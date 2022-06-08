import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import LocalisedPrice from 'UI/LPrice';
import { STAR } from 'assets/SvgIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CURRENCY_SYMBOL_MAP,
  NEW_ARRIVALS_CATEGORIES,
  REOPENING_CATEGORIES,
} from 'const/index';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { truncate, checkLTT } from 'utils/helper';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { dateToString } from 'utils/dateUtils';
import InteractionContext from 'contexts/Interaction';
import { convertUidToUrl } from 'utils/urlUtils';
import { createBookingURL } from 'utils';
import parse from 'url-parse';
import { expandFontToken } from 'const/typography';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { useRecoilValue } from 'recoil';
import { hsidAtom } from 'store/atoms/hsid';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';
import { trackEvent } from 'utils/analytics';

const ProductCard = styled.div`
  width: 100%;
  height: 100%;
  max-width: 100%;
  cursor: pointer;
  display: grid;
  grid-template-rows: 176px auto;
  grid-row-gap: 8px;
  transform: translate3d(0, 0, 0);
  transition: ease 0.2s;

  &:hover {
    transform: translate3d(0, -5px, 0);
  }

  .product-v2-title {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Heading/Product Card')}
  }

  .reopening {
    margin-top: 4px;
    color: ${COLORS.TEXT.BEACH};
    ${expandFontToken('UI/Label Small')}
  }

  .product-v2-image {
    display: block;
    position: relative;
  }

  .overlay-booster {
    position: absolute;
    top: 8px;
    left: 0;
    background: ${COLORS.PRIMARY.OCEAN_BLUE};
    border-radius: 0 2px 2px 0;
    color: #fff;
    line-height: 1;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 800;
    padding: 5px 12px;
    ${({ theme }) => theme.productCards.overlayBoosterStyles}
  }

  .product-v2-bottom-left {
    display: grid;
    grid-gap: ${({ isEntertainmentMb }) => (isEntertainmentMb ? '0' : '4px')};
    height: max-content;
    ${({ isEntertainmentMb }) => isEntertainmentMb && `margin-top: 12px;`}
  }

  .product-v2-bottom {
    display: grid;
    align-items: baseline;
    justify-content: space-between;
    grid-template-columns: 1fr auto;
    grid-gap: ${({ isEntertainmentMb }) => (isEntertainmentMb ? '0;' : '8px')};
    height: max-content;
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb &&
      `grid-template-columns: 1fr;
    `}
  }

  .product-v2-bottom-right {
    display: grid;
    grid-row-gap: 8px;
    align-self: end;
  }

  .product-v2-price {
    ${expandFontToken('Subheading/Large')}
    text-align: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'left' : 'right'};

    ${({ isEntertainmentMb }) =>
      isEntertainmentMb &&
      `grid-row: 2;
      display: flex;
    align-items: center;`}
    span {
      color: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? COLORS.GRAY.G3 : COLORS.GRAY.G1};
    }

    .mr-4 {
      margin-right: 4px;
    }

    .discount {
      background-color: ${COLORS.BACKGROUND.SOOTHING_GREEN};
      color: ${COLORS.TEXT.OKAY_GREEN_3};
      padding: 2px 4px;
      border-radius: 2px;
      margin-left: 6px;
      ${expandFontToken('UI/Label XS')}
    }
  }

  .product-v2-scratch-price {
    ${expandFontToken('UI/Label Small')}
    text-align: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'left' : 'right'};
    text-decoration-line: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'unset' : 'line-through'};

    span {
      color: ${COLORS.GRAY.G4};
    }
  }

  .vendor-name {
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 500;
    text-transform: uppercase;
    font-size: 11px;
    line-height: 11px;
    letter-spacing: 0.5px;
    color: ${COLORS.GRAY.G4};
  }

  .l1-booster-wrapper {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    justify-content: space-between;
    ${expandFontToken('UI/Label Small')}
    margin-bottom: 2px;
  }

  .l1-booster-wrapper * {
    color: ${COLORS.GRAY.G4};
  }

  .rating {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    column-gap: 4px;
    font-size: 14px;
  }

  .avg-rating {
    color: ${COLORS.PRIMARY.JOY_MUSTARD};
  }

  .avg-rating svg {
    width: 10.52px;
    height: 10px;
  }

  @media (max-width: 768px) {
    grid-template-rows: 102px auto;
    transform: unset;
    transition: unset;
    ${({ isEntertainmentMb }) => isEntertainmentMb && 'grid-row-gap: 10px;'}
    &:hover {
      transform: unset;
    }

    .overlay-booster {
      padding: 4px 6px;
    }

    .product-v2-title {
      ${expandFontToken('Heading/XS')}
    }

    .product-v2-bottom {
      grid-template-columns: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '1fr' : 'auto'};
      grid-gap: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '0;' : '12px'};
    }

    .product-v2-bottom-left {
      width: 100%;
    }

    .title-wrap {
      grid-column: 1 / 2;
    }

    .product-v2-bottom-right {
      width: 100%;
      display: grid;
      grid-gap: 4px;
      grid-template-columns: auto auto;
      justify-content: left;
      align-items: center;
    }

    .product-v2-price {
      text-align: left;
      ${expandFontToken('Subheading/Regular')}
    }

    .product-v2-scratch-price {
      text-align: left;
      ${expandFontToken('UI/Label XS')}
    }

    .l1-booster-wrapper {
      ${expandFontToken('UI/Label XS')}
    }

    .avg-rating svg {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `width:8px;height: 8px;`}
    }

    .reopening {
      ${expandFontToken('UI/Label XS')}
    }
  }

  .product-v2-image img {
    height: auto;
    max-width: 100%;
    max-height: 100%;
    display: block;
    width: 100%;
    object-fit: cover;
    border-radius: 4px;
    font-family: ${HALYARD.FONT_STACK};
    background: #ebebeb;
    font-weight: 600;
    color: #bababa;
    position: relative;
    line-height: 1.4;
  }

  .product-v2-image img::after {
    content: ' ' attr(alt);
    position: absolute;
    height: calc(100% - 4px);
    width: calc(100% - 10px);
    background: #dadada;
    left: 0px;
    top: 0px;
    padding-top: 4px;
    padding-left: 10px;
    font-size: 14px;
    text-transform: capitalize;
  }

  a {
    text-decoration: none;
  }

  .product-v2-boosters p {
    margin: 0;
  }

  .product-v2-boosters,
  .product-v2-boosters p {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 12px;
    line-height: 12px;
  }

  .product-v2-boosters .inline-availability {
    color: ${({ theme: { cardAccent } }) =>
      cardAccent ? cardAccent : COLORS.GRAY.G2};
  }

  @media (max-width: 768px) {
    .product-v2-image img {
      height: 102px;
      border-radius: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '4px' : '2px'};
    }

    .product-v2-boosters {
      font-size: 12px;
    }
  }
`;

const Product = (props) => {
  const {
    allTours,
    tgid,
    cardIdPrefix,
    isMobile,
    isEntertainmentMb,
    productClick,
    activeCategoryId = null,
    host,
  } = props;
  const { currencySymbolMap, lang, nakedDomain, uid } = useContext(MBContext);
  const [initialized, setInitialized] = useState(true);
  const hsid = useRecoilValue(hsidAtom);
  const isLTT = checkLTT(uid);

  let url;
  useEffect(() => {
    url = host || window.location.hostname;
  }, []);

  useEffect(() => {
    if (hsid && isLTT) {
      const variant = getABTestingVariant(
        EXPERIMENT_NAMES.LTD_LP_Experiment,
        hsid,
        false,
        true
      );
      if (variant === VARIANTS.SHOWPAGE_REDIRECT) {
        setInitialized(false);
      }
    }
  }, [hsid, setInitialized, isLTT]);

  const { sliceData } = useContext(InteractionContext) || {};
  const { collectionId, primaryCatId, primarySubCatId } = sliceData || {};
  if (!allTours[tgid]) return null;
  const { listingPrice, ...tour } = allTours[tgid] || {};
  const {
    productImage,
    title,
    overlayBooster,
    vendor,
    cardFooter,
    category,
    reopeningDate,
    averageRating,
    reviewCount,
    showPageUid = null,
  } = tour || {};

  const { collectionName, primaryCategoryName, primarySubCategoryName } =
    category || {};
  let categoryName = '';

  if (isEntertainmentMb) {
    categoryName = primarySubCategoryName;
  } else {
    if (collectionId) {
      if (primaryCatId) {
        categoryName = primaryCategoryName;
      } else if (primarySubCatId) {
        categoryName = primarySubCategoryName;
      } else {
        categoryName = collectionName;
      }
    } else if (primaryCatId) {
      if (primarySubCatId) {
        categoryName = primarySubCategoryName;
      } else {
        categoryName = primaryCategoryName;
      }
    } else {
      categoryName = primarySubCategoryName;
    }
  }

  const isDev = url?.includes('localhost');
  const currentHost = !isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost?.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  let hostSplit = hostName?.split('.');
  hostSplit?.shift();

  const bookingURL = createBookingURL({
    nakedDomain,
    lang,
    tgid,
  });
  const showPageUrl = showPageUid
    ? convertUidToUrl({ uid: showPageUid, isDev, hostname: host })
    : bookingURL;

  const {
    finalPrice: price,
    originalPrice: scratchPrice,
    currencyCode,
    bestDiscount,
  } = listingPrice || {};
  const currencySymbol =
    currencySymbolMap[currencyCode]?.localSymbol ||
    CURRENCY_SYMBOL_MAP[currencyCode];

  const handleProductClick = (event) => {
    productClick(tgid, cardIdPrefix, event);
  };

  const isNew = NEW_ARRIVALS_CATEGORIES.includes(activeCategoryId);

  const openingDate = dateToString(reopeningDate, lang, 'DD MMM, YYYY');

  let OPENING_ON = '';
  if (openingDate === strings.TODAY || openingDate === strings.TOMORROW) {
    OPENING_ON = REOPENING_CATEGORIES.includes(activeCategoryId)
      ? strings.REOPENS
      : strings.OPENS;
  } else {
    OPENING_ON = REOPENING_CATEGORIES.includes(activeCategoryId)
      ? strings.REOPENING_ON
      : strings.OPENING_ON;
  }

  const isBeforeToday = new Date().getTime() > new Date(openingDate)?.getTime();
  const hasScratchPrice = scratchPrice > price;
  const cardComponent = (
    <ProductCard
      onClick={initialized && handleProductClick}
      className="product-v2"
      id={`${cardIdPrefix}-${tgid}`}
      onKeyDown={initialized && handleProductClick}
      role="button"
      tabIndex={0}
      isEntertainmentMb={isEntertainmentMb}
    >
      <div className="product-v2-image">
        <Image
          url={productImage}
          format="pjpg"
          width={400}
          imageId={tgid}
          height={250}
          alt={title}
        />
        <Conditional if={overlayBooster}>
          <div className="overlay-booster">{overlayBooster}</div>
        </Conditional>
      </div>
      <div className="product-v2-bottom">
        <Conditional if={vendor?.length && isMobile}>
          <div className="vendor-name">{vendor}</div>
        </Conditional>
        <Conditional if={isEntertainmentMb}>
          <div className="l1-booster-wrapper">
            <div className="l1-booster">{categoryName}</div>
            <div className="rating">
              <Conditional if={isNew}>
                <span className="avg-rating">{strings.NEW}</span>
              </Conditional>
              <Conditional if={!isNew && averageRating}>
                <span className="avg-rating">
                  {averageRating} {STAR(COLORS.JOY_MUSTARD)}
                </span>
              </Conditional>
              <Conditional if={!isNew && reviewCount}>
                <span className="total-rating">
                  (
                  {reviewCount > 999
                    ? `${(reviewCount / 1000).toFixed(1)}k`
                    : reviewCount}
                  )
                </span>
              </Conditional>
            </div>
          </div>
        </Conditional>
        <div className="title-wrap">
          <div className="product-v2-title">{truncate(title, 70)}</div>
          <Conditional
            if={
              isEntertainmentMb &&
              !isBeforeToday &&
              openingDate !== 'Invalid Date'
            }
          >
            <div className="reopening">
              {OPENING_ON} {openingDate}
            </div>
          </Conditional>
        </div>
        <div className="product-v2-bottom-left">
          <div className="product-v2-price">
            <Conditional if={isEntertainmentMb && !hasScratchPrice}>
              <span className="mr-4">{strings.FROM}</span>
            </Conditional>
            <LocalisedPrice
              price={price}
              currencySymbol={currencySymbol}
              lang={lang}
            />
            <Conditional
              if={isEntertainmentMb && hasScratchPrice && bestDiscount}
            >
              <span className="discount">
                {bestDiscount}% {strings.OFF}
              </span>
            </Conditional>
          </div>
          <Conditional if={hasScratchPrice}>
            <div className="product-v2-scratch-price">
              <Conditional if={isEntertainmentMb}>
                <span>{strings.FROM} </span>
              </Conditional>
              <LocalisedPrice
                price={scratchPrice}
                currencySymbol={currencySymbol}
                lang={lang}
              />
            </div>
          </Conditional>
        </div>
        <Conditional if={cardFooter?.length && !isEntertainmentMb}>
          <div className="product-v2-bottom-right">
            <div className="product-v2-boosters" data-cont={cardFooter?.length}>
              <RichText
                render={cardFooter}
                htmlSerializer={(...defaultArgs: any) =>
                  shortCodeSerializerWithParentProps(defaultArgs, tour)
                }
              />
            </div>
          </div>
        </Conditional>
      </div>
    </ProductCard>
  );
  const primaryCategory = allTours[tgid]?.primaryCategory;
  const showPageEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_EXPANDED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primaryCategory?.displayName,
    });
  };
  const showPageExists = !showPageUrl.includes('/book');
  const MWebEntertainmentMbProductWrapper = ({ children }) =>
    initialized || !showPageExists ? (
      <div role="button" tabIndex={0} onClick={showPageEvent}>
        {children}
      </div>
    ) : (
      <a
        target="_self"
        rel="noopener noreferrer"
        href={showPageUrl}
        onClick={showPageEvent}
      >
        {children}
      </a>
    );

  return (
    <>
      <Conditional if={!isMobile || !isEntertainmentMb}>
        <Conditional if={initialized}>{cardComponent}</Conditional>
        <Conditional if={!initialized}>
          <a
            href={showPageUrl}
            target="_self"
            rel="noopener noreferrer"
            onClick={showPageEvent}
          >
            {cardComponent}
          </a>
        </Conditional>
      </Conditional>

      <Conditional if={isMobile && isEntertainmentMb}>
        <MWebEntertainmentMbProductWrapper>
          <ProductCard
            className="product-v2"
            id={`${cardIdPrefix}-${tgid}`}
            role="button"
            tabIndex={0}
            onClick={(initialized || !showPageExists) && handleProductClick}
            onKeyDown={(initialized || !showPageExists) && handleProductClick}
            isEntertainmentMb={isEntertainmentMb}
          >
            <div className="product-v2-image">
              <Image
                url={productImage}
                format="pjpg"
                width={400}
                imageId={tgid}
                height={250}
                alt={title}
              />
              <Conditional if={overlayBooster}>
                <div className="overlay-booster">{overlayBooster}</div>
              </Conditional>
            </div>
            <div className="product-v2-bottom">
              <Conditional if={vendor?.length && isMobile}>
                <div className="vendor-name">{vendor}</div>
              </Conditional>
              <Conditional if={isEntertainmentMb}>
                <div className="l1-booster-wrapper">
                  <div className="l1-booster">{categoryName}</div>
                  <div className="rating">
                    <Conditional if={isNew}>
                      <span className="avg-rating">{strings.NEW}</span>
                    </Conditional>
                    <Conditional if={!isNew && averageRating}>
                      <span className="avg-rating">
                        {averageRating} {STAR(COLORS.PRIMARY.JOY_MUSTARD)}
                      </span>
                    </Conditional>
                    <Conditional if={!isNew && reviewCount}>
                      <span className="total-rating">
                        (
                        {reviewCount > 999
                          ? `${(reviewCount / 1000).toFixed(1)}k`
                          : reviewCount}
                        )
                      </span>
                    </Conditional>
                  </div>
                </div>
              </Conditional>
              <div className="title-wrap">
                <div className="product-v2-title">{truncate(title, 70)}</div>
                <Conditional
                  if={
                    isEntertainmentMb &&
                    !isBeforeToday &&
                    openingDate !== 'Invalid Date'
                  }
                >
                  <div className="reopening">
                    {OPENING_ON} {openingDate}
                  </div>
                </Conditional>
              </div>
              <div className="product-v2-bottom-left">
                <div className="product-v2-price">
                  <Conditional if={isEntertainmentMb && !hasScratchPrice}>
                    <span className="mr-4">{strings.FROM}</span>
                  </Conditional>
                  <LocalisedPrice
                    price={price}
                    currencySymbol={currencySymbol}
                    lang={lang}
                  />
                  <Conditional
                    if={isEntertainmentMb && hasScratchPrice && bestDiscount}
                  >
                    <span className="discount">
                      {bestDiscount}% {strings.OFF}
                    </span>
                  </Conditional>
                </div>
                <Conditional if={hasScratchPrice}>
                  <div className="product-v2-scratch-price">
                    <Conditional if={isEntertainmentMb}>
                      <span>{strings.FROM} </span>
                    </Conditional>
                    <LocalisedPrice
                      price={scratchPrice}
                      currencySymbol={currencySymbol}
                      lang={lang}
                    />
                  </div>
                </Conditional>
              </div>
              <Conditional if={cardFooter?.length && !isEntertainmentMb}>
                <div className="product-v2-bottom-right">
                  <div
                    className="product-v2-boosters"
                    data-cont={cardFooter?.length}
                  >
                    <RichText
                      render={cardFooter}
                      htmlSerializer={(...defaultArgs: any) =>
                        shortCodeSerializerWithParentProps(defaultArgs, tour)
                      }
                    />
                  </div>
                </div>
              </Conditional>
            </div>
          </ProductCard>
        </MWebEntertainmentMbProductWrapper>
      </Conditional>
    </>
  );
};

Product.defaultProps = {
  productClick: () => {},
};

export default Product;
