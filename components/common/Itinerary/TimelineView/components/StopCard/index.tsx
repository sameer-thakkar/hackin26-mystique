import React, { useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRecoilValue } from 'recoil';
import { ChildSection, SECTION_TYPE, SUB_TYPES } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { SubCardHeadingContainer } from 'components/common/Itinerary/TimelineView/components/PassesByCard/styles';
import Descriptors from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors';
import FindDirection from 'components/common/Itinerary/TimelineView/components/StopCard/components/FindDirection';
import MultiplePoints from 'components/common/Itinerary/TimelineView/components/StopCard/components/MultiplePoints';
import { MultiplePointsProps } from 'components/common/Itinerary/TimelineView/components/StopCard/components/MultiplePoints/types';
import NearbyThingsToDo from 'components/common/Itinerary/TimelineView/components/StopCard/components/NearbyThingsToDo';
import NextDestinationTravel from 'components/common/Itinerary/TimelineView/components/StopCard/components/NextDestinationTravel';
import SubStopCard from 'components/common/Itinerary/TimelineView/components/SubStopCard';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import Minus from 'assets/minus';
import Plus from 'assets/plus';
import {
  ClickableContainer,
  Container,
  ContentContainer,
  Description,
  DescriptionContainer,
  HeadingContainer,
  RankContainer,
  SubCardsContainer,
  SubStopsContainer,
  TitleContainer,
  ToggleContainer,
} from './styles';
import { StopCardProps } from './types';

const MAX_LEN_DESCRIPTION_STOP_CARD = 114;
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
}: StopCardProps & {
  itineraryId: number;
}) => {
  const { isMobile } = useRecoilValue(appAtom);
  const isDesktop = !isMobile;
  const [isOpen, setIsOpen] = useState(
    isDesktop ? defaultOpen || isActive : false
  );
  const [multiPointDefaultOpen, setMultiPointDefaultOpen] = useState(-1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { id, type, details, location } = isSubSection
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
  const { subStops, passBys } = useMemo(() => {
    const subStops = subCards.filter(({ subSectionDetails, isSubSection }) =>
      isSubSection
        ? subSectionDetails && !subSectionDetails.details.passBy
        : true
    );
    const passBys = subCards
      .filter(
        ({ subSectionDetails }) =>
          subSectionDetails && subSectionDetails.details.passBy
      )
      .map(({ subSectionDetails }) => subSectionDetails) as ChildSection[];
    return { subStops, passBys };
  }, []);
  const endPointIsNotSameAsStart = !sectionDetails?.details.sameAsStartingPoint;
  const multiPoints: MultiplePointsProps = {
    itineraryId,
    points:
      isStart || isEnd
        ? subCards.map(({ sectionDetails }) => ({
            image: sectionDetails!.details?.mediaUrls?.[0],
            title: sectionDetails!.details.name!,
            timeForNextSection: sectionDetails!.details.timeForNextSection,
          }))
        : [],
    isStartPoint: isStart,
    onItemClick: (index) => {
      if (variant === TimelineViewComponentVariant.DEFAULT) {
        if (index < 3) {
          setMultiPointDefaultOpen(index);
        }
        setIsOpen(true);
      } else {
        if (index < 3) {
          onStopSectionClick?.(subCards[index].sectionDetails!);
        }
      }
    },
  };
  const hasMultiPoints = multiPoints.points.length > 1;
  const handleStopSectionClick = () => {
    if (!hasMultiPoints || !isDesktop) {
      onStopSectionClick?.(isSubSection ? subSectionDetails! : sectionDetails!);
    }
  };
  useEffect(() => {
    if (defaultOpen) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'center',
      });
    }
  }, []);

  const isReducedVariant =
    variant === TimelineViewComponentVariant.REDUCED_WIDTH;

  useEffect(() => {
    if (isReducedVariant && isDesktop) setIsOpen(hasMultiPoints || isActive);
  }, [isActive]);

  const allowOpen = useMemo(() => {
    if (!isReducedVariant) {
      if (!endPointIsNotSameAsStart && isEnd) return false;
      if ((isStart || isEnd) && hasMultiPoints) return false;
      if (isSubCard && !hasImage && !description) return false;
      if (
        !isSubCard &&
        !isSubSection &&
        !hasImage &&
        (!description || description.length - 7 < MAX_LEN_DESCRIPTION_STOP_CARD)
      )
        return false;
      return true;
    } else {
      return (
        (!isStart &&
          !isEnd &&
          !isHOHOItinerary &&
          (!!subStops?.length || !!passBys?.length)) ||
        ((isStart || isEnd) && !hasMultiPoints) ||
        !isDesktop
      );
    }
  }, []);
  const subSectionHeading =
    subType?.label === SUB_TYPES.POI || subType?.label === SUB_TYPES.LANDMARK
      ? strings.ITINERARY.SUB_SECTION_HEADING.HIGHLIGHTS
      : subType?.label === SUB_TYPES.HOHO_BUS_STOP
      ? strings.ITINERARY.SUB_SECTION_HEADING.NEARBY_THINGS_TO_DO
      : strings.ITINERARY.SUB_SECTION_HEADING.THINGS_TO_DO;

  const DefaultHeadingContainer = () => {
    return (
      <>
        <Conditional if={allowOpen}>
          <ToggleContainer>
            {isOpen ? <Minus /> : <Plus height={20} width={20} />}
          </ToggleContainer>
        </Conditional>
        <Conditional if={(isEnd || isStart) && !isSubCard}>
          <TitleContainer>
            {isStart
              ? strings.ITINERARY.STOP_CARD.TITLE.START
              : strings.ITINERARY.STOP_CARD.TITLE.END}
          </TitleContainer>
        </Conditional>
        <HeadingContainer $isSubCard={isSubCard}>
          <Conditional if={!isSubCard && !hasMultiPoints}>
            {hasImage && (
              <>
                <Image
                  url={mediaUrls[0]}
                  alt={name || 'stop-image'}
                  height={20}
                  width={32}
                  priority
                  fetchPriority={'high'}
                  fill
                  aspectRatio="16:10"
                  autoCrop={false}
                  onLoadingComplete={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <Skeleton
                    height={20}
                    width={32}
                    borderRadius={4}
                    containerClassName="sub-image-loader"
                  />
                )}
              </>
            )}
          </Conditional>
          <p className="stop-name">
            {hasMultiPoints
              ? strings.formatString(
                  isStart
                    ? strings.ITINERARY.STOP_CARD.MULTI_POINTS_AVAILABLE.START
                    : strings.ITINERARY.STOP_CARD.MULTI_POINTS_AVAILABLE.END,
                  multiPoints.points.length
                )
              : isSubCard
              ? `${position}. ${name}`
              : name}
          </p>
          <Conditional if={findDirections && isSubCard}>
            <FindDirection location={location!} hoverAnimation />
          </Conditional>
        </HeadingContainer>
      </>
    );
  };
  const ReducedWidthHeadingContainer = () => {
    return (
      <HeadingContainer $isSubCard={isSubCard} $variant={variant}>
        <div className="stop-heading-container">
          <Conditional if={!hasMultiPoints && (isStart || isEnd)}>
            <p className="stop-title">
              {isStart
                ? strings.ITINERARY.STOP_CARD.TITLE.START
                : strings.ITINERARY.STOP_CARD.TITLE.END}
            </p>
          </Conditional>
          <div className="stop-name-container">
            <Conditional if={!isSubCard && !hasMultiPoints}>
              {hasImage && (
                <>
                  <Image
                    url={mediaUrls[0]}
                    alt={name || 'stop-image'}
                    height={isDesktop ? 20 : 16}
                    width={isDesktop ? 32 : 24}
                    priority
                    fetchPriority={'high'}
                    fill
                    aspectRatio="15:10"
                    autoCrop={false}
                    onLoadingComplete={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <Skeleton
                      height={isDesktop ? 20 : 16}
                      width={isDesktop ? 32 : 24}
                      borderRadius={4}
                      containerClassName="sub-image-loader"
                    />
                  )}
                </>
              )}
            </Conditional>
            <p className="stop-name">
              {hasMultiPoints
                ? strings.formatString(
                    isStart
                      ? strings.ITINERARY.STOP_CARD.MULTI_POINTS_AVAILABLE.START
                      : strings.ITINERARY.STOP_CARD.MULTI_POINTS_AVAILABLE.END,
                    multiPoints.points.length
                  )
                : isSubCard
                ? `${position}. ${name}`
                : name}
            </p>
          </div>
          <Conditional if={!endPointIsNotSameAsStart && isEnd}>
            <p className="stop-subtext">
              Your ending point would be same as your start point
            </p>
          </Conditional>
        </div>
        <Conditional if={allowOpen}>
          <div className="toggle-icon-container">
            {isOpen ? <Minus /> : <Plus height={20} width={20} />}
          </div>
        </Conditional>
      </HeadingContainer>
    );
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
          $isClickable={allowOpen || isReducedVariant}
        >
          <Conditional if={!isReducedVariant}>
            <DefaultHeadingContainer />
          </Conditional>
          <Conditional if={isReducedVariant}>
            <ReducedWidthHeadingContainer />
          </Conditional>
          <Conditional if={!hasMultiPoints}>
            <Conditional if={findDirections && isReducedVariant}>
              <FindDirection
                location={location!}
                hoverAnimation
                variant={variant}
              />
            </Conditional>
            <Conditional if={endPointIsNotSameAsStart}>
              <Descriptors {...descriptors} variant={variant} />
            </Conditional>
            <Conditional
              if={
                findDirections &&
                !isSubCard &&
                !hasMultiPoints &&
                !isReducedVariant
              }
            >
              <FindDirection location={location!} hoverAnimation />
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
                        height={142.5}
                        width={228}
                        priority
                        fetchPriority={'high'}
                        fill
                        aspectRatio="16:10"
                        autoCrop={false}
                        className="sub-card-image"
                        onLoadingComplete={() => setImageLoaded(true)}
                      />
                      {!imageLoaded && (
                        <Skeleton
                          height={143}
                          width={228}
                          borderRadius={4}
                          containerClassName="sub-image-loader"
                        />
                      )}
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
        <Conditional
          if={
            subStops?.length &&
            isReducedVariant &&
            !isSubCard &&
            isOpen &&
            !hasMultiPoints
          }
        >
          {subStops.map(
            ({ subSectionDetails, descriptors, sectionDetails }) => (
              <SubStopCard
                key={`subStop-card-${
                  (subSectionDetails || sectionDetails)?.id
                }`}
                subSectionDetails={subSectionDetails!}
                sectionDetails={sectionDetails!}
                descriptors={descriptors}
                variant={variant}
                itineraryId={itineraryId}
              />
            )
          )}
        </Conditional>
        <Conditional
          if={
            (passBys?.length || subStops?.length) &&
            isReducedVariant &&
            !isSubCard &&
            !hasMultiPoints &&
            isHOHOItinerary
          }
        >
          <SubStopsContainer>
            {subStops.map(
              ({ subSectionDetails, descriptors, sectionDetails }) => (
                <SubStopCard
                  key={`subStop-card-${
                    (subSectionDetails || sectionDetails)?.id
                  }`}
                  subSectionDetails={subSectionDetails!}
                  sectionDetails={sectionDetails!}
                  descriptors={descriptors}
                  variant={variant}
                  isHOHOItinerary={isHOHOItinerary}
                  itineraryId={itineraryId}
                />
              )
            )}
            {passBys.map((passBy) => (
              <SubStopCard
                key={`subStop-card-${passBy.id}`}
                subSectionDetails={passBy}
                variant={variant}
                isHOHOItinerary={isHOHOItinerary}
                itineraryId={itineraryId}
              />
            ))}
          </SubStopsContainer>
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
              />
            ))}
          </SubCardsContainer>
        </Conditional>
        <Conditional
          if={
            hasMultiPoints &&
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
      <Conditional
        if={
          !(isEnd || isForcedEnd) &&
          !isSubCard &&
          (timeForNextSection || modeOfTravel || distanceForNextSection)
        }
      >
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
