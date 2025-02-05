import React from 'react';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import InfoOutlinedIcon from 'components/Espeon/Assets/InfoOutlinedIcon';
import MetaLabel from 'components/Espeon/ProductCard/MetaLabel';
import {
  infoButtonStyle,
  productLabelStyles,
  separatorStyle,
} from 'components/Espeon/ProductCard/ProductLabels/styles';
import type { TProductLabels } from 'components/Espeon/ProductCard/ProductLabels/types';
import RatingLabel from 'components/Espeon/ProductCard/RatingLabel';

const ProductLabels = ({
  className,
  primaryCategory,
  primarySubCategory,
  metaLabel,
  reviewsDetails,
  ratingsNewLabel,
  showMetaLabel = true,
  showRating = true,
  showSeparator = false,
  isMobile,
  onRatingsClick,
  onMoreInfoClick,
}: TProductLabels) => {
  const hideDotSeparator = !(
    primaryCategory?.displayName || primarySubCategory?.displayName
  );
  return (
    <div
      className={cx(productLabelStyles, className)}
      data-show-separator={showSeparator}
    >
      <Conditional if={showRating}>
        <RatingLabel
          reviewsDetails={reviewsDetails}
          onRatingsClick={onRatingsClick}
          ratingsNewLabel={ratingsNewLabel}
          isMobile={isMobile}
        />
      </Conditional>

      <Conditional if={showSeparator && !hideDotSeparator && showMetaLabel}>
        <div className={separatorStyle}></div>
      </Conditional>

      <Conditional if={showMetaLabel}>
        <MetaLabel
          primaryCategory={primaryCategory}
          primarySubCategory={primarySubCategory}
          metaLabel={metaLabel}
        />
      </Conditional>

      <Conditional if={!!onMoreInfoClick}>
        <button className={infoButtonStyle} onClick={onMoreInfoClick}>
          <InfoOutlinedIcon
            height={16}
            width={16}
            strokeColor={'colors.semantic.icon.grey.1'}
          />
        </button>
      </Conditional>
    </div>
  );
};

export default ProductLabels;
