import React, { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { currencyAtom } from 'store/atoms/currency';
import { MBContext } from 'contexts/MBContext';
import PriceBlock, { PriceSkeleton, StyledPriceBlock } from 'UI/PriceBlock';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import Emoji from 'components/common/Emoji';
import { STAR } from 'assets/SvgIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  REOPENING_CATEGORIES,
  CASHBACK_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { truncate } from 'utils/helper';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { dateToString } from 'utils/dateUtils';
import InteractionContext from 'contexts/Interaction';
import { convertUidToUrl } from 'utils/urlUtils';
import { createBookingURL } from 'utils';
import { expandFontToken } from 'const/typography';
import { trackEvent } from 'utils/analytics';
import { checkLTT } from 'utils/helper';
import { parseDescriptors } from 'utils/productUtils';
import { descriptorIcons } from 'const/descriptorIcons';

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
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)}
  }

  .reopening {
    margin-top: 4px;
    color: ${COLORS.TEXT.BEACH};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }

  .product-v2-image {
    display: block;
    position: relative;
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
    grid-gap: ${({ isEntertainmentMb }) => (isEntertainmentMb ? '0' : '4px')};
    height: max-content;
    ${({ isEntertainmentMb }) => isEntertainmentMb && `margin-top: 12px;`}
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
    display: flex;
    align-items: center;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    padding: 0.2rem 0;

    .descSvg {
      margin: 0.12rem 0.2rem 0 0;
    }
  }

  .tour-price {
    column-gap: 4px;
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
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
      ${expandFontToken(FONTS.UI_LABEL_XS)}
    }
  }

  .tour-scratch-price {
    grid-column: 1 / 2;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
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
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
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
    color: ${COLORS.BRAND.CANDY};
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
      padding: 3px 6px;
      ${expandFontToken(FONTS.UI_LABEL_XS)}
    }

    .product-v2-title {
      ${expandFontToken(FONTS.HEADING_XS)}
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

    .tour-price {
      text-align: left;
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    }

    .tour-scratch-price {
      text-align: left;
      ${expandFontToken(FONTS.UI_LABEL_XS)}
    }

    .l1-booster-wrapper {
      ${expandFontToken(FONTS.UI_LABEL_XS)}
    }

    .avg-rating svg {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb &&
        `width:8px;
        height: 8px;
        
        path {
          fill:  ${COLORS.BRAND.CANDY};
          stroke:  ${COLORS.BRAND.CANDY};
        }
        `}
    }

    .reopening {
      ${expandFontToken(FONTS.UI_LABEL_XS)}
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
    activeCategoryId = null,
    host,
    productClick,
  } = props;
  const currency = useRecoilValue(currencyAtom);
  const {
    lang,
    nakedDomain,
    redirectToHeadoutBookingFlow,
    isDev,
    uid,
  } = useContext(MBContext);

  const { sliceData } = useContext(InteractionContext) || {};
  const { collectionId, primaryCatId, primarySubCatId } = sliceData || {};
  if (!allTours[tgid]) return null;

  const { listingPrice, ...tour } = allTours[tgid] || {};
  const {
    allTags,
    productImage,
    title,
    vendor,
    cardFooter,
    category,
    reopeningDate,
    averageRating,
    reviewCount,
    showPageUid = null,
    secondaryDescriptors = [],
    hasSpecialOffer,
  } = tour || {};
  const isLTT = checkLTT(uid);
  const {
    originalPrice,
    finalPrice,
    cashbackType,
    cashbackValue,
  } = listingPrice;
  const save = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);

  const { collectionName, primaryCategoryName, primarySubCategoryName } =
    category || {};
  let categoryName = '';

  const primaryCategory = allTours[tgid]?.primaryCategory;
  const primarySubCategory = allTours[tgid]?.primarySubCategory;
  const filteredDescriptors = parseDescriptors(secondaryDescriptors);

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

  const bookingURL = createBookingURL({
    nakedDomain,
    lang,
    tgid,
    redirectToHeadoutBookingFlow,
    currency,
  });
  const showPageUrl = showPageUid
    ? convertUidToUrl({ uid: showPageUid, isDev, hostname: host, lang })
    : bookingURL;

  const handleProductClick = (event) => {
    event.preventDefault();
    if (isMobile) {
      if (showPageExists) {
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
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      [ANALYTICS_PROPERTIES.DIV_TYPE]: 'Product List',
      [ANALYTICS_PROPERTIES.CASHBACK_SHOWN]:
        cashbackValue > 0 && cashbackType === CASHBACK_TYPES.PERCENTAGE,
      [ANALYTICS_PROPERTIES.DISCOUNT_SHOWN]: save > 0 ? 'Scratch Price' : null,
      [ANALYTICS_PROPERTIES.L1_BOOSTER_SHOWN]: getBooster(true),
    });
  };

  const isNewArrival = allTags.includes('NEWARRIVAL');

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

  const showPageEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_EXPANDED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
    });
  };
  const showPageExists = !showPageUrl.includes('/book');
  const getBooster = (onlyBoosterText = false) => {
    if ((save > 0 || hasSpecialOffer) && isLTT) {
      if (onlyBoosterText) return 'Special Offer';
      return (
        <div className="overlay-booster">
          <Emoji symbol="🤑" label="glowing-star" /> {strings.SPECIAL_OFFER}
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

  const cardComponent = (
    <ProductCard
      onClick={handleProductClick}
      className="product-v2"
      id={`${cardIdPrefix}-${tgid}`}
      onKeyDown={handleProductClick}
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
        {getBooster()}
      </div>
      <div className="product-v2-bottom">
        <Conditional if={vendor?.length && isMobile}>
          <div className="vendor-name">{vendor}</div>
        </Conditional>
        <Conditional if={isEntertainmentMb}>
          <div className="l1-booster-wrapper">
            <div className="l1-booster">{categoryName}</div>
            <div className="rating">
              <Conditional if={averageRating}>
                <span className="avg-rating">
                  {averageRating} {STAR(COLORS.BRAND.CANDY)}
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
        </Conditional>
        <div className="title-wrap">
          <Conditional if={!showPageExists}>
            <div className="product-v2-title">{truncate(title, 70)}</div>
          </Conditional>
          <Conditional if={showPageExists}>
            <a
              target="_self"
              rel="noopener noreferrer"
              href={showPageUrl}
              onClick={handleProductClick}
            >
              <div className="product-v2-title">{truncate(title, 70)}</div>
            </a>
          </Conditional>
          {!isLTT &&
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
              {getBooster()}
            </div>
            <div className="product-v2-bottom">
              <Conditional if={vendor?.length && isMobile}>
                <div className="vendor-name">{vendor}</div>
              </Conditional>
              <Conditional if={isEntertainmentMb}>
                <div className="l1-booster-wrapper">
                  <div className="l1-booster">{categoryName}</div>
                  <div className="rating">
                    <Conditional if={averageRating}>
                      <span className="avg-rating">
                        {averageRating} {STAR(COLORS.PRIMARY.JOY_MUSTARD)}
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
              </Conditional>
              <div className="title-wrap">
                <a
                  target="_self"
                  rel="noopener noreferrer"
                  href={showPageExists ? showPageUrl : bookingURL}
                  onClick={showPageEvent}
                >
                  <div className="product-v2-title">{truncate(title, 70)}</div>
                </a>
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
        </div>
      </Conditional>
    </>
  );
};

Product.defaultProps = {
  productClick: () => {},
};

export default Product;
