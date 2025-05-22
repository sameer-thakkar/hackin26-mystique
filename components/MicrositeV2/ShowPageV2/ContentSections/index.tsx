import {
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { JSXFunctionSerializer, PrismicRichText } from '@prismicio/react';
import { Link, Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { TContentSectionsProps } from 'components/MicrositeV2/ShowPageV2/ContentSections/interface';
import {
  Content,
  ContentSectionsWrapper,
  ContentWrapper,
} from 'components/MicrositeV2/ShowPageV2/ContentSections/style';
import CriticReview from 'components/MicrositeV2/ShowPageV2/CriticReview';
import ReviewSection from 'components/MicrositeV2/ShowPageV2/ReviewSection';
import GoogleMap from 'components/ShowPages/GoogleMap';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import ScrollableTabs from 'UI/ScrollableTabs';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  HIGHLIGHT_TYPES,
  LANGUAGE_CODE_MAP,
} from 'const/index';
import { strings } from 'const/strings';
import AdditionalInfo from 'assets/additionalInfo';
import AgeSuitability from 'assets/ageSuitability';
import CancellationAndRefunds from 'assets/cancellationAndRefunds';
import CastAndCrew from 'assets/castAndCrew';
import CriticReviewIcon from 'assets/criticReview';
import Facilities from 'assets/facilities';
import GettingThere from 'assets/gettingThere';
import Location from 'assets/location';
import ShowTimings from 'assets/showTimings';
import StarEmptyNew from 'assets/starEmptyNew';
import Story from 'assets/story';
import TicketsRedemption from 'assets/ticketsRedemption';
import TopSongs from 'assets/topSongs';
import WhyWatch from 'assets/whyWatch';
import { useIsLTTShowPageExperiementEnabled } from '../hooks/useIsLTTShowPageExperiementEnabled';
import { Divider } from '../ShowPageDescriptorSection/stlye';

const ContentSections = ({
  tourGroupData,
  name,
  isMobile,
  uid,
}: TContentSectionsProps) => {
  const contentSectionsRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  const aboutTheShowSectionRef = useRef<HTMLDivElement>(null);
  const [initialScrollPosition, setInitialScrollPosition] = useState(0);
  const { lang } = useContext(MBContext);

  const { microBrandsHighlight, id, reviewsDetails, topReviews } =
    tourGroupData;
  const { ratingsCount } = reviewsDetails ?? {};
  const TABS = [
    strings.SHOW_PAGE_V2.CONTENT_TABS.ABOUT,
    strings.SHOW_PAGE_V2.CONTENT_TABS.VENUE,
    strings.SHOW_PAGE_V2.CONTENT_TABS.TICKETS,
  ];

  const { isShowPageExperiment } = useIsLTTShowPageExperiementEnabled(uid);

  const {
    tabSchemaHighlight,
    highlightsSection,
    tabSchemaInfo,
    mapURL,
    detailsObjects,
    aboutTheatreSection,
    criticReview,
  } = parseShowPageData(microBrandsHighlight);

  if (ratingsCount > 0 || criticReview?.tab_content?.length) {
    TABS.push(strings.SHOW_PAGE_V2.CONTENT_TABS.Reviews);
  }

  const whyWatchSection = (highlightsSection as any)?.tab_content?.filter?.(
    (content: any) => content.type === HIGHLIGHT_TYPES.LIST_ITEM
  );

  const { [strings.SHOW_PAGE.THEATRE_NAME]: theatreName, theatrePageUrl } =
    detailsObjects || {};

  const getTabContent = (data: Record<string, any>, tabName: string) =>
    data.find((tab: Record<string, any>) => tab.tab_name === tabName) ?? {};

  const findRelevantTabContentIndex = (
    data: Record<string, any>,
    tabContentName: string
  ) => {
    if (!data?.tab_content?.length) return 0;

    const index = data?.tab_content?.findIndex(
      (content: Record<string, any>) => content.text === tabContentName
    );

    return index > 0 ? index : 0;
  };

  const aboutShow = getTabContent(
    tabSchemaHighlight,
    strings.SHOW_PAGE.ABOUT_SHOW
  );

  const theStoryIndex = findRelevantTabContentIndex(
    aboutShow,
    strings.SHOW_PAGE.THE_STORY
  );

  const showDescription =
    theStoryIndex > 0
      ? aboutShow?.tab_content?.slice(0, theStoryIndex)
      : aboutShow?.tab_content;
  const theStory = aboutShow?.tab_content?.slice(theStoryIndex + 1);

  const showDetails = getTabContent(
    tabSchemaHighlight,
    strings.SHOW_PAGE.SHOW_DETAILS
  );
  const topSongs = getTabContent(
    tabSchemaHighlight,
    strings.SHOW_PAGE.TOP_SONGS
  );
  const showTimings = showDetails?.tab_content?.slice(
    findRelevantTabContentIndex(showDetails, strings.SHOW_PAGE.SHOW_TIMINGS) +
      1,
    findRelevantTabContentIndex(showDetails, strings.SHOW_PAGE.CAST_AND_CREW)
  );

  const ageSuitability = getTabContent(
    tabSchemaHighlight,
    strings.SHOW_PAGE.AGE_SUITABILITY
  );

  const castAndCrewIndex = findRelevantTabContentIndex(
    showDetails,
    strings.SHOW_PAGE.CAST_AND_CREW
  );
  const castAndCrew = showDetails?.tab_content?.slice(castAndCrewIndex + 1);

  const gettingThere = getTabContent(
    tabSchemaInfo,
    strings.SHOW_PAGE.GETTING_THERE
  );
  const facilities = getTabContent(
    tabSchemaInfo,
    strings.SHOW_PAGE.FACILITIES_AND_ACCESSIBILITY
  );
  const additionalInfo = getTabContent(
    tabSchemaInfo,
    strings.SHOW_PAGE.ADDITIONAL_INFORMATION
  );

  const tickets = getTabContent(tabSchemaHighlight, strings.SHOW_PAGE.TICKETS);
  const cancellationAndRefundsIndex = findRelevantTabContentIndex(
    tickets,
    strings.SHOW_PAGE.CANCELLATION_AND_REFUNDS
  );
  const ticketRedemption = tickets?.tab_content?.slice(
    findRelevantTabContentIndex(tickets, strings.SHOW_PAGE.TICKETS_REDEMPTION) +
      1,
    cancellationAndRefundsIndex
  );

  const cancellationAndRefunds = tickets?.tab_content?.slice(
    cancellationAndRefundsIndex + 1
  );

  const convertToSentenceCase = (header: string): string => {
    if (lang !== 'en') return header;

    const words = header.split(' ');
    for (let i = 1; i < words.length; i++) {
      words[i] = words[i].toLowerCase();
    }
    return words.join(' ');
  };

  const onContentSectionTabClicked = (tabName: string, index: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.INFO_HEADING]: tabName,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
  };

  useEffect(() => {
    if (!contentSectionsRef.current) return;
    const attachEvents = (event: Event) => {
      trackEvent({
        eventName: ANALYTICS_EVENTS.SHOW_PAGE.CONTENT_SECTION_LINK_CLICKED,
        [ANALYTICS_PROPERTIES.LABEL]: (event.target as HTMLElement).innerText,
      });
    };

    const links = contentSectionsRef.current.querySelectorAll('p a');
    links.forEach((element) => {
      element.addEventListener('click', attachEvents);
    });

    const contentSections = contentSectionsRef.current;
    return () => {
      const links = contentSections?.querySelectorAll?.('p a');
      links.forEach((element) => {
        element.removeEventListener('click', attachEvents);
      });
    };
  }, [contentSectionsRef]);

  useEffect(() => {
    if (!contentSectionsRef.current) return;
    const sectionHeaderIdsInOrder = [
      'Why watch',
      'Storyline',
      'Show Timings',
      'Cast & Crew',
      'Top songs',
      'Age & content guide',
      'Theatre',
      'Getting there',
      'Facilities & accessibility',
      'Additional information',
      'Tickets redemption',
      'Cancellation & refunds',
      'What the critics think',
      'Ratings & reviews',
    ];
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        const rank =
          sectionHeaderIdsInOrder.findIndex((id) => id === entry.target.id) + 1;
        trackEvent({
          eventName: ANALYTICS_EVENTS.SHOW_PAGE_SECTION_VIEWED,
          [ANALYTICS_PROPERTIES.SECTION]: sectionId,
          [ANALYTICS_PROPERTIES.RANKING]: rank,
        });
        observer.unobserve(entry.target);
      }
    }, {});
    sectionHeaderIdsInOrder.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer?.disconnect();
    };
  }, [contentSectionsRef]);

  const componentSerializer = (
    type: any,
    _element: any,
    content: any,
    children: any,
    key: any,
    parentProps: any
  ) =>
    shortCodeSerializer(
      type,
      _element,
      content,
      children,
      key,
      parentProps,
      false
    );

  const getWhyWatchSectionHeader = () => {
    switch (lang) {
      case LANGUAGE_CODE_MAP.DE:
      case LANGUAGE_CODE_MAP.ES:
        return name;
      default:
        return strings.formatString(
          convertToSentenceCase(strings.WHY_WATCH),
          name
        ) as string;
    }
  };

  const sectionHeading = css({
    textStyle: 'Semantics/Heading/Small !important',
    color: 'core.grey.800 !important',
    marginTop: '1.5rem !important',
    marginBottom: '0.75rem !important',
  });

  const marginTopBottomForSectionHeading = css({
    marginTop: '0 !important',
    marginBottom: '1rem !important',
  });

  const aboutTheShowContainer = css({
    height: showMore ? '100%' : '16.125rem',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.7, 0, 0.3, 1)',
    position: 'relative',
  });

  const readMoreContainer = css({
    position: showMore ? 'relative' : 'absolute',
    bottom: 0,
    left: 0,
    paddingTop: !showMore ? 'space.48' : '0',
    backgroundGradient: !showMore
      ? 'linear-gradient(0deg, #FFFFFF 17.06%, rgba(255, 255, 255, 0) 100%)'
      : 'undefined',
    width: '100%',
    transition: 'all 0.3s cubic-bezier(0.7, 0, 0.3, 1)',
  });

  const readMoreLink = css({
    textStyle: 'Sematics/UI Label/Large !important',
    color: 'core.grey.900 !important',
    marginTop: 'space.24 !important',
    textDecoration: 'underline',
    lineHeight: 'lh.24 !important',
    textUnderlineOffset: '2px !important',
  });

  const whyWatchSectionHeading = css({
    marginBottom: '0.75rem !important',
    marginTop: '0.5rem !important',
    textStyle: 'Semantics/Heading/Regular !important',
    color: 'core.grey.800 !important',
  });

  const renderContentForNewShowPage = () => {
    return (
      <>
        <Content>
          <div className={aboutTheShowContainer}>
            <Conditional if={(highlightsSection as any)?.tab_content?.length}>
              <h2 id="About the show" ref={aboutTheShowSectionRef}>
                <WhyWatch />
                {strings.SHOW_PAGE_V2.CONTENT_SECTION_HEADERS.ABOUT_THE_SHOW}
              </h2>

              <Text className={whyWatchSectionHeading}>
                {getWhyWatchSectionHeader()}
              </Text>

              <PrismicRichText
                field={whyWatchSection}
                components={shortCodeSerializer}
              />

              <Conditional if={showDescription?.length}>
                <div
                  className={`show-description ${css({
                    marginTop: 'space.16 !important',
                  })} `}
                >
                  <PrismicRichText
                    field={showDescription}
                    components={shortCodeSerializer}
                  />
                </div>
              </Conditional>
            </Conditional>

            <Conditional if={theStoryIndex > 0}>
              <h2 id="Storyline" className={sectionHeading}>
                {strings.SHOW_PAGE_V2.CONTENT_SECTION_HEADERS.STORYLINE}
              </h2>
              <div className="storyline-content">
                <PrismicRichText
                  field={theStory}
                  components={shortCodeSerializer}
                />
              </div>
            </Conditional>

            <Conditional if={showTimings?.length}>
              <h2 id="Show Timings" className={sectionHeading}>
                {convertToSentenceCase(strings.SHOW_PAGE.SHOW_TIMINGS)}
              </h2>
              <PrismicRichText
                field={showTimings}
                components={shortCodeSerializer}
              />
            </Conditional>

            <Conditional if={castAndCrewIndex > 0}>
              <h2 id="Cast & Crew" className={sectionHeading}>
                {convertToSentenceCase(strings.SHOW_PAGE.CAST_AND_CREW)}
              </h2>
              <PrismicRichText
                field={castAndCrew}
                components={componentSerializer as JSXFunctionSerializer}
              />
            </Conditional>

            <Conditional if={topSongs?.tab_content?.length}>
              <h2 id="Top songs" className={sectionHeading}>
                {convertToSentenceCase(strings.SHOW_PAGE.TOP_SONGS)}
              </h2>
              <PrismicRichText
                field={topSongs?.tab_content}
                components={componentSerializer as JSXFunctionSerializer}
              />
            </Conditional>

            <Conditional if={ageSuitability?.tab_content?.length}>
              <h2 id="Age & content guides" className={sectionHeading}>
                {
                  strings.SHOW_PAGE_V2.CONTENT_SECTION_HEADERS
                    .AGE_SUITABILITY_AND_GUIDELINES
                }
              </h2>
              <PrismicRichText
                field={ageSuitability?.tab_content}
                components={shortCodeSerializer}
              />
            </Conditional>
            <div className={readMoreContainer}>
              <Link
                size="large"
                as="a"
                text={
                  showMore ? strings.READ_LESS : strings.SHOW_PAGE_V2.READ_MORE
                }
                className={readMoreLink}
                onClick={() => {
                  startTransition(() => {
                    setShowMore(!showMore);
                    setInitialScrollPosition(window.scrollY);
                    if (aboutTheShowSectionRef.current && showMore) {
                      window.scrollTo({
                        top: initialScrollPosition,
                        behavior: 'smooth',
                      });
                    }
                    trackEvent({
                      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
                      [ANALYTICS_PROPERTIES.CTA_TYPE]: showMore
                        ? CTA_TYPE.READ_LESS
                        : CTA_TYPE.READ_MORE,
                      [ANALYTICS_PROPERTIES.SECTION]: 'About the show',
                    });
                  });
                }}
              />
            </div>
          </div>
        </Content>
        <Conditional if={ratingsCount > 0 || criticReview?.tab_content?.length}>
          <Divider />
          <Content>
            <h2 id="Ratings & reviews">
              <StarEmptyNew fillColor={COLORS.BRAND.BLACK} />
              {convertToSentenceCase(strings.SHOW_PAGE_V2.RATINGS_AND_REVIEWS)}
            </h2>
            <ReviewSection
              tgid={id}
              reviewsDetails={reviewsDetails}
              isMobile={isMobile}
              initialReviews={topReviews}
              showFetchMoreButton
            />

            <Conditional if={criticReview?.tab_content?.length}>
              <Divider />
              <h2
                id="What the critics think"
                className={marginTopBottomForSectionHeading}
              >
                <CriticReviewIcon />
                {
                  strings.SHOW_PAGE_V2.CONTENT_SECTION_HEADERS
                    .WHAT_CRITICS_THINK
                }
              </h2>

              <CriticReview
                rating={
                  criticReview?.tab_content?.[
                    criticReview?.tab_content?.length - 3
                  ]?.text?.length
                }
                reviewContent={
                  criticReview?.tab_content?.[
                    criticReview?.tab_content?.length - 2
                  ]
                }
                criticName={
                  criticReview?.tab_content?.[
                    criticReview?.tab_content?.length - 1
                  ]
                }
              />
            </Conditional>
          </Content>
        </Conditional>

        <Divider />

        <Content>
          <h2 id="Tickets redemption">
            <TicketsRedemption />
            {convertToSentenceCase(strings.SHOW_PAGE.TICKETS_REDEMPTION)}
          </h2>
          <PrismicRichText
            field={ticketRedemption}
            components={shortCodeSerializer}
          />

          <Conditional if={cancellationAndRefunds?.length}>
            <Divider />
            <h2
              id="Cancellation & refunds"
              className={marginTopBottomForSectionHeading}
            >
              <CancellationAndRefunds />{' '}
              {convertToSentenceCase(
                strings.SHOW_PAGE.CANCELLATION_AND_REFUNDS
              )}
            </h2>

            <PrismicRichText
              field={cancellationAndRefunds}
              components={shortCodeSerializer}
            />
          </Conditional>
        </Content>

        <Divider />

        <Content id="theatre-section">
          <h2 id="Theatre" className="theatre-name">
            <span>
              {Location} {theatreName}
            </span>
            <Conditional if={theatrePageUrl}>
              <a
                href={theatrePageUrl}
                target="_blank"
                className="read-more"
                onClick={() => {
                  trackEvent({
                    eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
                    [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.READ_MORE,
                    [ANALYTICS_PROPERTIES.SECTION]: 'Theatre',
                  });
                }}
              >
                {strings.SHOW_PAGE_V2.READ_MORE}
              </a>
            </Conditional>
          </h2>
          <Conditional if={(aboutTheatreSection as any)?.tab_content?.length}>
            <div className="theatre-description">
              <PrismicRichText
                field={(aboutTheatreSection as any)?.tab_content}
                components={shortCodeSerializer}
              />
            </div>
          </Conditional>

          <Conditional if={gettingThere?.tab_content?.length}>
            <Divider />
            <h2 id="Getting there" className={marginTopBottomForSectionHeading}>
              <GettingThere />{' '}
              {convertToSentenceCase(strings.SHOW_PAGE.GETTING_THERE)}
            </h2>
            <PrismicRichText
              field={gettingThere?.tab_content}
              components={shortCodeSerializer}
            />
            <GoogleMap mapURL={mapURL} />
          </Conditional>

          <Conditional if={facilities?.tab_content?.length}>
            <Divider />
            <h2
              id="Facilities & accessibility"
              className={marginTopBottomForSectionHeading}
            >
              <Facilities />{' '}
              {convertToSentenceCase(
                strings.SHOW_PAGE.FACILITIES_AND_ACCESSIBILITY
              )}
            </h2>

            <PrismicRichText
              field={facilities?.tab_content}
              components={shortCodeSerializer}
            />
          </Conditional>

          <Conditional if={additionalInfo?.tab_content?.length}>
            <Divider />
            <h2
              id="Additional information"
              className={marginTopBottomForSectionHeading}
            >
              <AdditionalInfo />{' '}
              {convertToSentenceCase(strings.SHOW_PAGE.ADDITIONAL_INFORMATION)}
            </h2>

            <PrismicRichText
              field={additionalInfo?.tab_content}
              components={shortCodeSerializer}
            />
          </Conditional>
        </Content>
      </>
    );
  };

  return (
    <ContentSectionsWrapper>
      <ContentWrapper
        ref={contentSectionsRef}
        $isShowPageExperiment={isShowPageExperiment}
      >
        {isShowPageExperiment ? (
          renderContentForNewShowPage()
        ) : (
          <ScrollableTabs
            tabNames={TABS}
            isMobile={isMobile}
            onClickCallback={onContentSectionTabClicked}
          >
            <Content>
              <Conditional if={(highlightsSection as any)?.tab_content?.length}>
                <h2 id="Why watch">
                  <WhyWatch />
                  {getWhyWatchSectionHeader()}
                </h2>

                <PrismicRichText
                  field={whyWatchSection}
                  components={shortCodeSerializer}
                />
                <Conditional if={showDescription?.length}>
                  <div className="show-description">
                    <PrismicRichText
                      field={showDescription}
                      components={shortCodeSerializer}
                    />
                  </div>
                </Conditional>
              </Conditional>

              <Conditional if={theStoryIndex > 0}>
                <h2 id="Storyline">
                  <Story />{' '}
                  {strings.SHOW_PAGE_V2.CONTENT_SECTION_HEADERS.STORYLINE}
                </h2>
                <div className="storyline-content">
                  <PrismicRichText
                    field={theStory}
                    components={shortCodeSerializer}
                  />
                </div>
              </Conditional>

              <Conditional if={showTimings?.length}>
                <h2 id="Show Timings">
                  <ShowTimings />{' '}
                  {convertToSentenceCase(strings.SHOW_PAGE.SHOW_TIMINGS)}
                </h2>
                <PrismicRichText
                  field={showTimings}
                  components={shortCodeSerializer}
                />
              </Conditional>

              <Conditional if={castAndCrewIndex > 0}>
                <h2 id="Cast & Crew">
                  <CastAndCrew />{' '}
                  {convertToSentenceCase(strings.SHOW_PAGE.CAST_AND_CREW)}
                </h2>
                <PrismicRichText
                  field={castAndCrew}
                  components={componentSerializer as JSXFunctionSerializer}
                />
              </Conditional>

              <Conditional if={topSongs?.tab_content?.length}>
                <h2 id="Top songs">
                  <TopSongs />{' '}
                  {convertToSentenceCase(strings.SHOW_PAGE.TOP_SONGS)}
                </h2>
                <PrismicRichText
                  field={topSongs?.tab_content}
                  components={componentSerializer as JSXFunctionSerializer}
                />
              </Conditional>

              <Conditional if={ageSuitability?.tab_content?.length}>
                <h2 id="Age & content guide">
                  {' '}
                  <AgeSuitability />{' '}
                  {
                    strings.SHOW_PAGE_V2.CONTENT_SECTION_HEADERS
                      .AGE_SUITABILITY_AND_GUIDELINES
                  }
                </h2>
                <PrismicRichText
                  field={ageSuitability?.tab_content}
                  components={shortCodeSerializer}
                />
              </Conditional>
            </Content>

            <Content id="theatre-section">
              <h2 id="Theatre" className="theatre-name">
                <span>
                  {Location} {theatreName}
                </span>
                <Conditional if={theatrePageUrl}>
                  <a
                    href={theatrePageUrl}
                    target="_blank"
                    className="read-more"
                    onClick={() => {
                      trackEvent({
                        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
                        [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.READ_MORE,
                        [ANALYTICS_PROPERTIES.SECTION]: 'Theatre',
                      });
                    }}
                  >
                    {strings.SHOW_PAGE_V2.READ_MORE}
                  </a>
                </Conditional>
              </h2>
              <Conditional
                if={(aboutTheatreSection as any)?.tab_content?.length}
              >
                <div className="theatre-description">
                  <PrismicRichText
                    field={(aboutTheatreSection as any)?.tab_content}
                    components={shortCodeSerializer}
                  />
                </div>
              </Conditional>

              <Conditional if={gettingThere?.tab_content?.length}>
                <h2 id="Getting there">
                  <GettingThere />{' '}
                  {convertToSentenceCase(strings.SHOW_PAGE.GETTING_THERE)}
                </h2>
                <PrismicRichText
                  field={gettingThere?.tab_content}
                  components={shortCodeSerializer}
                />
                <GoogleMap mapURL={mapURL} />
              </Conditional>

              <Conditional if={facilities?.tab_content?.length}>
                <h2 id="Facilities & accessibility">
                  <Facilities />{' '}
                  {convertToSentenceCase(
                    strings.SHOW_PAGE.FACILITIES_AND_ACCESSIBILITY
                  )}
                </h2>

                <PrismicRichText
                  field={facilities?.tab_content}
                  components={shortCodeSerializer}
                />
              </Conditional>

              <Conditional if={additionalInfo?.tab_content?.length}>
                <h2 id="Additional information">
                  <AdditionalInfo />{' '}
                  {convertToSentenceCase(
                    strings.SHOW_PAGE.ADDITIONAL_INFORMATION
                  )}
                </h2>

                <PrismicRichText
                  field={additionalInfo?.tab_content}
                  components={shortCodeSerializer}
                />
              </Conditional>
            </Content>

            <Content>
              <h2 id="Tickets redemption">
                <TicketsRedemption />
                {convertToSentenceCase(strings.SHOW_PAGE.TICKETS_REDEMPTION)}
              </h2>
              <PrismicRichText
                field={ticketRedemption}
                components={shortCodeSerializer}
              />

              <Conditional if={cancellationAndRefunds?.length}>
                <h2 id="Cancellation & refunds">
                  <CancellationAndRefunds />{' '}
                  {convertToSentenceCase(
                    strings.SHOW_PAGE.CANCELLATION_AND_REFUNDS
                  )}
                </h2>

                <PrismicRichText
                  field={cancellationAndRefunds}
                  components={shortCodeSerializer}
                />
              </Conditional>
            </Content>

            <Conditional
              if={ratingsCount > 0 || criticReview?.tab_content?.length}
            >
              <Content>
                <Conditional if={criticReview?.tab_content?.length}>
                  <h2 id="What the critics think">
                    <CriticReviewIcon />
                    {
                      strings.SHOW_PAGE_V2.CONTENT_SECTION_HEADERS
                        .WHAT_CRITICS_THINK
                    }
                  </h2>

                  <CriticReview
                    rating={
                      criticReview?.tab_content?.[
                        criticReview?.tab_content?.length - 3
                      ]?.text?.length
                    }
                    reviewContent={
                      criticReview?.tab_content?.[
                        criticReview?.tab_content?.length - 2
                      ]
                    }
                    criticName={
                      criticReview?.tab_content?.[
                        criticReview?.tab_content?.length - 1
                      ]
                    }
                  />
                </Conditional>

                <h2 id="Ratings & reviews">
                  <StarEmptyNew fillColor={COLORS.BRAND.BLACK} />
                  {convertToSentenceCase(
                    strings.SHOW_PAGE_V2.RATINGS_AND_REVIEWS
                  )}
                </h2>
                <ReviewSection
                  tgid={id}
                  reviewsDetails={reviewsDetails}
                  isMobile={isMobile}
                  initialReviews={topReviews}
                  showFetchMoreButton
                />
              </Content>
            </Conditional>
          </ScrollableTabs>
        )}
      </ContentWrapper>
    </ContentSectionsWrapper>
  );
};

export default ContentSections;
