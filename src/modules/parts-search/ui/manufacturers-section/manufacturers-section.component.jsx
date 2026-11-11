import { ResultsSection } from '../results-section';

import { StatusPanel, LoadingPanel } from '../../../../shared/ui/index.js';
import { ManufacturerList } from '../manufacturer-list';

export function ManufacturersSection({
  number,
  brand,
  manufacturers,
  isSearching,
  error,
  onRetry,
  onSelect,
}) {
  return (
    <ResultsSection
      id="manufacturers-title"
      title="Производители"
      count={!isSearching && !error ? manufacturers.length : undefined}
      article={number}
      busy={isSearching}
    >
      {isSearching ? (
        <LoadingPanel label="Ищем производителей…" />
      ) : error ? (
        <StatusPanel
          isError
          title="Не удалось найти производителей"
          description={error}
          onRetry={onRetry}
        />
      ) : manufacturers.length ? (
        <ManufacturerList manufacturers={manufacturers} selected={brand} onSelect={onSelect} />
      ) : (
        <StatusPanel
          title="Производители не найдены"
          description="Проверьте артикул: возможна опечатка или деталь отсутствует у поставщика."
        />
      )}
    </ResultsSection>
  );
}
