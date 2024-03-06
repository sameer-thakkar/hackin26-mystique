import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import useSWR from 'swr';
import Button from '@headout/aer/src/atoms/Button';
import Conditional from 'components/common/Conditional';
import UIButton from 'components/UI/Button';
import Image from 'UI/Image';
import PriceBlock, { StyledPriceBlock } from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { createBookingURL, getCollectionSection } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { throttle } from 'utils/gen';
import { generateSidenavId } from 'utils/helper';
import { getCancellationPolicyString } from 'utils/productUtils';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { getDuration } from 'utils/timeUtils';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUTTON_LOADING_DURATION,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import Check from 'assets/check';
import ChevronDown from 'assets/chevronDown';
import Cross from 'assets/cross';

const ComparisonTableWrapper = styled.div<{
  $isMobile: boolean;
  $tourCount: number;
  $isTop: boolean;
}>`
  width: auto;
  display: grid;
  line-height: 1.3;

  .heading-wrapper {
    max-width: 1200px;
    margin: auto;
    width: 100%;
  }
  .comparison-heading {
    margin-bottom: 8px;
    ${expandFontToken('Heading/Large')}
    color: ${COLORS.GRAY.G2};
  }
  .comparison-description {
    padding-bottom: 32px;
    max-width: 60%;
    ${expandFontToken('UI/Label Medium')}
    color: ${COLORS.GRAY.G2};
  }

  .tour-title {
    ${expandFontToken('Heading/Product Card')}
    color: ${COLORS.GRAY.G2};
    grid-column: 1 / 3;
  }
  .tour-chin {
    display: grid;
    background: #fff;
    grid-template-columns: auto 1fr;
  }

  .table {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
    grid-row-gap: 24px;
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
    grid-template-columns: repeat(3, 1fr) ${({ $isMobile }) =>
        $isMobile ? '16px' : ''};
    grid-column-gap: 24px;
    border-bottom: 1px solid ${COLORS.GRAY.G6};
    padding-bottom: 24px;
    &:nth-of-type(0n + 1),
    &:last-child,
    &:nth-of-type(0n + 2) {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
  .cta-table-wrap .row {
    padding-top: 32px;
    padding-bottom: 32px;
    margin-bottom: -32px; /* This allows the Sticky Header to end early. without crossing over the CTA button. */
    position: sticky;
    bottom: 0;
    z-index: 3;
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
    ${expandFontToken('Subheading/XS')}
    color: ${COLORS.GRAY.G3};
    grid-row: 1;
    text-decoration: line-through;
  }
  ${StyledPriceBlock} {
    justify-content: left;
    .tour-price {
      ${expandFontToken('UI/Label Large (Heavy)')}
      color: ${COLORS.GRAY.G3};
    }
    .tour-scratch-price {
      ${expandFontToken('Subheading/XS')}
      margin-left: 0;
      color: ${COLORS.GRAY.G3};
      grid-column: unset;
    }
  }

  .row.sticky,
  .sticky.wrapper {
    position: sticky;
    top: 44px;
    background: ${COLORS.BRAND.WHITE};
    z-index: 5;
    margin-bottom: -8px;
    padding: auto 1rem;
  }
  .sticky.wrapper {
    width: 100%;
    height: 4.125rem;
    display: flex;
    align-items: center;
    ${({ $isTop }) =>
      $isTop &&
      `
      border-bottom: 1px solid ${COLORS.GRAY.G6};
    `}
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
    ${expandFontToken('Button/Medium')}
  }
  .vendor-cta a {
    color: ${COLORS.BRAND.PURPS};
    text-decoration: underline;
  }

  ul {
    list-style: initial;
    padding-left: 1em;
    display: grid;
    grid-row-gap: 8px;
    margin: 0;
  }
  color: ${COLORS.GRAY.G3};
  font-size: 14px;
  line-height: 22px;
  a {
    color: ${COLORS.TEXT.CANDY_1};
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
      grid-template-columns:
        0px repeat(${({ $tourCount }) => $tourCount}, 164px)
        4px;
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
    .comparison-heading,
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
      ${expandFontToken('Heading/XS')}
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
    .content-block {
      grid-row-gap: 8px;
    }
    .comparison-heading {
      margin-bottom: 8px;
    }
    .comparison-description {
      ${expandFontToken('Paragraph/Regular')}
      padding-bottom: 24px;
      color: ${COLORS.GRAY.G2};
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
          stroke: ${COLORS.BRAND.PURPS};
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
  img {
    height: 20px;
    width: 20px;
    object-fit: cover;
  }
  p,
  ul,
  li {
    ${expandFontToken('Paragraph/Regular')}
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
  ${expandFontToken('Heading/Small')}
  color: ${COLORS.GRAY.G2};
  @media (max-width: 768px) {
    ${expandFontToken('Heading/XS')}
    color: ${COLORS.GRAY.G3};
  }
`;

const AutomatedTourComparisonTable = ({
  heading,
  description,
  isMobile,
  collectionId,
}: any) => {
  const [isExpanded, setExpand] = useState(false);
  const [isNamesRowTop, setNamesRowTop] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(-1);
  const namesRowRef = useRef<HTMLDivElement>(null);

  const {
    lang,
    host,
    nakedDomain,
    biLink,
    redirectToHeadoutBookingFlow,
    isDev,
    isStage,
  } = useContext(MBContext);
  const currentHost = isDev && !isStage ? `http://${host}` : `https://${host}`;
  const orderedLabels = ['maxDuration', 'inclusions', 'cancellationPolicy'];

  useLayoutEffect(() => {
    if (!window) return;

    const scrollHandler = () => {
      if (!namesRowRef.current) return;

      const namesRowScrollPos = namesRowRef.current.getBoundingClientRect().top;
      if (isNamesRowTop && namesRowScrollPos > 44) setNamesRowTop(false);
      if (!isNamesRowTop && namesRowScrollPos <= 44) setNamesRowTop(true);
    };

    const throttledScrollHandler = throttle(scrollHandler, 300);
    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [isNamesRowTop]);

  useHistoryTraversal({
    action: () => {
      setButtonLoading(-1);
    },
  });

  const getLabelContent = (label: any, tour: any) => {
    if (label === 'maxDuration') {
      if (tour?.[label]) {
        const duration = getDuration({
          minDuration: tour[label],
          maxDuration: tour[label],
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
      const { cancellationPolicy, reschedulePolicy, ticketValidity } = tour;
      const { cancellable } = cancellationPolicy;
      const cancellationPolicyString = getCancellationPolicyString({
        cancellationPolicy,
        reschedulePolicy,
        ticketValidity,
        lang,
        localizedStrings: strings, // found out that this component is csr, so we can simply use strings in place of localizedStrings.
      });

      return {
        title: strings.CANCELLATION_POLICY_HEADING,
        content: (
          <div className="free-cancellation block-content-wrapper">
            <div className="icon">{cancellable ? Check() : Cross()}</div>
            <p>{cancellationPolicyString}</p>
          </div>
        ),
      };
    }
  };

  const onBookNowClick = ({ tgid, position }: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Comparison Card',
      'Div Type': 'product-list',
    });
  };

  const collectionEndpointParams = {
    language: lang,
    'include-unavailable': 'true',
  };
  const collectionEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CollectionSections,
    hostname: currentHost,
    params: collectionEndpointParams,
    id: collectionId,
  });
  const { data: collectionData } = useSWR(collectionEndpoint, {
    fetcher: swrFetcher,
  });
  const headoutPicks = collectionData
    ? getCollectionSection(collectionData, 'HEADOUT_PICKS')
    : [];
  const tourGroups = collectionData
    ? headoutPicks?.filter((item: any) => item.language.toLowerCase() === lang)
    : [];

  return (
    <Conditional if={tourGroups?.length}>
      <ComparisonTableWrapper
        $isTop={isNamesRowTop}
        $isMobile={isMobile}
        $tourCount={tourGroups?.length}
      >
        <div className="heading-wrapper">
          <div className="comparison-heading" id={generateSidenavId(heading)}>
            {heading}
          </div>
          <div className="comparison-description">{description}</div>
        </div>
        <div className="full-width-wrap">
          <div className="table">
            <div className="row max-content">
              {tourGroups?.map((tour: any, index: number) => {
                return (
                  <Column key={index}>
                    <div className="tour-image">
                      <Image
                        url={tour.imageUrl}
                        height={176}
                        width={282}
                        alt={tour.name}
                      />
                    </div>
                  </Column>
                );
              })}
            </div>
            <div className="sticky wrapper" ref={namesRowRef}>
              <div className="row wrapper">
                {tourGroups?.map((tour: any, index: number) => {
                  return (
                    <Column key={index}>
                      <div className="tour-chin">
                        <div className="tour-title">{tour.name}</div>
                        <div className="tour-booster">
                          <PrismicRichText
                            field={tour.cardFooter}
                            components={(...defaultArgs: any) =>
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
            <Conditional if={isExpanded}>
              <div
                className={`row`}
                id="expanded-details-section"
                style={{ marginTop: -8 }}
              >
                {tourGroups?.map((tour: any, index: number) => {
                  const ctaProps = {
                    link: {
                      url: createBookingURL({
                        nakedDomain,
                        lang,
                        tgid: tour.id,
                        biLink,
                        redirectToHeadoutBookingFlow,
                      }),
                    },
                  };
                  return (
                    <Column key={index}>
                      <div className="tour-cta">
                        <Button
                          size="medium"
                          variant="primary"
                          color="purps"
                          text={strings.BOOK_NOW_CTA}
                          isLoading={isButtonLoading === index}
                          height="2.75rem"
                          onClick={() => {
                            setButtonLoading(index);
                            setTimeout(
                              () => setButtonLoading(-1),
                              BUTTON_LOADING_DURATION
                            );
                            window.open(ctaProps.link.url, '_self');
                            onBookNowClick({
                              tgid: tour.tgid,
                              position: index + 1,
                            });
                          }}
                        />
                      </div>
                    </Column>
                  );
                })}
              </div>
            </Conditional>
            <div className="row max-content">
              {tourGroups?.map((tour: any, index: number) => {
                return (
                  <div className="column flat-price-block" key={index}>
                    <div className="content-block">
                      <BlockContent>
                        <PriceBlock
                          lang={lang}
                          listingPrice={tour?.listingPrice}
                          showScratchPrice
                        />
                      </BlockContent>
                    </div>
                  </div>
                );
              })}
            </div>
            {orderedLabels
              .filter((_label, index) =>
                isMobile && !isExpanded ? index < 2 : true
              )
              .map((label, rowIndex) => {
                return (
                  <div
                    className={`row`}
                    id={`comparison-list-details-${rowIndex}`}
                    key={rowIndex}
                  >
                    {tourGroups?.map((tour: any, colIndex: number) => {
                      // @ts-expect-error TS(2339): Property 'title' does not exist on type '{ title: ... Remove this comment to see the full error message
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
            <Conditional if={(isMobile && isExpanded) || !isMobile}>
              <div className={`row max-content`} id="expanded-details-column">
                {tourGroups?.map((tour: any, index: number) => {
                  return (
                    <div className="column flat-price-block" key={index}>
                      <div className="content-block">
                        <BlockLabel>{strings.PRICES_STARTING}</BlockLabel>
                        <BlockContent>
                          <PriceBlock
                            lang={lang}
                            listingPrice={tour?.listingPrice}
                            showScratchPrice
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
              {tourGroups?.map((tour: any, index: number) => {
                const ctaProps = {
                  link: {
                    url: createBookingURL({
                      nakedDomain,
                      lang,
                      tgid: tour.id,
                      flowType: tour.flowType,
                      biLink,
                      redirectToHeadoutBookingFlow,
                    }),
                  },
                };
                return (
                  <Column key={index}>
                    <div className="tour-cta">
                      <Button
                        size="medium"
                        variant="primary"
                        color="purps"
                        isLoading={isButtonLoading === index}
                        text={strings.BOOK_NOW_CTA}
                        height="2.75rem"
                        onClick={() => {
                          setButtonLoading(index);
                          setTimeout(
                            () => setButtonLoading(-1),
                            BUTTON_LOADING_DURATION
                          );
                          window.open(ctaProps.link.url, '_self');
                          onBookNowClick({
                            tgid: tour.tgid,
                            position: index + 1,
                          });
                        }}
                      />
                    </div>
                  </Column>
                );
              })}
            </div>
          </div>
        </div>
        <Conditional if={isMobile && !isExpanded}>
          <UIButton
            onClick={() => setExpand(true)}
            id="compare-all-details-button"
          >
            <div className="start-compare-icon">
              {strings.COMPARE_ALL_DETAILS} <ChevronDown />
            </div>
          </UIButton>
        </Conditional>
      </ComparisonTableWrapper>
    </Conditional>
  );
};

export default AutomatedTourComparisonTable;
