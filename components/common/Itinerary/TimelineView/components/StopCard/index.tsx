import React, { useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ChildSection, SECTION_TYPE, SUB_TYPES } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { SubCardHeadingContainer } from 'components/common/Itinerary/TimelineView/components/PassesByCard/styles';
import Descriptors from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors';
import FindDirection from 'components/common/Itinerary/TimelineView/components/StopCard/components/FindDirection';
import MultiplePoints from 'components/common/Itinerary/TimelineView/components/StopCard/components/MultiplePoints';
import { MultiplePointsProps } from 'components/common/Itinerary/TimelineView/components/StopCard/components/MultiplePoints/types';
import NearbyThingsToDo from 'components/common/Itinerary/TimelineView/components/StopCard/components/NearbyThingsToDo';
import NextDestinationTravel from 'components/common/Itinerary/TimelineView/components/StopCard/components/NextDestinationTravel';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import Minus from 'assets/minus';
import Plus from 'assets/plus';
import {
  ClickableContainer,
  Container,
  Description,
  DescriptionContainer,
  HeadingContainer,
  RankContainer,
  SubCardsContainer,
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
  findDirections = false,
}: StopCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
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
    points:
      isStart || isEnd
        ? subCards.map(({ sectionDetails }) => ({
            image: sectionDetails?.details?.mediaUrls?.[0],
            title: sectionDetails?.details.name!,
          }))
        : [],
    isStartPoint: isStart,
    onItemClick: (index) => {
      if (index < 3) {
        setMultiPointDefaultOpen(index);
      }
      setIsOpen(true);
    },
  };

  const hasMultiPoints = multiPoints.points.length > 1;

  useEffect(() => {
    if (defaultOpen) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'center',
      });
    }
  }, []);

  const allowOpen = useMemo(() => {
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
  }, []);

  const subSectionHeading =
    subType?.label === SUB_TYPES.POI || subType?.label === SUB_TYPES.LANDMARK
      ? strings.ITINERARY.SUB_SECTION_HEADING.HIGHLIGHTS
      : subType?.label === SUB_TYPES.HOHO_BUS_STOP
      ? strings.ITINERARY.SUB_SECTION_HEADING.NEARBY_THINGS_TO_DO
      : strings.ITINERARY.SUB_SECTION_HEADING.THINGS_TO_DO;

  return (
    <Container
      $isSubCard={isSubCard}
      $isStart={isStart || isForcedStart}
      $isEnd={isEnd || isForcedEnd}
      key={id}
      ref={ref}
    >
      <Conditional if={!isSubCard && position !== null}>
        <RankContainer $isEnd={isEnd}>
          <Conditional if={position}>
            <p>{position}</p>
          </Conditional>
          <Conditional if={!position}>
            <TailedArrowSVG />
          </Conditional>
        </RankContainer>
      </Conditional>
      <ClickableContainer
        onClick={() => {
          setMultiPointDefaultOpen(-1);
          setIsOpen(!isOpen);
          trackEvent({
            eventName: isSubCard
              ? ANALYTICS_EVENTS.ITINERARY.SUB_STOP_CLICKED
              : ANALYTICS_EVENTS.ITINERARY.STOP_CLICKED,
            [ANALYTICS_PROPERTIES.ACTION]: !isOpen ? 'Expanded' : 'Collapsed',
            [ANALYTICS_PROPERTIES.STOP_NAME]: name,
            [ANALYTICS_PROPERTIES.STOP_NUMBER]: position,
          });
        }}
        $isClickable={allowOpen}
      >
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
              />
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
        <Conditional if={!hasMultiPoints}>
          <Conditional if={endPointIsNotSameAsStart}>
            <Descriptors {...descriptors} />
          </Conditional>
          <Conditional if={findDirections && !isSubCard}>
            <FindDirection location={location!} hoverAnimation />
          </Conditional>
          <Conditional
            if={(showSubCardImage || description) && endPointIsNotSameAsStart}
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
        if={subStops.length && !isSubCard && (hasMultiPoints ? isOpen : true)}
      >
        <SubCardsContainer>
          <Conditional if={!hasMultiPoints}>
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
            />
          ))}
        </SubCardsContainer>
      </Conditional>
      <Conditional if={hasMultiPoints && !isOpen && endPointIsNotSameAsStart}>
        <MultiplePoints {...multiPoints} />
      </Conditional>
      <Conditional if={passBys.length && endPointIsNotSameAsStart}>
        <NearbyThingsToDo passBys={passBys} />
      </Conditional>
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
