import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import { NextAvailable } from 'components/Product/components/NextAvailable';
import { TTourTittleProps } from 'components/Product/interface';
import {
  BoosterTag,
  OpenDatedDescriptor,
  TitleWrapper,
  TourTitleWrapper,
} from 'components/Product/styles';
import { THEMES } from 'const/index';
import { strings } from 'const/strings';

export const TourTitle = ({
  isContentOpen,
  pageType,
  isLoading,
  cardTitle,
  isMobile,
  isTicketCard,
  hasBorderedTitle,
  tabs,
  boosterTag,
  mbTheme,
  isOpenDated,
  showAvailability,
  earliestAvailability,
  currentLanguage,
}: TTourTittleProps) => {
  return (
    <TitleWrapper
      $isTicketCard={isTicketCard}
      hasBorderedTitle={hasBorderedTitle && !tabs?.length}
    >
      <Conditional if={showAvailability}>
        <NextAvailable
          earliestAvailability={earliestAvailability}
          currentLanguage={currentLanguage}
          inTitle
        />
      </Conditional>
      <Conditional if={boosterTag && mbTheme !== THEMES.MIN_BLUE}>
        <BoosterTag>{boosterTag}</BoosterTag>
      </Conditional>
      <TourTitleWrapper isPopup={isContentOpen} pageType={pageType}>
        <Conditional if={!isLoading}>{cardTitle}</Conditional>
        <Conditional if={isLoading}>
          <Skeleton height={isMobile ? '1rem' : '1.25rem'} borderRadius={2} />
          <Skeleton height={isMobile ? '1rem' : '1.25rem'} borderRadius={2} />
        </Conditional>
      </TourTitleWrapper>
      <Conditional if={isOpenDated && !isMobile}>
        <OpenDatedDescriptor>
          <Emoji symbol="😇" label="blessed-face" />{' '}
          {strings.OPEN_DATED_DESCRIPTOR}
        </OpenDatedDescriptor>
      </Conditional>
    </TitleWrapper>
  );
};
