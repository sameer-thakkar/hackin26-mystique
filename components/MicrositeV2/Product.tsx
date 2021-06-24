import React, { useContext } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import LocalisedPrice from 'UI/LPrice';
import { SEE_SAFETY, STAR } from 'assets/SvgIcons';
import { CURRENCY_SYMBOL_MAP } from 'const/index';
import { strings } from 'const/strings';
import { SOLEIL, COLORS } from 'const/ui-constants';
import { truncate } from 'utils/helper';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { dateToString } from 'utils/dateToString';

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
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '20px' : '24px'};
    color: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GREY.G2 : COLORS.TWO_BLACK};
    font-weight: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? SOLEIL.SEMIBOLD : 800};
  }
  .reopening {
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 12px;
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
    line-height: 16px;
    margin-top: 4px;
    color: ${COLORS.BEACH};
  }
  .product-v2-image {
    display: block;
    position: relative;
  }
  .emb-safety {
    position: absolute;
    top: 8px;
    left: 8px;
  }
  .emb-safety svg {
    width: 52px;
    height: 32px;
  }
  .overlay-booster {
    position: absolute;
    top: 8px;
    left: 0;
    background: ${COLORS.ETHER};
    border-radius: 0 2px 2px 0;
    color: #fff;
    line-height: 1;
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 800;
    padding: 5px 12px;
    ${({ theme }) => theme.productCards.overlayBoosterStyles}
  }
  .product-v2-bottom-left {
    display: grid;
    grid-gap: 4px;
    height: max-content;
    ${({ isEntertainmentMb }) => isEntertainmentMb && `margin-top: 4px;`}
  }
  .product-v2-bottom {
    display: grid;
    align-items: baseline;
    justify-content: space-between;
    grid-template-columns: 1fr auto;
    grid-gap: 8px;
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
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    font-weight: ${SOLEIL.SEMIBOLD};
    line-height: 20px;
    text-align: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'left' : 'right'};
    color: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GREY.G3 : COLORS.TWO_BLACK};
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb &&
      `grid-row: 2;
      display: flex;
    align-items: center;`}
  }
  .product-v2-scratch-price {
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.REGULAR};
    font-size: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '12px' : '14px'};
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '16px' : '14px'};
    letter-spacing: 0.5px;
    text-align: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'left' : 'right'};
    text-decoration-line: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'unset' : 'line-through'};
    span {
      color: ${COLORS.GREY_G4};
    }
  }

  .discount {
    background-color: ${COLORS.SOOTHING_GREEN};
    color: ${COLORS.OKAY_GREEN};
    padding: 2px 4px;
    border-radius: 2px;
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 10px;
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
    line-height: 12px;
    margin-left: 6px;
  }

  .vendor-name {
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.MEDIUM};
    text-transform: uppercase;
    font-size: 11px;
    line-height: 11px;
    letter-spacing: 0.5px;
    color: ${COLORS.GREY_G4};
  }

  .l1-booster-wrapper {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    justify-content: space-between;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.MEDIUM};
    font-style: normal;
    line-height: 16px;
    font-size: 12px;
  }
  .l1-booster-wrapper * {
    color: ${COLORS.GREY.G4};
  }
  .rating {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    column-gap: 4px;
  }
  .avg-rating {
    color: ${COLORS.JOY_MUSTARD};
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
      font-size: 14px;
      line-height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '20px' : '1.3'};
      font-weight: ${SOLEIL.SEMIBOLD};
    }
    .product-v2-bottom {
      grid-template-columns: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '1fr' : 'auto'};
      grid-row-gap: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '4px;' : '12px'};
    }
    .product-v2-bottom-left {
      width: 100%;
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && ` grid-gap: 2px;margin-top: 10px;`}
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
      font-weight: ${SOLEIL.SEMIBOLD};
      font-size: 14px;
      line-height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '20px;' : '1'};
      font-family: ${SOLEIL.FONT_STACK};
    }
    .product-v2-scratch-price {
      text-align: left;
      font-size: 10px;
      line-height: 1.2;
      font-weight: ${SOLEIL.REGULAR};
      font-family: ${SOLEIL.FONT_STACK};
    }
    .l1-booster-wrapper {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `font-size: 10px;line-height: 12px;`}
    }
    .avg-rating svg {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `width:8px;height: 8px;`}
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
    font-family: ${SOLEIL.FONT_STACK};
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
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 12px;
    line-height: 12px;
  }
  .product-v2-boosters .inline-availability {
    color: ${({ theme: { cardAccent } }) =>
      cardAccent ? cardAccent : COLORS.FOUR_BLACK};
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
  } = props;
  const { currencySymbolMap, lang } = useContext(MBContext);
  if (!allTours[tgid]) return null;
  const { listingPrice, dfListingPrice, ...tour } = allTours[tgid] || {};
  const {
    productImage,
    title,
    overlayBooster,
    vendor,
    cardFooter,
    hasBestSafety,
    category,
    reopeningDate,
    averageRating,
    reviewCount,
  } = tour || {};

  const {
    finalPrice: price,
    originalPrice: scratchPrice,
    currencyCode,
    bestDiscount,
  } = listingPrice || dfListingPrice || {};
  const currencySymbol =
    currencySymbolMap[currencyCode]?.localSymbol ||
    CURRENCY_SYMBOL_MAP[currencyCode];

  const handleProductClick = () => {
    productClick(tgid, cardIdPrefix);
  };

  const openingDate = dateToString(reopeningDate, lang, 'DD MMM, YYYY');
  return (
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
          width={800}
          imageId={tgid}
          height={500}
          alt={title}
        />
        <Conditional if={overlayBooster}>
          <div className="overlay-booster">{overlayBooster}</div>
        </Conditional>
        <Conditional if={isEntertainmentMb && hasBestSafety}>
          <div className="emb-safety">{SEE_SAFETY}</div>
        </Conditional>
      </div>
      <div className="product-v2-bottom">
        <Conditional if={vendor?.length && isMobile}>
          <div className="vendor-name">{vendor}</div>
        </Conditional>
        <Conditional if={isEntertainmentMb}>
          <div className="l1-booster-wrapper">
            <div className="l1-booster">{category}</div>
            <Conditional if={reviewCount}>
              <div className="rating">
                <span className="avg-rating">
                  {averageRating} {STAR(COLORS.JOY_MUSTARD)}
                </span>
                <span className="total-rating">
                  (
                  {reviewCount > 999
                    ? `${(reviewCount / 1000).toFixed(1)}k`
                    : reviewCount}
                  )
                </span>
              </div>
            </Conditional>
          </div>
        </Conditional>
        <div className="title-wrap">
          <div className="product-v2-title">{truncate(title, 70)}</div>
          <Conditional if={isEntertainmentMb && openingDate !== 'Invalid Date'}>
            <div className="reopening">Reopening on {openingDate}</div>
          </Conditional>
        </div>
        <div className="product-v2-bottom-left">
          <div className="product-v2-price">
            <LocalisedPrice
              price={price}
              currencySymbol={currencySymbol}
              lang={lang}
            />
            <Conditional if={isEntertainmentMb && bestDiscount}>
              <span className="discount">
                {bestDiscount}% {strings.OFF}
              </span>
            </Conditional>
          </div>
          <Conditional if={scratchPrice > price}>
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
};

Product.defaultProps = {
  productClick: () => {},
};

export default Product;
