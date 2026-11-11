import styles from './results-section.module.css';

export function ResultsSection({ id, title, count, article, subtitle, action, busy, children }) {
  return (
    <section className={styles.resultsSection} aria-labelledby={id} aria-busy={busy}>
      <div className={styles.sectionHeading}>
        <div>
          <h2 id={id} className={styles.title}>
            {title} {count !== undefined && <span className={styles.countBadge}>{count}</span>}
          </h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {article && (
          <span className={styles.article}>
            Артикул <b className={styles.mono}>{article}</b>
          </span>
        )}
        {action}
      </div>
      {children}
    </section>
  );
}
