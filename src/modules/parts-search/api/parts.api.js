import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { PARTS_API_KEY, PARTS_API_URL } from './parts.config';
import { getVendorError } from './parts.errors';
import { mapManufacturers, mapOffers } from './parts.mapper';

const request = fetchBaseQuery({
  baseUrl: PARTS_API_URL,
  timeout: 12_000,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');

    return headers;
  },
});

export async function partsBaseQuery(args, api, extraOptions) {
  const result = await request(
    {
      ...args,
      params: { key: PARTS_API_KEY, info: 'on', ...args.params },
    },
    api,
    extraOptions,
  );

  if (result.error) {
    return result;
  }

  if (result.data?.error) {
    return {
      error: { status: 'VENDOR_ERROR', data: { error: getVendorError(result.data.error) } },
    };
  }

  if (!result.data || !Array.isArray(result.data.goods)) {
    return {
      error: {
        status: 'INVALID_RESPONSE',
        data: { error: 'Поставщик вернул некорректный ответ. Повторите поиск.' },
      },
    };
  }

  return result;
}

export const partsApi = createApi({
  reducerPath: 'partsApi',
  baseQuery: partsBaseQuery,
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getManufacturers: builder.query({
      query: (number) => ({ url: '', params: { number } }),
      transformResponse: mapManufacturers,
    }),
    getOffers: builder.query({
      query: ({ number, brand }) => ({ url: '', params: { number, brand, analogues: 'on' } }),
      transformResponse: mapOffers,
    }),
  }),
});

export const { useGetManufacturersQuery, useGetOffersQuery } = partsApi;
