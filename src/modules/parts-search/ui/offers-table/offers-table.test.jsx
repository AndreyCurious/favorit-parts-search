// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { OffersTable } from './offers-table.component';

const offers = Array.from({ length: 4000 }, (_, offerIndex) => ({
  id: String(offerIndex),
  brand: 'MEYLE',
  number: String(offerIndex),
  name: `Деталь ${offerIndex}`,
  warehouse: 'Москва',
  price: offerIndex,
  stock: offerIndex < 5 ? 1 : 0,
  isAnalogue: true,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('combines text, manufacturer and price filters and resets them', async () => {
  const filterOffers = [
    { id: 'oil', brand: 'INA', name: 'Масляный фильтр', number: 'OF1', price: 150, stock: 2 },
    { id: 'fuel', brand: 'INA', name: 'Топливный фильтр', number: 'FF1', price: 250, stock: 2 },
    { id: 'no-price', brand: 'INA', name: 'Масляный фильтр', number: 'OF2', price: null, stock: 2 },
    {
      id: 'other-brand',
      brand: 'BOSCH',
      name: 'Масляный фильтр',
      number: 'OF3',
      price: 200,
      stock: 2,
    },
  ].map((offer) => ({ ...offer, warehouse: 'Москва', isAnalogue: true }));

  render(<OffersTable offers={filterOffers} />);

  fireEvent.change(screen.getByRole('combobox', { name: 'Производитель' }), {
    target: { value: 'INA' },
  });
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'МАСЛЯНЫЙ' } });
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Цена от' }), {
    target: { value: '100' },
  });
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Цена до' }), {
    target: { value: '200' },
  });

  await waitFor(() => expect(screen.getByText('Найдено: 1 из 4')).toBeVisible());
  expect(screen.getByText('OF1')).toBeVisible();

  fireEvent.change(screen.getByRole('spinbutton', { name: 'Цена от' }), {
    target: { value: '300' },
  });
  expect(screen.getByRole('alert')).toHaveTextContent('не должна превышать');

  fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));

  await waitFor(() => expect(screen.getByText('Найдено: 4 из 4')).toBeVisible());
  expect(screen.getByRole('searchbox')).toHaveValue('');
  expect(screen.getByRole('spinbutton', { name: 'Цена от' })).toHaveValue(null);
});

it('virtualizes a large result set and keeps the stock filter usable', () => {
  // jsdom has no layout; provide viewport and row measurements for the real virtualizer.
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(600);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(100);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1000);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    left: 0,
    right: 1000,
    bottom: 100,
    width: 1000,
    height: 100,
  });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );

  render(<OffersTable offers={offers} />);

  expect(screen.getByText('Деталь 0')).toBeVisible();
  expect(screen.getAllByRole('row').length).toBeLessThan(100);
  expect(screen.queryByRole('button', { name: 'Далее' })).not.toBeInTheDocument();

  const scrollRegion = screen.getByRole('region', { name: 'Список предложений' });
  fireEvent.scroll(scrollRegion, { target: { scrollTop: 400 } });

  fireEvent.click(screen.getByRole('switch'));

  expect(screen.getByRole('switch')).toBeChecked();
  expect(screen.getAllByRole('row')).toHaveLength(6);
  expect(screen.getByText('Найдено: 5 из 4000')).toBeVisible();
  expect(screen.getByRole('region', { name: 'Список предложений' })).toBe(scrollRegion);
  expect(scrollRegion.scrollTop).toBe(0);
});
