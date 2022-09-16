import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';
import styled, { css } from 'styled-components';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import parse from 'url-parse';
import { MBContext } from 'contexts/MBContext';
import useSWR from 'swr';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { useWindowWidth } from '@react-hook/window-size';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import HorizontalLine from 'components/slices/HorizontalLine';
import Conditional from 'components/common/Conditional';
import ComboPopup from 'UI/ComboPopup';
import PriceBlock from 'UI/PriceBlock';
import Chevron from 'UI/Chevron';
import { StlyedSplit } from 'UI/Split';
import Button from 'UI/Button';
import Image from 'UI/Image';
import PromoCodeBlock from 'UI/PromoCodeBlock';
import { CALENDAR, BackArrow, CHEVRON_RIGHT_CIRCLE } from 'assets/SvgIcons';
import COLORS from 'const/colors';
import { descriptorIcons } from 'const/descriptorIcons';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';
import {
  ANALYTICS_EVENTS,
  THEMES,
  SIDEBAR_TYPES,
  LOCALISED_DATE_FORMATS,
  ANALYTICS_PROPERTIES,
  CUSTOM_TYPES,
  DESCRIPTORS,
} from 'const/index';
import { createBookingURL } from 'utils';
import {
  getCommonEventMetaData,
  getProductCommonProperties,
  trackEvent,
} from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getHostName, truncate, wordCount } from 'utils/helper';
import {
  extractTabsFromHighlights,
  getProductCardLayout,
} from 'utils/productUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { getDuration } from 'utils/timeUtils';
import { addQueryParams } from 'utils/urlUtils';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

dayjs.extend(advancedFormat);

const isLengthyArray = (item) => Array.isArray(item) && item.length;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  width: 100%;
`;

const PRODUCT_CARD_IMAGE_DIMENSIONS = {
  MOBILE: {
    width: 320,
  },
  DESKTOP: {
    height: 320,
  },
};

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
      aspect-ratio: 21/9;
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
  background-color: ${COLORS.GRAY.G7};
  margin-top: ${isAmp ? '0' : '0'};
  grid-area: cta-block;
  grid-column: 1 / 2;
  width: 32vw;
  border-radius: 4px;
  color: ${COLORS.GRAY.G2};
  position: absolute;
  ${expandFontToken('Button/Medium')}
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
    ${expandFontToken('Button/Medium')}
	color: ${COLORS.BRAND.CANDY};
    margin-left: 1em;
    margin-top: 16px;
    cursor: pointer;
    outline: none;
	display: grid;
	grid-auto-flow: column;
	justify-content: start;
	grid-gap: 8px;

	.chevron::before, .chevron::after {
		top: 0.6em;
		background-color: ${COLORS.BRAND.CANDY};
	}
	@media(max-width: 768px) {
		justify-content: left;
	}
  }
  ${({ theme }) => theme.productCards?.styles?.desktop}

  ${({ isTicketCard }) => (isTicketCard ? null : cardImageStyles)}

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
    grid-template-columns: 1fr;

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
  ${expandFontToken('Heading/Large')}
  margin: 0;
  max-width: 768px;
  @media (max-width: 768px) {
    ${expandFontToken('Heading/Small')};
  }
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

const BoosterTag = styled.div`
  font-size: 11px;
  font-weight: 600;
  line-height: 13px;
  color: ${COLORS.BRAND.CANDY};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: ${COLORS.BRAND.WHITE};
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
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Paragraph/Regular')}
    margin: 0;
  }
  @media (max-width: 768px) {
    margin-top: 0;
    ${expandFontToken('Paragraph/Regular')}
  }
`;

const TourTags = styled.div`
  ${expandFontToken('UI/Label Regular')}
  display: grid;
  grid-row-gap: 16px;
  align-items: start;
  align-content: start;
  margin: 0;
  margin-top: 8px;
  color: ${COLORS.GRAY.G3};
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
    max-width: 230px;
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
    ${expandFontToken('UI/Label Regular')}
    margin-top: -8px;
    grid-column-gap: 8px;
    grid-row-gap: 16px;
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
    ${expandFontToken('Button/Medium')}
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
    ${expandFontToken('UI/Label Small')}
  }
  justify-self: left;
  .tour-price {
    display: flex;
    ${expandFontToken('Heading/Large')}
  }
  @media (max-width: 768px) {
    grid-area: price-block;
    ${({ theme }) => theme.productCards.priceFontSettings.mobile}
    .tour-price {
      ${expandFontToken('Heading/Large')}
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
      background: ${COLORS.BRAND.WHITE};
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
  @media (max-width: 370px) {
    width: 90%;
  }
`;

const ProductBody = styled.div`
  grid-area: body;
  display: grid;
  grid-row-gap: 8px;
  overflow-anchor: none;
  .tour-description {
    cursor: ${({ hasReadMore }) => (hasReadMore ? 'pointer' : '')};
    ${expandFontToken('Paragraph/Medium')}
    p {
      margin: 0;
    }
    color: ${COLORS.GRAY.G2};
    display: grid;
    grid-gap: 0;
    ${({ collapsed, defaultOpen }) =>
      collapsed && !defaultOpen
        ? `
    *:not(div, svg, rect, g, path):nth-child(n + 4),
    ul li:nth-child(n + 4) {
      display: none;
    }
    `
        : ''}
    ul {
      margin: 0;
      padding: 0;
      padding-left: 1rem;
      display: grid;
      list-style-type: none;

      li {
        position: relative;
      }

      li::before {
        content: '•';
        position: absolute;
        left: -0.8rem;
        color: currentColor;
      }
    }
  }
  .amp-tour-description {
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

    .show-more-information {
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
      ${expandFontToken('Paragraph/Medium')}

      h6 {
        ${expandFontToken('Heading/Small')}
        margin: 16px 0;
        margin-top: 32px;
      }

      h6:first-child {
        margin-top: 0;
      }
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
  .display-none {
    display: none;
  }
  .display-expand {
    display: grid;
  }
`;

const NextAvailableBlock = styled.div`
  ${expandFontToken('Misc/Overline Large')}
  color: ${COLORS.GRAY.G2};
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
  font-family: ${HALYARD.FONT_STACK};
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
const V1BoosterBlock = styled.div`
  grid-area: booster;
  font-family: ${HALYARD.FONT_STACK};
  font-weight: 400;
  font-size: 15px;
  line-height: 21px;
  text-align: left;
  color: ${COLORS.GRAY.G4};
  font-size: 1em;
  display: inline-block;
  p {
    margin: 0;
    color: ${COLORS.GRAY.G4};
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
        font-weight: 500;
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
  display: block;
  ${expandFontToken('Paragraph/Large')}
  border-bottom: 1px solid #ebebeb;
  justify-content: left;
  position: relative;
  padding-top: 13px;
  overflow: hidden;
  .swiper-slide {
    width: auto;
  }
`;

const SwiperControls = styled.div`
  display: flex;
  align-items: center;
  .prev-slide,
  .next-slide {
    position: absolute;
    pointer-events: none;
    cursor: pointer;
    z-index: 2;
    height: 32px;
    svg {
      fill: ${COLORS.BRAND.WHITE};
      background: linear-gradient(
        180deg,
        ${COLORS.BRAND.WHITE} 25%,
        rgba(255, 255, 255, 0) 100%
      );
      background: -webkit-linear-gradient(
        180deg,
        ${COLORS.BRAND.WHITE} 25%,
        rgba(255, 255, 255, 0) 100%
      );
      circle {
        pointer-events: auto;
        box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1),
          0px 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .prev-slide {
    left: 0px;
    top: 0px;
    svg {
      transform: scaleX(-1);
    }
  }
  .next-slide {
    right: 0px;
    top: 0px;
  }
`;

const TabPanelWrapper = styled.div``;

const Tab = styled.div`
  cursor: pointer;
  padding-bottom: 8px;
  display: block;
  width: auto;
  border-bottom: 1px solid transparent;
  transform: translateY(1px);
  ${expandFontToken('UI/Label Medium')}
  margin-right: 2px;
  ${({ isActive }) => {
    return (
      isActive &&
      `
      color: ${COLORS.TEXT.PURPS_3};
      border-color: ${COLORS.TEXT.PURPS_3};
      padding-bottom: 7.25px;`
    );
  }}
`;

const TabPanel = styled.div`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
  ${({ pageType }) =>
    pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
      ? `
      li {
        color: #666666 !important;
      }`
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
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(false);
  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const updateIndex = useCallback(() => {
    updateCurrentIndex(swiper.realIndex);
  }, [swiper]);

  const updateSliderPosition = useCallback(() => {
    setIsBeginning(swiper?.isBeginning);
    setIsEnd(swiper?.isEnd);
  }, [swiper]);

  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

  useEffect(() => {
    if (isMobile) return;
    if (swiper !== null) {
      swiper?.on('slideChange', updateIndex);
      updateSliderPosition();
    }

    return () => {
      if (swiper !== null) {
        swiper?.off('slideChange', updateIndex);
      }
    };
  }, [isMobile, swiper, updateIndex, updateSliderPosition]);

  const goNext = () => {
    if (swiper !== null) {
      swiper?.slideNext();
      updateSliderPosition();
    }
  };

  const goPrev = () => {
    if (swiper !== null) {
      swiper?.slidePrev();
      updateSliderPosition();
    }
  };

  useEffect(() => {
    onTabChange({ tab: tabs[0], index: 0, defaultSelection: true });
  }, []);

  const trackedTabChange = (index) => {
    onTabChange({ tab: tabs[index], index });
  };

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 24,
    getSwiper: updateSwiper,
    shouldSwiperUpdate: true,
  };

  return (
    <HighlightTabsWrapper hasRegularHighlights={hasRegularHighlights}>
      <TabsWrapper onClick={(e) => e.stopPropagation()}>
        <Swiper {...swiperParams}>
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
        </Swiper>
        <SwiperControls>
          <Conditional if={!isBeginning}>
            <div
              className="prev-slide"
              role="button"
              tabIndex={0}
              onClick={goPrev}
            >
              {CHEVRON_RIGHT_CIRCLE}
            </div>
          </Conditional>
          <Conditional if={!isEnd}>
            <div
              className="next-slide"
              role="button"
              tabIndex={0}
              onClick={goNext}
            >
              {CHEVRON_RIGHT_CIRCLE}
            </div>
          </Conditional>
        </SwiperControls>
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
        width: 100%;
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
  isCombo = false,
}) => {
  const descriptorArray = shouldShowAllDescriptors
    ? descarr
    : descarr.slice(0, 4);

  return (
    <TourTags horizontal={horizontal} pageType={pageType}>
      {descriptorArray.map((item, index) => {
        const DescriptorSVG = descriptorIcons[item];
        if (item === DESCRIPTORS.DURATION && isCombo) return null;

        return item ? (
          <div key={`descriptor-${index}`} className="tour-tag">
            <DescriptorSVG />

            <Conditional if={item === DESCRIPTORS.DURATION}>
              {getDuration({ minDuration, maxDuration, lang })}
            </Conditional>
            <Conditional if={item !== DESCRIPTORS.DURATION}>
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
    primaryCategory,
    primaryCollection,
    primarySubCategory,
  } = props;

  const {
    mbTheme,
    biLink,
    bookSubdomain,
    lang,
    isStage,
    isDev,
    sidebarModal: { addToAside },
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);
  const router = useRouter();
  const pageMetaData = useRecoilValue(metaAtom);
  const currency = useRecoilValue(currencyAtom);
  const hostname = getHostName(isStage, isDev, host);
  const [isContentOpen, toggleContentOpen] = useState(defaultOpen);
  const [showMoreDetailsInTabs, setShowMoreDetails] = useState(
    defaultOpen || false
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showComboVariant, setShowComboVariant] = useState(false);

  const {
    combo: isCombo,
    multiVariant: isMultiVariant,
    minDuration,
    maxDuration,
    imageUrl: productImage,
  } = scorpioData || {};

  const isComboWithSingleVariant = isCombo && !isMultiVariant;
  const isComboWithMultiVariant = isCombo && isMultiVariant;

  const descriptorsList = descriptors || scorpioData.descriptors;
  const cardTitle = title || scorpioData.title;

  const { promo_code } = finalPromoCode || {};

  const params = {
    ...(lang && {
      language: lang,
    }),
  };
  const tourGroupEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    id: tgid,
    hostname,
    params,
  });

  const { data: tourGroupData } = useSWR(
    isComboWithSingleVariant ? tourGroupEndpoint : null,
    { fetcher: swrFetcher }
  );

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
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
    const { listingPrice } = tourPrices[tgid] ?? {};
    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]:
        isScratchPriceEnabled && originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: cardTitle,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CITY]: pageMetaData?.city?.cityCode,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const handleCloseComboPopup = () => {
    setShowComboVariant(false);
    if (!isMobile) {
      document.body.style.overflow = 'auto';
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.COMBO_VARIANT.POPUP_CLOSED,
      [ANALYTICS_PROPERTIES.MB_NAME]: hostname,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageType,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const handleShowComboPopup = () => {
    const { variants } = tourGroupData || {};
    if (tourGroupData && isComboWithSingleVariant) {
      if (typeof window !== 'undefined') {
        const { id: variantId } = variants[0];
        trackEvent({
          eventName: ANALYTICS_EVENTS.COMBO_VARIANT.VARIANT_CLICKED,
          'MB name': hostname,
          'Variant ID': variantId,
          TGID: tgid,
          Device: isMobile ? 'Mweb' : 'Desktop',
          ...getProductCommonProperties({
            primaryCategory,
            primaryCollection,
            primarySubCategory,
          }),
        });
        router.push(
          addQueryParams(productBookingUrl, {
            variantId,
          })
        );
        return;
      }
    }
    setShowComboVariant(true);
    sendBookNowEvent();
    if (!isMobile) {
      document.body.style.overflow = 'hidden';
    }
    if (isMobile && isComboWithMultiVariant) {
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
        [ANALYTICS_PROPERTIES.SECTION]: 'Product List',
        ...getCommonEventMetaData(pageMetaData),
        ...getProductCommonProperties({
          primaryCategory,
          primaryCollection,
          primarySubCategory,
        }),
      });
  };

  useEffect(() => {
    if (isMobile) return;

    const isTruncated = tabs?.[0]?.contents?.length ?? 0 > noOfListItemToShow;
    if (isTruncated) {
      setShowMoreDetails(isTruncated);
    }
  }, [tabs, isMobile, noOfListItemToShow]);

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
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
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
        <span id={`tour-description-more-text-${position}`}>
          {'+ ' + strings.MORE_DETAILS}
        </span>
        <span
          className="display-none"
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
      redirectToHeadoutBookingFlow,
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
        <Conditional if={!isTicketCard && productImage}>
          <div className="card-img">
            <Image
              url={productImage}
              imageId="card-img"
              aspectRatio={isMobile ? '21:9' : '3:4'}
              width={
                isMobile
                  ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width
                  : undefined
              }
              height={
                isMobile
                  ? undefined
                  : PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.height
              }
              objectFit="cover"
              autoCrop={false}
              quality={80}
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
              isCombo={isCombo}
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
                listingPrice={finalPrice}
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
              <Conditional if={!isCombo}>
                <a
                  target={isMobile ? null : '_blank'}
                  href={productBookingUrl}
                  rel="nofollow"
                >
                  <BookNowCta clickHandler={sendBookNowEvent} />
                </a>
              </Conditional>
              <Conditional if={isCombo}>
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
                isCombo={isCombo}
              />
            </Conditional>
          </CTAContainer>
        </ProductHeader>
        <Conditional if={!isMobile}>
          <HorizontalLine colorProp={COLORS.GRAY.G6} />
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
