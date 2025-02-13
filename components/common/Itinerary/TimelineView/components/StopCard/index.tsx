import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SECTION_TYPE, SUB_TYPES } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { SubCardHeadingContainer } from 'components/common/Itinerary/TimelineView/components/PassesByCard/styles';
import MultiplePoints from 'components/common/Itinerary/TimelineView/components/StopCard/components/MultiplePoints';
import NearbyThingsToDo from 'components/common/Itinerary/TimelineView/components/StopCard/components/NearbyThingsToDo';
import NextDestinationTravel from 'components/common/Itinerary/TimelineView/components/StopCard/components/NextDestinationTravel';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import SubStopSection from './components/SubStopSection';
import useStopCard from './hooks/useStopCard';
import {
  ClickableContainer,
  Container,
  ContentContainer,
  Description,
  DescriptionContainer,
  RankContainer,
  SubCardsContainer,
} from './styles';
import { StopCardProps } from './types';

const DefaultHeadingContainer = dynamic(
  () =>
    import(
      /* webpackChunkName: "DefaultHeadingContainer" */ './components/DefaultHeadingContainer'
    )
);
const ReducedWidthHeadingContainer = dynamic(
  () =>
    import(
      /* webpackChunkName: "ReducedWidthHeadingContainer" */ './components/ReducedWidthHeadingContainer'
    )
);
const Descriptors = dynamic(
  () =>
    import(
      /* webpackChunkName: "Descriptors" */ 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors'
    )
);

const StopCard = ({
  descriptors,
  defaultOpen = false,
  subCards = [],
  isSubCard = false,
  position,
  sectionDetails,
  subSectionDetails,
  isSubSection = false,
  isForcedStart = false,
  isForcedEnd = false,
  variant = TimelineViewComponentVariant.DEFAULT,
  onStopSectionClick,
  isActive = false,
  isHOHOItinerary,
  itineraryId,
  findDirections = false,
  hasMultipleSubStops = false,
}: StopCardProps & {
  itineraryId: number;
}) => {
  const { isMobile } = useRecoilValue(appAtom);
  const isDesktop = !isMobile;
  const [isOpen, setIsOpen] = useState(
    isDesktop ? defaultOpen || isActive : false
  );
  const [multiPointDefaultOpen, setMultiPointDefaultOpen] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const { id, type, details } = isSubSection
    ? subSectionDetails!
    : sectionDetails!;
  const {
    name,
    mediaUrls,
    description,
    timeForNextSection,
    modeOfTravel,
    distanceForNextSection,
    subType,
  } = details;
  const hasImage = !!mediaUrls?.length;
  const showSubCardImage = hasImage && isOpen;
  const isStart = type === SECTION_TYPE.START_LOCATION;
  const isEnd = type === SECTION_TYPE.END_LOCATION;
  const endPointIsNotSameAsStart = !sectionDetails?.details.sameAsStartingPoint;

  const {
    subStops,
    passBys,
    allowOpen,
    isStopSectionClickable,
    multiPoints,
    hasMultiPoints,
    shouldShowNextDestinationTravel,
    handleStopSectionClick,
    handleSubStopSectionClick,
  } = useStopCard({
    itineraryId,
    setIsOpen,
    setMultiPointDefaultOpen,
    subCards,
    variant,
    endPointIsNotSameAsStart,
    hasImage,
    isDesktop,
    isHOHOItinerary,
    isStart,
    isEnd,
    isSubSection,
    isSubCard,
    isForcedEnd,
    onStopSectionClick,
    sectionDetails,
    subSectionDetails,
  });

  const isReducedVariant =
    variant === TimelineViewComponentVariant.REDUCED_WIDTH;

  useEffect(() => {
    if (isReducedVariant && isDesktop) setIsOpen(hasMultiPoints || isActive);
  }, [isActive]);

  const subSectionHeading =
    subType?.label === SUB_TYPES.POI || subType?.label === SUB_TYPES.LANDMARK
      ? strings.ITINERARY.SUB_SECTION_HEADING.HIGHLIGHTS
      : subType?.label === SUB_TYPES.HOHO_BUS_STOP
      ? strings.ITINERARY.SUB_SECTION_HEADING.NEARBY_THINGS_TO_DO
      : strings.ITINERARY.SUB_SECTION_HEADING.THINGS_TO_DO;

  const commonHeadingProps = {
    name: name!,
    strings,
    variant,
    allowOpen,
    hasMultiPoints,
    hasMultipleSubStops,
    isOpen,
    isStart,
    isEnd,
    isSubCard,
    multiPoints,
    position,
  };

  return (
    <Container
      $isSubCard={isSubCard}
      $isStart={isStart || isForcedStart}
      $isEnd={isEnd || isForcedEnd}
      $variant={variant}
      key={id}
      ref={ref}
      onClick={handleStopSectionClick}
      id={`itinerary-card-${itineraryId}-${id}`}
      $isClickable={allowOpen}
      data-qa-marker="qaid-itinerary-stop-card"
    >
      <ContentContainer onClick={handleStopSectionClick} $variant={variant}>
        <Conditional if={!isSubCard && position !== null}>
          <RankContainer $isEnd={isEnd} $variant={variant} $isActive={isOpen}>
            <Conditional if={position}>
              <p>{position}</p>
            </Conditional>
            <Conditional if={position === 0}>
              <TailedArrowSVG />
            </Conditional>
          </RankContainer>
        </Conditional>
        <ClickableContainer
          onClick={() => {
            if (allowOpen) {
              setMultiPointDefaultOpen(-1);
              if (isDesktop) setIsOpen(!isOpen);
              trackEvent({
                eventName: isSubCard
                  ? ANALYTICS_EVENTS.ITINERARY.SUB_STOP_CLICKED
                  : ANALYTICS_EVENTS.ITINERARY.STOP_CLICKED,
                [ANALYTICS_PROPERTIES.ACTION]: !isOpen
                  ? 'Expanded'
                  : 'Collapsed',
                [ANALYTICS_PROPERTIES.STOP_NAME]: name,
                [ANALYTICS_PROPERTIES.STOP_NUMBER]: position,
              });
            }
          }}
          $isClickable={allowOpen}
        >
          <Conditional if={!isReducedVariant}>
            <DefaultHeadingContainer {...commonHeadingProps} />
          </Conditional>
          <Conditional if={isReducedVariant}>
            <ReducedWidthHeadingContainer
              {...commonHeadingProps}
              endPointIsNotSameAsStart={endPointIsNotSameAsStart}
              isStopSectionClickable={isStopSectionClickable}
            />
          </Conditional>
          <Conditional if={!hasMultiPoints}>
            <Conditional if={endPointIsNotSameAsStart}>
              <Descriptors
                {...descriptors}
                variant={variant}
                showLocationDescriptor={findDirections}
              />
            </Conditional>
            <Conditional
              if={
                (showSubCardImage || description) &&
                endPointIsNotSameAsStart &&
                !isReducedVariant
              }
            >
              <DescriptionContainer
                $isSubCard={isSubCard}
                $isOpen={isOpen}
                $hasImage={hasImage}
              >
                <Conditional if={showSubCardImage}>
                  {hasImage && (
                    <>
                      <Image
                        url={mediaUrls[0]}
                        alt="stop-image"
                        height={236}
                        width={378}
                        priority
                        fetchPriority={'high'}
                        fill
                        aspectRatio="16:10"
                        autoCrop={false}
                        className="sub-card-image"
                        loadHigherQualityImage={true}
                        placeholder="blur"
                      />
                    </>
                  )}
                </Conditional>
                <Conditional if={description}>
                  <Description $isSubCard={isSubCard} $isOpen={isOpen}>
                    <div
                      className="description-text"
                      dangerouslySetInnerHTML={{ __html: description! }}
                    />
                  </Description>
                </Conditional>
              </DescriptionContainer>
            </Conditional>
          </Conditional>
        </ClickableContainer>
        <Conditional if={!isHOHOItinerary}>
          <SubStopSection
            handleSubStopSectionClick={handleSubStopSectionClick}
            subStops={subStops}
            passBys={passBys}
            itineraryId={itineraryId}
            variant={variant}
            isSubCard={isSubCard}
            isOpen={isOpen}
            hasMultiPoints={hasMultiPoints}
            isHOHOItinerary={isHOHOItinerary}
          />
        </Conditional>
        <Conditional
          if={
            subStops.length &&
            !isSubCard &&
            (isStart || isEnd ? isOpen && hasMultiPoints : true) &&
            !isReducedVariant
          }
        >
          <SubCardsContainer>
            <Conditional if={!(isStart || isEnd)}>
              <SubCardHeadingContainer>
                <div className="sub-section-heading">{subSectionHeading}</div>
              </SubCardHeadingContainer>
            </Conditional>
            {subStops.map((subStopProps, index) => (
              <StopCard
                {...subStopProps}
                key={index}
                isSubCard
                defaultOpen={
                  (isStart || isEnd) && multiPointDefaultOpen === index
                }
                itineraryId={itineraryId}
                onStopSectionClick={onStopSectionClick}
                hasMultipleSubStops={subStops.length > 1}
              />
            ))}
          </SubCardsContainer>
        </Conditional>
        <Conditional
          if={
            hasMultiPoints &&
            !isMobile &&
            (!isOpen || isReducedVariant) &&
            endPointIsNotSameAsStart
          }
        >
          <MultiplePoints {...multiPoints} variant={variant} />
        </Conditional>
        <Conditional
          if={
            (passBys.length && !isReducedVariant && endPointIsNotSameAsStart) ||
            (passBys.length &&
              isReducedVariant &&
              endPointIsNotSameAsStart &&
              isOpen &&
              !isHOHOItinerary)
          }
        >
          <NearbyThingsToDo
            passBys={passBys}
            variant={variant}
            itineraryId={itineraryId}
            onClick={onStopSectionClick}
          />
        </Conditional>
      </ContentContainer>
      <Conditional if={shouldShowNextDestinationTravel}>
        <NextDestinationTravel
          timeForNextSection={timeForNextSection!}
          modeOfTravel={modeOfTravel}
          distanceForNextSection={distanceForNextSection!}
        />
      </Conditional>
    </Container>
  );
};

export default StopCard;
