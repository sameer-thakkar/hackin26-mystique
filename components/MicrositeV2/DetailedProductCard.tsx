import React, { useContext } from 'react';
import Image from '../UI/Image';
import { RichText } from 'prismic-reactjs';
import { CLOSE_WHITE } from '../../assets/SvgIcons';
import { GRAPHIK, COLORS, AVENIR } from '../../constants/ui-constants';
import {
  shortCodeSerializerWithParentProps,
  shortCodeSerializer,
} from '../../utils/shortCodes';
import { MBContext } from '../../contexts/MBContext';

const DetailedProductCard = (props) => {
  const closeDescriptionCard = () => {
    props.closeDescription();
  };
  const mbContext = useContext(MBContext);
  const { lang, nakedDomain } = mbContext;
  const { allTours, tgidClicked, cardPosition } = props;
  const activeTour = allTours[tgidClicked];
  const rightBlocksCount = activeTour.contentBlocks.right.length;
  const descriptors = activeTour.descriptors
    .split(',')
    .filter((d) => d.length)
    .map((d) => d.trim());
  return (
    <div className="product-v2-description">
      <div className="indicator-triangle"></div>
      <div className="product-v2-description-left">
        <div className="full-width-section">
          <div className="v2-desc-title">{activeTour.title}</div>
          {descriptors.length > 0 ? (
            <div className="v2-descriptors">
              {descriptors.map((descriptor, index) => {
                return (
                  <div className="v2-descriptor" key={index}>
                    {descriptor.trim()}
                  </div>
                );
              })}
            </div>
          ) : null}
          {activeTour.description && activeTour.description.length ? (
            <div className="content-block tour-description">
              <RichText
                render={activeTour.description}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          ) : null}
        </div>
        <div className="v2-desc-columns">
          <div className="v2-desc-left">
            {activeTour.contentBlocks.left.map((block, index) => {
              return (
                <div
                  className={`description-content-block ${block.align
                    .toLowerCase()
                    .replace(/\s/g, '-')}`}
                  key={index}
                >
                  <span className="description-label">{block.label} </span>
                  <span className="description-content">
                    <RichText
                      render={block.content}
                      htmlSerializer={(...defaultArgs: any) =>
                        shortCodeSerializerWithParentProps(
                          defaultArgs,
                          activeTour
                        )
                      }
                    />
                  </span>
                </div>
              );
            })}
          </div>
          <div className="v2-desc-right">
            {activeTour.contentBlocks.right.map((block, index) => {
              return (
                <div className="description-content-block right" key={index}>
                  <span className="description-label">{block.label} </span>
                  <span className="description-content">
                    <RichText
                      render={block.content}
                      htmlSerializer={(...defaultArgs: any) =>
                        shortCodeSerializerWithParentProps(
                          defaultArgs,
                          activeTour
                        )
                      }
                    />
                  </span>
                </div>
              );
            })}
            <div className="desc-cta-price">
              <div className="desc-price">
                <span className="from-text">from</span>
                <div className="price-wrapper">
                  <div className="desc-final-price">
                    {activeTour.currencySymbol}
                    {activeTour.price}
                  </div>
                  {activeTour.price < activeTour.scratchPrice ? (
                    <div className="desc-scratch-price">
                      {activeTour.currencySymbol}
                      {activeTour.scratchPrice}
                    </div>
                  ) : null}
                </div>
              </div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://book.${nakedDomain}${
                  lang === 'en' ? '' : `/${lang}`
                }/book/${tgidClicked}`}
              >
                <div className="desc-book-now-cta">
                  <span className="desc-book-now-text">Book Now</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="product-v2-description-right">
        {/* <Image url={activeTour.descriptionImage} width={1200} height={750} format="pjpg" /> */}
        <Image
          url={`${activeTour.descriptionImage || activeTour.productImage}`}
          width={1200}
          height={750}
          format="pjpg"
          imageId={tgidClicked}
        />
        <div
          onClick={closeDescriptionCard}
          role="button"
          tabIndex={0}
          className="close-button"
        >
          {CLOSE_WHITE}
        </div>
      </div>
      <style jsx>{`
        .product-v2-description {
          grid-column: 1 / 5;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          grid-column-gap: 24px;
          border: 1px solid #757575;
          color: ${COLORS.FOUR_BLACK};
          border-left: none;
          border-right: none;
          position: relative;
        }
        .v2-desc-title {
          font-size: 24px;
          line-height: 1.37;
          color: ${COLORS.TWO_BLACK};
          font-family: ${AVENIR.FONT_STACK};
          font-weight: ${AVENIR.BLACK};
        }
        .product-v2-description-left {
          padding: 24px 0;
        }
        .product-v2-description-left,
        .product-v2-description-right {
          display: grid;
          grid-gap: 24px;
        }
        .product-v2-description-right{
          z-index: 1;
          display: flex;
        }
        .v2-desc-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 24px;
          grid-auto-flow: row;
          grid-auto-rows: max-content;
        }
        .v2-desc-blocks .left{
          grid-column: 1;
        }
        .v2-desc-blocks .right{
          grid-column: 2;
        }
        .description-label {
          font-size: 16px;
          line-height: 1.4;
          color: ${COLORS.TWO_BLACK};
          font-family: ${GRAPHIK.FONT_STACK};
          font-weight: ${GRAPHIK.SEMIBOLD};
        }
        .full-width-section{
          display: grid;
          grid-row-gap: 8px;
        }
        .v2-descriptors{
          display: grid;
          grid-template-columns: repeat(5,auto);
          font-family: ${GRAPHIK.FONT_STACK};
          grid-gap: 12px;
          justify-content: left;
          height: max-content;
        }
        .v2-descriptor{
          background: ${COLORS.GREY_FO};
          border-radius: 2px;
          font-size: 12px;
          padding: 8px 12px;
          color: ${COLORS.TWO_BLACK};
          font-weight: 400;
          line-height: 1;
          text-transform: capitalize;
        }
        .tour-description{
          font-family: ${AVENIR.FONT_STACK};
          margin-top: 4px;
        }

        .description-content {
          font-size: 16px;
          line-height: 1.37;
          color: ${COLORS.FOUR_BLACK};
          font-family: ${GRAPHIK.FONT_STACK};
          font-weight: ${GRAPHIK.REGULAR};
        }

        .desc-cta-price {
          display: grid;
          align-items: center;
          grid-template-columns: auto auto;
          align-self: end;
          grid-column-gap: 30px;
        }

        .v2-desc-right,
        .v2-desc-left {
          display: grid;
          grid-gap: 24px;
          align-items: start;
        }

        .v2-desc-left {
          grid-auto-flow: row;
          grid-auto-rows: max-content;
        }
        .v2-desc-right {
          grid-template-rows: repeat(${rightBlocksCount}, max-content) auto;
        }

        .v2-desc-left .full-width{
          grid-column: 1 / 3;
        }
        

        .desc-price {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .desc-final-price, .from-text {
          font-family: ${AVENIR.FONT_STACK};
          font-size: 20px;
          line-height: 20px;
          color: ${COLORS.TWO_BLACK};
          font-weight: ${AVENIR.BLACK};
        }
        .price-wrapper{
          display: grid;
          grid-template-columns: auto auto;
          grid-column-gap: 8px;
          align-items: end;
        }

        .from-text{
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
          line-height: 18px;
        }

        .desc-scratch-price {
          font-family: ${GRAPHIK.FONT_STACK};
          font-weight: ${GRAPHIK.REGULAR};
          font-size: 14px;
          line-height: 20px;
          text-decoration-line: line-through;
          color: ${COLORS.FOUR_BLACK};
        }

        .desc-book-now-cta {
          background: #ec1943;
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 180px;
          height: 48px;
        }

        .desc-book-now-text {
          font-family: Avenir;
          font-size: 16px;
          line-height: 16px;
          color: #ffffff;
          font-weight: 600;
        }

        .close-button {
          position: absolute;
          top: 0;
          background-color: #000;
          right: 0;
          padding: 16px;
          cursor: pointer;
          display: flex;
        }
        .close-button img {
          height: 11px;
          width: 11px;
        }
        .indicator-triangle::after, .indicator-triangle::before{
          border-width: 0;
          transition: all 0.5s ease;
        }
        .indicator-triangle{
          display: grid;
        }
        .indicator-triangle::after, .indicator-triangle::before{
          border-color: transparent transparent #75757596 transparent;
          border-style: solid;
          border-width: 13px;
          content: "";
          grid-row: 1;
          grid-column: 1;
          align-self: end;
          justify-self: center;
          /* transform: translateY(calc(100% + 30px)); */
        }
        .indicator-triangle::after{
          border-color: transparent transparent #fff transparent;
          border-width: 12px;
          transform: translateY(2px);
        }
        .indicator-triangle{
          position: absolute;
          transform: translateY(-100%) translateX(-50%);
          top: 0;
          z-index: 0;
          left: ${25 * cardPosition - 12.5}%;
          /* left: calc(${cardPosition}px - 12.5%) */
        }
      `}</style>

      <style jsx global>{`
        .product-v2-description-right img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .description-content p {
          margin: 0;
        }
        .tour-description p {
          margin: 0;
        }

        .description-content ul {
          padding-left: 1em;
        }
        .description-content p {
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default DetailedProductCard;
