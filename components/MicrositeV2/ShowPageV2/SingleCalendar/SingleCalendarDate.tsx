import React from 'react';
import classNames from 'classnames';
import Conditional from 'components/common/Conditional';
import LSpan from './LSpan';
import styles from './styles';

interface SingleCalendarDateProps {
  dateAsString?: string;
  cutPrice?: string;
  price?: string;
  isAvailable?: boolean;
  isEmpty?: boolean;
  isMinPrice?: boolean;
  onClick?: (...args: any[]) => any;
  fullDate?: string;
  selectedDate?: string;
  hidePrice?: boolean;
  highlightSelectedDate?: boolean;
}

export const SingleCalendarDate = (props: SingleCalendarDateProps) => {
  const onClick = () => {
    const { onClick } = props;
    if (onClick) onClick();
  };

  const getPriceDiv = () => {
    const { price, cutPrice, isAvailable, isMinPrice } = props;

    const cutPriceDiv = cutPrice ? (
      <div className={styles.priceWrapper}>
        <span className={styles.cutPrice}>{cutPrice}</span>
      </div>
    ) : (
      ''
    );
    return isAvailable ? (
      <div className={styles.priceWrapper}>
        <div className={styles.price}>
          <span className={`price ${isMinPrice && price ? 'min-price' : ''}`}>
            {price}
          </span>
        </div>
        {cutPriceDiv}
      </div>
    ) : (
      <div className={styles.priceWrapper}>
        <span className={styles.soldOut}>-</span>
      </div>
    );
  };

  const {
    dateAsString,
    isEmpty,
    isAvailable,
    selectedDate,
    fullDate,
    hidePrice,
    highlightSelectedDate = true,
  } = props;

  const selected = fullDate === selectedDate;

  if (!isAvailable && !isEmpty) {
    return (
      <div
        className={classNames(
          styles.singleCalendarDateWrapper,
          styles.disabledDate
        )}
        aria-label={dateAsString}
        role="button"
        tabIndex={0}
        onClick={onClick}
      >
        <div className={classNames(styles.dateLabel, styles.disabledDateLabel)}>
          <LSpan>{dateAsString}</LSpan>
        </div>

        <Conditional if={!hidePrice}>{getPriceDiv()}</Conditional>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className={classNames(styles.singleCalendarDateWrapper, {
          empty: isEmpty,
          unavailable: !isAvailable,
        })}
      />
    );
  }

  return (
    <div
      className={classNames(styles.singleCalendarDateWrapper, {
        'selected-date': highlightSelectedDate && selected,
      })}
      aria-label={dateAsString}
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      <div className={styles.dateLabel}>
        <LSpan>{dateAsString}</LSpan>
      </div>

      <Conditional if={!hidePrice}>{getPriceDiv()}</Conditional>
    </div>
  );
};
