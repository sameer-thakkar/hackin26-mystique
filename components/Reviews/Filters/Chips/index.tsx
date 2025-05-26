import React, { useContext } from 'react';
import { EReviewRatingFilter } from 'types/reviews';
import { Filters } from '@headout/eevee';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { StyledChipsContainer } from './styles';
import { TReviewFilterProps } from './types';
import { getRatingFilterLabel } from './utils';

const FilterChips = ({
  onFilterChange,
  productDetails,
  showOnlyReviewsWithMedia,
  currentRatingFilter,
}: TReviewFilterProps) => {
  const { lang } = useContext(MBContext);

  const selectedRatingIndex =
    currentRatingFilter === null
      ? null
      : Object.values(EReviewRatingFilter).indexOf(currentRatingFilter);

  const handleRatingSelect = (index: number) => {
    const isActivatedAlready = selectedRatingIndex === index;
    const rating = isActivatedAlready
      ? null
      : Object.values(EReviewRatingFilter)[index];

    trackEvent({
      eventName: ANALYTICS_EVENTS.REVIEW_FILTER_CLICKED,
      [ANALYTICS_PROPERTIES.FILTER_CRITERIA]: getRatingFilterLabel(index),
      [ANALYTICS_PROPERTIES.TGID]: productDetails.tgid,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.PLATFORM_NAME]: productDetails.isDesktop
        ? 'DESKTOP'
        : 'MOBILE',
      [ANALYTICS_PROPERTIES.NUMBER_OF_REVIEWS]: productDetails.numberOfReviews,
      [ANALYTICS_PROPERTIES.AVERAGE_RATING]:
        productDetails.reviewsDetails.averageRating,
      [ANALYTICS_PROPERTIES.IS_SELECTED]: !isActivatedAlready,
    });
    onFilterChange({ rating, withImages: showOnlyReviewsWithMedia });
  };

  const handleImageSelect = (isActivated = false) => {
    const rating =
      selectedRatingIndex === null
        ? null
        : Object.values(EReviewRatingFilter)[selectedRatingIndex];
    trackEvent({
      eventName: ANALYTICS_EVENTS.REVIEW_FILTER_CLICKED,
      [ANALYTICS_PROPERTIES.FILTER_CRITERIA]: 'With Images',
      [ANALYTICS_PROPERTIES.TGID]: productDetails.tgid,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.PLATFORM_NAME]: productDetails.isDesktop
        ? 'DESKTOP'
        : 'MOBILE',
      [ANALYTICS_PROPERTIES.NUMBER_OF_REVIEWS]: productDetails.numberOfReviews,
      [ANALYTICS_PROPERTIES.AVERAGE_RATING]:
        productDetails.reviewsDetails.averageRating,
      [ANALYTICS_PROPERTIES.IS_SELECTED]: isActivated,
    });
    onFilterChange({ rating, withImages: isActivated });
  };

  return (
    <StyledChipsContainer data-qa-marker="qaid-review-filtering-options-container">
      <Filters
        variant="chip selector"
        text={strings.REVIEWS_SECTION.FILTERING.WITH_IMAGES}
        state={showOnlyReviewsWithMedia ? 'applied' : 'default'}
        onClick={() => handleImageSelect(!showOnlyReviewsWithMedia)}
        size="small"
      />
      {Object.keys(EReviewRatingFilter).map((ratingFilter, index) => (
        <Filters
          variant="chip selector"
          text={getRatingFilterLabel(index, true)}
          state={selectedRatingIndex === index ? 'applied' : 'default'}
          onClick={() => handleRatingSelect(index)}
          size="small"
          key={ratingFilter}
        />
      ))}
    </StyledChipsContainer>
  );
};

export default FilterChips;
