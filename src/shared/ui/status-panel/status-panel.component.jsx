import { AlertCircle, SearchX } from 'lucide-react';

import styles from './status-panel.module.css';

export function StatusPanel({ title, description, isError = false, onRetry }) {
  const Icon = isError ? AlertCircle : SearchX;

  return (
    <div
      className={[styles.statusPanel, isError ? styles.statusPanelError : ''].join(' ')}
      role={isError ? 'alert' : 'status'}
    >
      <span className={[styles.statusIcon, isError ? styles.errorIcon : ''].join(' ')}>
        <Icon size={25} aria-hidden="true" />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {onRetry && (
        <button
          type="button"
          className={['btn btn-outline-dark', styles.retryButton].join(' ')}
          onClick={onRetry}
        >
          Повторить запрос
        </button>
      )}
    </div>
  );
}
