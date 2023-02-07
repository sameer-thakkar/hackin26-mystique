import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message

import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';
import styled, { css } from 'styled-components';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import parse from 'url-parse';
import { MBContext } from 'contexts/MBContext';
import useSWR from 'swr';
import { useRecoilValue } from 'recoil';
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
  MEDIA_CAROUSEL_IMAGE_LIMIT,
} from 'const/index';
import { createBookingURL } from 'utils';
import {
  getCommonEventMetaData,
  getProductCommonProperties,
  trackEvent,
} from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import {
  checkIfGpMotorTickets,
  checkIfSportsSubCategory,
  getHostName,
} from 'utils/helper';
import {
  extractTabsFromHighlights,
  getProductCardLayout,
} from 'utils/productUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { getDuration } from 'utils/timeUtils';
import { addQueryParams } from 'utils/urlUtils';
import type { SwiperProps } from 'swiper/react';
import { FONTS } from 'const/fonts';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });
const MediaCarousel = dynamic(() => import('UI/MediaCarousel'));

dayjs.extend(advancedFormat);

const isLengthyArray = (item: any) => Array.isArray(item) && item.length;

const Container = styled.div<{
  isCardVisible?: boolean;
  isV3Design?: boolean;
  indexPosition: number;
}>`
  display: ${({ isCardVisible }) => (isCardVisible ? 'block' : 'none')};

  max-width: 1200px;
  margin: auto;
  width: 100%;
  position: relative;
  ${({ isV3Design, indexPosition }) =>
    isV3Design &&
    `
    border-top: 1px solid ${COLORS.GRAY.G4A};
    background-color: ${COLORS.GRAY.G8};
    min-height: 400px;
  }
  
  .indicator-triangle::before {
    border-color: transparent transparent ${COLORS.GRAY.G4A};
    border-width: 12px;
    border-style: solid;content: "";
    position: absolute;
    top: -24px;
    // use indexPosition to find the position of card in overall list and % 4 to find the order in a single row
    // and use this info to find a perfect fir for arrow from left
    left: ${25 * (((indexPosition + 4) % 4) + 1) - 14.5}%;
  }

  .indicator-triangle::after {
    border-color: transparent transparent ${COLORS.GRAY.G8};
    border-width: 12px;
    border-style: solid;content: "";
    position: absolute;
    top: -22px;
    left: ${25 * (((indexPosition + 4) % 4) + 1) - 14.5}%;
    transform: translateY(0px);
  }
  `}
`;

const PRODUCT_CARD_IMAGE_DIMENSIONS = {
  MOBILE: {
    width: 400,
    firstProductWidth: 600,
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
      width: calc(100% + 2rem);
      height: 11.25rem;
      max-height: 11.25rem;
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

const ctaBlockMobileStyles = (isSticky: boolean) => css`
  grid-column: 1;
  width: ${isSticky ? '84vw' : 'auto'};
  .tour-book-now-cta {
    line-height: 125%;
    padding: 0.75rem;
    border-radius: 8px;
    min-width: auto;
    letter-spacing: 0.6px;
    font-size: 0.875rem;
  }
`;

interface IStyledProductCard {
  isTicketCard: boolean;
  isMobile: boolean;
  isV3Design?: boolean;
  layout?: any;
  isNewMediaSite?: boolean;
  isFirstProduct?: boolean;
}

const StyledProductCard = styled.div<IStyledProductCard>`
  padding: ${({ isTicketCard, theme }) =>
    isTicketCard ? `24px 0px 24px 40px` : theme.productCards.padding.desktop};
  ${({ isTicketCard, theme, isMobile, isV3Design }) =>
    (!isTicketCard || isMobile) &&
    !isV3Design &&
    `border: ${theme.productCards.border};
    border-radius: 4px;`};
  display: grid;

  grid-row-gap: 24px;
  grid-template-columns: 1fr auto;
  grid-template-areas: ${({ layout }) =>
    layout.desktop.map((row: any) => `'${row}'`)};
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
    color: ${COLORS.TEXT.CANDY_1};
    margin-left: 1em;
    margin-top: 16px;
    cursor: pointer;
    outline: none;
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    grid-gap: 8px;

    .chevron::before,
    .chevron::after {
      top: 0.6em;
      background-color: ${COLORS.BRAND.CANDY};
    }
    @media (max-width: 768px) {
      justify-content: left;
    }
  }
  ${({ theme }) => theme.productCards?.styles?.desktop}

  ${({ isTicketCard }) => (isTicketCard ? null : cardImageStyles)}

  grid-template-rows: min-content min-content min-content;
  grid-template-columns: auto 1fr auto;
  grid-auto-rows: min-content;
  column-gap: 1.5rem;

  ${({ isNewMediaSite }) =>
    isNewMediaSite &&
    `
    .card-img {
      border-radius: 0;
    }
  `}

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.productCards.padding.mobile};
    margin: 0
      ${({ theme: { theme }, isTicketCard }) =>
        theme !== THEMES.MIN_BLUE && !isTicketCard
          ? '1.5rem'
          : isTicketCard
          ? '0'
          : '24px'};
    grid-template-areas: ${({ layout }) =>
      layout.mobile.map((row: any) => `'${row}'`)};
    width: auto;
    grid-template-columns: 1fr;

    ${({ theme }) => theme.productCards?.styles?.mobile}

    .more-details {
      margin-left: 0;
      margin-bottom: 0;
      ${({ isTicketCard }) =>
        isTicketCard &&
        `
        padding: 0.75rem;
        background-color: ${COLORS.GRAY.G7};
        margin-top: 0;
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
      `}
    }

    ${({ isNewMediaSite }) =>
      isNewMediaSite &&
      `
        .card-img {
          width: calc(100% + 2rem);

          img {
            border-radius: 0;
          }
        }

        .card-img img {
          width: 100%;
        }
      `}

    
    ${({ isNewMediaSite, isFirstProduct }) =>
      isNewMediaSite &&
      isFirstProduct &&
      `
        .card-img {
          height: 22.5rem;
          max-height: 22.5rem;
        
          .video-container, img {
            height: 22.5rem;
            width: 100%;
          }
        }
      `}
  }
`;

const ProductHeader = styled.div`
  display: grid;
  grid-gap: 16px;
  display: contents;
`;

const TourTitle = styled.h2<{ isPopup?: boolean; pageType?: string }>`
  ${expandFontToken('Heading/Large')}
  margin: 0;
  max-width: 768px;
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
  }
`;

const TitleWrapper = styled.div<{
  hasBorderedTitle?: boolean;
  $isTicketCard?: boolean;
}>`
  grid-area: title;
  ${({ hasBorderedTitle }) =>
    hasBorderedTitle
      ? `
            border-bottom: 1px solid ${COLORS.GRAY.G6};
            @media(max-width: 768px) {
              border: none;
            }
          `
      : ''}

  ${({ $isTicketCard }) =>
    !$isTicketCard &&
    `
    @media(max-width: 768px) {
      margin-top: -0.5rem;
      margin-bottom: -1rem;
    }
  `}
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

const TourTags = styled.div<{ horizontal?: boolean; pageType?: string }>`
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
    img {
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
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    margin-top: -8px;
    margin-bottom: -0.5rem;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    .tour-tag {
      margin: 0;
    }
  }
`;

export const CTAContainer = styled.div<{ pageType?: any }>`
  grid-area: cta-combo;
  display: grid;
  grid-gap: 16px;
  align-content: start;

  ${({ theme }) =>
    theme.theme === THEMES.MIN_BLUE &&
    `
    button.tour-book-now-cta {
      width: 100%;
    }
  `}

  button.tour-book-now-cta {
    ${expandFontToken('Button/Medium')}
  }
  @media (max-width: 768px) {
    display: contents;
  }
`;

const PriceContainer = styled.div<{
  $hasScratchPrice?: boolean;
  pageType?: string;
}>`
  justify-self: center;
  display: grid;
  grid-auto-flow: column;
  align-items: end;
  grid-column-gap: 8px;
  justify-items: left;
  grid-row-gap: 4px;
  justify-self: left;

  .tour-scratch-price {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: left;
    grid-column-gap: 4px;
    ${expandFontToken('UI/Label Small')}
  }

  .tour-price {
    display: flex;
    flex-direction: column;
    ${expandFontToken('Heading/Large')}

    .prefix {
      color: ${COLORS.GRAY.G3};
      ${expandFontToken('UI/Label Small')}
    }
  }

  @media (max-width: 768px) {
    grid-area: price-block;
    margin-top: ${({ $hasScratchPrice }) =>
      $hasScratchPrice ? '0' : '-0.25rem'};
    margin-bottom: 0.25rem;
    ${({ theme }) => theme.productCards.priceFontSettings.mobile}

    .styled-price-block {
      grid-column-gap: 0.25rem;
    }

    .tour-price-container .tour-price {
      margin-right: 0;
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
    }

    .tour-scratch-price {
      ${expandFontToken(FONTS.SUBHEADING_SMALL)};
    }

    .savedtag-block {
      ${expandFontToken(FONTS.MISC_TAG_REGULAR)};
    }
  }
`;

const CTABlock = styled.div<{
  isTicketCard?: boolean;
  isSticky: boolean;
  shouldOffset?: boolean;
}>`
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
    grid-area: ${({ isSticky }) => (isSticky ? 'cta-block' : 'body')};

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
    width: 100%;
  }
`;

const ProductBody = styled.div<{
  noOfListItemToShow?: number;
  hasReadMore?: boolean;
  defaultOpen?: boolean;
  collapsed?: boolean;
}>`
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
      padding-bottom: 0.5rem;
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
  color: ${COLORS.GRAY.G3};
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
    margin-top: -1rem;
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
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
const V1BoosterBlock = styled.div<{ boosterHasIcon?: boolean }>`
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

const HighlightTabsWrapper = styled.div<{ hasRegularHighlights: boolean }>`
  display: grid;
  grid-row-gap: 16px;
  margin-top: ${({ hasRegularHighlights }) =>
    hasRegularHighlights ? '16px' : 0};
`;

const TabsWrapper = styled.div`
  display: block;
  ${expandFontToken('Paragraph/Large')}
  border-bottom: 1px solid ${COLORS.GRAY.G6};
  justify-content: left;
  position: relative;
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
    left: 0;
    top: -0.5rem;
    svg {
      transform: scaleX(-1);
    }
  }
  .next-slide {
    right: 0;
    top: -0.5rem;
  }
`;

const TabPanelWrapper = styled.div``;

const Tab = styled.div<{ isActive: boolean }>`
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
      color: ${COLORS.TEXT.CANDY_1};
      border-color: ${COLORS.TEXT.CANDY_1};
      padding-bottom: 7.25px;`
    );
  }}
`;

const TabPanel = styled.div<{ isActive: boolean; pageType: string }>`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
  ${({ pageType }) =>
    pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
      ? `
      li {
        color: #666666 !important;
      }`
      : ''}
`;

const MoreDetailsBtn = styled(Button)`
  width: 100%;
  grid-area: cta-block;
  margin-top: -1rem;
`;

const richtextElements = {
  hyperlink: function Anchor({ children, data }: any) {
    return (
      <a href={data?.url} rel="nofollow noreferrer" target="_blank">
        {children}
      </a>
    );
  },
};

const swiperParams: SwiperProps = {
  slidesPerView: 'auto',
  spaceBetween: 24,
};

const HighlightTabs = ({
  tabs,
  hasRegularHighlights = false,
  onTabChange,
  pageType,
  activeTabIndex,
  showCard,
}: any) => {
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(false);
  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const updateIndex = useCallback(() => {
    if (isMobile) {
      return;
    }

    // @ts-expect-error TS(2531): Object is possibly 'null'.
    updateCurrentIndex(swiper.realIndex);
  }, [swiper, isMobile]);

  const updateSliderPosition = useCallback(() => {
    setIsBeginning((swiper as any)?.isBeginning);
    setIsEnd((swiper as any)?.isEnd);
  }, [swiper]);

  useEffect(() => {
    swiper && updateSliderPosition();
  }, [swiper]);

  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

  const goNext = () => {
    if (swiper !== null) {
      (swiper as any)?.slideNext();
      updateSliderPosition();
    }
  };

  const goPrev = () => {
    if (swiper !== null) {
      (swiper as any)?.slidePrev();
      updateSliderPosition();
    }
  };

  useEffect(() => {
    onTabChange({ tab: tabs[0], index: 0, defaultSelection: true });
  }, []);

  const trackedTabChange = (index: number) => {
    onTabChange({ tab: tabs[index], index });
  };

  return (
    <Conditional if={showCard}>
      <HighlightTabsWrapper hasRegularHighlights={hasRegularHighlights}>
        <TabsWrapper onClick={(e) => e.stopPropagation()}>
          <Swiper
            {...swiperParams}
            // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
            onSwiper={updateSwiper}
            onSlideChange={updateIndex}
          >
            {tabs.map((tab: any, index: number) => (
              <Tab
                isActive={activeTabIndex == index}
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  trackedTabChange(index);
                }}
                // @ts-expect-error TS(2769): No overload matches this call.
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
          {tabs.map((tab: any, index: number) => (
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
    </Conditional>
  );
};

const ModalCardContainer = styled.div<{ $isNewMediaSite: boolean }>`
  @media (max-width: 768px) {
    background: #fff;
    border-radius: 0.75rem 0.75rem 0 0;

    ${StyledProductCard} {
      margin: 0;
      border: none;
      padding: 0 24px;
      padding-top: 24px;
    }

    .card-img {
      width: calc(100% + 3.5rem);
      margin: -1.5rem -1.5rem -0.5rem;
      max-height: 175px;
    }

    ${({ $isNewMediaSite }) =>
      $isNewMediaSite &&
      `
          .card-img {
            width: calc(100% + 3rem); 
          
            .video-container {
              height: 11.25rem;

              video {
                height: 11.25rem;
              }
            }
          }
      `}

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
      ${MoreDetailsBtn} {
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
  descriptorArray,
  horizontal = false,
  pageType = '',
  minDuration,
  maxDuration,
  lang = 'en',
  isCombo = false,
  isGpMotorTicketsMb = false,
}: any) => {
  return (
    <TourTags horizontal={horizontal} pageType={pageType}>
      {descriptorArray.map((item: any, index: number) => {
        const DescriptorSVG = descriptorIcons[item];
        if (item === DESCRIPTORS.DURATION && (isCombo || isGpMotorTicketsMb))
          return null;

        return item ? (
          <div key={`descriptor-${index}`} className="tour-tag">
            <DescriptorSVG />

            <Conditional if={item === DESCRIPTORS.DURATION}>
              {getDuration({ minDuration, maxDuration, lang })}
            </Conditional>
            <Conditional if={item !== DESCRIPTORS.DURATION}>
              {/* @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
              {strings.DESCRIPTORS?.[item]}
            </Conditional>
          </div>
        ) : null;
      })}
    </TourTags>
  );
};

const Product = (props: any) => {
  const moreDetailsRef = useRef();
  const {
    tgid,
    position,
    currentLanguage,
    togglePopup,
    defaultOpen,
    title,
    descriptors,
    highlights: tempHighlights = [],
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
    boosterTag,
    isMobile,
    instantCheckout,
    showNextAvailable,
    isTicketCard = false,
    indexPosition,
    pageType = '',
    finalPromoCode,
    appliedPromo,
    primaryCategory,
    primaryCollection,
    primarySubCategory,
    showCard = true,
    mediaUpgradeExperiment = {},
    flowType,
    bannerVideo,
    isV3Design,
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
  const pageMetaData = useRecoilValue(metaAtom);
  const currency = useRecoilValue(currencyAtom);
  const hostname = getHostName(isStage, isDev, host);
  const [isContentOpen, toggleContentOpen] = useState(defaultOpen);
  const [showMoreDetailsInTabs, setShowMoreDetails] = useState(
    defaultOpen || false
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showComboVariant, setShowComboVariant] = useState(false);

  const isGpMotorTicketsMb = checkIfGpMotorTickets(uid);
  const isSportsSubCategory = checkIfSportsSubCategory(primarySubCategory?.id);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('pid');
    const popup = urlParams.get('popup');
    if (pid != tgid) return;
    if (popup === 'combo') {
      if (isMobile && isComboWithMultiVariant) {
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
          history: {
            enable: true,
            params: {
              pid: tgid,
              popup: 'combo',
            },
            isQueryRestore: true,
          },
        });
      }
    }
    if (popup === 'details') {
      // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
      addToAside({
        width: '100vw',
        children: (
          // @ts-expect-error TS(2769): No overload matches this call.
          <ModalCardContainer>
            {getProductCardElements(true)}
          </ModalCardContainer>
        ),
        type: SIDEBAR_TYPES.PRODUCT_CARD,
        onCloseCallback: () => trackedToggleContent(true),
        history: {
          enable: true,
          params: {
            pid: tgid,
            popup: 'details',
          },
          isQueryRestore: true,
        },
      });
    }
  }, [isMobile, showCard]);

  const {
    combo: isCombo,
    multiVariant: isMultiVariant,
    minDuration,
    maxDuration,
    imageUrl: productImage,
    images,
  } = scorpioData || {};

  const isComboWithSingleVariant = isCombo && !isMultiVariant;
  const isComboWithMultiVariant = isCombo && isMultiVariant;

  const descriptorsList = descriptors || scorpioData.descriptors;
  const cardTitle = title || scorpioData.title;
  const { promo_code } = finalPromoCode || {};
  const { isNewMediaSite } = mediaUpgradeExperiment;
  const isFirstProduct = indexPosition === 0;

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
    // @ts-expect-error TS(2345): Argument of type '[string | null | undefined, { fe... Remove this comment to see the full error message
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
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
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
        window.open(
          addQueryParams(productBookingUrl, {
            variantId,
          }),
          '_blank',
          'noopener, noreferrer'
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
        history: {
          enable: true,
          params: {
            pid: tgid,
            popup: 'combo',
          },
        },
      });
    }
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

  const boosterHasIcon =
    booster?.filter((i: any) => i.type === 'image').length > 0;
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

  const { highlights, tabs } = isMobile
    ? { highlights: finalHighlights, tabs: [] }
    : extractTabsFromHighlights(finalHighlights);

  const shouldShowMoreDetails =
    tabs[activeTabIndex]?.contents.flat()?.length > 3 &&
    showMoreDetailsInTabs &&
    !defaultOpen;
  const hasReadMore = shouldShowMoreDetails || isMobile;

  const noOfListItemToShow = getMaxListItemsToShow(
    tabs[activeTabIndex]?.contents
  );

  const onTabChange = ({ tab, index, defaultSelection }: any) => {
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
  const finalListingPrice = listingPrice;
  const { tourId } = finalListingPrice || {};
  const hasV1Booster = booster && RichText.asText(booster).trim().length > 0;
  const hasOffer = isOfferEnabled && offerId;
  const hasBorderedTitle = !hasOffer && !hasV1Booster;

  const onMoreDetailsClick = (e: any) => {
    e?.stopPropagation();
    if (mbTheme !== THEMES.MIN_BLUE && isMobile) {
      trackedToggleContent(false);
      // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
      addToAside({
        width: '100vw',
        children: (
          <ModalCardContainer $isNewMediaSite={isNewMediaSite}>
            {getProductCardElements(true)}
          </ModalCardContainer>
        ),
        type: SIDEBAR_TYPES.PRODUCT_CARD,
        onCloseCallback: () => trackedToggleContent(true),
        history: {
          enable: true,
          params: {
            pid: tgid,
            popup: 'details',
          },
        },
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
    hasNextAvailable: earliestAvailability?.startDate,
    isTicketCard: isTicketCard,
    hasPromoCode: promo_code,
  });
  const trackedToggleContent = (isOpen: any) => {
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
    const keyPressedOnReadMore = (event: any) => {
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
    return isMobile ? (
      <MoreDetailsBtn
        fillType="secondaryFill"
        onClick={onMoreDetailsClick}
        onKeyDown={keyPressedOnReadMore}
        role="button"
        data-open="0"
        tabIndex={0}
      >
        {strings.MORE_DETAILS}
      </MoreDetailsBtn>
    ) : (
      <div
        // @ts-expect-error TS(2322): Type 'MutableRefObject<undefined>' is not assignab... Remove this comment to see the full error message
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

  const hasHighlights =
    isLengthyArray(highlights) &&
    highlights.filter((item: any) => item.text).length;
  const productBookingUrl = createBookingURL({
    nakedDomain: bookingUrl,
    lang: currentLanguage,
    currency,
    tgid,
    promoCode: promo_code === appliedPromo ? appliedPromo : null,
    tourId,
    biLink,
    date: instantCheckout && earliestAvailability ? earliestAvailability : null,
    isMobile,
    bookSubdomain,
    redirectToHeadoutBookingFlow,
    ctaSuffix: ctaUrlSuffix,
    flowType,
  });

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
      {isV3Design // This is just for the experiment. Will revert this at a later time or figure a better to do this
        ? strings.BOOK_NOW_CTA
        : isGpMotorTicketsMb && isSportsSubCategory
        ? strings.BUY_TICKETS_CTA
        : strings.CHECK_AVAIL}
      {mbTheme === THEMES.MIN_BLUE ? BackArrow : null}
    </Button>
  );

  const getProductCardElements = (expandContent: any) => (
    <>
      <StyledProductCard
        layout={layout}
        isTicketCard={isTicketCard}
        isMobile={isMobile}
        isNewMediaSite={isNewMediaSite}
        isFirstProduct={isFirstProduct}
        isV3Design={isV3Design}
      >
        <Conditional if={!isTicketCard && productImage && !isNewMediaSite}>
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
              fill={true}
              objectFit="cover"
              autoCrop={false}
              quality={80}
              alt={cardTitle}
            />
          </div>
        </Conditional>
        <Conditional if={!isTicketCard && images?.length && isNewMediaSite}>
          <div className="card-img">
            <MediaCarousel
              imageList={images?.slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT)}
              videoUrl={isMobile && isFirstProduct ? bannerVideo : null}
              imageId="card-img"
              imageAspectRatio={isMobile ? '21:9' : '3:4'}
              imageWidth={
                isMobile
                  ? isFirstProduct
                    ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.firstProductWidth
                    : PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width
                  : undefined
              }
              imageHeight={
                isMobile && !isFirstProduct
                  ? undefined
                  : PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.height
              }
              isFirstProduct={isFirstProduct}
              tgid={tgid}
              isMobile={isMobile}
            />
          </div>
        </Conditional>

        <ProductHeader>
          <TitleWrapper
            $isTicketCard={isTicketCard}
            hasBorderedTitle={hasBorderedTitle && !tabs.length}
          >
            <Conditional if={boosterTag && mbTheme !== THEMES.MIN_BLUE}>
              <BoosterTag>{boosterTag}</BoosterTag>
            </Conditional>
            <TourTitle isPopup={isContentOpen} pageType={pageType}>
              {cardTitle}
            </TourTitle>
          </TitleWrapper>
          <Conditional if={mbTheme === THEMES.MIN_BLUE}>
            <Descriptors
              descriptorArray={descriptorsList}
              pageType={pageType}
              minDuration={minDuration}
              maxDuration={maxDuration}
              lang={currentLanguage}
              isCombo={isCombo}
              isGpMotorTicketsMb={isGpMotorTicketsMb}
            />
          </Conditional>
          <Conditional if={hasV1Booster}>
            <V1BoosterBlock boosterHasIcon={boosterHasIcon}>
              <RichText render={booster} htmlSerializer={shortCodeSerializer} />
            </V1BoosterBlock>
          </Conditional>
          {hasOffer &&
            offerId &&
            productOffer.map((offer: any, index: number) => {
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
            <PriceContainer
              $hasScratchPrice={
                showScratchPrice &&
                finalListingPrice.originalPrice > finalListingPrice.finalPrice
              }
              pageType={pageType}
            >
              <PriceBlock
                showScratchPrice={showScratchPrice}
                listingPrice={finalListingPrice}
                lang={currentLanguage}
                showSavings
                prefix
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
                  target={isMobile ? undefined : '_blank'}
                  href={productBookingUrl}
                  rel="nofollow noreferrer"
                >
                  <BookNowCta clickHandler={sendBookNowEvent} />
                </a>
              </Conditional>
              <Conditional if={isCombo}>
                <BookNowCta clickHandler={handleShowComboPopup} />
              </Conditional>
            </CTABlock>
            <Conditional
              if={showNextAvailable && earliestAvailability?.startDate}
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
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
                isCombo={isCombo}
                isGpMotorTicketsMb={isGpMotorTicketsMb}
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
              className={'tour-description'}
              id={`tour-description-${position}`}
              // @ts-expect-error TS(2322): Type '((e: MouseEvent<HTMLDivElement, MouseEvent>)... Remove this comment to see the full error message
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
                  showCard={showCard}
                />
              </Conditional>
            </div>
          </Conditional>
          <Conditional if={hasReadMore && !isMobile}>
            {getMoreDetailsButton()}
          </Conditional>
        </ProductBody>
        <Conditional if={hasReadMore && isMobile && !expandContent}>
          {getMoreDetailsButton()}
        </Conditional>
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

  const getIsCardVisible = () => {
    if (isMobile) {
      return !isV3Design;
    } else {
      return showCard;
    }
  };

  return (
    <Container
      isV3Design={isV3Design}
      indexPosition={indexPosition}
      isCardVisible={getIsCardVisible()}
    >
      <Conditional if={isV3Design}>
        <div className="indicator-triangle"></div>
      </Conditional>
      {getProductCardElements(isContentOpen)}
    </Container>
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
