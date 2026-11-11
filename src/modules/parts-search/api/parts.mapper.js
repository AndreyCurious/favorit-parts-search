const getText = (value) => (typeof value === 'string' ? value.trim() : '');
const parseNonNegativeNumber = (value) => {
  if (!['string', 'number'].includes(typeof value) || (typeof value === 'string' && !value.trim()))
    return null;

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};
const isValidProduct = (product) =>
  product && typeof product === 'object' && getText(product.brand) && getText(product.number);

function getProducts(payload) {
  if (!payload || !Array.isArray(payload.goods)) throw new Error('Некорректный формат ответа API.');
  // Favorit returns goods: [{}] when an article is not found.

  return payload.goods.filter(isValidProduct);
}

export function mapManufacturers(payload) {
  const brands = new Map();

  for (const product of getProducts(payload)) {
    const brand = getText(product.brand);

    const id = brand.toLocaleUpperCase('en-US');

    if (!brands.has(id))
      brands.set(id, {
        brand,
        name: getText(product.name) || 'Название не указано',
        number: getText(product.number),
      });
  }

  return [...brands.values()].sort((firstManufacturer, secondManufacturer) =>
    firstManufacturer.brand.localeCompare(secondManufacturer.brand),
  );
}

export function mapOffers(payload) {
  const offers = new Map();

  const queue = getProducts(payload).map((product) => ({ product, isAnalogue: false }));

  const visited = new WeakSet();

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const { product, isAnalogue } = queue[cursor];

    if (!isValidProduct(product) || visited.has(product)) continue;
    visited.add(product);

    const warehouses = Array.isArray(product.warehouses)
      ? product.warehouses.filter(
          (entry) => entry && typeof entry === 'object' && !Array.isArray(entry),
        )
      : [];

    const identity = [
      getText(product.goodsID),
      getText(product.brand).toUpperCase(),
      getText(product.number).toUpperCase(),
    ];

    for (const warehouse of warehouses.length ? warehouses : [null]) {
      const price = warehouse ? parseNonNegativeNumber(warehouse.price) : null;
      const stock = warehouse ? parseNonNegativeNumber(warehouse.stock) : 0;
      const warehouseName = getText(warehouse?.code) || getText(warehouse?.id) || 'Склад не указан';
      // Keep distinct products and shipping options; remove only exact duplicates.
      const id = JSON.stringify([
        ...identity,
        warehouse?.id || warehouseName,
        price,
        stock,
        warehouse?.shipmentDate || '',
        getText(warehouse?.warehouseShipping),
        Boolean(product.notRefund || warehouse?.notRefund),
      ]);
      if (!offers.has(id))
        offers.set(id, {
          id,
          brand: getText(product.brand),
          number: getText(product.number),
          name: getText(product.name) || 'Название не указано',
          warehouse: warehouse ? warehouseName : 'Нет предложений',
          price,
          stock,
          isAnalogue,
          notRefund: Boolean(product.notRefund || warehouse?.notRefund),
        });
    }

    if (Array.isArray(product.analogues)) {
      queue.push(
        ...product.analogues
          .filter(isValidProduct)
          .map((analogue) => ({ product: analogue, isAnalogue: true })),
      );
    }
  }

  return [...offers.values()];
}
