import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import Conditional from 'components/common/Conditional';
import Product from 'components/Product';
import HorizontalLine from 'components/slices/HorizontalLine';
import Button from 'UI/Button';
import ComboPopup from 'UI/ComboPopup';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { truncate, wordCount } from 'utils/helper';
import {
  extractTabsFromHighlights,
  getProductCardLayout,
} from 'utils/productUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { getDuration } from 'utils/timeUtils';
import { getDomainFromUid } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { descriptorIcons } from 'const/descriptorIcons';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LOCALISED_DATE_FORMATS,
  SIDEBAR_TYPES,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import BackArrow from 'assets/backArrow';
import BlackColorClose from 'assets/blackColorClose';
import Calendar from 'assets/calendar';

dayjs.extend(advancedFormat);

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  width: 100%;
  border: ${({ theme }) => theme.productCards.border};
  border-radius: 16px;
  background: ${COLORS.BRAND.WHITE};
`;

const ProductHeader = styled.div`
  min-height: 10rem;
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

const WrapperPopupProductCard = styled.div<{
  isMainCard: boolean;
  isMobile: boolean;
}>`
  border: ${({ theme }) => theme.productCards.border};
  border-radius: 16px;
  display: grid;
  grid-template-columns: ${({ isMainCard, isMobile }) =>
    isMainCard || isMobile ? 'auto' : 'auto 40px'};
  overflow: hidden;
  background: ${COLORS.BRAND.WHITE};
  @media (max-width: 768px) {
    ${({ isMobile }) => (!isMobile ? 'margin: 0 16px;' : 'border: 0;')};
  }
`;

const WrapperProductCard = styled.div`
  padding: 1.5rem;
  & > ${HorizontalLine} {
    border-bottom-style: dashed;
  }
`;

const TourTitle = styled.div`
  ${expandFontToken(FONTS.HEADING_SMALL)}
  margin: 0 !important;
  @media (max-width: 768px) {
    ${({
      // @ts-expect-error TS(2339): Property 'isPopup' does not exist on type 'Pick<De... Remove this comment to see the full error message
      isPopup,
      theme,
    }) =>
      isPopup
        ? theme.productCards.titleFontSettings.popupMobile
        : theme.productCards.titleFontSettings.mobile};
  }
`;

const MoreDetailWrapper = styled.div`
  display: flex;
  align-items: baseline;
  color: ${COLORS.TEXT.CANDY_1};
  padding-bottom: 0.8rem;
  ${expandFontToken('Button/Medium')}
  cursor: pointer;
  @media (max-width: 768px) {
  }
`;

const MoreDetailsIcon = styled.div`
  width: 0.45rem;
  height: 0.45rem;
  margin-left: 0.125rem;
  border-top: 2px solid ${COLORS.TEXT.CANDY_1};
  border-right: 2px solid ${COLORS.TEXT.CANDY_1};
  transform: rotate(45deg);
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
  ${({
    // @ts-expect-error TS(2339): Property 'hasBorderedTitle' does not exist on type... Remove this comment to see the full error message
    hasBorderedTitle,
  }) =>
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
  // @ts-expect-error TS(2339): Property 'isMainCard' does not exist on type 'Pick... Remove this comment to see the full error message
  ({ isMainCard, isOpened }) => `
  display: flex;
  flex-wrap: wrap;
  margin: 0.9rem 0 0.5rem 0;
  align-items: start;
  align-content: start;
  color: ${COLORS.GRAY.G3};
  .tour-tag-wrapper{
    ${!isOpened ? `display: inline !important;float: left;` : ''}
    padding-bottom: 0.75rem;
  }
  .tour-tag {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 0.25rem;
    margin-right: ${isMainCard ? '1.25rem' : '1rem'};
    max-width: 230px;
    justify-content: left;
    align-items: center;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    margin-bottom: ${isMainCard ? '5px' : '0'};
    .image-wrap {
      display: flex;
      align-items: top;
      padding-top: calc(100% / 2);
    }
    img{
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
  align-content: start;
  padding-top: 0.625rem;
  justify-content: space-between;
  ${({ theme }) =>
    theme.theme === THEMES.MIN_BLUE
      ? `
    button.tour-book-now-cta {
      width: 100%;
    }
  `
      : ``}
  height: 100%;
  align-items: end;
  display: flex;
  @media (max-width: 768px) {
    display: contents;
  }
`;

const PriceContainer = styled.div`
  justify-self: center;
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
    ${expandFontToken(FONTS.HEADING_REGULAR)}
    margin-bottom: 0.4rem;
  }
  @media (max-width: 768px) {
    justify-self: left;
    grid-area: price-block;
    ${({ theme }) => theme.productCards.priceFontSettings.mobile}
  }
`;
const CTABlock = styled.div<{ isSticky: boolean; shouldOffset: boolean }>`
  a {
    text-decoration: none;
  }
  .tour-book-now-cta {
    margin: auto;
    min-width: 13.5rem;
    width: 100%;
    display: block;
    ${expandFontToken('Button/Medium')}
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

const Descriptors = ({
  descriptorArray,
  isMainCard = false,
  isOpened = false,
  minDuration,
  maxDuration,
  lang = 'en',
}: any) => {
  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <TourTags isOpened={isOpened}>
      {descriptorArray.map((item: any, index: number) => {
        const DescriptorSVG = descriptorIcons[item];

        let descEl = item ? (
          <div key={`descriptor-${index}`} className="tour-tag">
            <DescriptorSVG />

            <Conditional if={item === 'DURATION'}>
              {getDuration({ minDuration, maxDuration, lang })}
            </Conditional>
            <Conditional if={item !== 'DURATION'}>
              {/* @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
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

const TicketCard = (props: any) => {
  const {
    tgid,
    position,
    currentLanguage,
    defaultOpen,
    title,
    descriptors,
    highlights: tempHighlights,
    tourPrices,
    uid,
    hasOffer: isOfferEnabled,
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
    instantCheckout,
    showEarliestAvailability,
    flowType,
  } = props;

  const {
    mbTheme,
    biLink,
    bookSubdomain,
    redirectToHeadoutBookingFlow,
    sidebarModal: { addToAside },
  } = useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);
  const pageMetaData = useRecoilValue(metaAtom);
  const isTicketCard = true;
  const [isOpened, setIsOpened] = useState(false);
  const [showComboVariant, setShowComboVariant] = useState(false);

  const {
    minDuration,
    maxDuration,
    combo: isCombo,
    multiVariant: isMultiVariant,
    descriptors: tourDescriptors,
    primaryCategory,
    primaryCollection,
    primarySubCategory,
    title: tourTitle,
    highlights: tourHighlights,
    listingPrice: tourListingPrice,
  } = scorpioData ?? {};
  const descriptorsList = descriptors || tourDescriptors;
  const isComboWithMultiVariant = isCombo && isMultiVariant;

  const popupOpener = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_MORE_DETAILS_VIEWED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.ACTION]: isOpened ? 'Contract' : 'Expand',
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      [ANALYTICS_PROPERTIES.SECTION]: 'Product List',
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
    setIsOpened(true);
    document.body.style.overflow = 'hidden';
  };

  const popupCloser = () => {
    setIsOpened(false);
    document.body.style.overflow = 'auto';
  };

  const sendBookNowEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      'Div Type': 'product-list',
    });

    const { originalPrice, finalPrice, currencyCode } = listingPrice ?? {};
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
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const getDate = (date: any, currentLanguage: any) => {
    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    if (date === today) return strings.TODAY;
    if (date === tomorrow) return strings.TOMORROW;
    return (
      dayjs(date)
        .locale(currentLanguage)
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        .format(LOCALISED_DATE_FORMATS[currentLanguage].DATE_MONTH)
    );
  };

  const cardTitle = title || tourTitle;
  let url = host || window.location.host;
  const currentHost = getDomainFromUid(uid);
  const hostName = currentHost?.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  let hostSplit = hostName?.split('.');
  hostSplit?.shift();
  const bookingUrl = hostSplit?.join('.') ?? '';

  const showScratchPrice = isFetched && isScratchPriceEnabled;
  const finalHighlights = asText(tempHighlights)?.trim()?.length
    ? tempHighlights
    : tourHighlights;
  let mobileFallbackShortSummary =
    finalHighlights
      ?.filter((line: any) => wordCount(line?.text) > 5)
      ?.slice(0, 1) ?? '';
  mobileFallbackShortSummary = mobileFallbackShortSummary.map(
    (content: any) => ({
      spans: [],
      text: truncate(content.text, 80),
      type: 'paragraph',
    })
  );
  let hasShortSummary = shortSummary?.length > 0;
  hasShortSummary =
    !hasShortSummary && isMobile
      ? mobileFallbackShortSummary.length > 0
      : hasShortSummary;
  const isFallbackSummary = isMobile && shortSummary?.length <= 0;
  const finalShortSummary = isFallbackSummary
    ? mobileFallbackShortSummary
    : shortSummary;
  const { tabs } = isMobile
    ? { tabs: [] }
    : extractTabsFromHighlights(finalHighlights);

  let { listingPrice } = tourPrices[tgid];
  listingPrice = tourListingPrice;

  if (isFetched && !listingPrice) return null;
  const finalPrice = listingPrice;
  const { tourId } = finalPrice || {};
  const hasV1Booster = booster && asText(booster as []).trim().length > 0;
  const hasOffer = isOfferEnabled && offerId;
  const hasBorderedTitle = !hasOffer && !hasV1Booster;

  const layout = getProductCardLayout({
    hasOffer,
    hasV1Booster,
    mbTheme,
    isTicketCard,
  });

  const productBookingUrl = createBookingURL({
    nakedDomain: bookingUrl,
    lang: currentLanguage,
    currency,
    tgid,
    variantId: tourId,
    biLink,
    date: instantCheckout && earliestAvailability ? earliestAvailability : null,
    isMobile,
    bookSubdomain,
    redirectToHeadoutBookingFlow,
    ctaSuffix: ctaUrlSuffix,
    flowType,
  });

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
      // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
      addToAside({
        width: '100vw',
        children: (
          <ComboPopup
            productTitle={cardTitle}
            l1Booster={boosterTag}
            tgid={tgid}
            isMobile={isMobile}
            closeHandler={handleCloseComboPopup}
            descriptors={descriptorsList}
            bookingUrl={productBookingUrl}
            minDuration={minDuration}
            maxDuration={maxDuration}
          />
        ),
        type: SIDEBAR_TYPES.COMBO_VARIANT,
        onCloseCallback: () => handleCloseComboPopup(),
      });
    }
  };
  const getCTABlock = (expandContent: any) => (
    <>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <PriceContainer isOpened={isOpened}>
        <PriceBlock
          showScratchPrice={showScratchPrice}
          listingPrice={finalPrice}
          lang={currentLanguage}
          showSavings
          key={'price-block'}
          prefix
        />
      </PriceContainer>

      <CTABlock
        isSticky={expandContent}
        shouldOffset={earliestAvailability && mbTheme === THEMES.MIN_BLUE}
      >
        <Conditional if={!isComboWithMultiVariant}>
          <a
            // @ts-expect-error TS(2322): Type '"_blank" | null' is not assignable to type '... Remove this comment to see the full error message
            target={isFetched && isMobile ? null : '_blank'}
            href={productBookingUrl}
            rel="nofollow noreferrer"
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
              {mbTheme === THEMES.MIN_BLUE ? <BackArrow /> : null}
            </Button>
          </a>
        </Conditional>
        <Conditional if={isComboWithMultiVariant}>
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
            {mbTheme === THEMES.MIN_BLUE ? <BackArrow /> : null}
          </Button>
        </Conditional>
      </CTABlock>
      <Conditional
        if={showEarliestAvailability && earliestAvailability?.startDate}
      >
        <NextAvailableBlock>
          <div className="icon">
            <Calendar />
          </div>
          <div className="available-text">
            {`${strings.NEXT_AVAILABLE}`}
            {getDate(earliestAvailability?.startDate, currentLanguage)}
          </div>
        </NextAvailableBlock>
      </Conditional>
    </>
  );

  const getProductCardElements = () => (
    <PopupWrapper onClick={() => popupCloser()}>
      <PopupContentWrapper onClick={(e) => e.stopPropagation()}>
        {/* @ts-expect-error TS(2769): No overload matches this call. */}
        <WrapperPopupProductCard layout={layout} isMobile={isMobile}>
          <Conditional if={!isMobile}>
            <Product {...props} isTicketCard={isTicketCard} />
            <CloseIconWrapper onClick={() => popupCloser()}>
              {BlackColorClose}
            </CloseIconWrapper>
          </Conditional>
        </WrapperPopupProductCard>
      </PopupContentWrapper>
    </PopupWrapper>
  );

  const getProductCard = (expandContent: any, isFallbackSummary = false) => (
    <>
      <WrapperProductCard>
        <ProductHeader>
          {/* @ts-expect-error TS(2769): No overload matches this call. */}
          <TitleWrapper hasBorderedTitle={hasBorderedTitle && !tabs.length}>
            {/* @ts-expect-error TS(2769): No overload matches this call. */}
            <TourTitle isOpened={isOpened} isPopup={defaultOpen}>
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
              <PrismicRichText
                field={finalShortSummary}
                components={shortCodeSerializer}
              />
            </ShortSummary>
          </Conditional>
          <Descriptors
            descriptorArray={descriptorsList}
            isMainCard={true}
            minDuration={minDuration}
            maxDuration={maxDuration}
            lang={currentLanguage}
          />
          <Conditional if={!isMobile}>
            <MoreDetailWrapper
              onClick={() => {
                popupOpener();
              }}
            >
              {strings.MORE_DETAILS}
              <MoreDetailsIcon />
            </MoreDetailWrapper>
          </Conditional>
        </ProductHeader>
        <HorizontalLine colorProp={COLORS.GRAY.G6} />
        <CTAContainer>{getCTABlock(expandContent)}</CTAContainer>
      </WrapperProductCard>
      <Conditional if={isOpened && !isMobile}>
        {getProductCardElements()}
      </Conditional>
      <Conditional
        if={!isMobile && isComboWithMultiVariant && showComboVariant}
      >
        <ComboPopup
          productTitle={cardTitle}
          l1Booster={boosterTag}
          tgid={tgid}
          isMobile={isMobile}
          closeHandler={handleCloseComboPopup}
          descriptors={descriptorsList}
          bookingUrl={productBookingUrl}
          minDuration={minDuration}
          maxDuration={maxDuration}
        />
      </Conditional>
    </>
  );

  return isMobile ? (
    <Product {...props} isTicketCard={isTicketCard} />
  ) : (
    <Container>{getProductCard(defaultOpen)}</Container>
  );
};

export default TicketCard;
