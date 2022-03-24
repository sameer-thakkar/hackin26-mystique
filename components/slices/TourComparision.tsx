import React, { useContext, useState } from 'react';
import { useAmp } from 'next/amp';
import styled from 'styled-components';
import parse from 'url-parse';
import { RichText } from 'prismic-reactjs';
import PriceBlock, { StyledPriceBlock } from 'UI/PriceBlock';
import EnvironmentContext from 'contexts/environmentContext';
import ProductsContext from 'contexts/Products';
import { MBContext } from 'contexts/MBContext';
import Image from 'components/UI/Image';
import Button from 'components/UI/Button';
import { createBookingURL } from 'utils';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { CHEVRON_DOWN } from 'assets/SvgIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  TOUR_COMPARISION_DESIGN,
} from 'const/index';
import { strings } from 'const/strings';
import { SOLEIL, COLORS } from 'const/ui-constants';
import Conditional from 'components/common/Conditional';
import { trackEvent } from 'utils/analytics';

const StyledTourComparisionTable = styled.div`
  width: auto;
  display: grid;
  line-height: 1.3;
  font-family: ${SOLEIL.FONT_STACK};
  .heading-wrapper {
    max-width: 1200px;
    margin: auto;
    width: 100%;
  }
  .comparision-heading {
    text-align: left;
    font-size: 24px;
    margin-bottom: 8px;
    font-weight: ${SOLEIL.MEDIUM};
    font-family: ${SOLEIL.FONT_STACK};
    color: ${COLORS.TWO_BLACK};
    line-height: 33px;
  }
  .comparision-description {
    padding-bottom: 32px;
    max-width: 60%;
    font-size: 16px;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.REGULAR};
    line-height: 20px;
    color: ${COLORS.FOUR_BLACK};
  }

  .tour-title {
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.SEMIBOLD};
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
    ${({ designType }) =>
      designType == TOUR_COMPARISION_DESIGN.TYPE_2
        ? `
      grid-row-gap: 16px;
    `
        : ``}
    grid-column-gap: 8px;
  }
  .row {
    max-width: 1200px;
    margin: auto;
    /* to line up correctly with other slices/elements.  */
    /* 5.46 is the padding added to other elements on page. */
    width: calc(100% - (5.46vw * 2));
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(4, 1fr) ${({ isMobile }) =>
      isMobile ? '16px' : ''};
    grid-column-gap: 24px;
    ${({ designType, showImage }) =>
      designType == TOUR_COMPARISION_DESIGN.TYPE_2
        ? `
      border-bottom: 1px solid ${COLORS.GREY.G6};
      padding-bottom: 16px;
      &:nth-of-type(0n+1),
      &:last-child
      ${showImage ? ', &:nth-of-type(0n+2)' : ''}{
        border-bottom: none;
        padding-bottom: 0;
      }
    `
        : ``}
  }
  .cta-table-wrap .row {
    background: ${COLORS.WHITE};
    padding-top: 32px;
    padding-bottom: 32px;
    margin-bottom: -32px; /* This allows the Sticky Header to end early. without crossing over the CTA button. */
    position: sticky;
    bottom: 0;
    z-index: 15;
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
    font-family: ${SOLEIL.FONT_STACK};
    color: ${COLORS.GREY_G4};
    line-height: 16px;
    grid-row: 1;
    text-decoration: line-through;
  }
  ${StyledPriceBlock} {
    justify-content: left;
    .tour-price {
      font-size: 16px;
      font-family: ${SOLEIL.FONT_STACK};
      font-weight: ${SOLEIL.SEMIBOLD};
      color: ${COLORS.FOUR_BLACK};
      line-height: 20px;
    }
    .tour-price {
      font-family: ${SOLEIL.FONT_STACK};
      font-weight: ${SOLEIL.SEMIBOLD};
      color: ${COLORS.FOUR_BLACK};
    }
    .tour-scratch-price {
      font-size: 14px;
      font-family: ${SOLEIL.FONT_STACK};
      margin-left: 0;
      color: ${COLORS.FOUR_BLACK};
      grid-column: unset;
    }
  }

  .row.sticky,
  .sticky.wrapper {
    position: sticky;
    top: 12px;
    background: ${COLORS.WHITE};
    z-index: 15;
    padding-bottom: 8px;
    ${({ designType }) =>
      designType == TOUR_COMPARISION_DESIGN.TYPE_2
        ? `
      margin-bottom: -8px;
    `
        : ``}
  }
  .sticky.wrapper {
    width: 100%;
    max-width: unset;
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
    ${({ designType }) =>
      designType == TOUR_COMPARISION_DESIGN.TYPE_2
        ? `
      margin-bottom: -8px;
  `
        : ``}
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
    font-weight: ${SOLEIL.SEMIBOLD};
    font-family: ${SOLEIL.FONT_STACK};
    line-height: 18px;
    letter-spacing: 0.5px;
    color: ${COLORS.GREY_G4};
    ${({ designType }) =>
      designType == TOUR_COMPARISION_DESIGN.TYPE_2
        ? `
      color: ${COLORS.GREY_6D};
      font-size: 14px;
      line-height: 22px;
    `
        : ``}
  }

  .block-content {
    font-size: 15px;
    line-height: 20px;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.REGULAR};
    color: ${COLORS.FOUR_BLACK};
    ${({ designType }) =>
      designType == TOUR_COMPARISION_DESIGN.TYPE_2
        ? `
      font-size: 14px;
      line-height: 22px;
    `
        : ``}
    img {
      height: 20px;
      width: 20px;
      object-fit: cover;
    }
  }
  .vendor-cta {
    margin-top: -8px;
    text-align: center;
    line-height: 16px;
    font-size: 14px;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.MEDIUM};
  }
  .vendor-cta a {
    color: ${COLORS.PURPS};
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
    margin: 0;
  }
  color: ${COLORS.GREY_6D};
  font-size: 14px;
  line-height: 22px;
  ${({ designType }) =>
    designType == TOUR_COMPARISION_DESIGN.TYPE_2
      ? `
    a {
      color: ${COLORS.HEADOUT_CANDY};
    }
    `
      : ``}
  @media (max-width: 768px) {

    .full-width-wrap {
      margin: 0 -16px;
      padding-right: 16px;
      max-width: unset;
      width: 100%;
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
      position: relative;
    }
    .row {
      max-width: 100vw;
      grid-column-gap: 12px;
      ${({ designType }) =>
        designType == TOUR_COMPARISION_DESIGN.TYPE_2
          ? `
      grid-column-gap: 16px;
      `
          : ``}
      grid-template-columns: 0px repeat(${({ tourCount }) =>
        tourCount}, 164px) 4px;
      position: relative;
    }
    .row::before {
      display: grid;
      content: '';
    }
    .row::after{
      content: '';
      width: 16px;
      background: #fff;
      height: 2px;
      position: absolute;
      left: 0;
      bottom: -2px;
    }

    .column .tour-image img {
      width: auto;
      height: 102px;
    }
    .row .column:not(:first-child) .block-label {
      visibility: initial;
    }
    .row,
    .comparision-heading,
    #compare-all-details-button {
      max-width: unset;
      margin: 0 16px;
      width: calc(100% - 32px); 
    }
    ${StyledPriceBlock} {
      .tour-price {
        font-size: 15px;
      }
      .tour-scratch-price {
        font-size: 12px;
      }
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
      ${({ designType }) =>
        designType == TOUR_COMPARISION_DESIGN.TYPE_2
          ? ``
          : `
        font-size: 12px;
        line-height: 12px;
      `}
      color: ${COLORS.GREY_75};
      font-family: ${SOLEIL.FONT_STACK};
      font-weight: ${SOLEIL.MEDIUM};
    }
    .block-content {
    ${({ designType }) =>
      designType == TOUR_COMPARISION_DESIGN.TYPE_2
        ? ``
        : `
      font-size: 15px;
    `}
    }
    .comparision-heading {
      font-family: ${SOLEIL.FONT_STACK};
      font-weight: ${SOLEIL.MEDIUM};
      line-height: 26px;
      margin-bottom: 8px;
    }
    .comparision-description {
      font-size: 16px;
      color: ${COLORS.DAVY_GREY};
      font-weight: ${SOLEIL.REGULAR};
      padding-bottom: 24px;
      width: 100%;
    }
    .wrapper.sticky {
      z-index: unset;
    }
    .cta-table-wrap .row {
      padding-bottom: 8px;
      margin-bottom: 0;
      z-index: 2;
    }
    .start-compare-icon {
      display: grid;
      align-items: center;
      grid-template-columns: auto auto;
      grid-column-gap: 10px;
      justify-content: center;
      svg {
        path {
          stroke: ${COLORS.PURPS};
          stroke-width: 1.5px;
        }
      }
    }
    .no-display{
      display: none;
    }
    .show-two-children:nth-child(0){
      display:grid;
    }
    .show-two-children:nth-child(0){
      display:grid;
    }
  }

  /* CSS Target Safari. (double @media intentional) */
  @media not all and (min-resolution:.001dpcm){ 
    @supports (-webkit-appearance:none) {
      .full-width-wrap {
        max-width: 100vw;
      }
  }}
`;

/**
 * Comparision table slice allows you to compare product highlights of two or more tours side-by-side
 *
 * ## Repeatable Zone:
 *  - Label Order: ('Select Lables')
 *
 *  > Select the order in which the labels need to appear in the table.
 *
 * ## Non Repeatable Zone;
 * - Heading:
 *
 *  > Sets the Heading for the Coparision Table.
 * - Description
 *
 *  > Sets a short description for Comparision Table.
 *
 * - Show Image
 *
 *  > Set to no, if you want to hide the image.
 *
 * -Design Type,
 *  > Currently there are two designs for Comparision Table, select the appropriate design you require.
 *
 *
 *
 * - CSV TGIDs List:
 *
 *  > Add comma seperated tgids of the tour to be shown in the table (ex: 508, 509...)
 *
 *  > **Ensure** the TGID you enter has been entered in the All Tours Tab
 *
 */

const TourComparisonTable = (props) => {
  const {
    heading,
    description,
    tgidsCSV,
    isMobile,
    orderedLabels,
    vendors,
    vendorLinks,
    designType = 'Type-1',
    showImage = true,
  } = props;
  const [isExpanded, setExpand] = useState(false);
  const envContext = useContext(EnvironmentContext);
  const toursContext = useContext(ProductsContext);
  const mbContext = useContext(MBContext);
  const isAmp = useAmp();
  const url = envContext.windowUrl;
  const { uid, nakedDomain, biLink } = mbContext;
  const lang = mbContext.lang || 'en';
  const currentHost = !envContext.isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const { allTours } = toursContext;
  const getContentNormalizedTours = (tgidArray) => {
    let toursArr = tgidArray.map((tgid) => allTours[tgid]);
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
    .map((tgid) => parseInt(tgid))
    .filter((tgid) => allTours[tgid]?.available);
  const content_normalized_tours = getContentNormalizedTours(tgidArray);

  // Return null if no / only one tgid given/available
  if (tgidArray.length <= 1) return null;
  // @ts-ignore
  const compareTableOnClickForAMP = Array(...Array(orderedLabels.length).keys())
    .map(
      (el) => `comparison-list-details-${el}.toggleClass(class='no-display')`
    )
    .join(',');

  const onBookNowClick = ({ tgid, position }) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Comparision Card',
      'Div Type': 'product-list',
    });
  };

  return (
    <StyledTourComparisionTable
      isExpanded={isExpanded || isAmp}
      isMobile={isMobile}
      tourCount={tgidArray.length}
      designType={designType}
      showImage={showImage}
    >
      <div className="heading-wrapper">
        <div className="comparision-heading">{heading}</div>
        <div className="comparision-description">{description}</div>
      </div>
      <div className="full-width-wrap">
        <div className="table">
          <Conditional if={showImage}>
            <div className="row max-content" style={{ zIndex: -1 }}>
              {content_normalized_tours.map((tour, index) => {
                return (
                  <div className="column" key={index}>
                    <div className="tour-image">
                      <Image url={tour.productImage} height={176} width={282} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Conditional>
          <div className="sticky wrapper">
            <div className="row wrapper">
              {content_normalized_tours.map((tour, index) => {
                return (
                  <div className="column" key={index}>
                    <div className="tour-chin">
                      <div className="tour-title">{tour.title}</div>
                      <div className="tour-booster">
                        <RichText
                          render={tour.cardFooter}
                          htmlSerializer={(...defaultArgs: any) =>
                            shortCodeSerializerWithParentProps(
                              defaultArgs,
                              tour
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Conditional if={isExpanded || isAmp}>
            <div
              className={`row ${isAmp ? 'no-display' : ''}`}
              id="expanded-details-section"
              style={{ marginTop: -8 }}
            >
              {content_normalized_tours.map((tour, index) => {
                const ctaProps = {
                  link: {
                    url: createBookingURL({
                      nakedDomain,
                      lang,
                      tgid: tour.tgid,
                      biLink,
                    }),
                  },
                };
                return (
                  <div className="column" key={index}>
                    <div className="tour-cta">
                      <a
                        href={ctaProps.link.url}
                        onClick={() =>
                          onBookNowClick({
                            tgid: tour.tgid,
                            position: index + 1,
                          })
                        }
                      >
                        <Button widthProp="100%">{strings.BOOK_NOW_CTA}</Button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </Conditional>
          <div className="row max-content">
            {content_normalized_tours.map((tour, index) => {
              return (
                <div className="column flat-price-block" key={index}>
                  <div className="content-block">
                    <Conditional
                      if={designType == TOUR_COMPARISION_DESIGN.TYPE_1}
                    >
                      <div className="block-label">
                        {strings.PRICES_STARTING}
                      </div>
                    </Conditional>
                    <div className="block-content">
                      <PriceBlock
                        lang={lang}
                        price={tour.listingPrice}
                        showScratchPrice={true}
                        prefix={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {orderedLabels
            .filter((label, index) =>
              isMobile && !isExpanded && !isAmp ? index < 2 : true
            )
            .map((label, rowIndex) => {
              return (
                <div
                  className={`row ${
                    rowIndex >= 2 && isAmp ? 'no-display' : ''
                  } `}
                  id={`comparison-list-details-${rowIndex}`}
                  key={rowIndex}
                >
                  {content_normalized_tours.map((tour, colIndex) => {
                    return (
                      <div className="column content-block" key={colIndex}>
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
          <Conditional if={(isMobile && isExpanded) || !isMobile || isAmp}>
            <div
              className={`row max-content ${isAmp ? 'no-display' : ''}`}
              id="expanded-details-column"
            >
              {content_normalized_tours.map((tour, index) => {
                return (
                  <div className="column flat-price-block" key={index}>
                    <div className="content-block">
                      <div className="block-label">
                        {strings.PRICES_STARTING}
                      </div>
                      <div className="block-content">
                        <PriceBlock
                          lang={lang}
                          price={tour.listingPrice}
                          showScratchPrice={true}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Conditional>
        </div>
        <div className="table cta-table-wrap">
          <div className="row">
            {content_normalized_tours.map((tour, index) => {
              const ctaProps = {
                link: {
                  url: createBookingURL({
                    nakedDomain,
                    lang,
                    tgid: tour.tgid,
                    biLink,
                  }),
                },
              };
              return (
                <div className="column" key={index}>
                  <div className="tour-cta">
                    <a
                      href={ctaProps.link.url}
                      onClick={() =>
                        onBookNowClick({ tgid: tour.tgid, position: index + 1 })
                      }
                    >
                      <Button fillType="fill" widthProp="100%">
                        {strings.BOOK_NOW_CTA}
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Conditional if={isMobile && !isExpanded}>
        <Button
          onClick={() => setExpand(true)}
          id="compare-all-details-button"
          on={`
              tap:expanded-details-section.toggleClass(class='no-display'),
              expanded-details-column.toggleClass(class='no-display'),
              compare-all-details-button.toggleClass(class='no-display', force=true),
              ${compareTableOnClickForAMP}
            `}
        >
          <div className="start-compare-icon">
            {strings.COMPARE_ALL_DETAILS} {CHEVRON_DOWN}
          </div>
        </Button>
      </Conditional>
    </StyledTourComparisionTable>
  );
};

export default TourComparisonTable;
