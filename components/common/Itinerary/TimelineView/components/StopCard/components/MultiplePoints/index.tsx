import React from 'react';
import Conditional from 'components/common/Conditional';
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
  onClick,
  id,
}: MultiplePointsProps['points'][0] & {
  index: number;
  onClick: (index: number) => void;
  id: string;
}) => {
  return (
    <SinglePointContainer
      onClick={() => onClick(index)}
      id={id}
      $hasImage={!!image}
    >
      <SinglePointHeadingSection>
        <Conditional if={image}>
          <NumberedImageContainer>
            <Image
              url={image!}
              alt="stop-image"
              height={20}
              width={32}
              priority
              fetchPriority={'high'}
              fill
              aspectRatio="16:10"
              autoCrop={false}
            />
            <p>{index}</p>
          </NumberedImageContainer>
        </Conditional>
        <p className="single-point-heading">{title}</p>
      </SinglePointHeadingSection>
    </SinglePointContainer>
  );
};

const MultiplePoints = ({
  points,
  isStartPoint = false,
  onItemClick,
}: MultiplePointsProps) => {
  const showMorePoints = points.length > 3;

  return (
    <Container $showMorePoints={showMorePoints}>
      {points.slice(0, Math.min(points.length, 3)).map((point, index) => (
        <SinglePoint
          {...point}
          index={index}
          key={`single-map-point-${isStartPoint ? 'start' : 'stop'}-${index}`}
          id={`single-map-point-${isStartPoint ? 'start' : 'stop'}-${index}`}
          onClick={onItemClick}
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
