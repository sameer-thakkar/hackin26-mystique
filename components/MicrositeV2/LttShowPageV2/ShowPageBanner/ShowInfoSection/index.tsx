import { useContext, useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import LinkResolver from 'components/LinkResolver';
import { getTranslateButtonText } from 'components/MicrositeV2/LttShowPageV2/ReviewSection';
import { TShowInfoSectionProps } from 'components/MicrositeV2/LttShowPageV2/ShowPageBanner/ShowInfoSection/interface';
import {
  Breadcrumbs,
  Hero,
  InfoSection,
  InfoSectionWrapper,
  ReviewPopover,
  ShowInfoSectionWrapper,
  TagSection,
  TheatreSection,
  ViewTranslatedContentButton,
} from 'components/MicrositeV2/LttShowPageV2/ShowPageBanner/ShowInfoSection/style';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import Image from 'UI/Image';
import Tooltip from 'UI/Tooltip';
import { MBContext } from 'contexts/MBContext';
import { getTagPageMap } from 'utils';
import { trackEvent } from 'utils/analytics';
import { dateToString, isDateInThePast } from 'utils/dateUtils';
import { generateDescriptor, getStars } from 'utils/productUtils';
import { getRandomReviewerImage } from 'utils/reviewUtils';
import { getLogoRedirectionUrl, getTagPageLink } from 'utils/urlUtils';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LANGUAGE_MAP,
  REOPENING_CATEGORIES,
} from 'const/index';
import { strings } from 'const/strings';
import {
  COLORED_CALENDAR,
  LOCATION,
  STAR,
  VERTICAL_PRODUCT_IMAGE_PLACEHOLDER,
} from 'assets/SvgIcons';

const ShowInfoSection = ({
  tourGroupData,
  isMobile,
  isDev,
}: TShowInfoSectionProps) => {
  const { host, lang, uid } = useContext(MBContext);
  const [usingTranslatedContent, setUsingTranslatedContent] = useState(true);
  const [mwebShowMoreTagsClicked, setmwebShowMoreTagsClicked] = useState(false);
  const {
    name,
    primarySubCategory,
    reviewsDetails,
    microBrandsDescriptor,
    microBrandsHighlight,
    topReviews,
    verticalImage,
    primaryCategory,
  } = tourGroupData ?? {};

  const { url: verticalImageUrl, alt: verticalImageAlt } = verticalImage;
  const { name: subCategoryName } = primarySubCategory;
  const { averageRating, ratingsCount } = reviewsDetails;
  const {
    content: topReviewContent,
    translatedContent: translatedTopReviewContent,
    nonCustomerName: topReviewUserName,
    rating: topReviewRating,
    reviewerImgUrl: topReviewReviwerImg,
    sourceLanguage,
  } = topReviews?.[0] ?? {};

  const numberOfTagsToShow = isMobile ? 2 : 5;

  const landingPageUrl =
    getLogoRedirectionUrl({
      uid: uid ?? '',
      lang,
      isDev,
      host,
    }) ?? '/';

  const LTT_TAG_PAGE_MAP = getTagPageMap();
  const getTagUrl = (name: string) =>
    getTagPageLink({
      url: LTT_TAG_PAGE_MAP[name.replace('’', "'")],
      lang,
      uid: uid ?? '',
      isProd: !isDev,
    });

  const shortenedRatingsCount =
    ratingsCount > 999 ? `${(ratingsCount / 1000).toFixed(1)}k` : ratingsCount;

  const updatedDescriptors = generateDescriptor({
    v2Descriptors: microBrandsDescriptor,
    lang,
    isShowPage: true,
  });

  const { detailsObjects } = parseShowPageData(microBrandsHighlight);

  const tagsArray = [primarySubCategory.displayName, ...updatedDescriptors];
  const {
    [strings.SHOW_PAGE.THEATRE_NAME]: theatreName,
    theatrePageUrl,
    [strings.SHOW_PAGE.OPENING_DATE]: reopeningDate,
  } = detailsObjects || {};

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const onReadMoreClicked = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_PAGE.RATING_WIDGET_CLICKED,
      [ANALYTICS_PROPERTIES.NUMBER_OF_RATINGS]: ratingsCount,
      [ANALYTICS_PROPERTIES.RATING]: averageRating,
    });
    jumpToReviewsSection();
  };

  const jumpToReviewsSection = () => {
    const reviewSection = document.getElementById(`Ratings & reviews`);
    if (!reviewSection) return;
    window.scrollTo({
      top: reviewSection.offsetTop - 16 * (isMobile ? 8 : 10),
      behavior: 'smooth',
    });
  };

  const openingDate = dateToString(
    reopeningDate,
    LANGUAGE_MAP.en.code,
    'DD MMM, YYYY'
  );
  const localisedOpeningDate = dateToString(
    reopeningDate,
    lang,
    'DD MMM, YYYY'
  );

  let OPENING_ON = '';
  if (openingDate === strings.TODAY || openingDate === strings.TOMORROW) {
    OPENING_ON = REOPENING_CATEGORIES.includes(primaryCategory.id)
      ? strings.REOPENS
      : strings.OPENS;
  } else {
    OPENING_ON = REOPENING_CATEGORIES.includes(primaryCategory.id)
      ? strings.REOPENING_ON
      : strings.OPENING_ON;
  }
  const isOpeningDateInThePast = isDateInThePast(reopeningDate);

  const trackReviewPopoverHovered = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_PAGE.RATINGS_HOVERED,
    });
  };

  const trackVideoAreaClicked = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_PAGE.VIDEO_CLICKED,
    });
  };

  return (
    <ShowInfoSectionWrapper onClick={trackVideoAreaClicked}>
      <Conditional if={!isMobile}>
        <Breadcrumbs>
          <LinkResolver url={landingPageUrl}>
            London Theatre Tickets
          </LinkResolver>
          <Conditional if={getTagUrl(subCategoryName)}>
            /
            <LinkResolver url={getTagUrl(subCategoryName)}>
              {subCategoryName}
            </LinkResolver>
          </Conditional>
          /<span>{name}</span>
        </Breadcrumbs>
      </Conditional>
      <Hero $isImageAvailable={!!verticalImageUrl}>
        <div ref={imageContainerRef} className="image-section">
          <Image
            draggable={false}
            url={verticalImageUrl ?? ''}
            alt={verticalImageAlt}
            priority
            height={isMobile ? 180 : 267}
            width={isMobile ? 120 : 178}
            autoCrop={true}
            className={`banner-vertical-image`}
            fetchPriority="high"
            fitCrop={true}
          />
          <span className="image-placeholder">
            <VERTICAL_PRODUCT_IMAGE_PLACEHOLDER
              $height={isMobile ? 172 : 258}
              $width={isMobile ? 120 : 178}
            />
          </span>
        </div>
        <InfoSectionWrapper>
          <InfoSection $isReviewSectionVisible={averageRating > 0}>
            <Conditional if={averageRating > 0}>
              <div
                className="rating-section"
                onMouseEnter={trackReviewPopoverHovered}
              >
                <div
                  className="ratings-wrapper"
                  onClick={onReadMoreClicked}
                  role="button"
                  tabIndex={0}
                >
                  <span className="rating">
                    {averageRating}
                    {STAR(COLORS.BRAND.CANDY)}
                  </span>
                  <Conditional if={ratingsCount > 0}>
                    <span className="review-count">
                      ({shortenedRatingsCount} ratings)
                    </span>
                  </Conditional>
                </div>
                <Conditional if={topReviewContent?.length}>
                  <ReviewPopover id="review-popover">
                    <div className="header">
                      {averageRating}
                      {STAR(COLORS.BRAND.CANDY)}
                    </div>
                    <div className="review">
                      <div className="review-header">
                        <div className="reviwer-details">
                          <div className="reviewer-image">
                            <Image
                              draggable={false}
                              url={
                                topReviewReviwerImg ??
                                getRandomReviewerImage(topReviewUserName ?? '')
                              }
                              alt={``}
                              priority
                              height={37}
                              width={37}
                              autoCrop={true}
                              fetchPriority="high"
                              fitCrop={true}
                            />
                          </div>
                          <div className="user-details">
                            <span className="name">{topReviewUserName}</span>
                            <span className="country">United kingdoms</span>
                          </div>
                        </div>
                        <div className="stars">
                          {getStars(topReviewRating).map((star) => star)}
                        </div>
                      </div>
                      <div className="review-content">
                        {usingTranslatedContent && translatedTopReviewContent
                          ? translatedTopReviewContent
                          : topReviewContent}
                      </div>
                      <Conditional
                        if={
                          sourceLanguage?.toLowerCase() !==
                            lang?.toLowerCase() && translatedTopReviewContent
                        }
                      >
                        <ViewTranslatedContentButton
                          onClick={() =>
                            setUsingTranslatedContent(!usingTranslatedContent)
                          }
                        >
                          {getTranslateButtonText(
                            usingTranslatedContent,
                            sourceLanguage,
                            lang
                          )}
                        </ViewTranslatedContentButton>
                      </Conditional>
                      <button className="read-more" onClick={onReadMoreClicked}>
                        {strings.LTT_SHOW_PAGE.READ_MORE_REVIEWS}
                      </button>
                    </div>
                  </ReviewPopover>
                </Conditional>
              </div>
            </Conditional>
            {name.length > 46 ? (
              <Tooltip
                content={name}
                trigger={<h1 className="title">{name}</h1>}
              />
            ) : (
              <h1 className="title">{name}</h1>
            )}

            <Conditional if={!isOpeningDateInThePast && reopeningDate}>
              <p className="reopening">
                {COLORED_CALENDAR}
                {OPENING_ON} {localisedOpeningDate}
              </p>
            </Conditional>
          </InfoSection>
          <TagSection>
            {tagsArray
              .slice(
                0,
                mwebShowMoreTagsClicked ? tagsArray.length : numberOfTagsToShow
              )
              .map((tag, index) =>
                getTagUrl(tag) ? (
                  <LinkResolver
                    className="tag"
                    key={tag}
                    url={getTagUrl(tag)}
                    onClick={() => {
                      trackEvent({
                        eventName: ANALYTICS_EVENTS.CATEGORY_TAG_CLICKED,
                        [ANALYTICS_PROPERTIES.HEADING]: tag,
                        [ANALYTICS_PROPERTIES.RANKING]: index + 1,
                      });
                    }}
                  >
                    {tag}
                  </LinkResolver>
                ) : null
              )}
            <Conditional
              if={
                isMobile &&
                !mwebShowMoreTagsClicked &&
                tagsArray.length > numberOfTagsToShow
              }
            >
              <div
                className="show-more"
                onClick={() => setmwebShowMoreTagsClicked(true)}
                role="button"
                tabIndex={0}
              >
                +{tagsArray.length - numberOfTagsToShow} more{' '}
              </div>
            </Conditional>
          </TagSection>
          <TheatreSection>
            {LOCATION}
            <a
              href={theatrePageUrl}
              className="theatre-name"
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                trackEvent({
                  eventName: ANALYTICS_EVENTS.SHOW_PAGE.THEATRE_NAME_CLICKED,
                  [ANALYTICS_PROPERTIES.THEATRE_NAME]: theatreName,
                });
              }}
            >
              {theatreName}
            </a>
          </TheatreSection>
        </InfoSectionWrapper>
      </Hero>
    </ShowInfoSectionWrapper>
  );
};

export default ShowInfoSection;
