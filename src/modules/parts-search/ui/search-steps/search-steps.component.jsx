import { Check } from 'lucide-react';

import styles from './search-steps.module.css';

export function SearchSteps({ hasBrand }) {
  return (
    <ol className={styles.searchSteps} aria-label="Этапы подбора">
      <li
        className={[styles.step, hasBrand ? '' : styles.stepActive].join(' ')}
        aria-current={!hasBrand ? 'step' : undefined}
      >
        <span
          className={[styles.stepNumber, hasBrand ? styles.doneNumber : styles.activeNumber].join(
            ' ',
          )}
        >
          {hasBrand ? <Check size={16} aria-hidden="true" /> : '01'}
        </span>
        <span>Выберите производителя</span>
      </li>
      <li
        className={[styles.step, hasBrand ? styles.stepActive : ''].join(' ')}
        aria-current={hasBrand ? 'step' : undefined}
      >
        <span className={[styles.stepNumber, hasBrand ? styles.activeNumber : ''].join(' ')}>
          02
        </span>
        <span>Сравните предложения</span>
      </li>
    </ol>
  );
}
