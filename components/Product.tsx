import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import parse from 'url-parse';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown/with-html';
import * as labels from 'constants/localization/labels';
import LocalisedPrice from 'UI/LPrice';
import HorizontalLine from './slices/HorizontalLine';
import Button from 'UI/Button';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from 'utils/shortCodes';
import { ANALYTICS_EVENTS } from 'constants/index';
import { COLORS, SOLEIL } from 'constants/ui-constants';
import { CALENDAR } from 'assets/SvgIcons';
import 'utils/dayjsLocale';

const isLengthyArray = (item) => Array.isArray(item) && item.length;

const StyledProductCard = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  padding: 32px 24px;
  border: 1px solid ${COLORS.GREY_G6};
  border-radius: 4px;
  display: grid;
  grid-row-gap: 24px;
  .more-details {
    font-weight: ${SOLEIL.MEDIUM};
    font-size: 14px;
    line-height: 15px;
    color: ${COLORS.MED_SLATE_BLUE};
    margin-left: 1em;
    margin-top: 16px;
    cursor: pointer;
    outline: none;
  }
  @media (max-width: 768px) {
    grid-row-gap: 16px;
    padding: 24px 16px;
    .more-details {
      margin-top: 0;
      margin-left: 0;
      margin-bottom: 0;
    }
  }
`;
const ProductHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  .header-left,
  .header-right {
    display: grid;
    align-content: start;
    grid-gap: 16px;
  }
  .tour-title {
    font-size: 24px;
    line-height: 32px;
    font-weight: ${SOLEIL.MEDIUM};
    margin: 0;
  }
  .tour-tags {
    font-size: 14px;
    font-weight: ${SOLEIL.MEDIUM};
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-content: left;
    grid-column-gap: 8px;
    color: ${COLORS.GREY_G3};
  }
  @media (max-width: 768px) {
    grid-template-columns: auto;
    display: contents;
    .tour-title {
      font-size: 18px;
      line-height: 24px;
    }
    .header-left,
    .header-right {
      display: contents;
    }
    .tour-tags {
      display: flex;
      flex-wrap: wrap;
      align-items: start;
      font-size: 12px;
      line-height: 13px;
      margin-bottom: -8px;
      .tour-tag,
      .bullet {
        margin-right: 8px;
      }
      .tour-tag {
        margin-bottom: 8px;
      }
    }
  }
`;

const PriceBlock = styled.div`
  justify-self: center;
  display: grid;
  justify-items: left;
  grid-row-gap: 4px;
  .tour-scratch-price {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 4px;
    font-weight: ${SOLEIL.REGULAR};
    color: ${COLORS.GREY_G4};
    font-size: 11px;
    line-height: 12px;
    span {
      text-decoration: line-through;
      display: block;
    }
  }
  .tour-price {
    font-size: 25px;
    line-height: 32px;
    display: flex;
    font-weight: ${SOLEIL.MEDIUM};
    color: ${COLORS.FOUR_BLACK};
  }
  @media (max-width: 768px) {
    justify-self: left;
    .tour-scratch-price {
      font-size: 11px;
      line-height: 12px;
    }
    .tour-price {
      font-size: 20px;
      line-height: 24px;
    }
  }
`;
const CTABlock = styled.div`
  a {
    text-decoration: none;
  }
  .tour-book-now-cta {
    width: 100%;
  }
  @media (max-width: 768px) {
    grid-row: ${({ showEarliestAvail, hasOffer }) =>
      showEarliestAvail || hasOffer ? 6 : 5};
    grid-row: ${({ showEarliestAvail, hasOffer }) =>
      showEarliestAvail && hasOffer ? 7 : 6};
    .tour-book-now-cta {
      justify-content: center;
    }
  }
`;

const ProductBody = styled.div`
  display: grid;
  .tour-description {
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    line-height: 24px;
    font-weight: ${SOLEIL.REGULAR};
    color: ${COLORS.FOUR_BLACK};
    opacity: 0.99;
    display: grid;
    grid-gap: 12px;
    ul {
      padding: 0;
      padding-left: 1em;
      display: grid;
      grid-gap: 12px;
      ${({ collapsed }) =>
        collapsed
          ? `
      li:nth-of-type(n + 3) {
        display: none;
      }
      `
          : ''}
    }
    p {
      margin: 0;
      font-weight: ${SOLEIL.MEDIUM};
    }
  }
  @media (max-width: 768px) {
    display: contents;
    .tour-description {
      p {
        display: none;
      }
    }
    ul {
      ${({ collapsed }) =>
        collapsed
          ? `
      li:nth-of-type(n + 2) {
        display: none;
      }
      `
          : ''}
    }
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
  @media (max-width: 768px) {
    grid-row: 8;
  }
`;
const ProductOfferBlock = styled.div`
  font-size: 15px;
  line-height: 15px;
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${SOLEIL.MEDIUM};
  cursor: pointer;
  color: ${COLORS.MED_SLATE_BLUE};
  p {
    margin: 0;
    color: ${COLORS.MED_SLATE_BLUE};
  }
`;
const V1BoosterBlock = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: 400;
  line-height: 1.31;
  text-align: left;
  color: ${COLORS.CORAL};
  margin: 0.8em 0;
  font-size: 1em;
  display: inline-block;

  p {
    margin: 0;
    color: ${COLORS.MED_SLATE_BLUE};
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
const Product = (props) => {
  const moreDetailsRef = useRef();
  const { analytics, tgid, position, currentLanguage, togglePopup } = props;
  const {
    title,
    descriptors,
    highlights,
    tourPrices,
    uid,
    currencySymbol,
    hasOffer,
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

  const [isContentOpen, toggleContentOpen] = useState(false);

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
  if (isFetched && !tourPrices[tgid]?.price) return null;

  return (
    <StyledProductCard>
      <ProductHeader>
        <div className="header-left">
          <h2 className="tour-title">{cardTitle}</h2>
          <div className="tour-tags">
            {descriptorsList.reduce((acc, item, index) => {
              const descriptor = item.trim();
              if (descriptor) {
                acc.push(
                  <>
                    {index !== 0 && <div className="bullet">•</div>}
                    <div key={index} className="tour-tag">
                      {descriptor.replace(/['"]+/g, '')}
                    </div>
                  </>
                );
              }
              return acc;
            }, [])}
          </div>
          {booster && RichText.asText(booster).trim().length > 0 ? (
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
        </div>
        <div className="header-right">
          <PriceBlock>
            {showScratchPrice &&
            tourPrices[tgid].scratchPrice > tourPrices[tgid].price ? (
              <div className="tour-scratch-price">
                <div>{labels[currentLanguage].FROM}</div>
                <LocalisedPrice
                  price={tourPrices[tgid].scratchPrice}
                  currencySymbol={currencySymbol}
                  lang={currentLanguage}
                />
              </div>
            ) : null}
            {isFetched ? (
              <div className="tour-price">
                <LocalisedPrice
                  price={tourPrices[tgid].price}
                  currencySymbol={currencySymbol}
                  lang={currentLanguage}
                />
              </div>
            ) : null}
          </PriceBlock>
          <CTABlock
            showEarliestAvail={earliestAvailability}
            hasOffer={hasOffer}
          >
            <a
              target={isFetched && isMobile ? null : '_blank'}
              href={`http://book.${bookingUrl}${
                currentLanguage === 'en' ? '' : `/${currentLanguage}`
              }/book/${tgid}${ctaUrlSuffix}`}
            >
              <Button
                className={`tour-book-now-cta`}
                paddingSides="77px"
                type="fillGradient"
                onClick={sendBookNowEvent}
                onKeyDown={sendBookNowEvent}
                role="button"
                tabIndex={0}
              >
                {labels[currentLanguage].BOOK_NOW_CTA}
              </Button>
            </a>
          </CTABlock>

          {earliestAvailability && (
            <NextAvailableBlock>
              <div className="icon">{CALENDAR}</div>
              <div className="available-text">
                {`${labels[currentLanguage].AVAILABLE} `}
                {getDate(earliestAvailability, currentLanguage)}
              </div>
            </NextAvailableBlock>
          )}
        </div>
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
            <ReactMarkdown source={scorpioData.highlights} escapeHtml={false} />
          )}
        </div>
        <div
          ref={moreDetailsRef}
          data-open="0"
          onClick={() => toggleContentOpen(!isContentOpen)}
          className="more-details"
          onKeyDown={() => toggleContentOpen(!isContentOpen)}
          role="button"
          tabIndex={0}
        >
          {` ${
            isContentOpen
              ? '- ' + labels[currentLanguage].SHOW_LESS_TEXT
              : '+ ' + labels[currentLanguage].MORE_DETAILS
          }`}
        </div>
      </ProductBody>
    </StyledProductCard>
  );
};

export default Product;
