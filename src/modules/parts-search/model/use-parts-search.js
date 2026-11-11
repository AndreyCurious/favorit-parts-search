import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from '../../../shared/lib/use-debounced-value.js';
import { useGetManufacturersQuery, useGetOffersQuery } from '../api/parts.api.js';
import { inputChanged, brandSelected } from './search.slice.js';

export function usePartsSearch() {
  const dispatch = useDispatch();

  const { input, brand } = useSelector((state) => state.search);

  const number = input.trim();

  const { debounced: debouncedNumber, flush } = useDebouncedValue(number, 450);

  const isDebouncing = number !== debouncedNumber;

  const manufacturers = useGetManufacturersQuery(debouncedNumber, {
    skip: !debouncedNumber || !number || isDebouncing,
    refetchOnMountOrArgChange: true,
  });

  const offers = useGetOffersQuery(
    { number, brand },
    {
      skip: !brand || !number || isDebouncing,
      refetchOnMountOrArgChange: true,
    },
  );

  return {
    input,
    number,
    brand,
    manufacturers,
    offers,
    isSearching: Boolean(number) && (isDebouncing || manufacturers.isFetching),
    changeInput: (value) => dispatch(inputChanged(value)),
    selectBrand: (value) => dispatch(brandSelected(value)),
    submitSearch: () => {
      dispatch(brandSelected(null));
      if (isDebouncing) flush();
      else if (!manufacturers.isUninitialized && !manufacturers.isFetching) manufacturers.refetch();
    },
  };
}
