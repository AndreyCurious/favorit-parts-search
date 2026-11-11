import { SlidersHorizontal } from 'lucide-react';

import { useOfferFilters } from '../../model/use-offer-filters';
import { OfferFilters } from '../offer-filters';
import { OfferList } from '../offer-list';
import { StatusPanel } from '../../../../shared/ui';

import styles from './offers-table.module.css';

export function OffersTable({ offers }) {
  const {
    filters,
    sort,
    setSort,
    manufacturers,
    visibleOffers,
    priceError,
    hasActiveFilters,
    changeFilter,
    resetFilters,
  } = useOfferFilters(offers);

  return (
    <div className={styles.offersPanel}>
      <OfferFilters
        filters={filters}
        manufacturers={manufacturers}
        priceError={priceError}
        hasActiveFilters={hasActiveFilters}
        onChange={changeFilter}
        onReset={resetFilters}
      />

      <div className={styles.offersToolbar}>
        <label className={styles.stockToggle}>
          <input
            className={styles.stockInput}
            type="checkbox"
            role="switch"
            checked={filters.inStockOnly}
            onChange={(event) => changeFilter('inStockOnly', event.target.checked)}
          />
          <span className={styles.stockLabel}>Только в наличии</span>
        </label>

        <div className={styles.sortControl}>
          <SlidersHorizontal size={16} aria-hidden="true" />
          <select
            className={['form-select', styles.sortSelect].join(' ')}
            aria-label="Сортировка предложений"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="relevance">Сначала искомая деталь</option>
            <option value="price-asc">Цена по возрастанию</option>
            <option value="price-desc">Цена по убыванию</option>
          </select>
        </div>
      </div>

      {visibleOffers.length ? (
        <OfferList offers={visibleOffers} />
      ) : (
        <StatusPanel
          title={priceError ? 'Проверьте диапазон цены' : 'Нет подходящих предложений'}
          description={priceError || 'Измените условия поиска или сбросьте фильтры.'}
        />
      )}

      <div className={styles.offersFootnote} role="status">
        Найдено: {visibleOffers.length} из {offers.length}
      </div>
    </div>
  );
}
