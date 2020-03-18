import React, { useContext, useState } from 'react';
import Image from '../UI/Image';
import parse from 'url-parse';
import styled from 'styled-components';
import EnvironmentContext from '../../contexts/environmentContext';
import ProductsContext from '../../contexts/Products';
import CommonCTA from '../UI/CTA';
import { RichText } from 'prismic-reactjs';
import { AVENIR, COLORS, GRAPHIK } from '../../constants/ui-constants';
import { shortCodeSerializerWithParentProps } from '../../utils/shortCodes';
import { MBContext } from '../../contexts/MBContext';
import { CHEVRON_DOWN } from '../../public/static/svg-icons';

const StyledTourComparisionTable = styled.div`
  width: auto;
  display: grid;
  line-height: 1.3;
  font-family: ${GRAPHIK.FONT_STACK};
  .comparision-heading {
    font-size: 24px;
    margin-bottom: 8px;
    font-weight: ${AVENIR.HEAVY};
    font-family: ${AVENIR.FONT_STACK};
    color: ${COLORS.TWO_BLACK};
    line-height: 33px;
  }
  .comparision-description {
    padding-bottom: 32px;
    width: 60%;
    font-size: 16px;
    font-family: ${GRAPHIK.FONT_STACK};
    font-weight: ${GRAPHIK.REGULAR};
    line-height: 20px;
    color: ${COLORS.FOUR_BLACK};
  }
  .tour-title {
    font-family: ${AVENIR.FONT_STACK};
    font-weight: ${AVENIR.HEAVY};
    font-size: 16px;
    color: ${COLORS.TWO_BLACK};
    letter-spacing: 0.0035em;
    line-height: 24px;
    grid-column: 1 / 3;
  }
  .tour-chin {
    display: grid;
    background: #fff;
    grid-template-columns: auto 1fr;
    grid-gap: 8px;
  }

  .table {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
    grid-row-gap: 32px;
    grid-column-gap: 8px;
  }
  .cta-table-wrap .row {
    background: ${COLORS.WHITE};
    padding-top: 32px;
    padding-bottom: 32px;
    margin-bottom: -32px;
    position: sticky;
    bottom: 0;
    z-index: 15;
  }
  .row {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(4, 1fr) ${({ isMobile }) =>
        isMobile ? '16px' : ''};
    grid-column-gap: 24px;
  }
  .tour-booster {
    align-self: end;
    justify-self: end;
  }
  .price-block {
    display: grid;
    line-height: 1;
    grid-row-gap: 2px;
  }
  .old-price {
    font-size: 12px;
    font-family: ${AVENIR.FONT_STACK};
    color: ${COLORS.EIGHT_GRAY};
    line-height: 16px;
    grid-row: 1;
    text-decoration: line-through;
  }
  .current-price {
    font-size: 16px;
    font-family: ${AVENIR.FONT_STACK};
    font-weight: ${AVENIR.HEAVY};
    color: ${COLORS.FOUR_BLACK};
    line-height: 20px;
  }
  .flat-price-block .current-price {
    font-family: ${GRAPHIK.FONT_STACK};
    font-weight: ${GRAPHIK.SEMIBOLD};
    color: ${COLORS.FOUR_BLACK};
  }

  .flat-price-block .old-price {
    font-size: 16px;
    font-family: ${GRAPHIK.FONT_STACK};
    margin-left: 8px;
    color: ${COLORS.FOUR_BLACK};
  }

  .row.sticky {
    position: sticky;
    top: 12px;
    background: ${COLORS.WHITE};
    z-index: 15;
    padding-bottom: 8px;
  }

  .column p {
    margin: 0;
  }
  .content-block .popup-trigger {
    font-size: 13px;
    line-height: 20px;
  }
  .tour-image {
    margin-bottom: -32px;
  }
  .column .tour-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  .content-block {
    display: grid;
    grid-row-gap: 12px;
    grid-template-rows: auto 1fr;
  }
  .block-label {
    font-size: 16px;
    font-weight: ${AVENIR.HEAVY};
    font-family: ${AVENIR.FONT_STACK};
    line-height: 18px;
    letter-spacing: 0.5px;
    color: ${COLORS.EIGHT_GRAY};
  }
  .block-content {
    font-size: 15px;
    line-height: 20px;
    font-family: ${GRAPHIK.FONT_STACK};
    font-weight: ${GRAPHIK.REGULAR};
    color: ${COLORS.FOUR_BLACK};
  }
  .vendor-cta {
    margin-top: -8px;
    text-align: center;
    line-height: 16px;
    font-size: 14px;
    font-family: ${AVENIR.FONT_STACK};
    font-weight: ${AVENIR.MEDIUM};
  }
  .vendor-cta a {
    color: ${COLORS.RHAPSODY};
    text-decoration: underline;
  }
  .row .column:not(:first-child) .block-label {
    visibility: hidden;
  }
  ul {
    list-style: initial;
    padding-left: 1em;
    display: grid;
    grid-row-gap: 8px;
  }
  @media (max-width: 768px) {
    .full-width-wrap {
      margin: 0 -16px;
      max-width: 768px;
      overflow-y: hidden;
      overflow-x: scroll;
      overscroll-behavior-x: contain;
      overflow: -moz-scrollbars-none;
      -ms-overflow-style: none;
    }
    .full-width-wrap::-webkit-scrollbar {
      width: 0 !important;
    }

    .table {
      grid-row-gap: 32px;
      position: relative;
    }
    .row {
      grid-column-gap: 12px;
      grid-template-columns: 4px repeat(${({ tourCount }) => tourCount}, 164px) 4px;
    }
    .row::before {
      dispaly: grid;
      content: '';
    }
    .column .tour-image img {
      width: auto;
      height: 102px;
    }
    .row .column:not(:first-child) .block-label {
      visibility: initial;
    }
    .flat-price-block .current-price {
      font-size: 15px;
    }
    .flat-price-block .old-price {
      font-size: 12px;
    }
    .tour-title {
      font-size: 14px;
      grid-column: 1;
      line-height: 18px;
    }
    .tour-chin {
      grid-template-columns: 1fr;
    }
    .tour-booster {
      align-self: top;
      justify-self: left;
    }

    .tour-chin .price-block {
      display: none;
    }
    .content-block {
      grid-row-gap: 8px;
    }
    .block-label {
      font-size: 12px;
      color: ${COLORS.GREY_75};
      font-family: ${GRAPHIK.FONT_STACK};
      font-weight: ${GRAPHIK.HEAVY};
      line-height: 12px;
    }
    .block-content {
      font-size: 15px;
    }
    .comparision-heading {
      font-family: ${GRAPHIK.FONT_STACK};
      font-weight: ${GRAPHIK.SEMIBOLD};
      line-height: 26px;
      margin-bottom: 8px;
    }
    .comparision-description {
      font-size: 16px;
      color: ${COLORS.DAVY_GREY};
      font-weight: ${GRAPHIK.REGULAR};
      padding-bottom: 24px;
      width: 100%;
    }
    .row.sticky {
      z-index: unset;
    }
    .cta-table-wrap .row {
      padding-bottom: 8px;
      margin-bottom: 0;
    }
    .start-compare-icon {
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 10px;
      justify-content: center;
      svg {
        path {
          stroke: ${COLORS.RHAPSODY};
          stroke-width: 1.5px;
        }
      }
    }
  }
`;

const TourComparisonTable = props => {
  const {
    heading,
    description,
    tgidsCSV,
    isMobile,
    orderedLabels,
    vendors,
    vendorLinks,
    slice,
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
  const { allTours, ready: allToursReady } = toursContext;
  if (!allToursReady) return null;
  const getContentNormalizedTours = tgidArray => {
    let toursArr = tgidArray.map(tgid => allTours[tgid]);
    toursArr = toursArr.reduce((acc, tour, index) => {
      let content = [
        ...tour.contentBlocks.left,
        ...tour.contentBlocks.right,
        ...tour.contentBlocks.hidden,
      ];
      content = content.reduce((accum, block) => {
        return {
          ...accum,
          [block.labelId]: {
            label: block.label,
            content: block.content,
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
    return toursArr;
  };
  const tgidArray = tgidsCSV
    .split(',')
    .map(tgid => parseInt(tgid))
    .filter(tgid => allTours[tgid].available);
  const content_normalized_tours = getContentNormalizedTours(tgidArray);
  const [isExpanded, setExpand] = useState(false);

  const ComparisionTable = (
    <StyledTourComparisionTable
      isExpanded={isExpanded}
      isMobile={isMobile}
      tourCount={tgidArray.length}
    >
      <div className="comparision-heading">{heading}</div>
      <div className="comparision-description">{description}</div>
      <div className="full-width-wrap">
        <div className="table">
          <div className="row max-content" style={{ zIndex: -1 }}>
            {content_normalized_tours.map((tour, cellIndex) => {
              return (
                <div className="column">
                  <div className="tour-image">
                    <Image
                      dontLazyLoad={true}
                      url={tour.productImage}
                      height={176}
                      width={282}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="row sticky">
            {content_normalized_tours.map((tour, cellIndex) => {
              return (
                <div className="column">
                  <div className="tour-chin">
                    <div className="tour-title">{tour.title}</div>
                    <div className="tour-booster">
                      <RichText
                        render={tour.cardFooter}
                        htmlSerializer={(...defaultArgs: any) =>
                          shortCodeSerializerWithParentProps(defaultArgs, tour)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {isExpanded ? (
            <div className="row" style={{ marginTop: -8 }}>
              {content_normalized_tours.map((tour, cellIndex) => {
                const props = {
                  link: {
                    url: `https://book.${nakedDomain}/book/${
                      lang == 'en' ? '' : lang + '/'
                    }${tour.tgid}`,
                  },
                  bordered: true,
                };
                return (
                  <div className="column">
                    <div className="tour-cta">
                      <CommonCTA {...props}>Book Now</CommonCTA>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
          <div className="row max-content">
            {content_normalized_tours.map((tour, cellIndex) => {
              return (
                <div className="column flat-price-block">
                  <div className="content-block">
                    <div className="block-label">Prices Starting</div>
                    <div className="block-content">
                      <span className="current-price">
                        {tour.currencySymbol}
                        {tour.price}
                      </span>
                      {NB_SPACE}
                      {tour.scratchPrice > tour.price ? (
                        <span className="old-price">
                          {tour.currencySymbol}
                          {tour.scratchPrice}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {orderedLabels
            .filter((label, index) =>
              isMobile && !isExpanded ? index < 2 : true
            )
            .map((label, rowIndex) => {
              return (
                <div className="row">
                  {content_normalized_tours.map((tour, cellIndex) => {
                    return (
                      <div className="column content-block">
                        <div className="block-label">
                          {tour.contentBlocks[label.labelId]?.label}
                        </div>
                        <div className="block-content">
                          <RichText
                            render={tour.contentBlocks[label.labelId]?.content}
                            htmlSerializer={(...defaultArgs: any) =>
                              shortCodeSerializerWithParentProps(
                                defaultArgs,
                                tour
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          {(isMobile && isExpanded) || !isMobile ? (
            <div className="row max-content">
              {content_normalized_tours.map((tour, cellIndex) => {
                return (
                  <div className="column flat-price-block">
                    <div className="content-block">
                      <div className="block-label">Prices Starting</div>
                      <div className="block-content">
                        <span className="current-price">
                          {tour.currencySymbol}
                          {tour.price}
                        </span>
                        {NB_SPACE}
                        {tour.scratchPrice > tour.price ? (
                          <span className="old-price">
                            {tour.currencySymbol}
                            {tour.scratchPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="table cta-table-wrap">
          <div className="row">
            {content_normalized_tours.map((tour, cellIndex) => {
              const props = {
                link: {
                  url: `https://book.${nakedDomain}/book/${
                    lang == 'en' ? '' : lang + '/'
                  }${tour.tgid}`,
                },
              };
              return (
                <div className="column">
                  <div className="tour-cta">
                    <CommonCTA {...props}>Book Now</CommonCTA>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isMobile && !isExpanded ? (
        <CommonCTA clickHandler={() => setExpand(true)} bordered={true}>
          <div className="start-compare-icon">
            Compare All Details {CHEVRON_DOWN}
          </div>
        </CommonCTA>
      ) : null}
    </StyledTourComparisionTable>
  );
  // if (isMobile && isExpanded)
  //   return ReactDOM.createPortal(
  //     <StyledPortal>
  //       <div className="portal-header">
  //         <div className="back" onClick={() => togglePopup()}>
  //           {CHEVRON_LEFT}
  //         </div>
  //       </div>
  //       {ComparisionTable}
  //     </StyledPortal>,
  //     document.body
  //   );
  // else return ;

  return ComparisionTable;
};

export default TourComparisonTable;
