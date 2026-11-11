// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Provider } from 'react-redux';

import { createAppStore } from '../../../../app/store.js';
import { SearchPage } from '.';
import { partsApi } from '../../api/parts.api.js';

const createResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

const createProduct = (brand, number = '01089') => ({
  brand,
  number,
  name: `Деталь ${brand}`,
  warehouses: [
    {
      id: 'msk',
      code: 'Москва',
      price: 1500,
      stock: 2,
    },
  ],
});

const deferred = () => {
  let resolve;

  const promise = new Promise((done) => {
    resolve = done;
  });

  return {
    promise,
    resolve,
  };
};

let store;

let partsHandler;

let fetchMock;

beforeEach(() => {
  partsHandler = async () =>
    createResponse({
      goods: [createProduct('FEBI'), createProduct('INA')],
    });
  fetchMock = vi.fn(async (request) => {
    const url = new URL(request.url);
    return partsHandler(url);
  });
  vi.stubGlobal('fetch', fetchMock);
  store = createAppStore();
});

afterEach(() => {
  cleanup();
  store.dispatch(partsApi.util.resetApiState());
  vi.unstubAllGlobals();
});
async function mount() {
  render(
    <Provider store={store}>
      <SearchPage />
    </Provider>,
  );

  const input = screen.getByRole('textbox', {
    name: 'Артикул детали',
  });
  await waitFor(() => expect(input).toBeEnabled());

  return input;
}
const enter = (input, value) =>
  fireEvent.change(input, {
    target: {
      value,
    },
  });

const brandButton = (brand) =>
  screen.findByRole('button', {
    name: new RegExp(`^${brand}`),
  });

describe('two-stage search behavior', () => {
  it('debounces input and requests offers only after explicit brand selection', async () => {
    partsHandler = async (url) =>
      createResponse({
        goods: url.searchParams.has('brand')
          ? [createProduct(url.searchParams.get('brand'))]
          : [createProduct('FEBI')],
      });
    const input = await mount();
    enter(input, '0');
    enter(input, '01');
    enter(input, '01089');
    fireEvent.click(await brandButton('FEBI'));
    expect(await screen.findByRole('table')).toBeVisible();
    expect(screen.getByText('2 шт.')).toBeVisible();
    const urls = fetchMock.mock.calls
      .map(([request]) => new URL(request.url))
      .filter((url) => url.pathname === '/hs/hsprice/');
    expect(urls).toHaveLength(2);
    expect(urls[0].searchParams.has('brand')).toBe(false);
    expect(urls[1].searchParams.get('brand')).toBe('FEBI');
    expect(urls[0].searchParams.get('number')).toBe('01089');
    expect(urls[1].searchParams.get('number')).toBe('01089');
    expect(urls[1].searchParams.get('analogues')).toBe('on');
  });
  it('ignores outdated offers after switching the manufacturer and clears results on input', async () => {
    const pendingResponse = deferred();
    partsHandler = async (url) => {
      const brand = url.searchParams.get('brand');
      if (brand === 'FEBI') return pendingResponse.promise;
      return createResponse({
        goods: brand ? [createProduct('INA')] : [createProduct('FEBI'), createProduct('INA')],
      });
    };
    const input = await mount();
    enter(input, '01089');
    fireEvent.click(await brandButton('FEBI'));
    await waitFor(() =>
      expect(fetchMock.mock.calls.some(([request]) => request.url.includes('brand=FEBI'))).toBe(
        true,
      ),
    );
    fireEvent.click(await brandButton('INA'));
    await screen.findByRole('table');
    await act(async () => {
      pendingResponse.resolve(
        createResponse({
          goods: [createProduct('OLD-OFFER')],
        }),
      );
    });
    expect(screen.queryByText('OLD-OFFER')).not.toBeInTheDocument();
    enter(input, 'another');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(store.getState().search.brand).toBeNull();
  });
  it('shows a network error and supports retry', async () => {
    let failed = false;
    partsHandler = async () => {
      if (!failed) {
        failed = true;
        throw new TypeError('Failed to fetch');
      }
      return createResponse({
        goods: [createProduct('FEBI')],
      });
    };
    const input = await mount();
    enter(input, '01089');
    expect(await screen.findByRole('alert')).toHaveTextContent('Проверьте интернет');
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Повторить запрос',
      }),
    );
    expect(await brandButton('FEBI')).toBeVisible();
  });
  it('shows empty results and does not query for whitespace or cleared input', async () => {
    partsHandler = async () =>
      createResponse({
        goods: [{}],
      });
    const input = await mount();
    enter(input, '  ');
    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));
    expect(fetchMock).not.toHaveBeenCalled();
    enter(input, 'missing');
    expect(await screen.findByText('Производители не найдены')).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Очистить артикул',
      }),
    );
    expect(input).toHaveFocus();
    expect(screen.getByText('Нужная деталь начинается с артикула')).toBeVisible();
    expect(screen.queryByText('Производители не найдены')).not.toBeInTheDocument();
  });
  it('handles an empty second-stage response', async () => {
    partsHandler = async (url) =>
      createResponse({
        goods: url.searchParams.has('brand') ? [] : [createProduct('FEBI')],
      });
    const input = await mount();
    enter(input, '01089');
    fireEvent.click(await brandButton('FEBI'));
    expect(await screen.findByText('Предложения не найдены')).toBeVisible();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
