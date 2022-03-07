import React, { useContext, useEffect, useState } from 'react';
import { useAmp } from 'next/amp';
import useSWR from 'swr';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import PriceBlock, { StyledPriceBlock } from 'UI/PriceBlock';
import EnvironmentContext from 'contexts/environmentContext';
import { MBContext } from 'contexts/MBContext';
import Image from 'components/UI/Image';
import Button from 'components/UI/Button';
import { createBookingURL } from 'utils';
import { CHEVRON_DOWN, CHECK, CROSS } from 'assets/SvgIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { SOLEIL, COLORS } from 'const/ui-constants';
import Conditional from 'components/common/Conditional';
import { trackEvent } from 'utils/analytics';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { getDuration } from 'utils/timeUtils';

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
    grid-row-gap: 16px;
    grid-column-gap: 8px;
  }
  .row {
    max-width: 1200px;
    margin: auto;
    /* to line up correctly with other slices/elements.  */
    /* 5.46 is the padding added to other elements on page. */
    width: calc(100%);
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(3, 1fr) ${({ isMobile }) =>
        isMobile ? '16px' : ''};
    grid-column-gap: 24px;
    border-bottom: 1px solid ${COLORS.GREY.G6};
    padding-bottom: 16px;
    &:nth-of-type(0n + 1),
    &:last-child,
    &:nth-of-type(0n + 2) {
      border-bottom: none;
      padding-bottom: 0;
    }
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
    margin-bottom: -8px;
  }
  .sticky.wrapper {
    width: 100%;
    max-width: unset;
  }

  .content-block .popup-trigger {
    font-size: 13px;
    line-height: 20px;
  }

  .tour-image {
    margin-bottom: -8px;
  }

  .content-block {
    display: grid;
    grid-row-gap: 12px;
    grid-template-rows: auto 1fr;
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
  a {
    color: ${COLORS.HEADOUT_CANDY};
  }
  .free-cancellation {
    display: grid;
    grid-template-columns: 24px auto;
    grid-gap: 10px;
    .icon {
      display: grid;
      align-items: center;
      justify-content: center;
    }
  }
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
      width: 100% !important;
      grid-column-gap: 16px;
      grid-template-columns: 0px repeat(${({ tourCount }) => tourCount}, 164px) 4px;
      position: relative;
    }
    .row::before {
      display: grid;
      content: '';
    }
    .row::after {
      content: '';
      width: 16px;
      background: #fff;
      height: 2px;
      position: absolute;
      left: 0;
      bottom: -2px;
    }

    .row,
    .comparision-heading,
    #compare-all-details-button {
      max-width: unset;
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
      max-width: 100%;
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
    .no-display {
      display: none;
    }
    .show-two-children:nth-child(0) {
      display: grid;
    }
    .show-two-children:nth-child(0) {
      display: grid;
    }
  }

  /* CSS Target Safari. (double @media intentional) */
  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {
      .full-width-wrap {
        max-width: 100vw;
      }
    }
  }
`;

const Column = styled.div`
  p {
    margin: 0;
  }
  .tour-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  :not(:first-child) .block-label {
    visibility: hidden;
  }
  @media (max-width: 768px) {
    .tour-image img {
      width: auto;
      height: 102px;
    }
    :not(:first-child) .block-label {
      visibility: initial;
    }
  }
`;

const BlockContent = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${SOLEIL.REGULAR};
  color: ${COLORS.FOUR_BLACK};
  font-size: 14px;
  line-height: 22px;
  img {
    height: 20px;
    width: 20px;
    object-fit: cover;
  }
  p,
  ul,
  li {
    font-size: 1rem;
    line-height: 1.6;
    color: rgb(68, 68, 68);
    font-family: soleil, sans-serif;
  }
  @media (max-width: 768px) {
    width: 164px;
    div.block-content-wrapper,
    li {
      width: 100%;
    }
  }
`;

const BlockLabel = styled.div`
  font-weight: ${SOLEIL.SEMIBOLD};
  font-family: ${SOLEIL.FONT_STACK};
  letter-spacing: 0.5px;
  color: ${COLORS.GREY_G4};
  font-size: 14px;
  line-height: 22px;
  @media (max-width: 768px) {
    color: ${COLORS.GREY_75};
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.MEDIUM};
  }
`;

const AutomatedTourComparisonTable = ({
  heading,
  description,
  isMobile,
  collectionId,
}) => {
  const [isExpanded, setExpand] = useState(false);
  const [itemArray, setItemArray] = useState([]);

  const envContext = useContext(EnvironmentContext);
  const mbContext = useContext(MBContext);
  const isAmp = useAmp();
  const { nakedDomain, biLink } = mbContext;
  const lang = mbContext.lang || 'en';
  const host = mbContext?.host;
  const currentHost = !envContext.isDev ? `https://${host}` : `http://${host}`;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  const orderedLabels = ['maxDuration', 'inclusions', 'cancellationPolicy'];

  const getLabelContent = (label, tour) => {
    if (label === 'maxDuration') {
      if (tour?.[label]) {
        const duration = getDuration({
          minDuration: tour?.[label],
          maxDuration: tour?.[label],
          lang,
        });
        return {
          title: strings.DURATION,
          content: <p>{duration}</p>,
        };
      } else {
        return {
          title: strings.DURATION,
          content: <p>{strings.FLEXIBLE}</p>,
        };
      }
    } else if (label == 'inclusions') {
      const content = tour?.[label];

      return {
        title: strings.INCLUSIONS,
        content: (
          <div
            className="block-content-wrapper"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ),
      };
    } else if (label == 'cancellationPolicy') {
      if (tour?.[label]?.cancellable) {
        const hours = Math.floor(tour?.[label]?.cancellableUpTo / 60);
        return {
          title: strings.FREE_CANCELLATION,
          content: (
            <div className="free-cancellation block-content-wrapper">
              <div className="icon">{CHECK}</div>
              <p>
                {strings.TICKET_CAN_BE_CANCELED.replace(
                  '{hours}',
                  hours.toString()
                )}
              </p>
            </div>
          ),
        };
      } else {
        return {
          title: strings.FREE_CANCELLATION,
          content: (
            <div className="free-cancellation block-content-wrapper">
              <div className="icon">{CROSS}</div>
              <p>{strings.TICKET_CANNOT_BE_CANCELED}</p>
            </div>
          ),
        };
      }
    }
  };

  // Return null if no / only one tgid given/available
  // if (tgidArray.length <= 1) return null;
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
  const collectionEndpointParams = {
    language: lang,
    'include-unavailable': 'true',
  };
  const collectionEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupCollectionV1,
    hostname: hostName,
    params: collectionEndpointParams,
    id: collectionId,
  });
  const { data: collectionData } = useSWR(collectionEndpoint, {
    fetcher: swrFetcher,
  });
  useEffect(() => {
    const headoutPicks = collectionData?.sections
      ?.filter((section) => {
        if (section?.type === 'HEADOUT_PICKS') {
          return section?.tourGroups?.items;
        }
      })?.[0]
      ?.tourGroups?.items?.filter(
        (item) => item.language.toLowerCase() === lang
      );
    setItemArray(headoutPicks);
  }, [collectionData]);

  return (
    <Conditional if={itemArray?.length}>
      <StyledTourComparisionTable
        isExpanded={isExpanded || isAmp}
        isMobile={isMobile}
        tourCount={itemArray?.length}
      >
        <div className="heading-wrapper">
          <div className="comparision-heading">{heading}</div>
          <div className="comparision-description">{description}</div>
        </div>
        <div className="full-width-wrap">
          <div className="table">
            <div className="row max-content" style={{ zIndex: -1 }}>
              {itemArray?.map((tour, index) => {
                return (
                  <Column key={index}>
                    <div className="tour-image">
                      <Image url={tour.imageUrl} height={176} width={282} />
                    </div>
                  </Column>
                );
              })}
            </div>
            <div className="sticky wrapper">
              <div className="row wrapper">
                {itemArray?.map((tour, index) => {
                  return (
                    <Column key={index}>
                      <div className="tour-chin">
                        <div className="tour-title">{tour.name}</div>
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
                    </Column>
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
                {itemArray?.map((tour, index) => {
                  const ctaProps = {
                    link: {
                      url: createBookingURL({
                        nakedDomain,
                        lang,
                        tgid: tour.id,
                        biLink,
                      }),
                    },
                  };
                  return (
                    <Column key={index}>
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
                          <Button widthProp="100%">
                            {strings.BOOK_NOW_CTA}
                          </Button>
                        </a>
                      </div>
                    </Column>
                  );
                })}
              </div>
            </Conditional>
            <div className="row max-content">
              {itemArray?.map((tour, index) => {
                return (
                  <div className="column flat-price-block" key={index}>
                    <div className="content-block">
                      <BlockContent>
                        <PriceBlock
                          lang={lang}
                          price={tour.listingPrice}
                          showScratchPrice={true}
                          prefix={false}
                        />
                      </BlockContent>
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
                    {itemArray?.map((tour, colIndex) => {
                      const { title, content } = getLabelContent(label, tour);
                      return (
                        <Column key={colIndex}>
                          <div className="content-block" key={colIndex}>
                            <BlockLabel>{title}</BlockLabel>
                            <BlockContent>{content}</BlockContent>
                          </div>
                        </Column>
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
                {itemArray?.map((tour, index) => {
                  return (
                    <div className="column flat-price-block" key={index}>
                      <div className="content-block">
                        <BlockLabel>{strings.PRICES_STARTING}</BlockLabel>
                        <BlockContent>
                          <PriceBlock
                            lang={lang}
                            price={tour.listingPrice}
                            showScratchPrice={true}
                          />
                        </BlockContent>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Conditional>
          </div>
          <div className="table cta-table-wrap">
            <div className="row">
              {itemArray?.map((tour, index) => {
                const ctaProps = {
                  link: {
                    url: createBookingURL({
                      nakedDomain,
                      lang,
                      tgid: tour.id,
                      biLink,
                    }),
                  },
                };
                return (
                  <Column key={index}>
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
                        <Button type="fill" widthProp="100%">
                          {strings.BOOK_NOW_CTA}
                        </Button>
                      </a>
                    </div>
                  </Column>
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
    </Conditional>
  );
};

export default AutomatedTourComparisonTable;
