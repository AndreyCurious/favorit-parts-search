import styles from './loading-panel.module.css';

export function LoadingPanel({ label }) {
  return (
    <div className={styles.loadingPanel} role="status" aria-live="polite">
      <span
        className={['spinner-border spinner-border-sm', styles.spinner].join(' ')}
        aria-hidden="true"
      />
      <span>{label}</span>
      <div className={styles.skeletonLines} aria-hidden="true">
        <i className={styles.skeletonLine} />
        <i className={[styles.skeletonLine, styles.shortLine].join(' ')} />
        <i className={[styles.skeletonLine, styles.mediumLine].join(' ')} />
      </div>
    </div>
  );
}
