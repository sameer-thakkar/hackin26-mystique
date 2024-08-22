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
  forceMobileStyles = false,
  isPopup,
  flexible = false,
  className,
  showTime = false,
}: TNextAvailableProps) => {
  if (showSkeleton)
    return (
      <NextAvailableBlockSkeletonWrapper>
        <Skeleton height="1rem" width="9rem" />
      </NextAvailableBlockSkeletonWrapper>
    );
  const earliestAvailabilityTitle = getEarliestAvailableDate({
    date: earliestAvailability?.startDate,
    currentLanguage,
    time: earliestAvailability?.startTime,
    showTime,
  });
  const text = flexible ? (
    strings.OPEN_DATED_DESCRIPTOR
  ) : (
    <>
      {strings.NEXT_AVAILABLE}
      {earliestAvailabilityTitle}
    </>
  );
  if (earliestAvailabilityTitle === strings.TODAY && inTitle)
    return <AvailableTodayBooster />;
  return (
    <NextAvailableBlock
      $isDrawer={isDrawer}
      $isExperimentalCard={isExperimentalCard}
      forceMobileStyles={forceMobileStyles}
      isPopup={isPopup}
      className={className}
    >
      <div
        data-card-section={CARD_SECTION_MARKERS.AVAILABILITY}
        className="available-text"
      >
        {text}
      </div>
    </NextAvailableBlock>
  );
};
