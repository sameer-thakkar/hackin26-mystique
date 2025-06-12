import { useContext, useRef, useState } from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import Conditional from 'components/common/Conditional';
import LinkResolver from 'components/LinkResolver';
import LttSaleDesciptor from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/lttSaleDesciptor';
import { getTranslateButtonText } from 'components/MicrositeV2/ShowPageV2/ReviewSection';
import { TShowInfoSectionProps } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ShowInfoSection/interface';
import {
  Hero,
  InfoSection,
  InfoSectionWrapper,
  ReviewPopover,
  ShowInfoSectionWrapper,
  TagSection,
  TheatreSection,
  ViewTranslatedContentButton,
} from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ShowInfoSection/style';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import Image from 'UI/Image';
import Tooltip from 'UI/Tooltip';
import { MBContext } from 'contexts/MBContext';
import { getTagPageMap } from 'utils';
import { trackEvent } from 'utils/analytics';
import { dateToString, isDateInThePast } from 'utils/dateUtils';
import { checkIfLTTMB } from 'utils/helper';
import { getLocalizedCount } from 'utils/localizationUtils';
import {
  generateDescriptor,
  getBoosterValueFromListingPrice,
  getStars,
} from 'utils/productUtils';
import { getRandomReviewerImage } from 'utils/reviewUtils';
import { getTagPageLink } from 'utils/urlUtils';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LANGUAGE_MAP,
  REOPENING_CATEGORIES,
} from 'const/index';
import { LTT_SALE_HARDCODINGS } from 'const/lttSaleHardcodings';
import { strings } from 'const/strings';
import ColoredCalendar from 'assets/coloredCalendar';
import Location from 'assets/location';
import Star from 'assets/star';
import VerticalProductImagePlaceholder from 'assets/verticalProductImagePlaceholder';

const ShowInfoSection = ({
  tourGroupData,
  isMobile,
  isDev,
  breadcrumbs,
  taggedCity,
}: TShowInfoSectionProps) => {
  const { lang, uid } = useContext(MBContext);
  const isLTT = checkIfLTTMB(uid);
  const [usingTranslatedContent, setUsingTranslatedContent] = useState(true);
  const [mwebShowMoreTagsClicked, setmwebShowMoreTagsClicked] = useState(false);
  const {
    name,
    primarySubCategory = {},
    reviewsDetails = {},
    microBrandsDescriptor,
    microBrandsHighlight,
    topReviews,
    verticalImage,
    primaryCategory = {},
    primaryCity = {},
    listingPrice = {},
    id: tgid,
  } = tourGroupData ?? {};

  const { bestDiscount } = getBoosterValueFromListingPrice(listingPrice);

  const { url: verticalImageUrl, alt: verticalImageAlt } = verticalImage;
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

  const TAG_PAGE_MAP = getTagPageMap(uid);
  const getTagUrl = (name: string) =>
    name &&
    getTagPageLink({
      url: TAG_PAGE_MAP[name.replace('’', "'")],
      lang,
      uid: uid ?? '',
      isProd: !isDev,
    });

  const localizedRatingsCount = getLocalizedCount(ratingsCount, lang);

  const updatedDescriptors = generateDescriptor({
    v2Descriptors: microBrandsDescriptor,
    lang,
    isShowPage: true,
    primarySubCategory,
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

  const openingDate = dateToString({
    date: reopeningDate,
    currentLanguage: LANGUAGE_MAP.en.code,
    dateFormat: 'MMM-DD-YYYY',
  });
  const localisedOpeningDate = dateToString({
    date: reopeningDate,
    currentLanguage: lang,
    dateFormat: 'MMM-DD-YYYY',
  });

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
        <Breadcrumbs
          breadcrumbs={breadcrumbs}
          taggedCity={taggedCity}
          primaryCity={primaryCity}
          isMobile={isMobile}
          showName={name}
          isShowPage
        />
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
            autoCrop
            className={`banner-vertical-image`}
            fetchPriority="high"
            fitCrop
          />
          <span className="image-placeholder">
            <VerticalProductImagePlaceholder
              $height={isMobile ? 172 : 258}
              $width={isMobile ? 120 : 178}
            />
          </span>
          <Conditional
            if={
              (bestDiscount > 0 && isLTT) ||
              LTT_SALE_HARDCODINGS[tgid as string]
                ?.SHOW_SPECIAL_OFFER_DESCRIPTION
            }
          >
            <LttSaleDesciptor containerHasBorder />
          </Conditional>
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
                    <Star color={COLORS.TEXT.CANDY_1} />
                    {averageRating}
                  </span>
                  <Conditional if={ratingsCount > 0}>
                    <span className="review-count">
                      (
                      <span>
                        {strings.formatString(
                          strings.RATINGS,
                          localizedRatingsCount || ''
                        )}
                      </span>
                      )
                    </span>
                  </Conditional>
                </div>
                <Conditional if={topReviewContent?.length}>
                  <ReviewPopover id="review-popover">
                    <div className="header">
                      <Star color={COLORS.TEXT.CANDY_1} />
                      {averageRating}
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
                              autoCrop
                              fetchPriority="high"
                              fitCrop
                            />
                          </div>
                          <div className="user-details">
                            <span className="name">{topReviewUserName}</span>
                            <span className="country">United Kingdom</span>
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
                        {strings.SHOW_PAGE_V2.READ_MORE_REVIEWS}
                      </button>
                    </div>
                  </ReviewPopover>
                </Conditional>
              </div>
            </Conditional>
            {name?.length > 46 ? (
              <Tooltip
                content={name}
                trigger={<h1 className="title">{name}</h1>}
              />
            ) : (
              <h1 className="title">{name}</h1>
            )}

            <Conditional if={!isOpeningDateInThePast && reopeningDate}>
              <p className="reopening">
                <ColoredCalendar />
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
                    className="tag with-link"
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
                ) : (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                )
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
          <Conditional if={!!theatreName}>
            <TheatreSection $isUnderlined={!!theatrePageUrl}>
              {Location}
              <a
                href={theatrePageUrl}
                className="theatre-name"
                target="_blank"
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
          </Conditional>
        </InfoSectionWrapper>
      </Hero>
    </ShowInfoSectionWrapper>
  );
};

export default ShowInfoSection;
