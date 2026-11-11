import { getErrorMessage } from '../../../../shared/lib/format';

import { usePartsSearch } from '../../model/use-parts-search.js';
import { SearchField } from '../search-field';
import { SearchSteps } from '../search-steps';
import { ManufacturersSection } from '../manufacturers-section';
import { OffersSection } from '../offers-section';
import { SearchIntro } from '../search-intro';

import styles from './search-page.module.css';

export function SearchPage() {
  const search = usePartsSearch();
  const { manufacturers, offers, number, brand, isSearching } = search;

  return (
    <>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>ТОЧНЫЙ ПОИСК. ПОНЯТНЫЙ ВЫБОР.</p>
          <h1 className={styles.title}>
            Найдите свою деталь<span className={styles.titleAccent}>.</span>
          </h1>
          <p className={styles.pageDescription}>
            Производители, аналоги и предложения — по одному артикулу.
          </p>
        </div>
      </div>

      <SearchField
        value={search.input}
        onChange={search.changeInput}
        onSubmit={search.submitSearch}
      />
      <SearchSteps hasBrand={Boolean(brand)} />
      {!number && <SearchIntro />}
      {number && (
        <ManufacturersSection
          number={number}
          brand={brand}
          manufacturers={manufacturers.currentData || []}
          error={manufacturers.isError ? getErrorMessage(manufacturers.error) : null}
          onRetry={manufacturers.refetch}
          isSearching={isSearching}
          onSelect={search.selectBrand}
        />
      )}
      {brand && (
        <OffersSection
          number={number}
          brand={brand}
          offers={offers.currentData || []}
          isLoading={offers.isFetching}
          error={offers.isError ? getErrorMessage(offers.error) : null}
          onRetry={offers.refetch}
          onChangeBrand={() => search.selectBrand(null)}
        />
      )}
    </>
  );
}
