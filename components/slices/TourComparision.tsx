import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Image from '../UI/Image';
import parse from 'url-parse';
import * as LABELS from '../../public/static/localization/labels';
import EnvironmentContext from '../../contexts/environmentContext';
import { RichText } from 'prismic-reactjs';
import { AVENIR, COLORS, GRAPHIK } from '../../constants/ui-constants';
import { ProductsContext } from '../../contexts/Products';
import { shortCodeSerializerWithParentProps } from '../../utils/shortCodes';
import { MBContext } from '../../contexts/MBContext';
import CommonCTA from '../UI/CTA';
import styled from 'styled-components';
import Popup from '../common/Popup';
import { CHEVRON_LEFT } from '../../public/static/svg-icons';

const StyledTourComparisionTable = styled.div`
  width: auto;
  display: grid;
  line-height: 1.3;
  font-family: ${GRAPHIK.FONT_STACK};
  .comparision-heading {
    font-size: 24px;
    margin-bottom: 4px;
    font-weight: ${AVENIR.HEAVY};
    font-family: ${AVENIR.FONT_STACK};
  }
  .comparision-description {
    padding-bottom: 32px;
    font-size: 14px;
    font-family: ${AVENIR.FONT_STACK};
  }
  .tour-title {
    font-family: ${AVENIR.FONT_STACK};
    font-weight: ${AVENIR.HEAVY};
    line-height: 1.33;
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
  .row {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(${({ tourCount }) => tourCount}, 1fr) 16px;
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
    color: ${COLORS.GREY_75};
    grid-row: 1;
    text-decoration: line-through;
  }
  .current-price {
    font-size: 16px;
    font-family: ${AVENIR.FONT_STACK};
    color: ${COLORS.DAVY_GREY};
  }
  .flat-price-block .current-price {
    font-family: ${GRAPHIK.FONT_STACK};
    font-weight: ${GRAPHIK.HEAVY};
    color: ${COLORS.DAVY_GREY};
  }

  .row.sticky {
    position: sticky;
    top: 0;
    background: ${COLORS.WHITE};
    z-index: 15;
  }

  .column p {
    margin: 0;
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
    grid-row-gap: 8px;
    grid-template-rows: 1em 1fr;
  }
  .block-label {
    font-size: 16px;
    font-weight: ${AVENIR.HEAVY};
    font-family: ${AVENIR.FONT_STACK};
    line-height: 1.12;
  }
  .block-content {
    font-size: 15px;
    line-height: 1.33;
    font-family: ${GRAPHIK.FONT_STACK};
    font-weight: ${GRAPHIK.REGULAR};
  }
  .vendor-cta {
    margin-top: -8px;
    text-align: center;
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
  }
  @media (max-width: 768px) {
    .full-width-wrap {
      margin: 0 -16px;
      ${({ isExpanded, isMobile }) =>
        !isExpanded && isMobile
          ? `
        overflow-y: hidden;
        overflow-x: scroll;
        overscroll-behavior-x: contain;
        padding-bottom: 20px;
      `
          : ''}
    }
    .table {
      grid-row-gap: 32px;
      position: relative;
    }
    .row {
      grid-column-gap: 12px;
    }
    .column .tour-image img {
      width: auto;
      height: 102px;
    }
    .full-width-wrap {
      margin-bottom: 32px;
    }
    .column:first-child {
      padding-left: 16px;
    }
    .column:last-child {
      padding-right: 16px;
    }
    .row .column:not(:first-child) .block-label {
      visibility: initial;
    }
    .tour-title {
      font-size: 14px;
      grid-column: 1;
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

    .block-label {
      font-size: 12px;
      color: ${COLORS.GREY_75};
      font-family: ${GRAPHIK.FONT_STACK};
      font-weight: ${GRAPHIK.MEDIUM};
    }
    .block-content {
      font-size: 15px;
    }
  }
`;

const StyledPortal = styled.div`
  padding: 0 16px;
  display: grid;
  overflow: hidden;
  height: 100vh;
  grid-template-rows: 60px auto;
  .portal-header {
    display: grid;
    align-items: center;
    justify-content: left;
  }
  .full-width-wrap {
    overflow: scroll;
    height: calc(100vh - 60px);
  }
  .back {
    padding: 8px;
    padding-left: 0;
  }
  .row {
    margin-left: 16px;
  }
  .row::after {
    content: '';
    width: 4px;
    height: 4px;
    display: block;
  }
  .column:first-child {
    padding-left: 0;
  }
  .column:last-child {
    padding-right: 0;
  }
  .vendor-cta {
    margin-bottom: 40px;
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
  const allTours = toursContext.allTours;
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
  const togglePopup = () => {
    setExpand(!isExpanded);
  };
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (window) {
      const mbParentEl = window.document.getElementById('body-wrap');
      if (isExpanded) {
        setScrollPosition(window.scrollY);
        mbParentEl.style.display = 'none';
        window.scrollTo(0, 0);
      } else {
        mbParentEl.style.display = 'unset';
        window.scrollTo(0, scrollPosition);
      }
    }
  }, [isExpanded]);
  const ComparisionTable = (
    <StyledTourComparisionTable
      isExpanded={isExpanded}
      isMobile={isMobile}
      tourCount={tgidArray.length}
    >
      {!isExpanded ? (
        <>
          <div className="comparision-heading">{heading}</div>
          <div className="comparision-description">{description}</div>
        </>
      ) : null}

      <div className="full-width-wrap">
        <div className="table">
          <div className="row max-content">
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
          <div className="row max-content">
            {content_normalized_tours.map((tour, cellIndex) => {
              return (
                <div className="column flat-price-block">
                  <div className="content-block">
                    <div className="block-label">Price</div>
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
          {isExpanded || !isMobile ? (
            <>
              <div className="row">
                {content_normalized_tours.map((tour, cellIndex) => {
                  const props = {
                    link: {
                      url: `https://book.${nakedDomain}/book/${
                        lang == 'en' ? '' : lang + '/'
                      }${tour.tgid}`,
                    },
                    text: 'Book Now',
                    bordered: true,
                  };
                  return (
                    <div className="column">
                      <div className="tour-cta">
                        <CommonCTA {...props} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="row">
                {content_normalized_tours.map((tour, cellIndex) => {
                  const props = {
                    link: {
                      url: `https://book.${nakedDomain}/book/${
                        lang == 'en' ? '' : lang + '/'
                      }${tour.tgid}`,
                    },
                    text: 'Book Now',
                    bordered: true,
                  };
                  return (
                    <div className="column">
                      {tour.vendor ? (
                        <div className="vendor-cta">
                          <a href={tour.vendorLink} className="cta-btn">
                            {LABELS[lang].MORE_FROM} {isMobile ? <br /> : null}{' '}
                            {tour.vendor}
                          </a>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div>
        {isMobile && !isExpanded ? (
          <CommonCTA
            text={'Compare ' + content_normalized_tours.length}
            clickHandler={() => togglePopup()}
            bordered={true}
          />
        ) : null}
      </div>
    </StyledTourComparisionTable>
  );
  if (isMobile && isExpanded)
    return ReactDOM.createPortal(
      <StyledPortal>
        <div className="portal-header">
          <div className="back" onClick={() => togglePopup()}>
            {CHEVRON_LEFT}
          </div>
        </div>
        {ComparisionTable}
      </StyledPortal>,
      document.body
    );
  else return ComparisionTable;
};

export default TourComparisonTable;
