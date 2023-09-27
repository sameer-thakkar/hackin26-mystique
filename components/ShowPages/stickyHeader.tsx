import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { Button } from '@headout/aer';
import PriceBlock, { StyledPriceBlock } from 'UI/PriceBlock';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUTTON_LOADING_DURATION,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';

const BannerContent = styled.div(
  // @ts-expect-error TS(2339): Property 'showComponent' does not exist on type 'P... Remove this comment to see the full error message
  ({ showComponent }) => `
  z-index: 3;
  background: ${COLORS.BRAND.WHITE};
  top: 80px;
  position: -webkit-sticky;

  ${showComponent ? `position: sticky;` : `display: none;`}
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  height: 78px;

  .heading-wrapper {
    display: grid;
    height: 100%;
    align-items: center;
    grid-template-columns: auto auto;
  }

  .top-text-wrapper {
    ${expandFontToken('UI/Label Regular')}
    color: ${COLORS.GRAY.G3};
    margin-bottom: 8px;
  }

  .heading {
    ${expandFontToken('Heading/Small')}
    color: ${COLORS.GRAY.G2};
  }

  .tags-wrapper {
    display: inline-block;
    border: 1px solid ${COLORS.GRAY.G6};
    color: ${COLORS.GRAY.G3};
    padding: 6px 8px;
    margin: 8px 8px 8px 0;
    border-radius: 2px;
    font-size: 12px;
  }

  .priceBlockWrapper {
    justify-content: flex-end;
    display: flex;
    border-right: 1px solid ${COLORS.GRAY.G6};
  }

  .right-pricing {
    text-align: right;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: right;
  }

  .buy-button-wrapper {
    margin: 0px 16px;
    height: 2.75rem;
    width: 12.5rem;
    button {
      border: none;
      cursor: pointer;
  }
  }
  .unavailable-button {
    background: ${COLORS.GRAY.G5};
    color: ${COLORS.BRAND.WHITE};
    }
  .unavailable-button {
    background: ${COLORS.GRAY.G5};
    color: ${COLORS.BRAND.WHITE};
  }

  .details-container {
    display: grid;
    grid-template-columns: auto auto auto auto;
  }

  .details-container .key {
    color: #666666;
    font-size: 12px;
  }

  .details-container .value {
    color: #444444;
    font-size: 15px;
  }

  .individual-container {
    padding: 10px;
  }

  ${StyledPriceBlock} {
    margin-right: 16px;
    .tour-price {
      color: ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.HEADING_REGULAR)}
      display: flex;
      flex-direction: column;
      .prefix {
        text-align: left;
        ${expandFontToken(FONTS.UI_LABEL_SMALL)}
      }
    }
    .tour-scratch-price{
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
      color: ${COLORS.GRAY.G4};
    }
  }

  @media (max-width: 768px) {
    .heading-wrapper {
      grid-template-columns: auto;
    }

    .right-pricing {
      margin-top: 20px;
      text-align: left;
      grid-template-columns: auto auto;
    }

    .buy-button {
      display: none;
    }

    .details-container {
      grid-template-columns: auto auto;
    }

    h1 {
      font-size: 21px;
    }

    .top-text-wrapper {
      font-size: 12px;
    }
  }
`
);

const BannerContentWrapper = styled.div`
  margin: 0 120px;
  height: 100%;
`;

const StickyHeader = ({
  tgid,
  tourGroupData,
  currentLanguage,
  nextAvailable,
  showComponent,
  isAvailable,
  bookingUrl,
  isButtonLoading,
  setButtonLoading,
}: any) => {
  const {
    listingPrice,
    name,
    primaryCategory,
    primarySubCategory,
    primaryCollection,
  } = tourGroupData ?? {};

  const { NEXT_AVAILABLE } = strings || {};
  const REOPENING_STRING = `${NEXT_AVAILABLE}`;
  const pageMetaData = useRecoilValue(metaAtom);

  const trackBookNowClick = () => {
    const { originalPrice, finalPrice, currencyCode } = listingPrice ?? {};
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: name,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.code,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  useHistoryTraversal({
    action: () => {
      setButtonLoading(false);
    },
  });

  return (
    <>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <BannerContent showComponent={showComponent}>
        <BannerContentWrapper>
          <div className="heading-wrapper">
            <div>
              <div className="top-text-wrapper">
                {isAvailable
                  ? `${REOPENING_STRING} ${nextAvailable}`
                  : strings.SHOW_CLOSED}
              </div>
              <div className="heading">{name}</div>
            </div>
            <div className="right-pricing">
              <div className="priceBlockWrapper">
                <PriceBlock
                  listingPrice={listingPrice}
                  lang={currentLanguage}
                  showSavings
                  showScratchPrice
                  prefix
                />
              </div>
              <div className="buy-button-wrapper">
                <Button
                  tabIndex={0}
                  size="medium"
                  color="purps"
                  variant="primary"
                  isLoading={isButtonLoading}
                  disabled={!isAvailable}
                  onClick={() => {
                    if (isButtonLoading) return;
                    setButtonLoading(true);
                    setTimeout(
                      () => setButtonLoading(false),
                      BUTTON_LOADING_DURATION
                    );
                    trackBookNowClick();
                    window.open(bookingUrl, '_self', 'noopener, noreferrer');
                  }}
                  text={isAvailable ? strings.CHECK_AVAIL : strings.UNAVAILABLE}
                />
              </div>
            </div>
          </div>
        </BannerContentWrapper>
      </BannerContent>
    </>
  );
};

export default StickyHeader;
