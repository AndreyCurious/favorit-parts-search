import { describe, expect, it } from 'vitest';

import { mapOffers } from './parts.mapper.js';

const createProduct = (overrides = {}) => ({
  goodsID: 'one',
  brand: 'FEBI',
  number: '01089',
  name: 'Ролик',
  price: 99999,
  count: 99,
  warehouses: [
    {
      id: 'msk',
      code: 'Москва',
      price: 100,
      stock: 3,
    },
  ],
  ...overrides,
});

describe('API mapping', () => {
  it('keeps distinct products and shipping options while removing exact duplicates', () => {
    const firstShipment = { id: 'msk', price: 100, stock: 3, warehouseShipping: 'first' };
    const secondShipment = { ...firstShipment, warehouseShipping: 'second' };

    const result = mapOffers({
      goods: [
        createProduct({ warehouses: [firstShipment, secondShipment, firstShipment] }),
        createProduct({ goodsID: 'another-product', warehouses: [firstShipment] }),
      ],
    });

    expect(result).toHaveLength(3);
    expect(new Set(result.map((offer) => offer.id)).size).toBe(3);
  });
  it('uses only warehouse prices and warehouse stocks, including zero', () => {
    const result = mapOffers({
      goods: [
        createProduct({
          warehouses: [
            {
              id: 'one',
              price: 0,
              stock: 0,
            },
            {
              id: 'two',
              price: '12.34',
              stock: '2',
            },
          ],
        }),
      ],
    });
    expect(
      result.map(({ price, stock }) => ({
        price,
        stock,
      })),
    ).toEqual([
      {
        price: 0,
        stock: 0,
      },
      {
        price: 12.34,
        stock: 2,
      },
    ]);
  });
  it('flattens nested analogues, deduplicates offers and preserves the original label', () => {
    const analogue = createProduct({
      brand: 'INA',
      number: '531',
      analogues: [
        createProduct({
          brand: 'SKF',
          number: 'VKM',
        }),
      ],
    });
    const result = mapOffers({
      goods: [
        createProduct({
          analogues: [analogue, createProduct()],
        }),
        createProduct(),
      ],
    });
    expect(
      result.map(({ brand, isAnalogue }) => ({
        brand,
        isAnalogue,
      })),
    ).toEqual([
      {
        brand: 'FEBI',
        isAnalogue: false,
      },
      {
        brand: 'INA',
        isAnalogue: true,
      },
      {
        brand: 'SKF',
        isAnalogue: true,
      },
    ]);
  });
});
