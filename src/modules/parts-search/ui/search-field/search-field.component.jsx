import { useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

import styles from './search-field.module.css';
const EXAMPLES = ['01089', 'W719/30', '7160500039S'];

export function SearchField({ value, onChange, onSubmit, disabled }) {
  const inputRef = useRef(null);

  return (
    <form
      className={styles.searchBox}
      aria-label="Поиск детали"
      onSubmit={(event) => {
        event.preventDefault();
        if (value.trim() && !disabled) onSubmit();
      }}
    >
      <label
        id="article-label"
        htmlFor="article"
        className={['form-label', styles.label].join(' ')}
      >
        Артикул детали
      </label>
      <div className={styles.articleInputWrap}>
        <Search size={22} aria-hidden="true" className={styles.searchIcon} />
        <input
          ref={inputRef}
          id="article"
          className={['form-control', styles.articleInput].join(' ')}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Например, 01089"
          maxLength={64}
          autoComplete="off"
          spellCheck="false"
          disabled={disabled}
          aria-describedby="search-help"
        />
        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            aria-label="Очистить артикул"
          >
            <X size={19} />
          </button>
        )}
        <button
          className={styles.inputArrow}
          type="submit"
          aria-label="Найти производителей"
          disabled={disabled || !value.trim()}
        >
          <ArrowRight size={22} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.searchHelpRow}>
        <p id="search-help" className={styles.helpText}>
          Поиск начнётся автоматически после ввода
        </p>
        <div className={styles.exampleList}>
          <span>Попробуйте:</span>
          {EXAMPLES.map((example) => (
            <button
              type="button"
              key={example}
              className={styles.exampleButton}
              onClick={() => onChange(example)}
              disabled={disabled}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
