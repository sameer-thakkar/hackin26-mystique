import React, { useEffect, useRef } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { trackPageSection } from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import { SECTION_NAMES } from 'components/HOHO/constants';
import { StructuredCardProps } from 'components/slices/StructuredCard/interface';
import {
  ContentWrapper,
  StructuredItem,
  StyledCard,
} from 'components/slices/StructuredCard/styles';
import Button from 'UI/Button';
import Image from 'UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { shortCodeSerializer } from 'utils/shortCodes';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import DiagonalArrow from 'assets/diagonalArrow';
import Duration from 'assets/duration';
import Frequency from 'assets/frequency';
import Timings from 'assets/timings';

const StructuredCard: React.FC<StructuredCardProps> = (props) => {
  const {
    introText,
    outroText,
    cardImageUrl,
    timings,
    frequency,
    duration,
    altText,
    isMobile,
    ctaUrl,
    ctaText,
    activeTabIndex,
  } = props;

  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting && activeTabIndex === -1) {
      trackPageSection({ section: SECTION_NAMES.BUS_ROUTES });
    }
  }, [isIntersecting]);

  return (
    <StyledCard ref={containerRef}>
      <ContentWrapper>
        <PrismicRichText field={introText} components={shortCodeSerializer} />
        <div className="structured-content">
          <Conditional if={timings}>
            <StructuredItem>
              <div className="label">
                {Timings} {strings.HOHO.TIMINGS}
              </div>
              <div className="info">{timings}</div>
            </StructuredItem>
          </Conditional>
          <Conditional if={frequency}>
            <StructuredItem>
              <div className="label">
                {Frequency}
                {strings.HOHO.FREQUENCY}
              </div>
              <div className="info">{frequency}</div>
            </StructuredItem>
          </Conditional>
          <Conditional if={duration}>
            <StructuredItem>
              <div className="label">
                {Duration} {strings.HOHO.DURATION}
              </div>
              <div className="info">{duration}</div>
            </StructuredItem>
          </Conditional>
        </div>
        <PrismicRichText field={outroText} components={shortCodeSerializer} />
        <Conditional if={ctaUrl?.url && ctaText}>
          <a
            href={ctaUrl?.url}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              trackEvent({
                eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
                [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.VIEW_ROUTES,
                [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAMES.BUS_ROUTES,
              })
            }
            className={`${outroText?.[0]?.text ? '' : 'no-margin'}`}
          >
            <Button fillType="blackBordered" paddingSides="1rem">
              {ctaText} {DiagonalArrow}
            </Button>
          </a>
        </Conditional>
      </ContentWrapper>
      <Image
        url={cardImageUrl?.url}
        alt={altText || ''}
        height={isMobile ? 250 : 500}
        aspectRatio="16:9"
        fitCrop={true}
        onClick={() => window.open(cardImageUrl?.url)}
      />
    </StyledCard>
  );
};

export default StructuredCard;
