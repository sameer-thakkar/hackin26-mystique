import React, { useContext } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import Image from 'UI/Image';
import PriceBlock, { PriceSkeleton, StyledPriceBlock } from 'UI/PriceBlock';
import InteractionContext from 'contexts/Interaction';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { trackEvent } from 'utils/analytics';
import { dateToString } from 'utils/dateUtils';
import { checkIfLTTMB, truncate } from 'utils/helper';
import { parseDescriptors, shouldUseDynamicShowPage } from 'utils/productUtils';
import { convertUidToUrl, getFormattedUrlSlug } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import COLORS from 'const/colors';
import { descriptorIcons } from 'const/descriptorIcons';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CASHBACK_TYPES,
  LANGUAGE_MAP,
  REOPENING_CATEGORIES,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';
import { STAR } from 'assets/SvgIcons';

const ProductCard = styled.div<{
  $isV3Design?: boolean;
  singleCard?: boolean;
  categoryFontNameStyles?: string;
  productCardHeight?: number;
}>`
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
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)}
  }

  .reopening {
    margin-top: 4px;
    color: ${COLORS.TEXT.BEACH};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }

  .overlay-booster {
    position: absolute;
    top: 8px;
    left: 8px;
    border-radius: 2px;
    padding: 4px 6px 5px;
    background: ${COLORS.BRAND.WHITE};
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  }

  .product-v2-bottom-left {
    display: grid;
    grid-gap: 0;
    height: max-content;
    margin-top: 12px;
    .discount {
      ${expandFontToken('UI/Label Small (Heavy)')};
      color: ${COLORS.OCEAN_BLUE.TERTIARY};
    }
  }

  .product-v2-bottom {
    display: grid;
    align-items: baseline;
    justify-content: space-between;
    grid-template-columns: 1fr auto;
    grid-gap: 0;
    height: max-content;
    grid-template-columns: 1fr;
  }

  .product-v2-bottom-right {
    display: grid;
    grid-row-gap: 8px;
    align-self: end;
  }

  ${StyledPriceBlock} {
    grid-template-columns: auto;
  }

  ${PriceSkeleton} {
    &:before {
      content: unset;
    }
    &:after {
      height: 24px;
    }
  }

  .descriptors {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    display: flex;
    align-items: center;
    padding: 0.2rem 0;

    .descSvg {
      margin: 0.12rem 0.2rem 0 0;
    }
  }

  .tour-price {
    column-gap: 4px;
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
    text-align: left;

    grid-row: 2;
    display: flex;
    align-items: center;
    span {
      color: ${COLORS.GRAY.G3};
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
      ${expandFontToken(FONTS.UI_LABEL_XS)}
    }
  }

  .tour-scratch-price {
    grid-column: 1 / 2;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    text-align: left;
    text-decoration-line: unset;

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
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    margin-bottom: 0.25rem;
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
    .rating-number {
      margin-right: 0.125rem;
      color: ${COLORS.BRAND.CANDY};
    }
  }

  .avg-rating svg {
    position: relative;
    top: 0.063rem;
    width: 12px;
    height: 12px;
  }

  @media (max-width: 768px) {
    grid-template-rows: ${({ $isV3Design, productCardHeight, singleCard }) =>
        singleCard
          ? `${productCardHeight}px`
          : $isV3Design
          ? '204px'
          : '102px'} auto;
    transform: unset;
    transition: unset;
    grid-row-gap: 10px;

    &:hover {
      transform: unset;
    }

    .overlay-booster {
      padding: 3px 6px;
      ${expandFontToken(FONTS.UI_LABEL_XS)}
    }

    .product-v2-title {
      ${({ singleCard }) => {
        return singleCard
          ? `${expandFontToken(FONTS.HEADING_PRODUCT_CARD)}`
          : `${expandFontToken(FONTS.HEADING_XS)}`;
      }}
    }

    .product-v2-bottom {
      grid-template-columns: 1fr;
      grid-gap: 0;
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

    .tour-price {
      text-align: left;
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    }

    .tour-scratch-price {
      text-align: left;
      ${expandFontToken(FONTS.UI_LABEL_XS)}
    }

    .l1-booster-wrapper {
      ${({ singleCard }) => {
        return singleCard
          ? `${expandFontToken(FONTS.SUBHEADING_XS)}`
          : `${expandFontToken(FONTS.UI_LABEL_XS)}`;
      }}
    }

    .avg-rating svg {
      width: 12px;
      height: 12px;

      path {
        fill: ${COLORS.BRAND.CANDY};
        stroke: ${COLORS.BRAND.CANDY};
      }
    }

    .reopening {
      ${expandFontToken(FONTS.UI_LABEL_XS)}
    }
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
    .product-v2-boosters {
      font-size: 12px;
    }
  }
`;

const ProductImage = styled.div<{
  singleCard?: boolean;
  categoryFontNameStyles?: string;
  productCardHeight?: number;
}>`
  display: block;
  position: relative;

  img {
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

  img::after {
    content: ' ' attr(alt);
    position: relative;
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

  @media (max-width: 768px) {
    img {
      height: ${({ singleCard, productCardHeight }) => {
        return singleCard ? `${productCardHeight}px` : '102px';
      }};
      border-radius: 4px;
    }
  }
`;

const IMAGE_DIMENSIONS = {
  MOBILE: {
    V2: { WIDTH: '171', HEIGHT: '102' },
    V3: { WIDTH: '327', HEIGHT: '204' },
  },
  DESKTOP: {
    WIDTH: '282',
    HEIGHT: '176',
  },
};

const Product = (props: any) => {
  const {
    allTours,
    tgid,
    cardIdPrefix,
    isMobile,
    isEntertainmentMb,
    activeCategoryId = null,
    host,
    productClick,
    isV3Design,
    showPriceBlock = true,
    showSecondaryDescriptors = true,
    productCardStyles,
    isVenuePage,
    showPageUid: showPageUidForVenuePage,
  } = props;

  const currency = useRecoilValue(currencyAtom);
  const {
    lang,
    nakedDomain,
    redirectToHeadoutBookingFlow,
    isDev,
    uid,
  } = useContext(MBContext);

  // @ts-expect-error TS(2339): Property 'sliceData' does not exist on type '{}'.
  const { sliceData } = useContext(InteractionContext) || {};
  const { collectionId, primaryCatId, primarySubCatId } = sliceData || {};
  if (!allTours[tgid]) return null;

  const { listingPrice, flowType, ...tour } = allTours[tgid] || {};

  const {
    allTags,
    productImage,
    title,
    name,
    vendor,
    category,
    reopeningDate,
    averageRating,
    reviewCount,
    showPageUid = null,
    secondaryDescriptors = [],
    hasSpecialOffer,
    urlSlugs,
  } = tour || {};

  const { singleCard, productCardHeight } = productCardStyles ?? {};

  const isLTT = checkIfLTTMB(uid);
  const { originalPrice, finalPrice, cashbackType, cashbackValue } =
    listingPrice ?? {};
  const save = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);

  const { collectionName, primaryCategoryName, primarySubCategoryName } =
    category || {};
  let categoryName = '';

  const primaryCategory = allTours[tgid]?.primaryCategory;
  const primarySubCategory = allTours[tgid]?.primarySubCategory;
  const filteredDescriptors = parseDescriptors(secondaryDescriptors);

  if (isEntertainmentMb) {
    categoryName =
      allTours[tgid]?.primarySubCategory?.displayName || primarySubCategoryName;
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

  const bookingURL = createBookingURL({
    nakedDomain,
    lang,
    tgid,
    redirectToHeadoutBookingFlow,
    currency,
    flowType,
  });
  let showPageUrl = bookingURL;
  if (shouldUseDynamicShowPage()) {
    showPageUrl = getFormattedUrlSlug(urlSlugs, lang);
  } else if (showPageUid || isVenuePage) {
    showPageUrl = convertUidToUrl({
      uid: isVenuePage ? showPageUidForVenuePage : showPageUid,
      isDev,
      hostname: host,
      lang,
    });
  }

  const handleProductClick = (
    event:
      | React.KeyboardEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement | HTMLAnchorElement>
  ) => {
    event.preventDefault();
    if (isMobile) {
      if (isV3Design) {
        productClick(tgid, event);
      } else if (showPageExists) {
        window.open(showPageUrl, '_self', 'noopener,noreferrer');
      } else {
        window.open(bookingURL, '_self', 'noopener,noreferrer');
      }
    } else {
      if (isEntertainmentMb) {
        window.open(showPageUrl, '_blank');
      } else {
        productClick(tgid, event);
      }
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: activeCategoryId,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title ?? name,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      [ANALYTICS_PROPERTIES.DIV_TYPE]: 'Product List',
      [ANALYTICS_PROPERTIES.CASHBACK_SHOWN]:
        cashbackValue > 0 && cashbackType === CASHBACK_TYPES.PERCENTAGE,
      [ANALYTICS_PROPERTIES.DISCOUNT_SHOWN]: save > 0 ? 'Scratch Price' : null,
      [ANALYTICS_PROPERTIES.L1_BOOSTER_SHOWN]: getBooster(true),
    });
  };

  const isNewArrival = allTags.includes('NEWARRIVAL');

  const openingDate = dateToString(
    reopeningDate,
    LANGUAGE_MAP.en.code,
    'DD MMM, YYYY'
  );
  const localisedOpeningDate = dateToString(
    reopeningDate,
    lang,
    'DD MMM, YYYY'
  );

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

  const showPageEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_EXPANDED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title ?? name,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
    });
  };
  const showPageExists = !showPageUrl.includes('/book');
  const getBooster = (onlyBoosterText = false) => {
    if ((save > 0 || hasSpecialOffer) && isLTT) {
      if (onlyBoosterText) return strings.SHOW_PAGE.SPECIAL_OFFER;
      return (
        <div className="overlay-booster">
          <Emoji symbol="🤑" label="glowing-star" />{' '}
          {strings.SHOW_PAGE.SPECIAL_OFFER}
        </div>
      );
    } else if (isNewArrival) {
      if (onlyBoosterText) return 'NEW`';
      return (
        <div className="overlay-booster">
          <Emoji symbol="🌟" label="glowing-star" /> {strings.NEW}
        </div>
      );
    } else return null;
  };

  const { HEIGHT: cardImageHeight, WIDTH: cardImageWidth } = isMobile
    ? isV3Design
      ? IMAGE_DIMENSIONS.MOBILE.V3
      : IMAGE_DIMENSIONS.MOBILE.V2
    : IMAGE_DIMENSIONS.DESKTOP;

  const cardComponent = (
    <ProductCard
      onClick={handleProductClick}
      className="product-v2"
      id={`${cardIdPrefix}-${tgid}`}
      onKeyDown={handleProductClick}
      role="button"
      tabIndex={0}
      $isV3Design={isV3Design}
      singleCard={!!singleCard}
      productCardHeight={productCardHeight}
    >
      <ProductImage
        singleCard={!!singleCard}
        productCardHeight={productCardHeight}
      >
        <Image
          url={productImage}
          format="pjpg"
          imageId={tgid}
          alt={title ?? name}
          width={cardImageWidth}
          height={
            productCardStyles?.productCardHeight
              ? productCardStyles.productCardHeight
              : cardImageHeight
          }
        />
        {getBooster()}
      </ProductImage>
      <div className="product-v2-bottom">
        <Conditional if={vendor?.length && isMobile}>
          <div className="vendor-name">{vendor}</div>
        </Conditional>
        <div className="l1-booster-wrapper">
          <div className="l1-booster">{categoryName}</div>
          <div className="rating">
            <Conditional if={averageRating}>
              <span className="avg-rating">
                <span className="rating-number">
                  {averageRating?.toFixed?.(1)}
                </span>
                {STAR(COLORS.BRAND.CANDY)}
              </span>
            </Conditional>
            <Conditional if={reviewCount}>
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
        <div className="title-wrap">
          <Conditional if={!showPageExists}>
            <div className="product-v2-title">
              {truncate(title ?? name, 70)}
            </div>
          </Conditional>
          <Conditional if={showPageExists}>
            <a
              target="_self"
              rel="noopener noreferrer"
              href={showPageUrl}
              onClick={handleProductClick}
            >
              <div className="product-v2-title">
                {truncate(title ?? name, 70)}
              </div>
            </a>
          </Conditional>
          {!isLTT &&
            showSecondaryDescriptors &&
            filteredDescriptors.map((descriptor) => {
              const { code, name } = descriptor;
              if (name && code) {
                const DiscSvgElm = descriptorIcons[code];
                return (
                  <div key={name} className="descriptors">
                    <DiscSvgElm className="descSvg" />
                    <span>{name}</span>
                  </div>
                );
              }
              return null;
            })}
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
        <Conditional if={showPriceBlock}>
          <div className="product-v2-bottom-left">
            <PriceBlock
              prefix
              showCashback
              listingPrice={listingPrice}
              showSavings
              showScratchPrice
              lang={lang}
              save={save}
            />
          </div>
        </Conditional>
      </div>
    </ProductCard>
  );

  return (
    <>
      <Conditional if={!isMobile || !isEntertainmentMb}>
        {cardComponent}
      </Conditional>

      <Conditional if={isMobile && isEntertainmentMb}>
        <div role="button" tabIndex={0} onClick={handleProductClick}>
          <ProductCard
            className="product-v2"
            id={`${cardIdPrefix}-${tgid}`}
            role="button"
            tabIndex={0}
            $isV3Design={isV3Design}
            singleCard={!!singleCard}
            productCardHeight={productCardHeight}
          >
            <ProductImage
              singleCard={!!singleCard}
              productCardHeight={productCardHeight}
            >
              <Image
                url={productImage}
                format="pjpg"
                imageId={tgid}
                width={cardImageWidth}
                height={
                  productCardStyles?.productCardHeight
                    ? productCardStyles.productCardHeight
                    : cardImageHeight
                }
                alt={title ?? name}
              />
              {getBooster()}
            </ProductImage>
            <div className="product-v2-bottom">
              <Conditional if={vendor?.length && isMobile}>
                <div className="vendor-name">{vendor}</div>
              </Conditional>
              <div className="l1-booster-wrapper">
                <div className="l1-booster">{categoryName}</div>
                <div className="rating">
                  <Conditional if={averageRating}>
                    <span className="avg-rating">
                      <span className="rating-number">
                        {averageRating.toFixed?.(1)}
                      </span>
                      {STAR(COLORS.PRIMARY.JOY_MUSTARD)}
                    </span>
                  </Conditional>
                  <Conditional if={reviewCount}>
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
              <div className="title-wrap">
                <a
                  target="_self"
                  rel="noopener noreferrer"
                  href={showPageExists ? showPageUrl : bookingURL}
                  onClick={showPageEvent}
                >
                  <div className="product-v2-title">
                    {truncate(title ?? name, 70)}
                  </div>
                </a>
                <Conditional
                  if={!isBeforeToday && openingDate !== 'Invalid Date'}
                >
                  <div className="reopening">
                    {OPENING_ON} {localisedOpeningDate}
                  </div>
                </Conditional>
              </div>
              <Conditional if={showPriceBlock}>
                <div className="product-v2-bottom-left">
                  <PriceBlock
                    prefix
                    listingPrice={listingPrice}
                    showSavings
                    showCashback
                    showScratchPrice
                    lang={lang}
                    save={save}
                  />
                </div>
              </Conditional>
            </div>
          </ProductCard>
        </div>
      </Conditional>
    </>
  );
};

Product.defaultProps = {
  productClick: () => {},
};

export default Product;
