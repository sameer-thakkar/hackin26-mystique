import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import Image from '../UI/Image';
import { RichText } from 'prismic-reactjs';
import parse from 'url-parse';
import { GRAPHIK, AVENIR, COLORS } from '../../constants/ui-constants';
import EnvironmentContext from '../../contexts/environmentContext';
import { ProductsContext } from '../../contexts/Products';
import { shortCodeSerializerWithParentProps } from '../../utils/shortCodes';
import { MBContext } from '../../contexts/MBContext';
import * as LABELS from '../../public/static/localization/labels';

const TourComparisonTable = props => {
  const closeDescriptionCard = () => {
    props.closeDescription();
  };

  const {
    heading,
    description,
    tgidsCSV,
    isMobile,
    orderedLabels,
    vendors,
    vendorLinks,
  } = props;
  const NB_SPACE = '\u00A0';

  const envContext = useContext(EnvironmentContext);
  const toursContext = useContext(ProductsContext);
  const mbContext = useContext(MBContext);
  const url = envContext.windowUrl;
  const { uid, lang, nakedDomain } = mbContext;
  const currentHost = !envContext.isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage.', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  // const nakedDomain = hostSplit.slice(0,2).join(".");
  const allTours = toursContext.allTours;
  // const activeTour = allTours[tgidClicked];
  // const rightBlocksCount = activeTour.contentBlocks.right.length;
  const getContentNormalizedTours = tgidArray => {
    let toursArr = tgidArray.map(tgid => allTours[tgid]);
    const labels = {
      title: {
        max: 0,
      },
    };

    toursArr = toursArr.reduce((acc, tour, index) => {
      labels.title.max = Math.max(labels.title.max, tour.title.length);
      let content = [
        ...tour.contentBlocks.left,
        ...tour.contentBlocks.right,
        ...tour.contentBlocks.hidden,
      ];
      content = content.reduce((accum, block) => {
        if (!labels[block.labelId]) labels[block.labelId] = {};
        labels[block.labelId].max = Math.max(
          labels[block.labelId].max || 0,
          block.len
        );
        return {
          ...accum,
          [block.labelId]: {
            label: block.label,
            content: block.content,
            len: block.len,
            id: block.labelId,
          },
        };
      }, {});
      return [
        ...acc,
        {
          ...tour,
          contentBlocks: content,
          vendor: vendors && vendors[index],
          vendorLink: vendorLinks && vendorLinks[index],
        },
      ];
    }, []);
    return { toursArr, labels };
  };
  const tgidArray = tgidsCSV
    .split(',')
    .map(tgid => parseInt(tgid))
    .filter(tgid => allTours[tgid].available);
  const content_normalized_tours = getContentNormalizedTours(tgidArray);
  const rowsRef = useRef({});
  const [state, setState] = useState(false);
  const [blockStyles, setBlockStyles] = useState({});
  useLayoutEffect(() => {
    if (rowsRef.current) {
      let blockStylesTemp = {};
      Object.keys(rowsRef.current).forEach((id, index) => {
        const ref = rowsRef.current[id];
        if (ref.el) {
          blockStylesTemp[ref.labelId] = {
            minHeight: ref.el.getBoundingClientRect().height,
          };
        }
      });
      setBlockStyles({ ...blockStylesTemp });
    }
  }, []);
  return (
    <div className="product-comparision-table" onClick={() => setState(!state)}>
      <div className="comparision-heading">{heading}</div>
      <div className="comparision-description">{description}</div>
      <div className="tour-options">
        {content_normalized_tours.toursArr.map((tour, index) => {
          const content_blocks = tour.contentBlocks;
          const title = tour.title;
          const titleMaxLen = content_normalized_tours.labels.title.max;
          const thisTitleLen = title.length;
          const isLargestTitle = titleMaxLen == thisTitleLen;
          return (
            <div className="tour-column" key={index}>
              <div className="tour-image">
                <Image url={tour.productImage} />
              </div>
              <div className="tour-content-wrap">
                <div
                  className="tour-chin"
                  style={blockStyles['title']}
                  ref={el => {
                    if (isLargestTitle) {
                      rowsRef.current['title'] = {
                        el: el,
                        labelId: 'title',
                      };
                    }
                  }}
                >
                  <div className="tour-title">{tour.title}</div>
                  <div className="price-block">
                    <div className="current-price">
                      {tour.currencySymbol}
                      {tour.price}
                    </div>
                    {tour.scratchPrice > tour.price ? (
                      <div className="old-price">
                        {tour.currencySymbol}
                        {tour.scratchPrice}
                      </div>
                    ) : null}
                  </div>
                  <div className="tour-booster">
                    <RichText
                      render={tour.cardFooter}
                      htmlSerializer={(...defaultArgs: any) =>
                        shortCodeSerializerWithParentProps(defaultArgs, tour)
                      }
                    />
                  </div>
                </div>
                <div className="content-blocks">
                  <div className="block">
                    <div className="block-label">
                      {index == 0 ? 'Price' : NB_SPACE}
                    </div>
                    <div className="block-content">
                      <div className="price-content-block">
                        {tour.currencySymbol}
                        {tour.price}
                        {NB_SPACE}
                        {NB_SPACE}
                        {tour.scratchPrice > tour.price ? (
                          <span className="strike-through">
                            {tour.currencySymbol}
                            {tour.scratchPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {orderedLabels.map((label, blockIndex) => {
                    const block_content = content_blocks[label.labelId] || {};
                    const thisLabelMaxLen =
                      content_normalized_tours.labels[label.labelId] &&
                      content_normalized_tours.labels[label.labelId].max;
                    const thisContentLen = block_content
                      ? block_content.len
                      : 0;
                    const isLargestBlock = thisLabelMaxLen == thisContentLen;
                    return (
                      <div
                        className={`block ${label.labelId}`}
                        style={blockStyles[label.labelId]}
                        ref={el => {
                          if (isLargestBlock)
                            rowsRef.current[label.labelId] = {
                              el: el,
                              labelId: label.labelId,
                            };
                        }}
                        key={blockIndex}
                      >
                        <div className="block-label">
                          {index == 0 && block_content.content
                            ? block_content.label
                            : NB_SPACE}
                        </div>
                        <div className="block-content">
                          {block_content.content ? (
                            <RichText
                              render={block_content.content}
                              htmlSerializer={(...defaultArgs: any) =>
                                shortCodeSerializerWithParentProps(
                                  defaultArgs,
                                  tour
                                )
                              }
                            />
                          ) : (
                            '-'
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="tour-cta">
                  <a
                    href={`https://book.${nakedDomain}/book/${
                      lang == 'en' ? '' : lang + '/'
                    }${tour.tgid}`}
                    className="cta-btn"
                  >
                    Book Now
                  </a>
                </div>
                {tour.vendor ? (
                  <div className="vendor-cta">
                    <a href={tour.vendorLink} className="cta-btn">
                      {LABELS[lang].MORE_FROM} {tour.vendor}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .product-comparision-table {
          width: 100%;
          max-width: calc(100vw - 32px);
          color: #545454;
        }
        .tour-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-column-gap: 24px;
        }
        .strike-through {
          text-decoration: line-through;
        }
        .comparision-heading {
          font-size: 24px;
          font-weight: ${AVENIR.HEAVY};
          font-family: ${AVENIR.FONT_STACK};
        }
        .comparision-description {
          margin-bottom: 32px;
          font-size: 14px;
          font-family: ${AVENIR.FONT_STACK};
        }
        .tour-column {
          position: relative;
        }
        .tour-title {
          font-family: ${AVENIR.FONT_STACK};
          font-weight: ${AVENIR.HEAVY};
          grid-column: 1 / 3;
        }
        .tour-chin {
          display: grid;
          position: sticky;
          top: 0;
          z-index: 15;
          background: #fff;
          grid-template-columns: auto 1fr;
          grid-gap: 8px;
          justify-content: space-between;
          justify-items: flex-end;
        }
        /* TODO: Improve this, Handle in code. */
        .tour-chin::after {
          position: absolute;
          content: '';
          height: 100%;
          width: 24px;
          right: -24px;
          background: #fff;
        }
        .block-label {
          font-size: 16px;
          font-weight: ${AVENIR.HEAVY};
          font-family: ${AVENIR.FONT_STACK};
        }
        .price-block {
          font-family: ${AVENIR.FONT_STACK};
          font-weight: ${AVENIR.HEAVY};
          font-size: 16px;
          text-align: left;
          line-height: 1;
          display: grid;
          grid-row-gap: 8px;
          height: max-content;
        }
        .old-price {
          font-weight: ${AVENIR.ROMAN};
          font-size: 12px;
          grid-row: 1;
          text-decoration: line-through;
        }
        .content-blocks {
          display: grid;
          grid-auto-flow: row;
          /* grid-template-rows: 50px repeat(${Object.keys(
            content_normalized_tours.labels
          ).length - 1}, max-content); */
          margin-top: 32px;
          margin-bottom: 32px;
          grid-row-gap: 32px;
        }
        /* .tour-cta {
          position: sticky;
          bottom: 0px;
          padding-bottom: 15px;
          background: #fff;
        } */
        .tour-cta .cta-btn {
          padding: 16px;
          display: block;
          width: calc(100% - 34px);
          border:1px solid ${COLORS.RHAPSODY};
          border-radius: 4px;
          color: ${COLORS.RHAPSODY};
          font-size: 16px;
          font-family: ${AVENIR.FONT_STACK};
          text-align: center;
          font-weight: ${AVENIR.HEAVY};
          text-decoration: none;
        }
        . .block {
          line-height: 1.33;
        }
        .tour-booster, .price-block{
          align-self: end;
        }
        .vendor-cta{
          text-align: center;
          margin-top: 24px;
          font-weight: ${AVENIR.MEDIUM};
          font-size: 14px;
          font-family: ${AVENIR.FONT_STACK};
        }
        .vendor-cta a{
          color: ${COLORS.RHAPSODY};
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .tour-options {
            width: 100vw;
            overflow-y: hidden;
            overflow-x: scroll;
            grid-gap: 12px;
            grid-template-columns: 4px repeat(${tgidArray.length}, 164px) 16px;
            margin-left: -16px;
            margin-right: -16px;
          }
          .tour-options::before {
            content: "";
          }
          .tour-options::after {
            content: "";
          }
          .tour-chin::after{
            width: 12px;
            right: -12px;
          }
          .tour-chin {
            position: initial;
            grid-template-columns: auto;
            grid-column-gap: 8px;
          }
          .tour-cta {
            position: initial;
          }
          .price-block {
            height: max-content;
            text-align: left;
          }
          .tour-chin{
            justify-items: left;
          }
          .tour-title {
            font-family: ${GRAPHIK.FONT_STACK};
            font-size: 14px;
            grid-column: 1 / 2;
            font-weight: ${GRAPHIK.HEAVY};
          }
          .price-block {
            display: none;
          }
        }
      `}</style>
      <style global jsx>{`
        .tour-options img {
          width: 100%;
          border-radius: 4px;
        }
        .block-content p {
          margin: 0;
        }
        .tour-options .block-content p:empty::after {
          display: block;
          content: ' ';
        }
        .tour-booster p {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default TourComparisonTable;
