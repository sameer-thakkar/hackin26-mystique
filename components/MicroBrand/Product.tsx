import React, { Component } from 'react';
import { RichText } from 'prismic-reactjs';
import Image from '../UI/Image';
import { shortCodeSerializerWithParentProps } from '../../utils/shortCodes';
import { truncate } from '../../utils/helper';
import { AVENIR, GRAPHIK, COLORS } from '../../constants/ui-constants';

export const Product = props => {
  const handleProductClick = () => {
    props.productClick(props.tgid, props.cardIdPrefix);
  };
  const { allTours, tgid, cardIdPrefix } = props;
  const tour = allTours[tgid];
  return (
    <div
      onClick={handleProductClick}
      className="product-v2"
      id={`${cardIdPrefix}-${tgid}`}
    >
      <div className="product-v2-image">
        <Image
          url={tour.productImage}
          format="pjpg"
          width={800}
          imageId={tgid}
          height={700}
          alt={tour.title}
        />
        {tour.overlayBooster ? (
          <div className="overlay-booster">{tour.overlayBooster}</div>
        ) : null}
      </div>
      <div className="product-v2-bottom">
        <div className="product-v2-bottom-left">
          <div className="product-v2-title">{truncate(tour.title, 40)}</div>
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
        <div className="product-v2-bottom-right">
          <div className="product-v2-price">
            {tour.currencySymbol}
            {tour.price}
          </div>
          {tour.scratchPrice > tour.price ? (
            <div className="product-v2-scratch-price">
              {tour.currencySymbol}
              {tour.scratchPrice}
            </div>
          ) : null}
        </div>
      </div>
      <style jsx>{`
        .product-v2 {
          width: 100%;
          height: 100%;
          max-width: 100%;
          cursor: pointer;
          display: grid;
          grid-template-rows: 176px auto;
          grid-row-gap: 8px;
        }
        .product-v2-title {
          font-family: ${AVENIR.FONT_STACK};
          font-size: 16px;
          line-height: 24px;
          color: #545454;
          font-weight: 800;
        }
        .product-v2-image {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
        }
        .overlay-booster {
          position: absolute;
          top: 8px;
          left: 0;
          background: ${COLORS.ETHER};
          border-radius: 0 2px 2px 0;
          color: #fff;
          line-height: 1;
          font-family: Avenir;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 800;
          padding: 5px 12px;
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
          grid-column-gap: 8px;
          height: max-content;
        }
        .product-v2-bottom-right {
          display: grid;
          grid-row-gap: 8px;
        }
        .product-v2-price {
          font-family: ${AVENIR.FONT_STACK};
          font-size: 16px;
          line-height: 1;
          text-align: right;
          color: ${COLORS.DAVY_GREY};
          font-weight: ${AVENIR.HEAVY};
        }
        .product-v2-scratch-price {
          font-family: ${AVENIR.FONT_STACK};
          font-weight: ${AVENIR.ROMAN};
          font-size: 12px;
          line-height: 1;
          text-align: right;
          text-decoration-line: line-through;
          color: #757575;
        }

        @media (max-width: 768px) {
          .product-v2 {
            grid-template-rows: 102px auto;
          }
          .overlay-booster {
            padding: 4px 6px;
          }
          .product-v2-title {
            font-size: 14px;
            line-height: 1.3;
            font-weight: ${AVENIR.HEAVY};
          }
          .product-v2-bottom {
            grid-template-columns: auto;
            grid-row-gap: 12px;
          }
          .product-v2-bottom-left {
            width: 100%;
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
            font-weight: ${GRAPHIK.MEDIUM};
            font-size: 14px;
            line-height: 1;
            font-family: ${GRAPHIK.FONT_STACK};
          }
          .product-v2-scratch-price {
            text-align: left;
            font-size: 10px;
            line-height: 1.2;
            font-weight: ${GRAPHIK.REGULAR};
            font-family: ${GRAPHIK.FONT_STACK};
          }
          .product-v2-boosters {
          }
        }
      `}</style>
      <style global jsx>{`
        .product-v2-image img {
          height: auto;
          max-width: 100%;
          max-height: 100%;
          display: block;
          width: 100%;
          object-fit: cover;
          border-radius: 4px;
          font-family: Avenir;
          background: #ebebeb;
          font-weight: 600;
          color: #bababa;
          position: relative;
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
        body .product-v2-boosters,
        body .long-form .product-v2-boosters p {
          font-family: ${GRAPHIK.FONT_STACK};
          font-size: 12px;
          line-height: 12px;
        }
        .product-v2-boosters .inline-availability {
          color: ${COLORS.TEAL};
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
      `}</style>
    </div>
  );
};

Product.defaultProps = {
  productClick: () => {},
};
