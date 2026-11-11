import { useMemo, useState } from 'react';

import {
  createOfferSearchIndex,
  filterOffers,
  getPriceRangeError,
  sortOffers,
} from './offers.selectors';

const INITIAL_FILTERS = { search: '', brand: '', minPrice: '', maxPrice: '', inStockOnly: false };

export function useOfferFilters(offers) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState('relevance');

  const manufacturers = useMemo(
    () =>
      [...new Set(offers.map((offer) => offer.brand))].sort((firstBrand, secondBrand) =>
        firstBrand.localeCompare(secondBrand),
      ),
    [offers],
  );

  const searchIndex = useMemo(() => createOfferSearchIndex(offers), [offers]);
  const sortedOffers = useMemo(() => sortOffers(offers, sort), [offers, sort]);
  const visibleOffers = useMemo(
    () => filterOffers(sortedOffers, filters, searchIndex),
    [sortedOffers, filters, searchIndex],
  );

  const priceError = getPriceRangeError(filters);
  const hasActiveFilters = Object.values(filters).some((value) =>
    typeof value === 'string' ? value.trim() !== '' : value,
  );

  const changeFilter = (name, value) => {
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return {
    filters,
    sort,
    setSort,
    manufacturers,
    visibleOffers,
    priceError,
    hasActiveFilters,
    changeFilter,
    resetFilters,
  };
}
