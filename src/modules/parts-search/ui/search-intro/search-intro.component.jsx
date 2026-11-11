import { ScanLine, PackageSearch, CircleCheck } from 'lucide-react';

import styles from './search-intro.module.css';

export function SearchIntro() {
  return (
    <section className={styles.searchIntro} aria-labelledby="intro-title">
      <div className={styles.introSymbol} aria-hidden="true">
        <ScanLine size={30} />
      </div>
      <h2 id="intro-title" className={styles.title}>
        Нужная деталь начинается с артикула
      </h2>
      <p className={styles.description}>
        Введите номер с упаковки или самой детали.
        <br />
        Мы найдём производителей, доступные предложения и аналоги.
      </p>
      <div className={styles.introFeatures}>
        <span className={styles.feature}>
          <PackageSearch size={16} aria-hidden="true" /> Оригиналы и аналоги
        </span>
        <span className={styles.feature}>
          <CircleCheck size={16} aria-hidden="true" /> Остатки по складам
        </span>
      </div>
    </section>
  );
}
