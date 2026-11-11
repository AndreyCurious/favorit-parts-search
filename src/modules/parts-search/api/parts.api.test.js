import { afterEach, expect, it, vi } from 'vitest';

import { createAppStore } from '../../../app/store';
import { partsApi } from './parts.api';

let store;

afterEach(() => {
  store?.dispatch(partsApi.util.resetApiState());
  vi.unstubAllGlobals();
});

it('treats supplier errors returned with HTTP 200 as a failed query', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(JSON.stringify({ error: 'Invalid key client!' }), {
          headers: { 'Content-Type': 'application/json' },
        }),
    ),
  );

  store = createAppStore();

  const result = await store.dispatch(partsApi.endpoints.getManufacturers.initiate('01089'));

  expect(result.isError).toBe(true);
  expect(result.error.data.error).toContain('ключ');
  expect(result.data).toBeUndefined();
});
