const brandCollator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });

export function getPriceRangeError({ minPrice = '', maxPrice = '' }) {
  const bounds = [minPrice, maxPrice].filter((value) => value !== '');

  if (bounds.some((value) => !Number.isFinite(Number(value)) || Number(value) < 0)) {
    return 'Цена должна быть неотрицательным числом.';
  }

  if (minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice)) {
    return 'Цена «от» не должна превышать цену «до».';
  }

  return '';
}

export function createOfferSearchIndex(offers) {
  return new Map(
    offers.map((offer) => [
      offer.id,
      `${offer.brand} ${offer.name} ${offer.number}`.toLocaleLowerCase('ru-RU'),
    ]),
  );
}

export function sortOffers(offers, sort) {
  return offers.toSorted((firstOffer, secondOffer) => {
    if (sort === 'price-asc' || sort === 'price-desc') {
      if (firstOffer.price === null) return secondOffer.price === null ? 0 : 1;
      if (secondOffer.price === null) return -1;

      return sort === 'price-asc'
        ? firstOffer.price - secondOffer.price
        : secondOffer.price - firstOffer.price;
    }

    return (
      Number(firstOffer.isAnalogue) - Number(secondOffer.isAnalogue) ||
      brandCollator.compare(firstOffer.brand, secondOffer.brand)
    );
  });
}

export function filterOffers(offers, filters, searchIndex) {
  const { inStockOnly, search = '', brand = '', minPrice = '', maxPrice = '' } = filters;

  if (getPriceRangeError(filters)) return [];

  const searchTerms = search.trim().toLocaleLowerCase('ru-RU').split(/\s+/).filter(Boolean);
  const minimum = minPrice === '' ? null : Number(minPrice);
  const maximum = maxPrice === '' ? null : Number(maxPrice);
  const hasPriceRange = minimum !== null || maximum !== null;

  if (!inStockOnly && !brand && !hasPriceRange && !searchTerms.length) return offers;

  return offers.filter((offer) => {
    if (inStockOnly && !(offer.stock > 0)) return false;
    if (brand && offer.brand !== brand) return false;
    if (hasPriceRange && offer.price === null) return false;
    if (minimum !== null && offer.price < minimum) return false;
    if (maximum !== null && offer.price > maximum) return false;
    if (!searchTerms.length) return true;

    const searchableText = searchIndex.get(offer.id) || '';

    return searchTerms.every((term) => searchableText.includes(term));
  });
}
