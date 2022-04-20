import React, { useRef, useState, useContext, useEffect } from 'react';
import { RichText } from 'prismic-reactjs';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import parse from 'url-parse';
import styled, { css } from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import HorizontalLine from 'components/slices/HorizontalLine';
import Conditional from 'components/common/Conditional';
import ComboVariants from 'components/UI/ComboVariants';
import PriceBlock from 'UI/PriceBlock';
import Chevron from 'UI/Chevron';
import { StlyedSplit } from 'UI/Split';
import Button from 'UI/Button';
import Image from 'UI/Image';
import { currencyAtom } from 'store/atoms/currency';
import { CALENDAR, BackArrow } from 'assets/SvgIcons';
import { strings } from 'const/strings';
import {
  ANALYTICS_EVENTS,
  THEMES,
  SIDEBAR_TYPES,
  LOCALISED_DATE_FORMATS,
  ANALYTICS_PROPERTIES,
  CUSTOM_TYPES,
} from 'const/index';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { shortCodeSerializer } from 'utils/shortCodes';
import {
  extractTabsFromHighlights,
  getProductCardLayout,
} from 'utils/productUtils';
import { trackEvent } from 'utils/analytics';
import { getHostName, truncate, wordCount } from 'utils/helper';
import PromoCodeBlock from 'UI/PromoCodeBlock';
import { createBookingURL } from 'utils';
import { descriptorIcons } from 'const/descriptorIcons';
import { getDuration } from 'utils/timeUtils';

dayjs.extend(advancedFormat);

const isLengthyArray = (item) => Array.isArray(item) && item.length;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  width: 100%;
`;

const cardImageStyles = css`
  .card-img {
    grid-area: card-img;
    width: 258px;
    height: 344px;
    border-radius: 0.5rem;

    img {
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      grid-row-end: initial;
      grid-column: span 2;

      width: ${({ isAmp }) => ` calc(100% + ${isAmp ? '2rem' : '1rem'})`};
      max-height: 158px;
      margin: -22px -16px -0.5rem;

      border-radius: 0.5rem 0.5rem 0 0;

      img {
        border-radius: 0.5rem 0.5rem 0 0;
        background-color: rgba(0, 0, 0, 0.3);
        margin: 0;
      }
    }
  }
`;

const moreDetailsButtonStyles = (isAmp: boolean) => css`
  padding: 0.75rem;
  background-color: ${COLORS.GREY.G7};
  margin-top: ${isAmp ? '0.4rem' : '0'};
  grid-area: cta-block;
  grid-column: 1 / 2;
  width: 32vw;
  border-radius: 4px;
  font-weight: 600;
  color: ${COLORS.GREY.G2};
  position: absolute;
  font-size: 0.875rem;
  letter-spacing: 0.6px;
  display: flex;
  justify-content: center;
  line-height: 125%;
  .chevron {
    display: none;
  }
`;

const ctaBlockMobileStyles = (isSticky: boolean) => css`
  grid-column: ${isSticky ? '1' : '2'};
  margin-top: -1.5rem;
  margin-left: auto;
  width: ${isSticky ? '84vw' : '42vw'};
  .tour-book-now-cta {
    line-height: 125%;
    padding: 0.75rem;
    border-radius: 4px;
    min-width: auto;
    letter-spacing: 0.6px;
    font-size: 0.875rem;
  }
`;

const StyledProductCard = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  padding: ${({ isTicketCard, theme }) =>
    isTicketCard ? `24px 0px 24px 40px` : theme.productCards.padding.desktop};
  ${({ isTicketCard, theme, isMobile }) =>
    (!isTicketCard || isMobile) &&
    `border: ${theme.productCards.border};
    border-radius: 4px;`};
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
    font-weight: ${SOLEIL.MEDIUM};
    font-size: 14px;
    line-height: 15px;
    margin-left: 1em;
    margin-top: 16px;
    cursor: pointer;
    outline: none;
    ${({ theme }) => theme.productCards.moreDetailsStyle}
  }
  ${({ theme }) => theme.productCards?.styles?.desktop}

  ${({ isTicketCard }) =>
    isTicketCard
      ? null
      : cardImageStyles}

  grid-template-rows: min-content min-content min-content;
  grid-template-columns: auto 1fr auto;
  grid-auto-rows: min-content;
  column-gap: 1.5rem;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.productCards.padding.mobile};
    margin: 0
      ${({ theme: { theme }, isTicketCard }) =>
        theme !== THEMES.MIN_BLUE && !isTicketCard
          ? '16px'
          : isTicketCard
          ? '0'
          : '24px'};
    grid-template-areas: ${({ layout }) =>
      layout.mobile.map((row) => `'${row}'`)};
    width: auto;
    grid-template-columns: auto;

    ${({ theme }) => theme.productCards?.styles?.mobile}

    .more-details {
      margin-left: 0;
      margin-bottom: 0;
      ${({ isTicketCard, isAmp }) =>
        isTicketCard ? null : moreDetailsButtonStyles(isAmp)}
    }
  }
`;
const ProductHeader = styled.div`
  display: grid;
  grid-gap: 16px;
  display: contents;
  @media (max-width: 768px) {
  }
`;

const TourTitle = styled.h2`
  font-weight: ${SOLEIL.MEDIUM};
  margin: 0;
  max-width: 768px;
  ${({ theme }) => theme.productCards.titleFontSettings.desktop};
  ${({ pageType }) =>
    pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE ? 'font-weight: 600;' : ''}
  @media (max-width: 768px) {
    ${({ isPopup, theme }) =>
      isPopup
        ? theme.productCards.titleFontSettings.popupMobile
        : theme.productCards.titleFontSettings.mobile};
  }
`;

const TitleWrapper = styled.div`
  grid-area: title;
  ${({ hasBorderedTitle }) =>
    hasBorderedTitle
      ? `
            border-bottom: 1px solid ${COLORS.GREY.G6};
            padding-bottom: 16px;
            margin-bottom: -8px;
            @media(max-width: 768px) {
              border: none;
            }
          `
      : ''}
`;

const BoosterTag = styled.div`
  font-size: 11px;
  font-weight: 600;
  line-height: 13px;
  color: ${COLORS.HEADOUT_CANDY};
  text-transform: uppercase;
  letter-spacing: 0.4px;

  background: ${COLORS.WHITE};
  border-radius: 2px;
  margin-bottom: 7px;
  padding: 2px 4px;
  display: inline-block;

  @media (max-width: 768px) {
    position: absolute;
    margin-top: -2.125rem;
    padding: 5px;
    border-radius: 4px;
  }
`;

const ShortSummary = styled.div`
  margin-top: -8px;
  grid-area: summary;
  p {
    color: ${COLORS.GREY.G2};
    font-size: 14px;
    line-height: 20px;
    margin: 0;
  }
  @media (max-width: 768px) {
    margin-top: 0;
    font-size: 14px;
    line-height: 23px;
  }
`;

const TourTags = styled.div`
  font-size: 14px;
  font-weight: ${SOLEIL.REGULAR};
  display: grid;
  grid-row-gap: 12px;
  align-items: start;
  align-content: start;
  margin: 0;
  margin-top: 8px;
  color: ${COLORS.GREY_G3};
  ${({ horizontal }) =>
    horizontal &&
    `
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    grid-column-gap: 16px;
  `}
  .tour-tag {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 8px;
    margin-right: 8px;
    font-size: 14px;
    max-width: 230px;
    line-height: 22px;
    justify-content: left;
    align-items: center;
    margin-bottom: 0;
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
    ${({ pageType }) =>
      pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
        ? 'line-height: 20px;color: #444444;'
        : ''}
  }
  @media (max-width: 768px) {
    grid-area: tags;
    align-items: start;
    display: grid;
    grid-template-columns: auto auto;
    font-size: 12px;
    line-height: 13px;
    margin-top: -8px;
    grid-column-gap: 8px;
    grid-row-gap: 12px;
    .tour-tag {
      margin: 0;
    }
  }
`;

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
  button.tour-book-now-cta {
    ${({ pageType }) =>
      pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
        ? 'border-radius: 2px;font-weight: 600;line-height: 22px;'
        : ''}
  }
  @media (max-width: 768px) {
    display: contents;
  }
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
    ${({ pageType }) =>
      pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
        ? 'font-size: 13px !important;line-height: 17px !important;'
        : ''}
  }
  .tour-price {
    display: flex;
    ${({ pageType }) =>
      pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
        ? 'line-height: 28px !important; color: #666666;'
        : ''}
  }
  ${({ theme }) => theme.productCards.priceFontSettings.desktop}
  @media (max-width: 768px) {
    justify-self: left;
    grid-area: price-block;
    ${({ theme }) => theme.productCards.priceFontSettings.mobile}
    .tour-price {
      font-size: 24px;
    }
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
    line-height: 1;
    border-radius: ${({ isTicketCard }) => (isTicketCard ? '4px' : '8px')};
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

    ${({ isSticky, shouldOffset }) =>
      isSticky
        ? `
      position: sticky;
      bottom: 16px;
      bottom: calc(16px + env(safe-area-inset-bottom));
      ${shouldOffset ? 'transform: translateY(32px);' : ''}
      background: ${COLORS.WHITE};
      z-index: 2;
    `
        : ``}
    .tour-book-now-cta {
      justify-content: center;
      width: 100%;
    }

    ${({ isTicketCard, isSticky }) =>
      isTicketCard ? null : ctaBlockMobileStyles(isSticky)}
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
      font-weight: ${SOLEIL.MEDIUM};
    }
    font-family: ${SOLEIL.FONT_STACK};
    ${({ theme }) => theme.productCards.regularFontSettings.desktop}
    color: ${COLORS.FOUR_BLACK};
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
        margin-bottom: 0.5rem;
  }
  ul:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    position: relative;
    
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
      padding-bottom: 2rem;
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
  font-weight: ${SOLEIL.MEDIUM};
  color: ${COLORS.FOUR_BLACK};
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
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${SOLEIL.REGULAR};
  cursor: pointer;
  color: ${({ theme: { primaryAccent } }) =>
    primaryAccent ? primaryAccent : COLORS.MED_SLATE_BLUE};
  p {
    margin: 0;
    color: ${({ theme: { primaryAccent } }) =>
      primaryAccent ? primaryAccent : COLORS.MED_SLATE_BLUE};
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
const V1BoosterBlock = styled.div`
  grid-area: booster;
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${SOLEIL.REGULAR};
  font-size: 15px;
  line-height: 21px;
  text-align: left;
  color: ${COLORS.GREY.G4};
  font-size: 1em;
  display: inline-block;
  p {
    margin: 0;
    color: ${COLORS.GREY.G4};
    font-size: 15px;
    strong {
      font-weight: unset;
    }
  }
  br {
    display: none;
  }
  .block-img img {
    display: none;
  }
  @media (max-width: 768px) {
    br {
      display: initial;
    }
    .block-img img {
      width: 100%;
      display: inline;
    }
    p {
      font-size: 12px;
      strong {
        font-weight: ${SOLEIL.MEDIUM};
        line-height: 1.5;
      }
    }
    font-size: 0.8em;
    display: grid;
    grid-template-columns: ${(props) => (props.boosterHasIcon ? '40px' : '')} auto;
    grid-gap: 10px;
    align-items: center;
    margin: 0;
  }
`;

const HighlightTabsWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;
  margin-top: ${({ hasRegularHighlights }) =>
    hasRegularHighlights ? '16px' : 0};
`;

const TabsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  font-weight: ${SOLEIL.SEMIBOLD};
  font-size: 14px;
  line-height: 20px;
  grid-column-gap: 24px;
  border-bottom: 1px solid #ebebeb;
  justify-content: left;
`;

const TabPanelWrapper = styled.div``;

const Tab = styled.div`
  cursor: pointer;
  padding-bottom: 8px;
  display: block;
  width: 100%;
  border-bottom: 1px solid transparent;
  transform: translateY(1px);
  font-weight: ${SOLEIL.REGULAR};
  ${({ pageType }) =>
    pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
      ? 'font-weight: 600;color: #444444;'
      : ''}
  ${({ isActive }) => {
    return (
      isActive &&
      `
      font-weight: ${SOLEIL.SEMIBOLD};
      color: ${COLORS.PURPS3};
      border-color: ${COLORS.PURPS3};
    `
    );
  }}
`;

const TabPanel = styled.div`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
  ${({ pageType }) =>
    pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
      ? 'li{color: #666666 !important;}'
      : ''}
`;

const richtextElements = {
  hyperlink: function Anchor({ children, data }) {
    return (
      <a href={data?.url} rel="nofollow noreferrer" target="_blank">
        {children}
      </a>
    );
  },
};

const HighlightTabs = ({
  tabs,
  hasRegularHighlights = false,
  onTabChange,
  pageType,
  activeTabIndex,
}) => {
  useEffect(() => {
    onTabChange({ tab: tabs[0], index: 0, defaultSelection: true });
  }, []);

  const trackedTabChange = (index) => {
    onTabChange({ tab: tabs[index], index });
  };

  return (
    <HighlightTabsWrapper hasRegularHighlights={hasRegularHighlights}>
      <TabsWrapper>
        {tabs.map((tab, index) => (
          <Tab
            isActive={activeTabIndex == index}
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              trackedTabChange(index);
            }}
            pageType={pageType}
          >
            {tab.heading}
          </Tab>
        ))}
      </TabsWrapper>
      <TabPanelWrapper>
        {tabs.map((tab, index) => (
          <TabPanel
            isActive={activeTabIndex == index}
            key={index}
            pageType={pageType}
          >
            <RichText render={tab.contents} elements={richtextElements} />
          </TabPanel>
        ))}
      </TabPanelWrapper>
    </HighlightTabsWrapper>
  );
};

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

    .card-img {
      width: calc(100% + 1.5rem);
      margin: -1.5rem -1.5rem -0.5rem;
      max-height: 175px;
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
      width: 100%;
      grid-column: 1 / span 2;
      .tour-book-now-cta {
        border-radius: 8px;
      }
    }
  }
`;

export const Descriptors = ({
  descriptorArray: descarr,
  horizontal = false,
  pageType = '',
  shouldShowAllDescriptors = true,
  minDuration,
  maxDuration,
  lang = 'en',
}) => {
  const descriptorArray = shouldShowAllDescriptors
    ? descarr
    : descarr.slice(0, 4);

  return (
    <TourTags horizontal={horizontal} pageType={pageType}>
      {descriptorArray.map((item, index) => {
        const DescriptorSVG = descriptorIcons[item];

        return item ? (
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
      })}
    </TourTags>
  );
};

const Product = (props) => {
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
    isTicketCard = false,
    indexPosition,
    pageType = '',
    finalPromoCode,
    appliedPromo,
  } = props;

  const {
    mbTheme,
    biLink,
    bookSubdomain,
    isStage,
    isDev,
    sidebarModal: { addToAside },
  } = useContext(MBContext);

  const hostname = getHostName(isStage, isDev, host);
  const currency = useRecoilValue(currencyAtom);
  const [isContentOpen, toggleContentOpen] = useState(defaultOpen);
  const [showMoreDetailsInTabs, setShowMoreDetails] = useState(
    defaultOpen || false
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showComboVariant, setShowComboVariant] = useState(false);
  const { combo, minDuration, maxDuration } = scorpioData || {};

  const descriptorsList = descriptors || scorpioData.descriptors;
  const cardTitle = title || scorpioData.title;

  const { promo_code } = finalPromoCode || {};

  const handlePopup = () => {
    togglePopup();
  };

  const sendBookNowEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      'Div Type': 'product-list',
    });
  };

  const handleCloseComboPopup = () => {
    setShowComboVariant(false);
    if (!isMobile) {
      document.body.style.overflow = 'auto';
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.COMBO_VARIANT.POPUP_CLOSED,
      'MB name': hostname,
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
          />
        ),
        type: SIDEBAR_TYPES.COMBO_VARIANT,
        onCloseCallback: () => handleCloseComboPopup(),
      });
    }
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

  const boosterHasIcon = booster?.filter((i) => i.type === 'image').length > 0;
  let url = host || window.location.host;
  const currentHost = !isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');
  const showScratchPrice = isScratchPriceEnabled;
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

  const { highlights, tabs } = isMobile
    ? { highlights: finalHighlights, tabs: [] }
    : extractTabsFromHighlights(finalHighlights);

  const hasReadMore =
    (highlights.flat()?.length >= 3 || showMoreDetailsInTabs) && !defaultOpen;

  const noOfListItemToShow = getMaxListItemsToShow(
    tabs[activeTabIndex]?.contents
  );

  const onTabChange = ({ tab, index, defaultSelection }) => {
    const noOfListItems = getMaxListItemsToShow(tab.contents);

    const isTruncated = tab.contents.length > noOfListItems;

    setShowMoreDetails(isTruncated);
    setActiveTabIndex(index);

    if (!defaultSelection)
      trackEvent({
        eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
        [ANALYTICS_PROPERTIES.TGID]: tgid,
        [ANALYTICS_PROPERTIES.INFO_HEADING]: tab.heading,
        [ANALYTICS_PROPERTIES.POSITION]: index + 1,
        [ANALYTICS_PROPERTIES.IS_TRUNCATED]: isTruncated,
        [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      });
  };

  useEffect(() => {
    if (isMobile) return;

    const isTruncated = tabs?.[0]?.contents?.length ?? 0 > noOfListItemToShow;
    if (isTruncated) {
      setShowMoreDetails(isTruncated);
    }
  }, [tabs.length, isMobile]);

  const { listingPrice } = tourPrices[tgid];

  if (!listingPrice) return null;
  const finalPrice = listingPrice;
  const { tourId } = finalPrice || {};
  const hasV1Booster = booster && RichText.asText(booster).trim().length > 0;
  const hasOffer = isOfferEnabled && offerId;
  const hasBorderedTitle = !hasOffer && !hasV1Booster;

  const onMoreDetailsClick = (e) => {
    e?.stopPropagation();
    if (mbTheme !== THEMES.MIN_BLUE && isMobile) {
      trackedToggleContent(false);
      addToAside({
        width: '100vw',
        children: (
          <ModalCardContainer>
            {getProductCardElements(true, isFallbackSummary)}
          </ModalCardContainer>
        ),
        type: SIDEBAR_TYPES.PRODUCT_CARD,
        onCloseCallback: () => trackedToggleContent(true),
      });
    } else {
      trackedToggleContent(isContentOpen);
      toggleContentOpen(!isContentOpen);
    }
  };

  const layout = getProductCardLayout({
    hasOffer,
    hasV1Booster,
    mbTheme,
    hasShortSummary: hasShortSummary,
    hasNextAvailable: earliestAvailability?.startDate,
    isTicketCard: isTicketCard,
    hasPromoCode: promo_code,
  });
  const trackedToggleContent = (isOpen) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_MORE_DETAILS_VIEWED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.ACTION]: isOpen ? 'Contract' : 'Expand',
      [ANALYTICS_PROPERTIES.INFO_HEADING]: tabs[activeTabIndex]?.heading,
      [ANALYTICS_PROPERTIES.POSITION]: indexPosition + 1,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      [ANALYTICS_PROPERTIES.SECTION]: 'Product List',
    });
  };

  const getMoreDetailsButton = () => {
    const keyPressedOnReadMore = (event) => {
      if (event.keyCode == 13 && !isMobile) {
        toggleContentOpen(!isContentOpen);
        trackedToggleContent(isContentOpen);
      }
    };
    const innerContent =
      mbTheme === THEMES.DEFAULT &&
      pageType != CUSTOM_TYPES.GLOBAL_EXPERIENCE ? (
        <>
          {isContentOpen
            ? '- ' + strings.SHOW_LESS_TEXT
            : '+ ' + strings.MORE_DETAILS}
        </>
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
        onClick={onMoreDetailsClick}
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

  const hasHighlights =
    isLengthyArray(highlights) && highlights.filter((item) => item.text).length;
  const productBookingUrl =
    createBookingURL({
      nakedDomain: bookingUrl,
      lang: currentLanguage,
      currency,
      tgid,
      promoCode: promo_code === appliedPromo ? appliedPromo : null,
      tourId,
      biLink,
      date:
        instantCheckout && earliestAvailability ? earliestAvailability : null,
      isMobile,
      bookSubdomain,
    }) + (ctaUrlSuffix || '');

  const BookNowCta = ({ clickHandler }: { clickHandler: () => void }) => (
    <Button
      className={`tour-book-now-cta`}
      paddingSides={isMobile ? '14px' : '8px'}
      fillType="fill"
      onClick={clickHandler}
      onKeyDown={clickHandler}
      role="button"
      tabIndex={0}
    >
      {strings.CHECK_AVAIL}
      {mbTheme === THEMES.MIN_BLUE ? BackArrow : null}
    </Button>
  );

  const getProductCardElements = (
    expandContent,
    isFallbackSummary = false,
    shouldShowAllDescriptors?: boolean
  ) => (
    <>
      <StyledProductCard
        isAmp={isAmp}
        layout={layout}
        isTicketCard={isTicketCard}
        isMobile={isMobile}
      >
        <Conditional if={!isTicketCard}>
          <div className="card-img">
            <Image
              url={scorpioData.images[0].url}
              imageId="card-img"
              aspectRatio={isMobile ? '21:9' : '3:4'}
              width={344}
            />
          </div>
        </Conditional>

        <ProductHeader>
          <TitleWrapper hasBorderedTitle={hasBorderedTitle && !tabs.length}>
            <Conditional if={boosterTag && mbTheme !== THEMES.MIN_BLUE}>
              <BoosterTag>{boosterTag}</BoosterTag>
            </Conditional>
            <TourTitle isPopup={isContentOpen} pageType={pageType}>
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
            <Conditional if={!isTicketCard}>
              <ShortSummary>
                <RichText render={finalShortSummary} />
              </ShortSummary>
            </Conditional>
          </Conditional>
          <Conditional if={mbTheme === THEMES.MIN_BLUE}>
            <Descriptors
              descriptorArray={descriptorsList}
              pageType={pageType}
              minDuration={minDuration}
              maxDuration={maxDuration}
              lang={currentLanguage}
            />
          </Conditional>
          <Conditional if={hasV1Booster && !isAmp}>
            <V1BoosterBlock boosterHasIcon={boosterHasIcon}>
              <RichText render={booster} htmlSerializer={shortCodeSerializer} />
            </V1BoosterBlock>
          </Conditional>
          {hasOffer &&
            offerId &&
            productOffer.map((offer, index) => {
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
            })}
          <CTAContainer pageType={pageType}>
            <PriceContainer pageType={pageType}>
              <PriceBlock
                showScratchPrice={showScratchPrice}
                price={finalPrice}
                lang={currentLanguage}
                showSavings={true}
                key={'price-block'}
              />
            </PriceContainer>
            <Conditional if={isTicketCard && promo_code}>
              <PromoCodeBlock {...props} />
            </Conditional>

            <CTABlock
              isSticky={expandContent}
              shouldOffset={earliestAvailability && mbTheme === THEMES.MIN_BLUE}
              isTicketCard={isTicketCard}
            >
              <Conditional if={!combo}>
                <a
                  target={isMobile ? null : '_blank'}
                  href={productBookingUrl}
                  rel="nofollow"
                >
                  <BookNowCta clickHandler={sendBookNowEvent} />
                </a>
              </Conditional>
              <Conditional if={combo}>
                <BookNowCta clickHandler={handleShowComboPopup} />
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
            <Conditional if={mbTheme !== THEMES.MIN_BLUE}>
              <Descriptors
                descriptorArray={descriptorsList}
                pageType={pageType}
                shouldShowAllDescriptors={shouldShowAllDescriptors}
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
              />
            </Conditional>
          </CTAContainer>
        </ProductHeader>
        <Conditional if={!isMobile}>
          <HorizontalLine colorProp={COLORS.GREY.G6} />
        </Conditional>
        <ProductBody
          hasReadMore={hasReadMore}
          collapsed={!expandContent}
          noOfListItemToShow={noOfListItemToShow + 1}
          defaultOpen={defaultOpen}
        >
          <Conditional
            if={
              !isTicketCard ||
              (isTicketCard && !isMobile) ||
              (isTicketCard && expandContent)
            }
          >
            <div
              className={`${
                isAmp
                  ? 'amp-tour-description tour-description'
                  : 'tour-description'
              }`}
              id={`tour-description-${position}`}
              onClick={
                !isMobile && !defaultOpen
                  ? (e) => {
                      e.stopPropagation();
                      toggleContentOpen(!isContentOpen);
                      trackedToggleContent(isContentOpen);
                    }
                  : null
              }
            >
              <Conditional if={hasHighlights}>
                <RichText
                  render={highlights || []}
                  htmlSerializer={shortCodeSerializer}
                  elements={richtextElements}
                />
              </Conditional>
              <Conditional if={tabs.length}>
                <HighlightTabs
                  onTabChange={onTabChange}
                  hasRegularHighlights={hasHighlights}
                  tabs={tabs}
                  pageType={pageType}
                  activeTabIndex={activeTabIndex}
                />
              </Conditional>
            </div>
          </Conditional>
          <Conditional if={hasReadMore}>
            {isTicketCard && isAmp
              ? null
              : isAmp
              ? getMoreDetailsButtonForAMP()
              : getMoreDetailsButton()}
          </Conditional>
        </ProductBody>
      </StyledProductCard>
      {showComboVariant && !isMobile && (
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
        />
      )}
    </>
  );

  return (
    <Container>{getProductCardElements(isContentOpen, false, isAmp)}</Container>
  );
};

export default Product;

const getMaxListItemsToShow = (contentsForTab: Record<string, any>[] = []) => {
  if (contentsForTab.length === 0) {
    return 2;
  }

  const APPROX_WORDS_SPANNING_CARD_IMG_HEIGHT = 42;
  const MAX_LIST_ITEMS = 4;

  let wordCountInListItems = 0;
  let listItemsCount = 0;

  contentsForTab.forEach((content) => {
    if (wordCountInListItems < APPROX_WORDS_SPANNING_CARD_IMG_HEIGHT) {
      wordCountInListItems += content.text.split(' ').length;
      listItemsCount++;
    }
  });

  return Math.min(MAX_LIST_ITEMS, listItemsCount);
};
