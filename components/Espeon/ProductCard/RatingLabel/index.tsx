import React from 'react';
import { Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import StarFull from 'components/Espeon/Assets/StarFull';
import { ECardSectionMarkers } from 'components/Espeon/ProductCard/constants';
import {
  averageRatingClass,
  ratingCountClass,
  ratingIconStyle,
  ratingLabelWrapperClass,
  ratingsNewLabelClass,
} from 'components/Espeon/ProductCard/RatingLabel/styles';
import type { TRatingLabel } from 'components/Espeon/ProductCard/RatingLabel/types';
import { shortenNumberToUnits } from 'components/Espeon/utils/number';

const RatingLabel = ({
  reviewsDetails,
  ratingsNewLabel,
  onRatingsClick,
}: TRatingLabel) => {
  const { showRatings, averageRating, ratingsCount } = reviewsDetails;
  const ratings = shortenNumberToUnits(ratingsCount).toUpperCase();

  return (
    <div className={ratingLabelWrapperClass}>
      <Conditional if={showRatings}>
        <StarFull className={ratingIconStyle} />
      </Conditional>

      <Text
        as="span"
        className={cx(averageRatingClass, !showRatings && ratingsNewLabelClass)}
        data-card-section={ECardSectionMarkers.Reviews}
        textStyle="Semantics/UI Label/Medium (Heavy)"
      >
        {showRatings ? averageRating : ratingsNewLabel}
      </Text>

      <Conditional if={showRatings}>
        <Text
          as="span"
          textStyle="Semantics/UI Label/Medium"
          className={ratingCountClass}
          data-enabled={!!onRatingsClick}
          onClick={onRatingsClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onRatingsClick) {
              onRatingsClick();
            }
          }}
          {...(!onRatingsClick && {
            'data-card-section': ECardSectionMarkers.Reviews,
          })}
          tabIndex={0}
        >
          ({ratings})
        </Text>
      </Conditional>
    </div>
  );
};

export default RatingLabel;
