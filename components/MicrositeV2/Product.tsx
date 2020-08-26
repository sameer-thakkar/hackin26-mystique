import React from 'react';
import { RichText } from 'prismic-reactjs';
import Image from 'UI/Image';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { truncate } from 'utils/helper';
import { SOLEIL, COLORS } from 'constants/ui-constants';
import { CURRENCY_SYMBOL_MAP } from 'constants/index';
import styled from 'styled-components';

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
    line-height: 24px;
    color: ${COLORS.TWO_BLACK};
    font-weight: 800;
  }
  .product-v2-image {
    display: block;
    position: relative;
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
  }
  .product-v2-bottom {
    display: grid;
    align-items: baseline;
    justify-content: space-between;
    grid-template-columns: 1fr auto;
    grid-gap: 8px;
    height: max-content;
  }
  .product-v2-bottom-right {
    display: grid;
    grid-row-gap: 8px;
    align-self: end;
  }
  .product-v2-price {
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    color: ${COLORS.TWO_BLACK};
    font-weight: ${SOLEIL.SEMIBOLD};
  }
  .product-v2-scratch-price {
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.REGULAR};
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.5px;
    text-align: right;
    text-decoration-line: line-through;
    color: ${COLORS.GREY_G4};
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

  @media (max-width: 768px) {
    grid-template-rows: 102px auto;
    transform: unset;
    transition: unset;
    &:hover {
      transform: unset;
    }
    .overlay-booster {
      padding: 4px 6px;
    }
    .product-v2-title {
      font-size: 14px;
      line-height: 1.3;
      font-weight: ${SOLEIL.SEMIBOLD};
    }
    .product-v2-bottom {
      grid-template-columns: auto;
      grid-row-gap: 12px;
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
      font-weight: ${SOLEIL.SEMIBOLD};
      font-size: 14px;
      line-height: 1;
      font-family: ${SOLEIL.FONT_STACK};
    }
    .product-v2-scratch-price {
      text-align: left;
      font-size: 10px;
      line-height: 1.2;
      font-weight: ${SOLEIL.REGULAR};
      font-family: ${SOLEIL.FONT_STACK};
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
      border-radius: 2px;
    }
    .product-v2-boosters {
      font-size: 12px;
    }
  }
`;

const Product = (props) => {
  const handleProductClick = () => {
    props.productClick(props.tgid, props.cardIdPrefix);
  };
  const { allTours, tgid, cardIdPrefix, isMobile } = props;
  if (!allTours[tgid]) return null;
  const { listingPrice, dfListingPrice, ...tour } = allTours[tgid];
  const priceObj = listingPrice || dfListingPrice;
  const price = priceObj?.finalPrice;
  const scratchPrice = priceObj?.originalPrice;
  const currencySymbol = CURRENCY_SYMBOL_MAP[priceObj?.currencyCode];
  return (
    <ProductCard
      onClick={handleProductClick}
      className="product-v2"
      id={`${cardIdPrefix}-${tgid}`}
      onKeyDown={handleProductClick}
      role="button"
      tabIndex={0}
    >
      <div className="product-v2-image">
        <Image
          url={tour.productImage}
          format="pjpg"
          width={800}
          imageId={tgid}
          height={500}
          alt={tour.title}
        />
        {tour.overlayBooster ? (
          <div className="overlay-booster">{tour.overlayBooster}</div>
        ) : null}
      </div>
      <div className="product-v2-bottom">
        {tour.vendor?.length && isMobile ? (
          <div className="vendor-name">{tour.vendor}</div>
        ) : null}
        <div className="title-wrap">
          <div className="product-v2-title">{truncate(tour.title, 70)}</div>
        </div>
        <div className="product-v2-bottom-left">
          <div className="product-v2-price">
            {currencySymbol}
            {price}
          </div>
          {scratchPrice > price ? (
            <div className="product-v2-scratch-price">
              {currencySymbol}
              {scratchPrice}
            </div>
          ) : null}
        </div>
        <div className="product-v2-bottom-right">
          {tour.cardFooter.length ? (
            <div
              className="product-v2-boosters"
              data-cont={tour.cardFooter.length}
            >
              <RichText
                render={tour.cardFooter}
                htmlSerializer={(...defaultArgs: any) =>
                  shortCodeSerializerWithParentProps(defaultArgs, tour)
                }
              />
            </div>
          ) : null}
        </div>
      </div>
    </ProductCard>
  );
};

Product.defaultProps = {
  productClick: () => {},
};

export default Product;
