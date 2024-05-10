import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import Chevron from 'components/UI/Chevron';
import LocalisedPrice from 'components/UI/LPrice';
import { trackEvent } from 'utils/analytics';
import { addQueryParams } from 'utils/urlUtils';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';
import 'react-loading-skeleton/dist/skeleton.css';

const VariantCardWrapper = styled.div`
  width: 100%;
  height: inherit;
  overflow-x: hidden;
  background: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 14px 16px 16px;
  box-sizing: border-box;
  p {
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
  }
  .more-details {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    column-gap: 4px;
    align-items: center;
    color: ${COLORS.TEXT.PURPS_3};
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
    margin-top: 16px;

    &.collapsed {
      margin-top: 0;
    }
  }
  .chevron {
    margin-bottom: -0.4rem;

    &::after,
    &::before {
      background-color: ${COLORS.TEXT.PURPS_3};
      border-radius: 5px;
    }
  }
  ul {
    margin: 0;
  }
`;

const Name = styled.div`
  margin-bottom: 20px;
  ${expandFontToken('Heading/Small')}
  ${({
    // @ts-expect-error TS(2339): Property 'isSkeleton' does not exist on type 'Pick... Remove this comment to see the full error message
    isSkeleton,
  }) => isSkeleton && `margin-bottom: 0;`}
`;

const PriceWrapper = styled.div`
  display: grid;
  grid-template-columns: ${({
    // @ts-expect-error TS(2339): Property 'isSkeleton' does not exist on type 'Pick... Remove this comment to see the full error message
    isSkeleton,
  }) => (isSkeleton ? `repeat(2, 1fr)` : `repeat(2, max-content)`)};
  justify-content: space-between;
`;

const From = styled.div`
  text-transform: lowercase;
  color: ${COLORS.GRAY.G3};
  font-size: 10px;
  line-height: 12px;
`;

const Price = styled.div`
  display: grid;
  row-gap: 2px;
  .variant-price {
    color: ${COLORS.GRAY.G2};
    font-weight: 500;
    font-family: ${HALYARD.FONT_STACK};
    font-size: 15px;
    letter-spacing: 0.6px;
    line-height: 20px;
    margin-right: 8px;
    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
  .discount {
    color: ${COLORS.TEXT.OKAY_GREEN_3};
    background-color: ${COLORS.BACKGROUND.SOOTHING_GREEN};
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.2px;
    font-weight: 400;
    padding: 2px 4px;
    border-radius: 2px;
  }
`;

const Button = styled.div`
  box-sizing: border-box;
  display: flex;
  height: 2.25rem;
  padding: 0.5rem 0.75rem;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  align-self: stretch;
  border: 1px solid ${COLORS.BRAND.PURPS};
  border-radius: 4px;
  text-align: center;
  background-color: ${COLORS.BRAND.WHITE};
  color: ${COLORS.BRAND.PURPS};
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.2px;
  word-wrap: break-word;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    padding: 8px 12px;
  }
  &:hover {
    background-color: ${COLORS.BRAND.PURPS};
    color: ${COLORS.BRAND.WHITE};
  }
`;

const Description = styled.div`
  border-radius: 0 0 7px 7px;
  ${({
    // @ts-expect-error TS(2339): Property 'isSkeleton' does not exist on type 'Pick... Remove this comment to see the full error message
    isSkeleton,
  }) =>
    isSkeleton &&
    `
    @media(min-width: 768px) {
      padding-bottom: 112px;
    }
  `}
  ${({
    // @ts-expect-error TS(2339): Property 'hasVariantInfo' does not exist on type '... Remove this comment to see the full error message
    hasVariantInfo,
  }) =>
    hasVariantInfo &&
    `
    border-top: 1px solid ${COLORS.GRAY.G7};
    padding-top: 16px;
    margin-top: 16px;
    `}
  .desc-list {
    list-style: initial;
    padding-left: 1.6rem;
  }

  .desc-text {
    font-size: 14px;
    font-weight: 200;
    line-height: 20px;
    white-space: pre-line;
    color: ${COLORS.GRAY.G2};
  }

  li::marker {
    font-size: 0.7rem;
  }
`;

export const VariantCardSkeleton = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <SkeletonTheme
      baseColor={COLORS.GRAY.G6}
      highlightColor={COLORS.GRAY.G7}
      borderRadius={0}
      height="20px"
    >
      <VariantCardWrapper>
        {/* @ts-expect-error TS(2769): No overload matches this call. */}
        <Name isSkeleton>
          <Skeleton />
          <Conditional if={!isMobile}>
            <Skeleton width="66.55%" />
          </Conditional>
        </Name>
        {/* @ts-expect-error TS(2769): No overload matches this call. */}
        <PriceWrapper isSkeleton>
          <Price>
            <Skeleton width="30%" />
            <Skeleton width="80%" />
          </Price>
          <div style={{ alignSelf: 'end', textAlign: 'right' }}>
            <Skeleton
              width={isMobile ? '36%' : '52%'}
              height={isMobile ? 32 : 28}
            />
          </div>
        </PriceWrapper>

        {/* @ts-expect-error TS(2769): No overload matches this call. */}
        <Description isSkeleton>
          <Skeleton width="75%" />
          <Conditional if={!isMobile}>
            <Skeleton width="66.55%" />
          </Conditional>
        </Description>
      </VariantCardWrapper>
    </SkeletonTheme>
  );
};

const formatDescription = (desc: any) =>
  desc?.includes('- ') ? (
    <ul className="desc-list">
      {desc?.split('- ')?.map((line: any) => {
        return (
          <Conditional key={line} if={line}>
            <ReactMarkdown
              linkTarget="_blank"
              className="desc-text"
              components={{
                p: 'li',
                code(props) {
                  const { children, ...rest } = props;
                  return <a {...rest}>{children}</a>;
                },
              }}
            >
              {line}
            </ReactMarkdown>
          </Conditional>
        );
      })}
    </ul>
  ) : (
    <div className="desc-text">{desc}</div>
  );

const VariantCard = ({
  currencyCode,
  variantListingPrice,
  variantId,
  variantName,
  variantInfo,
  language,
  bookingUrl,
  tgid,
  hostname,
  isMobile,
}: any) => {
  const bookUrl = addQueryParams(bookingUrl, {
    variantId,
  });
  const { finalPrice: variantPrice, bestDiscount } = variantListingPrice || {};
  const [isContentOpen, toggleContentOpen] = useState(false);
  const pageMetaData = useRecoilValue(metaAtom);
  const trackVariantSelection = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.COMBO_VARIANT.VARIANT_CLICKED,
      [ANALYTICS_PROPERTIES.MB_NAME]: hostname,
      [ANALYTICS_PROPERTIES.VID]: variantId,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
    });
  };

  useEffect(() => {
    if (isContentOpen) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.COMBO_VARIANT.MORE_DETAILS,
        [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      });
    }
  }, [isContentOpen]);

  const getMoreDetailsButton = () => {
    const keyPressedOnReadMore = (event: any) => {
      if (event.keyCode == 13 && !isMobile) {
        toggleContentOpen(!isContentOpen);
      }
    };
    const innerContent = (
      <>
        {isContentOpen ? strings.SHOW_LESS_TEXT : strings.MORE_DETAILS}
        <Chevron
          isActive={isContentOpen}
          className="chevron"
          width="1.13rem"
          height="1.13rem"
        />
      </>
    );
    return (
      <div
        onClick={() => toggleContentOpen(!isContentOpen)}
        className={`more-details ${!isContentOpen && 'collapsed'}`}
        onKeyDown={keyPressedOnReadMore}
        role="button"
        tabIndex={0}
      >
        {innerContent}
      </div>
    );
  };

  return (
    <VariantCardWrapper>
      <Name>{variantName}</Name>
      <PriceWrapper>
        <Price>
          <From>{strings.FROM.toLowerCase()}</From>
          <div>
            <LocalisedPrice
              {...{
                price: variantPrice,
                currencyCode,
                lang: language,
                className: 'variant-price',
              }}
            />
            <Conditional if={isMobile && bestDiscount > 0}>
              <span className="discount">
                {strings.formatString(strings.SAVE, `${bestDiscount}`)}
              </span>
            </Conditional>
          </div>
        </Price>
        <Conditional if={isMobile}>
          <a href={bookUrl} target="_blank" rel="noopener">
            <Button onClick={trackVariantSelection}>
              {strings.COMBO_VARIANT.SELECT_CTA}
            </Button>
          </a>
        </Conditional>
      </PriceWrapper>
      <Conditional if={!isMobile}>
        <a href={bookUrl} target="_blank" rel="noopener">
          <Button onClick={trackVariantSelection}>
            {strings.COMBO_VARIANT.SELECT_CTA}
          </Button>
        </a>
      </Conditional>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <Description hasVariantInfo={variantInfo !== null}>
        <Conditional if={!isMobile || isContentOpen}>
          {formatDescription(variantInfo) || ''}
        </Conditional>
        <Conditional if={isMobile && variantInfo}>
          {getMoreDetailsButton()}
        </Conditional>
      </Description>
    </VariantCardWrapper>
  );
};
export default VariantCard;
