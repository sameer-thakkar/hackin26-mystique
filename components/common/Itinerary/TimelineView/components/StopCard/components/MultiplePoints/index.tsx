import React from 'react';
import Conditional from 'components/common/Conditional';
import PassByItemCard from 'components/common/Itinerary/TimelineView/components/SubStopCard';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import {
  Container,
  NumberedImageContainer,
  SinglePointContainer,
  SinglePointHeadingSection,
} from './styles';
import { MultiplePointsProps } from './types';

const SinglePoint = ({
  title,
  image,
  index,
  timeForNextSection,
  onClick,
  id,
  variant = TimelineViewComponentVariant.DEFAULT,
  itineraryId,
}: MultiplePointsProps['points'][0] & {
  index: number;
  onClick: (index: number) => void;
  id: string;
  variant?: TimelineViewComponentVariant;
  itineraryId: number;
}) => {
  const isReducedWidthVariant =
    variant === TimelineViewComponentVariant.REDUCED_WIDTH;

  return (
    <>
      <Conditional if={isReducedWidthVariant}>
        <PassByItemCard
          id={Number(id)}
          details={{
            name: title,
            mediaUrls: image ? [image] : [],
            timeFromParent: timeForNextSection,
            sameAsStartingPoint: false,
          }}
          rank={index}
          itineraryId={itineraryId}
          onClick={() => onClick(index)}
        />
      </Conditional>
      <Conditional if={!isReducedWidthVariant}>
        <SinglePointContainer
          onClick={() => onClick(index)}
          $hasImage={!!image}
          id={`itinerary-card-${itineraryId}-${id}`}
        >
          <SinglePointHeadingSection>
            <Conditional if={image}>
              <NumberedImageContainer>
                <Image
                  url={image!}
                  alt="stop-image"
                  height={isReducedWidthVariant ? 30 : 20}
                  width={isReducedWidthVariant ? 48 : 32}
                  priority
                  fetchPriority={'high'}
                  fill
                  aspectRatio="16:10"
                  autoCrop={false}
                  loadHigherQualityImage={true}
                />
                <p>{index}</p>
              </NumberedImageContainer>
            </Conditional>
            <p className="single-point-heading">{title}</p>
          </SinglePointHeadingSection>
        </SinglePointContainer>
      </Conditional>
    </>
  );
};

const MultiplePoints = ({
  points,
  isStartPoint = false,
  onItemClick,
  variant = TimelineViewComponentVariant.DEFAULT,
  itineraryId,
}: MultiplePointsProps) => {
  const showMorePoints = points.length > 3;

  return (
    <Container $showMorePoints={showMorePoints} $variant={variant}>
      {points.slice(0, Math.min(points.length, 3)).map((point, index) => (
        <SinglePoint
          {...point}
          index={index}
          key={`single-map-point-${isStartPoint ? 'start' : 'stop'}-${index}`}
          id={`single-map-point-${isStartPoint ? 'start' : 'stop'}-${index}`}
          onClick={onItemClick}
          variant={variant}
          itineraryId={itineraryId}
        />
      ))}
      <Conditional if={showMorePoints}>
        <SinglePointContainer $showMoreSection onClick={() => onItemClick(3)}>
          <p className="show-more-count">
            {strings.formatString(strings.ITINERARY.MORE, points.length - 3)}
            more
          </p>
        </SinglePointContainer>
      </Conditional>
    </Container>
  );
};

export default MultiplePoints;
