import { ArrowRight, Layers3 } from 'lucide-react';

import { SearchPage } from '../modules/parts-search/index.js';
import { ErrorBoundary } from '../shared/ui/index.js';

import styles from './app.module.css';

export function App() {
  return (
    <div className={styles.appShell}>
      <a className={styles.skipLink} href="#main">
        Перейти к поиску
      </a>
      <header className={styles.siteHeader}>
        <div className={[styles.pageContainer, styles.headerInner].join(' ')}>
          <a className={styles.brandLogo} href="/" aria-label="Фаворит — на главную">
            <span className={styles.logoMark} aria-hidden="true">
              F
            </span>
            <span>
              ФАВОРИТ<span className={styles.logoSubtitle}>ПОДБОР АВТОЗАПЧАСТЕЙ</span>
            </span>
          </a>
          <span className={styles.headerSection}>
            <Layers3 size={16} aria-hidden="true" /> Каталог предложений
          </span>
        </div>
      </header>
      <main id="main" className={[styles.pageContainer, styles.mainContent].join(' ')}>
        <div className={styles.breadcrumbLine}>
          <span className={styles.breadcrumbRoot}>Каталог</span>
          <ArrowRight size={12} aria-hidden="true" />
          Поиск по артикулу
        </div>

        <ErrorBoundary>
          <SearchPage />
        </ErrorBoundary>
      </main>
      <footer className={[styles.pageContainer, styles.siteFooter].join(' ')}>
        <span>Фаворит · Поиск автозапчастей</span>
      </footer>
    </div>
  );
}
