import { memo } from 'react';

import { formatPrice } from '../../../../shared/lib/format.js';

import styles from './offer-row.module.css';

export const OfferRow = memo(function OfferRow({ offer, rowRef, rowIndex }) {
  return (
    <tr
      ref={rowRef}
      data-index={rowIndex}
      aria-rowindex={rowIndex !== undefined ? rowIndex + 2 : undefined}
      className={styles.row}
    >
      <td className={[styles.offerProduct, styles.cell].join(' ')}>
        <div className={styles.offerBrandLine}>
          <strong className={styles.brand}>{offer.brand}</strong>
          <span
            className={[styles.typeBadge, offer.isAnalogue ? '' : styles.typeOriginal].join(' ')}
          >
            {offer.isAnalogue ? 'Аналог' : 'Искомая деталь'}
          </span>
        </div>
        <div className={styles.offerName}>{offer.name}</div>
        <span className={styles.offerNumber}>{offer.number}</span>
      </td>
      <td data-label="Склад" className={styles.cell}>
        <span className={styles.warehouseName}>{offer.warehouse}</span>
        {offer.notRefund && <span className={styles.returnNote}>Без возврата</span>}
      </td>
      <td data-label="В наличии" className={styles.cell}>
        <span className={[styles.stockLabel, offer.stock > 0 ? styles.inStock : ''].join(' ')}>
          {offer.stock === null
            ? 'Не указано'
            : offer.stock > 0
              ? `${offer.stock} шт.`
              : 'Нет в наличии'}
        </span>
      </td>
      <td data-label="Цена" className={[styles.offerPrice, styles.cell].join(' ')}>
        <span className={offer.price === null ? styles.priceUnknown : ''}>
          {formatPrice(offer.price)}
        </span>
        {offer.price !== null && <small className={styles.priceUnit}>за единицу</small>}
      </td>
    </tr>
  );
});
