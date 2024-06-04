import React from 'react';
import Skeleton from 'react-loading-skeleton';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { AvailableTodayBooster } from 'components/Product/components/AvailableTodayBooster';
import { TNextAvailableProps } from 'components/Product/interface';
import {
  NextAvailableBlock,
  NextAvailableBlockSkeletonWrapper,
} from 'components/Product/styles';
import { getEarliestAvailableDate } from 'utils/dateUtils';
import { CARD_SECTION_MARKERS } from 'const/productCard';
import { strings } from 'const/strings';

dayjs.extend(advancedFormat);

export const NextAvailable = ({
  showSkeleton,
  earliestAvailability,
  currentLanguage,
  inTitle,
  isExperimentalCard,
  isDrawer,
  className,
}: TNextAvailableProps) => {
  if (showSkeleton)
    return (
      <NextAvailableBlockSkeletonWrapper>
        <Skeleton height="1rem" width="9rem" />
      </NextAvailableBlockSkeletonWrapper>
    );
  const earliestAvailabilityTitle = getEarliestAvailableDate(
    earliestAvailability?.startDate,
    currentLanguage
  );
  if (earliestAvailabilityTitle === strings.TODAY && inTitle)
    return <AvailableTodayBooster />;
  return (
    <NextAvailableBlock
      $isDrawer={isDrawer}
      $isExperimentalCard={isExperimentalCard}
      className={className}
    >
      <div
        data-card-section={CARD_SECTION_MARKERS.AVAILABILITY}
        className="available-text"
      >
        {strings.NEXT_AVAILABLE}
        {earliestAvailabilityTitle}
      </div>
    </NextAvailableBlock>
  );
};
