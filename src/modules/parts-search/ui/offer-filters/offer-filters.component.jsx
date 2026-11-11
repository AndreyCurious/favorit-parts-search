import styles from './offer-filters.module.css';

export function OfferFilters({
  filters,
  manufacturers,
  priceError,
  hasActiveFilters,
  onChange,
  onReset,
}) {
  return (
    <div className={styles.filters} role="group" aria-label="Фильтры предложений">
      <label className={styles.searchField}>
        <span className={styles.label}>Поиск в предложениях</span>
        <input
          className={styles.input}
          type="search"
          placeholder="Название или артикул"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Производитель</span>
        <select
          className={styles.input}
          value={filters.brand}
          onChange={(event) => onChange('brand', event.target.value)}
        >
          <option value="">Все производители</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer} value={manufacturer}>
              {manufacturer}
            </option>
          ))}
        </select>
      </label>

      <fieldset className={styles.priceRange}>
        <legend className={styles.label}>Цена, ₽</legend>
        <div className={styles.priceInputs}>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            aria-label="Цена от"
            aria-invalid={Boolean(priceError)}
            aria-describedby={priceError ? 'price-range-error' : undefined}
            placeholder="От"
            value={filters.minPrice}
            onChange={(event) => onChange('minPrice', event.target.value)}
          />
          <span className={styles.separator} aria-hidden="true">
            –
          </span>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            aria-label="Цена до"
            aria-invalid={Boolean(priceError)}
            aria-describedby={priceError ? 'price-range-error' : undefined}
            placeholder="До"
            value={filters.maxPrice}
            onChange={(event) => onChange('maxPrice', event.target.value)}
          />
        </div>
      </fieldset>

      <button
        className={styles.resetButton}
        type="button"
        disabled={!hasActiveFilters}
        onClick={onReset}
      >
        Сбросить фильтры
      </button>

      {priceError && (
        <p className={styles.error} id="price-range-error" role="alert">
          {priceError}
        </p>
      )}
    </div>
  );
}
