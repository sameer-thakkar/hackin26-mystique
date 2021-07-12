import { RichText } from 'prismic-reactjs';
import { useRecoilValue } from 'recoil';
import Button from 'UI/Button';
import { strings } from 'const/strings';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import parse from 'url-parse';
import styled from 'styled-components';
import React, { useRef, useState, useContext, useEffect, useMemo } from 'react';
import HorizontalLine from 'components/slices/HorizontalLine';
import Cookies from 'js-cookie';
import {
  ANALYTICS_EVENTS,
  THEMES,
  SIDEBAR_TYPES,
  LOCALISED_DATE_FORMATS,
  NOS_OF_HIGHLIGHTS_TO_SHOW,
  AUDIOGUIDE_TAG_REGEX,
} from 'const/index';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { shortCodeSerializer } from 'utils/shortCodes';
import { CALENDAR, Shield, BackArrow, AudioGuideIcon } from 'assets/SvgIcons';
import Split, { StlyedSplit } from 'UI/Split';
import IconCTA, { StyledIconCTA } from 'UI/IconCTA';
import { brownScheme, greenScheme } from 'style/theme';
import { isSafetyIncluded, createBookingURL } from 'utils';
import { MBContext } from 'contexts/MBContext';
import PriceBlock from 'UI/PriceBlock';
import Chevron from 'UI/Chevron';
import {
  extractTabsFromHighlights,
  getDescriptorIconURL,
  getProductCardLayout,
  parseDescriptorIcon,
} from 'utils/productUtils';
import Image from 'UI/Image';
import { truncate, wordCount } from 'utils/helper';
import { currencyAtom } from 'store/atoms/currency';
import { EXPERIMENT_NAMES } from 'const/experiments';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';

import Conditional from './common/Conditional';

const SafeExperiencesPitch = dynamic(() => import('UI/SafeExperiencesPitch'), {
  ssr: false,
});

dayjs.extend(advancedFormat);

const isLengthyArray = (item) => Array.isArray(item) && item.length;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  width: 100%;
`;

const StyledProductCard = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  padding: ${({ theme }) => theme.productCards.padding.desktop};
  border: ${({ theme }) => theme.productCards.border};
  border-radius: 4px;
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
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.productCards.padding.mobile};
    margin: 0
      ${({ theme: { theme } }) => (theme !== THEMES.MIN_BLUE ? '16px' : '24px')};
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

const TourTitle = styled.h2`
  font-weight: ${SOLEIL.MEDIUM};
  margin: 0;
  max-width: 768px;
  ${({ theme }) => theme.productCards.titleFontSettings.desktop};
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
            border-bottom: 1px solid ${COLORS.GREY_G6};
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
  line-height: 13px;
  background: ${COLORS.PALE_YELLOW};
  border-radius: 2px;
  letter-spacing: 0.4px;
  margin-bottom: 7px;
  padding: 2px 4px;
  display: inline-block;
`;

const ShortSummary = styled.div`
  margin-top: -8px;
  grid-area: summary;
  p {
    color: ${COLORS.GREY_G3};
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
    img {
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
  }
  .tour-price {
    display: flex;
  }
  ${({ theme }) => theme.productCards.priceFontSettings.desktop}
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
    line-height: 1;
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
      background: ${COLORS.WHITE};
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
  font-weight: 400;
  line-height: 1.31;
  text-align: left;
  color: ${({ theme: { primaryAccent } }) =>
    primaryAccent ? primaryAccent : COLORS.CORAL};
  font-size: 1em;
  display: inline-block;
  p {
    margin: 0;
    color: ${({ theme: { primaryAccent } }) =>
      primaryAccent ? primaryAccent : COLORS.MED_SLATE_BLUE};
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

const IconBoosters = styled.div`
  grid-area: icon-booster;
  margin-left: 16px;
  ${StlyedSplit} {
    grid-column-gap: 30px;
  }
  @media (max-width: 768px) {
    margin-left: 0;
    justify-self: right;
    margin-top: -8px;
    ${StyledIconCTA} {
      justify-self: right;
      grid-template-columns: auto;
      border-radius: 50%;
      .icon {
        position: unset;
        transform: unset;
        left: unset;
        top: unset;
        height: 20px;
        width: 20px;
      }
      padding: 4px;
    }
    ${StlyedSplit} {
      border: none;
      grid-auto-flow: column;
      grid-column-gap: 24px;
      padding-left: 0;
    }
    .text,
    .chevron {
      display: none;
    }
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
  ${({ isActive }) => {
    return (
      isActive &&
      `
      font-weight: ${SOLEIL.SEMIBOLD};
      color: ${COLORS.RHAPSODY};
      border-color: ${COLORS.RHAPSODY};
    `
    );
  }}
`;

const TabPanel = styled.div`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
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

const HighlightTabs = ({ tabs, hasRegularHighlights = false, onTabChange }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    onTabChange(tabs[activeTabIndex]);
  }, [activeTabIndex, onTabChange, tabs]);

  return (
    <HighlightTabsWrapper hasRegularHighlights={hasRegularHighlights}>
      <TabsWrapper>
        {tabs.map((tab, index) => (
          <Tab
            isActive={activeTabIndex == index}
            key={index}
            onClick={() => setActiveTabIndex(index)}
          >
            {tab.heading}
          </Tab>
        ))}
      </TabsWrapper>
      <TabPanelWrapper>
        {tabs.map((tab, index) => (
          <TabPanel isActive={activeTabIndex == index} key={index}>
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
  hasValidity = false,
  isAGVariant = false,
}) => {
  return (
    <TourTags>
      <Conditional if={isAGVariant}>
        <div key={'audioguide'} className="tour-tag">
          <Image
            imageId={'audioguide'}
            url={getDescriptorIconURL('headphones')}
          />
          {strings.DESCRIPTORS.FREE_AUDIOGUDE}
        </div>
      </Conditional>
      <Conditional if={hasValidity}>
        <div key={'validity'} className="tour-tag">
          <Image imageId={'validity'} url={getDescriptorIconURL('validity')} />
          {strings.DESCRIPTORS.VALIDITY}
        </div>
      </Conditional>
      {descriptorArray.reduce((acc, item, index) => {
        const { icon, descriptor } = parseDescriptorIcon(item.trim());
        if (icon.includes('headphones') && isAGVariant) return acc;

        const descEl = descriptor ? (
          <div key={`descriptor-${index}`} className="tour-tag">
            <Image url={icon} />
            {descriptor.replace(/['"]+/g, '')}
          </div>
        ) : null;
        return [...acc, descEl];
      }, [])}
    </TourTags>
  );
};

const Product = (props) => {
  const moreDetailsRef = useRef();
  const {
    analytics,
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
  } = props;
  const { mbTheme, biLink, hsid, bookSubdomain } = useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);
  const [isContentOpen, toggleContentOpen] = useState(defaultOpen || isAmp);
  const [showMoreDetailsInTabs, setShowMoreDetails] = useState(
    defaultOpen || false
  );
  const finalHsid = hsid ?? Cookies.get('h-sid');
  const { allTags = [] } = scorpioData || {};

  const isAGVariant = useMemo(() => {
    if (
      !allTags.filter((tag) => AUDIOGUIDE_TAG_REGEX.test(tag)).length ||
      !finalHsid
    )
      return;

    return getABTestingVariant(
      EXPERIMENT_NAMES.AUDIO_GUIDE_EXPERIMENT,
      finalHsid
    );
  }, [finalHsid, allTags]);

  const { validity } = scorpioData;
  const descriptorsCsv = descriptors || scorpioData.descriptors;

  const descriptorsList = descriptorsCsv
    ? descriptorsCsv
        .match(/(("|').*?("|')|[^",]+)(?=\s*,|\s*$)/g)
        .map((descriptor) => descriptor.replace(/^["']+|['"]+$/g, '')) // replace escaped dbl-quotes.
    : [];

  const noOfListItemToShow = Math.max(
    NOS_OF_HIGHLIGHTS_TO_SHOW,
    descriptorsList.length
  );

  const onTabChange = (tab) => {
    setShowMoreDetails(tab.contents.length > noOfListItemToShow);
  };

  const handlePopup = () => {
    togglePopup();
  };

  const sendBookNowEvent = () => {
    analytics.setVariableInDataLayer({
      event: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      'Tour Group Id': tgid,
      Position: position,
      'Div Type': 'product-list',
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

  const boosterHasIcon = booster?.filter((i) => i.type === 'image').length > 0;
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

  let { listingPrice } = isFetched ? tourPrices[tgid] : { listingPrice: null };
  listingPrice = isAmp ? scorpioData.listingPrice : listingPrice;

  if (isFetched && !listingPrice) return null;
  const hasSafetyFlag = isSafetyIncluded(allTags);
  const finalPrice = listingPrice;
  const { tourId } = finalPrice || {};
  const openSafeSidebar = () => {
    addToAside({
      width: '41.06vw',
      children: (
        <SafeExperiencesPitch
          allTags={allTags}
          images={scorpioData.safetyImages}
        />
      ),
      sidePadding: isMobile ? 0 : 40,
    });
  };
  const hasV1Booster = booster && RichText.asText(booster).trim().length > 0;
  const hasOffer = isOfferEnabled && offerId;
  const hasBorderedTitle = !hasOffer && !hasV1Booster && !hasSafetyFlag;

  const layout = getProductCardLayout({
    hasOffer,
    hasSafetyFlag,
    hasV1Booster,
    mbTheme,
    hasShortSummary: hasShortSummary,
    hasNextAvailable: earliestAvailability?.startDate,
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
          {isContentOpen ? strings.SHOW_LESS_TEXT : strings.MORE_DETAILS}{' '}
          <Chevron isActive={isContentOpen} className={'chevron'} />{' '}
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
                  {getProductCardElements(true, isFallbackSummary)}
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
        on={`tap:tour-description-${position}.toggleClass(class='show-more-information'),tour-description-less-text-${position}.toggleClass(class='display-none'),tour-description-more-text-${position}.toggleClass(class='display-none')`}
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
      tourId,
      biLink,
      date:
        instantCheckout && earliestAvailability ? earliestAvailability : null,
      isMobile,
      bookSubdomain,
    }) + (ctaUrlSuffix || '');

  const hasReadMore =
    (highlights.flat()?.length >= 3 || showMoreDetailsInTabs) && !defaultOpen;
  const getProductCardElements = (expandContent, isFallbackSummary = false) => (
    <StyledProductCard layout={layout}>
      <ProductHeader>
        <TitleWrapper hasBorderedTitle={hasBorderedTitle && !tabs.length}>
          <Conditional if={boosterTag && mbTheme !== THEMES.MIN_BLUE}>
            <BoosterTag>{boosterTag}</BoosterTag>
          </Conditional>
          <TourTitle isPopup={isContentOpen}>
            {cardTitle} {isAGVariant ? strings.AUDIO_GUIDE.PRODUCT_SUFFIX : ''}
          </TourTitle>
        </TitleWrapper>
        <Conditional
          if={
            mbTheme !== THEMES.MIN_BLUE && !isFallbackSummary && hasShortSummary
          }
        >
          <ShortSummary>
            <RichText render={finalShortSummary} />
          </ShortSummary>
        </Conditional>
        <Conditional if={mbTheme === THEMES.MIN_BLUE}>
          <Descriptors
            descriptorArray={descriptorsList}
            hasValidity={!!validity}
            isAGVariant={isAGVariant}
          />
        </Conditional>
        <Conditional if={hasSafetyFlag}>
          <IconBoosters>
            <Split count={2} autoWidth={true}>
              <Conditional if={hasSafetyFlag}>
                <IconCTA
                  text={strings.SAFE_EXPERIENCE.FLAG_TEXT}
                  colorScheme={greenScheme}
                  ctaOnClick={openSafeSidebar}
                  icon={Shield}
                />
              </Conditional>
              <Conditional if={hasSafetyFlag && isAGVariant}>
                <IconCTA
                  text={strings.AUDIO_GUIDE.BANNER}
                  colorScheme={brownScheme}
                  icon={<AudioGuideIcon />}
                />
              </Conditional>
            </Split>
          </IconBoosters>
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
        <CTAContainer>
          <PriceContainer>
            <PriceBlock
              showScratchPrice={showScratchPrice}
              price={finalPrice}
              lang={currentLanguage}
              showSavings={true}
            />
          </PriceContainer>
          <CTABlock
            isSticky={expandContent}
            shouldOffset={earliestAvailability && mbTheme === THEMES.MIN_BLUE}
          >
            <a
              target={isFetched && isMobile ? null : '_blank'}
              href={productBookingUrl}
              rel="nofollow"
            >
              <Button
                className={`tour-book-now-cta`}
                paddingSides={isMobile ? '16px' : '8px'}
                type="fill"
                onClick={sendBookNowEvent}
                onKeyDown={sendBookNowEvent}
                role="button"
                tabIndex={0}
              >
                {strings.BOOK_NOW_CTA}
                {mbTheme === THEMES.MIN_BLUE ? BackArrow : null}
              </Button>
            </a>
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
              hasValidity={!!validity}
              descriptorArray={descriptorsList}
              isAGVariant={isAGVariant}
            />
          </Conditional>
        </CTAContainer>
      </ProductHeader>
      <Conditional if={!isMobile}>
        <HorizontalLine colorProp={COLORS.GREY_G6} />
      </Conditional>
      <ProductBody
        hasReadMore={hasReadMore}
        collapsed={!expandContent}
        noOfListItemToShow={noOfListItemToShow + 1}
        defaultOpen={defaultOpen}
      >
        <div
          className="tour-description"
          id={`tour-description-${position}`}
          onClick={
            !isMobile && !defaultOpen
              ? () => toggleContentOpen(!isContentOpen)
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
            />
          </Conditional>
        </div>
        <Conditional if={hasReadMore}>
          {isAmp ? getMoreDetailsButtonForAMP() : getMoreDetailsButton()}
        </Conditional>
      </ProductBody>
    </StyledProductCard>
  );

  return <Container>{getProductCardElements(isContentOpen)}</Container>;
};

export default Product;
