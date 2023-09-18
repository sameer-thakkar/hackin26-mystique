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
import { strings } from 'const/strings';

dayjs.extend(advancedFormat);

export const NextAvailable = ({
  showSkeleton,
  earliestAvailability,
  currentLanguage,
  inTitle,
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
    <NextAvailableBlock>
      <div className="available-text">
        {strings.NEXT_AVAILABLE}
        {earliestAvailabilityTitle}
      </div>
    </NextAvailableBlock>
  );
};
