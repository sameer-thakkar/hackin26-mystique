import React, { useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import parse from 'url-parse';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown/with-html';
import * as labels from 'constants/localization/labels';
import HorizontalLine from './slices/HorizontalLine';
import Button from 'UI/Button';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from 'utils/shortCodes';
import { ANALYTICS_EVENTS, THEMES } from 'constants/index';
import { COLORS, SOLEIL } from 'constants/ui-constants';
import { CALENDAR, BrownTicket, Shield, BackArrow } from 'assets/SvgIcons';
import 'utils/dayjsLocale';
import Split, { StlyedSplit } from 'UI/Split';
import IconCTA from 'UI/IconCTA';
import { brownScheme, greenScheme } from 'style/theme';
import { isDiscountedFuture, isSafetyIncluded } from 'utils';
import { MBContext } from 'contexts/MBContext';
import DiscountedFutureSidebar from './DiscountedFutureSidebar';
import SafeExperiencesPitch from 'UI/SafeExperiencesPitch';
import PriceBlock from 'UI/PriceBlock';
import Conditional from './common/Conditional';
import Chevron from 'UI/Chevron';

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
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.productCards.padding.mobile};
    margin: 0
      ${({ theme: { theme } }) => (theme === THEMES.DEFAULT ? '16px' : '24px')};
    grid-template-areas: ${({ layout }) =>
      layout.mobile.map((row) => `'${row}'`)};
    width: auto;
    grid-template-columns: auto;
    .more-details {
      margin-top: 0;
      margin-left: 0;
      margin-bottom: 0;
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
  grid-area: title;
  font-weight: ${SOLEIL.MEDIUM};
  margin: 0;
  max-width: 768px;
  ${({ theme }) => theme.productCards.titleFontSettings.desktop};
  @media (max-width: 768px) {
    ${({ theme }) => theme.productCards.titleFontSettings.mobile};
  }
`;

const TourTags = styled.div`
  grid-area: tags;
  font-size: 14px;
  margin-top: -8px;
  font-weight: ${SOLEIL.MEDIUM};
  display: grid;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  margin-bottom: -8px;
  color: ${COLORS.GREY_G3};
  .tour-tag {
    display: grid;
    margin-bottom: 8px;
    grid-auto-flow: column;
    grid-column-gap: 8px;
    margin-right: 8px;
    font-size: 14px;
    line-height: 20px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    font-size: 12px;
    line-height: 13px;
    .tour-tag {
      margin-bottom: 8px;
    }
  }
`;

const CTAContainer = styled.div`
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
    margin-top: 8px;
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
  .tour-description {
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
    ${({ collapsed }) =>
      collapsed
        ? `
    *:nth-child(n + 4),
    ul li:nth-child(n + 3) {
      display: none;
    }
    `
        : ''}
    ul {
      padding: 0;
      padding-left: 1.2em;
      display: grid;
      grid-gap: 12px;
    }
  }
  @media (max-width: 768px) {
    .tour-description {
      ${({ theme }) => theme.productCards.regularFontSettings.mobile}
    }
    ${({ collapsed }) =>
      collapsed
        ? `
        p:nth-child(1) {
          display: none;
        }
        strong {
          margin-top: 0 !important;
        }
        ul {
          li:nth-child(n + 2) {
            display: none;
          }
        }
    `
        : ''}
  }
`;

const NextAvailableBlock = styled.div`
  font-size: 14px;
  margin-top: 16px;
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
  @media (max-width: 768px) {
  }
`;
const ProductOfferBlock = styled.div`
  grid-area: offer;
  font-size: 15px;
  line-height: 15px;
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${SOLEIL.MEDIUM};
  cursor: pointer;
  color: ${({ theme: { primaryAccent } }) =>
    primaryAccent ? primaryAccent : COLORS.MED_SLATE_BLUE};
  p {
    margin: 0;
    color: ${({ theme: { primaryAccent } }) =>
      primaryAccent ? primaryAccent : COLORS.MED_SLATE_BLUE};
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
    ${StlyedSplit} {
      padding-left: 12px;
      grid-template-columns: auto auto 8px;
      grid-column-gap: 30px;
    }
  }
`;

const Product = (props) => {
  const moreDetailsRef = useRef();
  const {
    analytics,
    tgid,
    position,
    currentLanguage,
    togglePopup,
    defaultOpen,
  } = props;
  const {
    title,
    descriptors,
    highlights,
    tourPrices,
    uid,
    hasOffer: isOfferEnabled,
    productOffer,
    offerId,
    isMobile,
    isFetched,
    scorpioData,
    host,
    earliestAvailability,
    ctaUrlSuffix,
    isScratchPriceEnabled,
    booster,
  } = props;

  const { mbTheme } = useContext(MBContext);
  const [isContentOpen, toggleContentOpen] = useState(
    defaultOpen && mbTheme === THEMES.MIN_BLUE
  );

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
    if (date === today) return labels[currentLanguage].TODAY;
    if (date === tomorrow) return labels[currentLanguage].TOMORROW;
    return dayjs(date).locale(currentLanguage).format('MMM Do');
  };

  const boosterHasIcon = booster?.filter((i) => i.type === 'image').length > 0;
  const descriptorsCsv = descriptors || scorpioData.descriptors;
  const cardTitle = title || scorpioData.title;
  const descriptorsList = descriptorsCsv
    ? descriptorsCsv.match(/(("|').*?("|')|[^",]+)(?=\s*,|\s*$)/g)
    : [];
  let url = host || window.location.host;
  const isDev = url.includes('localhost');
  const currentHost = !isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage.', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');
  const showScratchPrice = isFetched && isScratchPriceEnabled;
  const isHighlightsFromPrismic =
    isLengthyArray(highlights) && highlights.filter((item) => item.text).length;
  const {
    sidebarModal: { addToAside },
  } = useContext(MBContext);
  const { listingPrice } = isFetched
    ? tourPrices[tgid]
    : { listingPrice: null };
  const { allTags, dfListingPrice } = scorpioData;
  if (isFetched && !listingPrice && !dfListingPrice) return null;
  const hasSafetyFlag = isSafetyIncluded(allTags);
  const isDFProduct =
    isFetched && isDiscountedFuture(allTags) && dfListingPrice;
  const isDFOnlyProduct =
    isFetched && listingPrice === null && dfListingPrice !== null;
  const openDFSidebar = () => {
    addToAside({
      width: '27.5vw',
      title: cardTitle,
      children: <DiscountedFutureSidebar product={tourPrices[tgid]} />,
    });
  };
  const finalPrice = listingPrice || dfListingPrice;
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

  const layout = {
    desktop: [
      'title cta-combo',
      mbTheme === THEMES.DEFAULT && 'tags cta-combo',
      (hasSafetyFlag || isDFProduct) && 'icon-booster cta-combo',
      hasOffer && 'offer cta-combo',
      hasV1Booster && 'booster cta-combo',
      'line line',
      mbTheme === THEMES.MIN_BLUE && 'tags tags',
      'body body',
    ].filter((row) => row),
    mobile: [
      'title',
      'tags',
      'price-block',
      (hasSafetyFlag || isDFProduct) && 'icon-booster',
      hasOffer && 'offer',
      hasV1Booster && 'booster ',
      'body',
      'cta-block',
    ].filter((row) => row),
  };

  const getMoreDetailsButton = () => {
    const innerContent =
      mbTheme === THEMES.DEFAULT ? (
        ` ${
          isContentOpen
            ? '- ' + labels[currentLanguage].SHOW_LESS_TEXT
            : '+ ' + labels[currentLanguage].MORE_DETAILS
        }`
      ) : (
        <>
          {isContentOpen
            ? labels[currentLanguage].SHOW_LESS_TEXT
            : labels[currentLanguage].MORE_DETAILS}{' '}
          <Chevron isActive={isContentOpen} className={'chevron'} />{' '}
        </>
      );
    return (
      <div
        ref={moreDetailsRef}
        data-open="0"
        onClick={() => toggleContentOpen(!isContentOpen)}
        className="more-details"
        onKeyDown={() => toggleContentOpen(!isContentOpen)}
        role="button"
        tabIndex={0}
      >
        {innerContent}
      </div>
    );
  };

  return (
    <Container>
      <StyledProductCard layout={layout}>
        <ProductHeader>
          <TourTitle>{cardTitle}</TourTitle>
          <TourTags>
            {descriptorsList.reduce((acc, item, index) => {
              const descriptor = item.trim();
              if (descriptor) {
                acc.push(
                  <div key={index} className="tour-tag">
                    {index !== 0 && <div className="bullet">•</div>}
                    {descriptor.replace(/['"]+/g, '')}
                  </div>
                );
              }
              return acc;
            }, [])}
          </TourTags>
          <Conditional if={hasSafetyFlag || isDFProduct}>
            <IconBoosters>
              <Split count={2} autoWidth={true}>
                {hasSafetyFlag ? (
                  <IconCTA
                    text={labels[currentLanguage].SAFE_EXPERIENCE.FLAG_TEXT}
                    colorScheme={greenScheme}
                    ctaOnClick={openSafeSidebar}
                    icon={Shield}
                  />
                ) : null}
                {isDFProduct ? (
                  <IconCTA
                    text={labels[currentLanguage].DISCOUNTED_FUTURES.FLAG_TEXT}
                    colorScheme={brownScheme}
                    ctaOnClick={openDFSidebar}
                    icon={BrownTicket}
                  />
                ) : null}
              </Split>
            </IconBoosters>
          </Conditional>
          {hasV1Booster ? (
            <V1BoosterBlock boosterHasIcon={boosterHasIcon}>
              <RichText render={booster} htmlSerializer={shortCodeSerializer} />
            </V1BoosterBlock>
          ) : null}

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
              isSticky={isContentOpen}
              shouldOffset={earliestAvailability}
            >
              <a
                target={isFetched && isMobile ? null : '_blank'}
                href={`http://book.${bookingUrl}${
                  currentLanguage === 'en' ? '' : `/${currentLanguage}`
                }/book/${tgid}${ctaUrlSuffix}${
                  isDFOnlyProduct ? '?isDiscountedFutures=true' : ''
                }`}
              >
                <Button
                  className={`tour-book-now-cta`}
                  paddingSides={isMobile ? '16px' : '8px'}
                  type="fill"
                  onClick={(e) => {
                    sendBookNowEvent();
                    if (isDFProduct && !isDFOnlyProduct) {
                      e.preventDefault();
                      e.stopPropagation();
                      openDFSidebar();
                      return false;
                    }
                  }}
                  onKeyDown={sendBookNowEvent}
                  role="button"
                  tabIndex={0}
                >
                  {isDFOnlyProduct
                    ? labels[currentLanguage].DISCOUNTED_FUTURES.FLAG_TEXT
                    : labels[currentLanguage].BOOK_NOW_CTA}
                  {mbTheme === THEMES.MIN_BLUE ? BackArrow : null}
                </Button>
              </a>
              {earliestAvailability && (
                <NextAvailableBlock>
                  <div className="icon">{CALENDAR}</div>
                  <div className="available-text">
                    {`${labels[currentLanguage].NEXT_AVAILABLE}`}
                    {getDate(earliestAvailability, currentLanguage)}
                  </div>
                </NextAvailableBlock>
              )}
            </CTABlock>
          </CTAContainer>
        </ProductHeader>
        {!isMobile && <HorizontalLine color={COLORS.GREY_G6} />}
        <ProductBody collapsed={!isContentOpen}>
          <div className="tour-description">
            {isHighlightsFromPrismic ? (
              <RichText
                render={highlights}
                htmlSerializer={shortCodeSerializer}
              />
            ) : (
              <ReactMarkdown
                source={scorpioData.highlights}
                escapeHtml={false}
              />
            )}
          </div>
          {getMoreDetailsButton()}
        </ProductBody>
      </StyledProductCard>
    </Container>
  );
};

export default Product;
