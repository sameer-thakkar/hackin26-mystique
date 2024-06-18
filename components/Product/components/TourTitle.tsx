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
import { CARD_SECTION_MARKERS } from 'const/productCard';
import { strings } from 'const/strings';
import InfoIconTicketCard from 'assets/infoIconTicketCard';

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
  isExperimentalCard,
  isDrawer,
  isPoiMwebCard,
  showInfoIcon,
  onClick = () => null,
  isHOHORevamp,
  forceMobile,
}: TTourTittleProps) => {
  return (
    <TitleWrapper
      $isTicketCard={isTicketCard}
      hasBorderedTitle={hasBorderedTitle && !tabs?.length}
      $isExperimentalCard={isExperimentalCard}
      $isDrawer={isDrawer}
      $forceMobile={forceMobile}
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
      <TourTitleWrapper
        data-card-section={CARD_SECTION_MARKERS.TITLE}
        isPopup={isContentOpen}
        pageType={pageType}
        isNonPoi={isDrawer && !isPoiMwebCard}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        $isHOHORevamp={isHOHORevamp}
        $forceMobile={forceMobile}
      >
        <Conditional if={!isLoading}>{cardTitle}</Conditional>
        <Conditional if={showInfoIcon}>
          <InfoIconTicketCard height={18} width={18} />
        </Conditional>
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
