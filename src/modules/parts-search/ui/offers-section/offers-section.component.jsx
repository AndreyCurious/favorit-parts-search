import { ResultsSection } from '../results-section';
import { StatusPanel, LoadingPanel } from '../../../../shared/ui/index.js';
import { OffersTable } from '../offers-table';

import styles from './offers-section.module.css';

export function OffersSection({ number, brand, offers, isLoading, error, onRetry, onChangeBrand }) {
  return (
    <ResultsSection
      id="offers-title"
      title="Предложения и аналоги"
      count={!isLoading && !error ? offers.length : undefined}
      subtitle={brand + ' / ' + number}
      busy={isLoading}
      action={
        <button type="button" className={styles.textButton} onClick={onChangeBrand}>
          Сменить производителя
        </button>
      }
    >
      {isLoading ? (
        <LoadingPanel label="Получаем предложения и аналоги…" />
      ) : error ? (
        <StatusPanel
          isError
          title="Не удалось загрузить предложения"
          description={error}
          onRetry={onRetry}
        />
      ) : offers.length ? (
        <OffersTable key={`${number}:${brand}`} offers={offers} />
      ) : (
        <StatusPanel
          title="Предложения не найдены"
          description="Для выбранного производителя пока нет данных. Выберите другого производителя или измените артикул."
        />
      )}
    </ResultsSection>
  );
}
