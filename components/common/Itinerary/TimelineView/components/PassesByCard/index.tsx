import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Section } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import {
  TimelineViewComponentVariant,
  TOnStopClick,
} from 'components/common/Itinerary/TimelineView/interface';
import Image from 'UI/Image';
import { isMobile } from 'utils/helper';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import EyeSVG from 'assets/eye';
import Minus from 'assets/minus';
import Plus from 'assets/plus';
import {
  Container,
  Cta,
  Heading,
  SpaceBlock,
  StyledMobilePassesByCardContainer,
  SubCardContainer,
  SubCardContentContainer,
  SubCardContentTextContainer,
  SubCardHeadingContainer,
} from './styles';
import { PassesByCardProps, PassesBySubCardProps } from './types';

const SubStopCard = dynamic(
  () =>
    import(
      /*webpackChunkName: "SubStopCard"  */ 'components/common/Itinerary/TimelineView/components/SubStopCard'
    )
);

const PassingBySubCard = ({
  title,
  image,
  description,
  link,
  variant,
  id,
  itineraryId,
  onClick,
}: PassesBySubCardProps) => {
  const isDesktop = !isMobile();
  const [isOpen, setIsOpen] = useState(false);
  const isReducedWidthVariant =
    variant === TimelineViewComponentVariant.REDUCED_WIDTH;

  const handleClick = () => {
    if (isDesktop) {
      if (!isLink) setIsOpen(!isOpen);
    }
    onClick?.({ id } as Section);
  };
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasContent = image || description;

  const isLink = !hasContent && link;

  return (
    <SubCardContainer
      $isOpen={isOpen}
      $variant={variant}
      {...(isLink && { href: link!, as: 'a', target: '_blank' })}
      id={`itinerary-card-${itineraryId}-${id}`}
      onClick={() => id && onClick?.({ id } as Section)}
    >
      <SubCardHeadingContainer onClick={handleClick} $variant={variant}>
        <Image
          url={image!}
          alt="stop-image"
          height={isDesktop ? (isReducedWidthVariant ? 16 : 20) : 20}
          width={isDesktop ? (isReducedWidthVariant ? 26 : 32) : 20}
          priority
          fetchPriority={'high'}
          fill
          aspectRatio="16:10"
          autoCrop={false}
          loadHigherQualityImage={true}
        />
        <p className="passing-by-sub-card-title">{title}</p>
        <Conditional if={isLink}>
          <TailedArrowSVG className="arrow-link" />
        </Conditional>
        <Conditional if={hasContent}>
          <>
            <Conditional if={!isOpen}>
              <Plus />
            </Conditional>
            <Conditional if={isOpen}>
              <Minus />
            </Conditional>
          </>
        </Conditional>
      </SubCardHeadingContainer>
      <Conditional if={isOpen && !isReducedWidthVariant}>
        <SubCardContentContainer>
          <Conditional if={image}>
            <div className="passing-by-sub-card-content-child passing-by-sub-card-content-image-section">
              <Image
                url={image!}
                alt="stop-image"
                height={160}
                width={256}
                priority
                fetchPriority={'high'}
                fill
                aspectRatio="16:10"
                autoCrop={false}
                onLoadingComplete={() => setImageLoaded(true)}
                loadHigherQualityImage={true}
              />
              {!imageLoaded && (
                <Skeleton
                  height={160}
                  width={256}
                  borderRadius={8}
                  containerClassName="image-loader"
                />
              )}
              <Conditional if={!description && link}>
                <Link href={link!} passHref legacyBehavior>
                  <Cta>
                    CTA copy <TailedArrowSVG />
                  </Cta>
                </Link>
              </Conditional>
            </div>
          </Conditional>
          <Conditional if={description}>
            <div className="passing-by-sub-card-content-child passing-by-sub-card-content-text-section">
              <SubCardContentTextContainer>
                <div
                  className="sub-card-description"
                  dangerouslySetInnerHTML={{ __html: description! }}
                />
              </SubCardContentTextContainer>
            </div>
          </Conditional>
        </SubCardContentContainer>
      </Conditional>
      <Conditional if={isOpen && isReducedWidthVariant}>
        <SpaceBlock $gap={'1rem'} />
        <SubStopCard
          id={id!}
          details={{
            name: title,
            mediaUrls: image ? [image] : [],
            sameAsStartingPoint: false,
          }}
          itineraryId={itineraryId}
        />
      </Conditional>
    </SubCardContainer>
  );
};

const MobilePassesByCard = ({
  title,
  image,
  description,
  link,
  id,
  onClick,
}: PassesBySubCardProps) => {
  const isLink = !image && !description;

  const handleContainerClick = () => {
    onClick?.({ id } as Section);
  };

  return (
    <StyledMobilePassesByCardContainer
      onClick={handleContainerClick}
      {...(isLink && {
        href: link!,
        as: 'a',
        target: '_blank',
        rel: 'noreferrer',
      })}
    >
      <div className="heading-container">
        <p className="heading">{title}</p>
        <div className="cta-container">
          <Conditional if={!isLink}>
            <Plus />
          </Conditional>
        </div>
      </div>

      <div className="rank-tag-container">
        <EyeSVG />
      </div>
    </StyledMobilePassesByCardContainer>
  );
};

const PassesByCard = ({
  stops = [],
  variant,
  isCruiseItinerary,
  itineraryId,
  onStopSectionClick,
}: PassesByCardProps & {
  itineraryId: number;
  onStopSectionClick?: TOnStopClick;
}) => {
  const isDesktop = !isMobile();

  return (
    <Container $variant={variant} $isCruiseItinerary={isCruiseItinerary}>
      <Conditional if={!(isCruiseItinerary && !isDesktop)}>
        <Heading $variant={variant}>
          {strings.ITINERARY.PASSES_BY_SECTION_HEADING}
        </Heading>
      </Conditional>
      {stops.map((stop, index) => (
        <>
          <Conditional if={!(isCruiseItinerary && !isDesktop)}>
            <PassingBySubCard
              {...stop}
              key={`passing-by-${index}`}
              variant={variant}
              itineraryId={itineraryId}
              onClick={onStopSectionClick}
            />
          </Conditional>
          <Conditional if={!isDesktop && isCruiseItinerary}>
            <MobilePassesByCard
              {...stop}
              key={`passing-by-${index}`}
              onClick={onStopSectionClick}
              itineraryId={itineraryId}
            />
          </Conditional>
        </>
      ))}
    </Container>
  );
};

export default PassesByCard;
