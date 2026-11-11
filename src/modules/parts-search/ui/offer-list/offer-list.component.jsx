import { useCallback, useLayoutEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { OfferRow } from '../offer-row';

import styles from './offer-list.module.css';

export function OfferList({ offers }) {
  const scrollRef = useRef(null);
  const isVirtualized = offers.length > 40;

  const getOfferKey = useCallback((offerIndex) => offers[offerIndex].id, [offers]);

  const virtualizer = useVirtualizer({
    count: offers.length,
    getScrollElement: () => scrollRef.current,
    getItemKey: getOfferKey,
    estimateSize: () => 260,
    overscan: 6,
    enabled: isVirtualized,
  });

  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    if (isVirtualized) virtualizer.scrollToOffset(0);
  }, [offers, isVirtualized, virtualizer]);

  const virtualRows = virtualizer.getVirtualItems();
  const topSpace = virtualRows[0]?.start ?? 0;
  const lastRow = virtualRows.at(-1);
  const bottomSpace = lastRow ? Math.max(0, virtualizer.getTotalSize() - lastRow.end) : 0;

  return (
    <div
      ref={scrollRef}
      className={styles.scrollContainer}
      tabIndex={0}
      role="region"
      aria-label="Список предложений"
    >
      <table className={styles.table} aria-rowcount={offers.length + 1}>
        <caption className="visually-hidden">
          Предложения по складам: производитель, название, цена и доступный остаток
        </caption>

        <thead className={styles.tableHead}>
          <tr>
            <th scope="col" className={[styles.headerCell, styles.productColumn].join(' ')}>
              Деталь / производитель
            </th>
            <th scope="col" className={[styles.headerCell, styles.warehouseColumn].join(' ')}>
              Склад
            </th>
            <th scope="col" className={[styles.headerCell, styles.stockColumn].join(' ')}>
              В наличии
            </th>
            <th scope="col" className={[styles.headerCell, styles.priceColumn].join(' ')}>
              Цена
            </th>
          </tr>
        </thead>

        <tbody className={styles.tableBody}>
          {isVirtualized ? (
            <>
              {topSpace > 0 && (
                <tr aria-hidden="true" role="presentation">
                  <td colSpan={4} className={styles.spacer} style={{ height: topSpace }} />
                </tr>
              )}

              {virtualRows.map((virtualRow) => (
                <OfferRow
                  key={virtualRow.key}
                  offer={offers[virtualRow.index]}
                  rowIndex={virtualRow.index}
                  rowRef={virtualizer.measureElement}
                />
              ))}

              {bottomSpace > 0 && (
                <tr aria-hidden="true" role="presentation">
                  <td colSpan={4} className={styles.spacer} style={{ height: bottomSpace }} />
                </tr>
              )}
            </>
          ) : (
            offers.map((offer, offerIndex) => (
              <OfferRow key={offer.id} offer={offer} rowIndex={offerIndex} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
