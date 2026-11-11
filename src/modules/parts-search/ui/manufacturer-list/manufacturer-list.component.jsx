import { ArrowUpRight, Check } from 'lucide-react';

import styles from './manufacturer-list.module.css';

export function ManufacturerList({ manufacturers, selected, onSelect }) {
  return (
    <div className={styles.manufacturerGrid} role="group" aria-label="Производители">
      {manufacturers.map((manufacturer) => (
        <button
          type="button"
          key={manufacturer.brand}
          className={[
            styles.manufacturerCard,
            selected === manufacturer.brand ? styles.isSelected : '',
          ].join(' ')}
          onClick={() => onSelect(manufacturer.brand)}
          aria-pressed={selected === manufacturer.brand}
        >
          <div className={styles.manufacturerTop}>
            <span className={styles.manufacturerName}>{manufacturer.brand}</span>
            {selected === manufacturer.brand ? (
              <Check
                size={19}
                aria-hidden="true"
                className={[styles.icon, styles.selectedIcon].join(' ')}
              />
            ) : (
              <ArrowUpRight size={19} aria-hidden="true" className={styles.icon} />
            )}
          </div>
          <span className={styles.manufacturerDescription}>{manufacturer.name}</span>
          <span className={styles.manufacturerArticle}>
            Артикул <b className={styles.articleNumber}>{manufacturer.number}</b>
          </span>
        </button>
      ))}
    </div>
  );
}
