import { RichText } from 'prismic-reactjs';
import { useRecoilValue } from 'recoil';
import Button from 'UI/Button';
import { strings } from 'const/strings';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import parse from 'url-parse';
import styled from 'styled-components';
import React, { useRef, useState, useContext } from 'react';
import HorizontalLine from 'components/slices/HorizontalLine';
import {
  ANALYTICS_EVENTS,
  THEMES,
  SIDEBAR_TYPES,
  LOCALISED_DATE_FORMATS,
  NOS_OF_HIGHLIGHTS_TO_SHOW,
  ANALYTICS_PROPERTIES,
} from 'const/index';
import COLORS from 'const/colors';
import { shortCodeSerializer } from 'utils/shortCodes';
import { CALENDAR, BackArrow } from 'assets/SvgIcons';
import { StlyedSplit } from 'UI/Split';
import { createBookingURL } from 'utils';
import { MBContext } from 'contexts/MBContext';
import PriceBlock from 'UI/PriceBlock';
import Chevron from 'UI/Chevron';
import {
  extractTabsFromHighlights,
  getProductCardLayout,
} from 'utils/productUtils';
import { truncate, wordCount } from 'utils/helper';
import { currencyAtom } from 'store/atoms/currency';
import { BLACK_COLOR_CLOSE } from 'assets/SvgIcons';
import Conditional from 'components/common/Conditional';
import Product from 'components/Product';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import PromoCodeBlock from 'UI/PromoCodeBlock';
import { descriptorIcons } from 'const/descriptorIcons';
import { getDuration } from 'utils/timeUtils';
import ComboVariants from 'UI/ComboVariants';
import { expandFontToken } from 'const/typography';
import { metaAtom } from 'store/atoms/meta';

dayjs.extend(advancedFormat);

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  width: 100%;
`;

const StyledProductCard = styled.div`
  padding: ${({ isMainCard }) => (isMainCard ? '24px' : '24px 0px 24px 40px')};
  display: grid;
  grid-row-gap: 24px;
  grid-template-columns: 1fr auto;
  grid-template-areas: ${({ layout }) =>
    layout.desktop.map((row) => `'${row}'`)};
  ${StlyedSplit} {
    margin: 0;
    max-width: unset;
    padding: 0;
  }
  ${HorizontalLine} {
    grid-area: line;
    margin: 8px 0;
    ${({ theme }) => theme.productCards.lineStyles || ''};
  }
  .more-details {
    font-weight: 500;
    font-size: 14px;
    line-height: 15px;
    margin-left: 1em;
    margin-top: 16px;
    cursor: pointer;
    outline: none;
    ${({ theme }) => theme.productCards.moreDetailsStyle}
  }
  ${({ theme }) => theme.productCards?.styles?.desktop}
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.productCards.padding.mobile};
    margin: 0;
    grid-template-areas: ${({ layout }) =>
      layout.mobile.map((row) => `'${row}'`)};
    width: auto;
    grid-template-columns: auto;
    .more-details {
      margin-top: 0;
      margin-left: 0;
      margin-bottom: 0;
    }
    ${({ theme }) => theme.productCards?.styles?.mobile}
  }
`;

const ProductHeader = styled.div`
  display: grid;
  grid-gap: 16px;
  display: contents;
  @media (max-width: 768px) {
  }
`;

const CloseIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${COLORS.GRAY.G8};
  right: 0;
  position: sticky;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
`;

const WrapperProductCard = styled.div`
  border: ${({ theme }) => theme.productCards.border};
  border-radius: 8px;
  display: grid;
  grid-template-columns: ${({ isMainCard, isMobile }) =>
    isMainCard || isMobile ? 'auto' : 'auto 40px'};
  overflow: hidden;
  background: white;
  @media (max-width: 768px) {
    ${({ isMobile }) => (!isMobile ? 'margin: 0 16px;' : 'border: 0;')};
  }
`;

const TourTitle = styled.h2`
  ${expandFontToken('Heading/Large')}
  margin: 0 !important;
  max-width: 768px;
  @media (max-width: 768px) {
    ${({ isPopup, theme }) =>
      isPopup
        ? theme.productCards.titleFontSettings.popupMobile
        : theme.productCards.titleFontSettings.mobile};
  }
`;

const MoreDetailWrapper = styled.div`
  color: ${COLORS.TEXT.CANDY_1};
  ${expandFontToken('Button/Medium')}
  cursor: pointer;
  @media (max-width: 768px) {
  }
`;

const PopupWrapper = styled.div`
  z-index: 10;
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgb(17, 17, 17, 0.6);
  top: 0;
  left: 0;
  display: grid;
  justify-content: center;
  align-items: center;
`;

const PopupContentWrapper = styled.div`
  width: 1200px !important;
  margin: auto;
`;

const TitleWrapper = styled.div`
  grid-area: title;
  ${({ hasBorderedTitle }) =>
    hasBorderedTitle
      ? `
            border-bottom: 1px solid ${COLORS.GRAY.G6};
            padding-bottom: 16px;
            margin-bottom: -8px;
            @media(max-width: 768px) {
              border: none;
            }
          `
      : ''}
`;

const ShortSummary = styled.div`
  margin-top: -8px;
  grid-area: summary;
  p {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken('Paragraph/Regular')}
    margin: 0;
  }
  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const TourTags = styled.div(
  ({ isMainCard, isOpened }) => `
  display: ${isMainCard ? 'inline' : 'grid'};
  grid-row-gap: 12px;
  align-items: start;
  align-content: start;
  margin: 0;
  color: ${COLORS.GRAY.G3};
  .tour-tag-wrapper{
    ${!isOpened ? `display: inline !important;float: left;` : ''}
  }
  .tour-tag {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 8px;
    margin-right: ${isMainCard ? '20px' : '8px'};
    max-width: 230px;
    justify-content: left;
    align-items: center;
    ${expandFontToken('UI/Label Medium')}
    margin-bottom: ${isMainCard ? '5px' : '0'};
    .image-wrap {
      display: flex;
      align-items: top;
      padding-top: calc(100% / 2);
    }
    img,
    amp-img {
      height: 16px;
      width: 16px;
      object-fit: cover;
    }
  }
  @media (max-width: 768px) {
    grid-area: tags;
    align-items: start;
    display: grid;
    grid-template-columns: auto auto;
    ${expandFontToken('UI/Label Regular')}
    margin-top: -8px;
    grid-column-gap: 8px;
    grid-row-gap: 12px;
    .tour-tag {
      margin: 0;
    }
  }
`
);

export const CTAContainer = styled.div`
  grid-area: cta-combo;
  display: grid;
  grid-gap: 16px;
  align-content: start;
  ${({ theme }) =>
    theme.theme === THEMES.MIN_BLUE
      ? `
    button.tour-book-now-cta {
      width: 100%;
    }
  `
      : ``}
  ${({ isMainCard }) =>
    isMainCard
      ? `
    height: 100%;
    align-items: center;
    display: flex;
`
      : ``}
  @media (max-width: 768px) {
    display: contents;
  }
`;

const CTAWrapper = styled.div`
  grid-gap: 16px;
  display: grid;
  padding-right: 16px;
`;

const PriceContainer = styled.div`
  justify-self: center;
  display: grid;
  grid-auto-flow: column;
  align-items: end;
  grid-column-gap: 8px;
  justify-items: left;
  grid-row-gap: 4px;
  .tour-scratch-price {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: left;
    grid-column-gap: 4px;
  }
  ${({ theme }) => theme.productCards.priceFontSettings.desktop}
  .tour-price {
    display: flex;
    ${expandFontToken('Heading/Large')}
  }
  @media (max-width: 768px) {
    justify-self: left;
    grid-area: price-block;
    ${({ theme }) => theme.productCards.priceFontSettings.mobile}
  }
`;
const CTABlock = styled.div`
  a {
    text-decoration: none;
  }
  .tour-book-now-cta {
    margin: auto;
    min-width: 230px;
    width: 100%;
    display: block;
    ${expandFontToken('Button/Medium')}
    border-radius: 4px;
    svg {
      vertical-align: middle;
      margin-left: 24px;
      transform: rotate(180deg);
      path {
        stroke: ${({ theme }) => theme.primaryBGText};
        stroke-width: 1.5px;
      }
    }
  }

  @media (max-width: 768px) {
    grid-area: cta-block;
    margin-top: 0;
    ${({ isSticky, shouldOffset }) =>
      isSticky
        ? `
      position: sticky;
      bottom: 0;
      padding-bottom: 16px;
      ${shouldOffset ? 'transform: translateY(32px);' : ''}
      background: ${COLORS.BRAND.WHITE};
      z-index: 2;
    `
        : ``}
    .tour-book-now-cta {
      justify-content: center;
      width: 100%;
    }
  }
`;

const ProductBody = styled.div`
  grid-area: body;
  display: grid;
  grid-row-gap: 8px;
  overflow-anchor: none;
  .tour-description {
    cursor: ${({ hasReadMore }) => (hasReadMore ? 'pointer' : '')};
    p {
      margin: 0;
      font-weight: 500;
    }
    ${({ theme }) => theme.productCards.regularFontSettings.desktop}
    color: ${COLORS.GRAY.G2};
    opacity: 0.99;
    display: grid;
    grid-gap: 0;
    ${({ collapsed, noOfListItemToShow, defaultOpen }) =>
      collapsed && !defaultOpen
        ? `
    *:not(div):nth-child(n + ${noOfListItemToShow}),
    ul li:nth-child(n + ${noOfListItemToShow}) {
      display: none;
    }
    `
        : ''}
    ul {
      padding: 0;
      padding-left: 1.0em;
      display: grid;
      grid-gap: 12px;
      li{
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 22px;
        color: #545454;
      }
    }
  }
  .amp-tour-description{
    ${({ collapsed, noOfListItemToShow, defaultOpen }) =>
      collapsed && !defaultOpen
        ? `
  *:not(div):nth-child(n + ${noOfListItemToShow}),
  ul li:nth-child(n + ${noOfListItemToShow}) {
    display: grid;
  }
  `
        : ''}
  }
  ul:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    
    .show-more-information{
      p:nth-child(1) {
              display: block;
      }
      ul {
        li:nth-child(n + 2) {
          display: list-item;
        }
      }
    }
    .tour-description {
      ${({ theme }) => theme.productCards.regularFontSettings.mobile}
    }
    ${({ collapsed, defaultOpen }) =>
      collapsed && !defaultOpen
        ? `
        .tour-description {
          display: none;
        }
    `
        : ''}
  }
  .display-none{
    display: none;
  }
  .display-expand{
    display:grid;
  }
`;

const NextAvailableBlock = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${COLORS.GRAY.G2};
  line-height: 15px;
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: center;
  .icon {
    display: flex;
  }
  ${({ theme }) => theme.productCards?.nextAvailable?.desktop}
  @media (max-width: 768px) {
    grid-area: next-available;
    margin-top: -8px;
    ${({ theme }) => theme.productCards?.nextAvailable?.mobile}
  }
`;
const ProductOfferBlock = styled.div`
  grid-area: offer;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  cursor: pointer;
  color: ${({ theme: { primaryAccent } }) =>
    primaryAccent ? primaryAccent : COLORS.BRAND.PURPS};
  p {
    margin: 0;
    color: ${({ theme: { primaryAccent } }) =>
      primaryAccent ? primaryAccent : COLORS.BRAND.PURPS};
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Labels = styled.div`
  padding: 0 24px;
  margin-bottom: -11.5px;
`;

const Label = styled.div`
  display: inline;
  margin-right: 12px;
  padding: 2px 4px;
  font-size: 10px;
  font-style: normal;
  font-weight: normal;
  line-height: 12px;
  color: #444444;
  border-radius: 2px;
  background: ${COLORS.JOY_MUSTARD.LIGHT_TONE_2};
`;

const ModalCardContainer = styled.div`
  @media (max-width: 768px) {
    background: #fff;
    border-radius: 10px 10px 0 0;
    ${StyledProductCard} {
      margin: 0;
      border: none;
      padding: 0 24px;
      padding-top: 24px;
    }
    ${TitleWrapper} {
      max-width: calc(100% - 24px);
    }
    ${ProductBody} {
      .tour-description {
        display: block;
        p {
          margin-bottom: 12px;
        }
        li,
        p {
          font-size: 15px;
          line-height: 23px;
        }
      }
      .more-details {
        display: none;
      }
    }
    ${CTABlock} {
      .tour-book-now-cta {
        border-radius: 8px;
      }
    }
  }
`;

const Descriptors = ({
  descriptorArray,
  isMainCard = false,
  isOpened = false,
  minDuration,
  maxDuration,
  lang = 'en',
}) => {
  return (
    <TourTags isMainCard={isMainCard} isOpened={isOpened}>
      {descriptorArray.map((item, index) => {
        const DescriptorSVG = descriptorIcons[item];

        let descEl = item ? (
          <div key={`descriptor-${index}`} className="tour-tag">
            <DescriptorSVG />

            <Conditional if={item === 'DURATION'}>
              {strings.formatString(
                strings.DESCRIPTORS.DURATION,
                `${getDuration({ minDuration, maxDuration, lang })}`
              )}
            </Conditional>
            <Conditional if={item !== 'DURATION'}>
              {strings.DESCRIPTORS?.[item]}
            </Conditional>
          </div>
        ) : null;

        descEl = isMainCard ? (
          <div className="tour-tag-wrapper">{descEl}</div>
        ) : null;

        return descEl;
      })}
    </TourTags>
  );
};

const TicketCard = (props) => {
  const moreDetailsRef = useRef();
  const {
    tgid,
    position,
    currentLanguage,
    togglePopup,
    defaultOpen,
    title,
    descriptors,
    highlights: tempHighlights,
    tourPrices,
    uid,
    hasOffer: isOfferEnabled,
    productOffer,
    offerId,
    isFetched,
    scorpioData,
    host,
    earliestAvailability = {},
    ctaUrlSuffix,
    isScratchPriceEnabled,
    booster,
    shortSummary,
    boosterTag,
    isMobile,
    isAmp,
    instantCheckout,
    showEarliestAvailability,
    finalPromoCode,
    appliedPromo,
  } = props;

  const { mbTheme, biLink, bookSubdomain } = useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);
  const pageMetaData = useRecoilValue(metaAtom);
  const isCombo = scorpioData?.combo;
  const isTicketCard = true;
  const [isContentOpen, toggleContentOpen] = useState(defaultOpen);
  const [isOpened, setIsOpened] = useState(false);
  const [showComboVariant, setShowComboVariant] = useState(false);
  const { promo_code } = finalPromoCode || {};
  const { minDuration, maxDuration } = scorpioData || {};

  const descriptorsList = descriptors || scorpioData.descriptors;

  const noOfListItemToShow = Math.max(
    NOS_OF_HIGHLIGHTS_TO_SHOW,
    descriptorsList.length
  );

  const popupOpener = () => {
    setIsOpened(true);
    document.body.style.overflow = 'hidden';
  };

  const popupCloser = () => {
    setIsOpened(false);
    document.body.style.overflow = 'auto';
  };

  const handlePopup = () => {
    togglePopup();
  };

  const sendBookNowEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      'Div Type': 'product-list',
    });

    const { originalPrice, finalPrice, currencyCode } = listingPrice ?? {};
    const { primaryCategory, primaryCollection, primarySubCategory } =
      scorpioData ?? {};
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]:
        isScratchPriceEnabled && originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: cardTitle,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CITY]: pageMetaData?.city?.cityCode,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const getDate = (date, currentLanguage) => {
    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    if (date === today) return strings.TODAY;
    if (date === tomorrow) return strings.TOMORROW;
    return dayjs(date)
      .locale(currentLanguage)
      .format(LOCALISED_DATE_FORMATS[currentLanguage].DATE_MONTH);
  };

  const cardTitle = title || scorpioData.title;
  let url = host || window.location.host;
  const isDev = url.includes('localhost');
  const currentHost = !isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');
  const showScratchPrice = isFetched && isScratchPriceEnabled;
  const finalHighlights = RichText.asText(tempHighlights)?.trim()?.length
    ? tempHighlights
    : scorpioData.highlights;
  let mobileFallbackShortSummary =
    finalHighlights?.filter((line) => wordCount(line?.text) > 5)?.slice(0, 1) ??
    '';
  mobileFallbackShortSummary = mobileFallbackShortSummary.map((content) => ({
    spans: [],
    text: truncate(content.text, 80),
    type: 'paragraph',
  }));
  let hasShortSummary = shortSummary?.length > 0;
  hasShortSummary =
    !hasShortSummary && isMobile
      ? mobileFallbackShortSummary.length > 0
      : hasShortSummary;
  const isFallbackSummary = isMobile && shortSummary?.length <= 0;
  const finalShortSummary = isFallbackSummary
    ? mobileFallbackShortSummary
    : shortSummary;
  const {
    sidebarModal: { addToAside },
  } = useContext(MBContext);

  const { highlights, tabs } = isMobile
    ? { highlights: finalHighlights, tabs: [] }
    : extractTabsFromHighlights(finalHighlights);

  let { listingPrice } = tourPrices[tgid];
  listingPrice = isAmp ? scorpioData.listingPrice : listingPrice;

  if (isFetched && !listingPrice) return null;
  const finalPrice = listingPrice;
  const { tourId } = finalPrice || {};
  const hasV1Booster = booster && RichText.asText(booster).trim().length > 0;
  const hasOffer = isOfferEnabled && offerId;
  const hasBorderedTitle = !hasOffer && !hasV1Booster;

  const layout = getProductCardLayout({
    hasOffer,
    hasV1Booster,
    mbTheme,
    hasShortSummary: hasShortSummary,
    hasNextAvailable: earliestAvailability?.startDate,
    isTicketCard,
    hasPromoCode: promo_code,
  });
  const getMoreDetailsButton = () => {
    const keyPressedOnReadMore = (event) => {
      if (event.keyCode == 13 && !isMobile) {
        toggleContentOpen(!isContentOpen);
      }
    };
    const innerContent =
      mbTheme === THEMES.DEFAULT ? (
        ` ${
          isContentOpen
            ? '- ' + strings.SHOW_LESS_TEXT
            : '+ ' + strings.MORE_DETAILS
        }`
      ) : (
        <>
          {isContentOpen ? strings.SHOW_LESS_TEXT : strings.MORE_DETAILS}
          <Chevron isActive={isContentOpen} className={'chevron'} />
        </>
      );
    return (
      <div
        ref={moreDetailsRef}
        data-open="0"
        onClick={() => {
          if (mbTheme !== THEMES.MIN_BLUE && isMobile) {
            addToAside({
              width: '100vw',
              children: (
                <ModalCardContainer>
                  {getProductCardElements()}
                </ModalCardContainer>
              ),
              type: SIDEBAR_TYPES.PRODUCT_CARD,
            });
          } else {
            toggleContentOpen(!isContentOpen);
          }
        }}
        className="more-details"
        onKeyDown={keyPressedOnReadMore}
        role="button"
        tabIndex={0}
      >
        {innerContent}
      </div>
    );
  };
  const getMoreDetailsButtonForAMP = () => {
    return (
      <div
        data-open="0"
        className="more-details"
        role="button"
        tabIndex={0}
        // @ts-ignore
        on={`tap:tour-description-more-text-${position}.toggleClass(class='display-none'),tour-description-less-text-${position}.toggleClass(class='display-none'),tour-description-${position}.toggleClass(class='display-expand')`}
      >
        <span
          className="more-details"
          id={`tour-description-more-text-${position}`}
        >
          {'+ ' + strings.MORE_DETAILS}
        </span>
        <span
          className="more-details display-none"
          id={`tour-description-less-text-${position}`}
        >
          {'- ' + strings.SHOW_LESS_TEXT}
        </span>
      </div>
    );
  };

  const productBookingUrl =
    createBookingURL({
      nakedDomain: bookingUrl,
      lang: currentLanguage,
      currency,
      tgid,
      tourId,
      biLink,
      promoCode: promo_code === appliedPromo ? appliedPromo : null,
      date:
        instantCheckout && earliestAvailability ? earliestAvailability : null,
      isMobile,
      bookSubdomain,
    }) + (ctaUrlSuffix || '');

  const hasReadMore = highlights.flat()?.length >= 3 && !defaultOpen;

  const handleCloseComboPopup = () => {
    setShowComboVariant(false);
    if (!isMobile) {
      document.body.style.overflow = 'auto';
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.COMBO_VARIANT.POPUP_CLOSED,
      'MB name': url,
      TGID: tgid,
      Device: isMobile ? 'Mweb' : 'Desktop',
    });
  };

  const handleShowComboPopup = () => {
    setShowComboVariant(true);
    sendBookNowEvent();
    if (!isMobile) {
      document.body.style.overflow = 'hidden';
    }
    if (isMobile) {
      addToAside({
        width: '100vw',
        children: (
          <ComboVariants
            productTitle={cardTitle}
            l1Booster={boosterTag}
            tgid={tgid}
            isMobile={isMobile}
            closeHandler={handleCloseComboPopup}
            descriptors={descriptorsList}
            bookingUrl={productBookingUrl}
            minDuration={minDuration}
            maxDuration={maxDuration}
            data={{}}
            error={{}}
          />
        ),
        type: SIDEBAR_TYPES.COMBO_VARIANT,
        onCloseCallback: () => handleCloseComboPopup(),
      });
    }
  };
  const getCTABlock = (expandContent) => (
    <>
      <PriceContainer isOpened={isOpened}>
        <PriceBlock
          showScratchPrice={showScratchPrice}
          price={finalPrice}
          lang={currentLanguage}
          showSavings={true}
          key={'price-block'}
        />
      </PriceContainer>
      <Conditional if={promo_code}>
        <PromoCodeBlock {...props} />
      </Conditional>
      <CTABlock
        isSticky={expandContent}
        shouldOffset={earliestAvailability && mbTheme === THEMES.MIN_BLUE}
      >
        <Conditional if={!isCombo}>
          <a
            target={isFetched && isMobile ? null : '_blank'}
            href={productBookingUrl}
            rel="nofollow"
          >
            <Button
              className={`tour-book-now-cta`}
              paddingSides={isMobile ? '16px' : '8px'}
              fillType="fill"
              onClick={sendBookNowEvent}
              onKeyDown={sendBookNowEvent}
              role="button"
              tabIndex={0}
            >
              {strings.CHECK_AVAIL}
              {mbTheme === THEMES.MIN_BLUE ? BackArrow : null}
            </Button>
          </a>
        </Conditional>
        <Conditional if={isCombo}>
          <Button
            className={`tour-book-now-cta`}
            paddingSides={isMobile ? '16px' : '8px'}
            fillType="fill"
            onClick={handleShowComboPopup}
            onKeyDown={handleShowComboPopup}
            role="button"
            tabIndex={0}
          >
            {strings.CHECK_AVAIL}
            {mbTheme === THEMES.MIN_BLUE ? BackArrow : null}
          </Button>
        </Conditional>
      </CTABlock>
      <Conditional
        if={showEarliestAvailability && earliestAvailability?.startDate}
      >
        <NextAvailableBlock>
          <div className="icon">{CALENDAR}</div>
          <div className="available-text">
            {`${strings.NEXT_AVAILABLE}`}
            {getDate(earliestAvailability?.startDate, currentLanguage)}
          </div>
        </NextAvailableBlock>
      </Conditional>
      <Conditional if={mbTheme !== THEMES.MIN_BLUE && (isMobile || isOpened)}>
        <Descriptors
          descriptorArray={descriptorsList}
          isMainCard={true}
          isOpened={isOpened}
          minDuration={minDuration}
          maxDuration={maxDuration}
          lang={currentLanguage}
        />
      </Conditional>
    </>
  );

  const getProductCardElements = () => (
    <PopupWrapper>
      <PopupContentWrapper>
        <WrapperProductCard layout={layout} isMobile={isMobile}>
          <Conditional if={!isMobile}>
            <Product {...props} isTicketCard={isTicketCard} />
            <CloseIconWrapper onClick={() => popupCloser()}>
              {BLACK_COLOR_CLOSE}
            </CloseIconWrapper>
          </Conditional>
        </WrapperProductCard>
      </PopupContentWrapper>
    </PopupWrapper>
  );

  const productOfferBlockMarkup = (productOffers) => {
    return productOffers?.map((offer, index) => {
      if (offer.id === offerId) {
        return (
          <ProductOfferBlock
            key={index}
            onClick={handlePopup}
            className="tour-offer"
          >
            <RichText
              render={offer.data.offer_title}
              htmlSerializer={shortCodeSerializer}
            />
          </ProductOfferBlock>
        );
      }
    });
  };

  const getProductCard = (expandContent, isFallbackSummary = false) => (
    <>
      <Labels>
        <Conditional if={boosterTag}>
          <Label>{boosterTag}</Label>
        </Conditional>
      </Labels>
      <WrapperProductCard layout={layout} isMainCard={true}>
        <StyledProductCard layout={layout} isMainCard={true}>
          <ProductHeader>
            <TitleWrapper hasBorderedTitle={hasBorderedTitle && !tabs.length}>
              <TourTitle isOpened={isOpened} isPopup={isContentOpen}>
                {cardTitle}
              </TourTitle>
            </TitleWrapper>
            <Conditional
              if={
                mbTheme !== THEMES.MIN_BLUE &&
                !isFallbackSummary &&
                hasShortSummary
              }
            >
              <ShortSummary>
                <RichText render={finalShortSummary} />
              </ShortSummary>
            </Conditional>
            <Conditional if={mbTheme === THEMES.MIN_BLUE}>
              <Descriptors
                descriptorArray={descriptorsList}
                isMainCard={true}
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
              />
            </Conditional>
            <Conditional if={mbTheme !== THEMES.MIN_BLUE}>
              <Descriptors
                descriptorArray={descriptorsList}
                isMainCard={true}
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
              />
            </Conditional>
            <Conditional if={!isMobile}>
              <MoreDetailWrapper
                onClick={() => {
                  popupOpener();
                }}
              >
                {strings.MORE_DETAILS} +
              </MoreDetailWrapper>
            </Conditional>
            <Conditional if={hasOffer && offerId}>
              {productOfferBlockMarkup(productOffer)}
            </Conditional>
            <CTAContainer isMainCard={true}>
              <Conditional if={isMobile}>
                {getCTABlock(expandContent)}
              </Conditional>
              <Conditional if={!isMobile}>
                <CTAWrapper>{getCTABlock(expandContent)}</CTAWrapper>
              </Conditional>
            </CTAContainer>
          </ProductHeader>
          <Conditional if={!isMobile}>
            <HorizontalLine colorProp={COLORS.GRAY.G6} />
          </Conditional>
          <Conditional if={isMobile}>
            <ProductBody
              hasReadMore={hasReadMore}
              collapsed={!expandContent}
              noOfListItemToShow={noOfListItemToShow + 1}
              defaultOpen={defaultOpen}
            >
              <Conditional if={hasReadMore}>
                {isAmp ? getMoreDetailsButtonForAMP() : getMoreDetailsButton()}
              </Conditional>
            </ProductBody>
          </Conditional>
        </StyledProductCard>
      </WrapperProductCard>
      <Conditional if={isOpened && !isMobile}>
        {getProductCardElements()}
      </Conditional>
      <Conditional if={showComboVariant && !isMobile}>
        <ComboVariants
          productTitle={cardTitle}
          l1Booster={boosterTag}
          tgid={tgid}
          isMobile={isMobile}
          closeHandler={handleCloseComboPopup}
          descriptors={descriptorsList}
          bookingUrl={productBookingUrl}
          minDuration={minDuration}
          maxDuration={maxDuration}
          data={{}}
          error={{}}
        />
      </Conditional>
    </>
  );

  return isMobile ? (
    <Product {...props} isTicketCard={isTicketCard} />
  ) : (
    <Container>{getProductCard(isContentOpen)}</Container>
  );
};

export default TicketCard;
