import { useContext } from 'react';
import { PrismicDocumentWithUID } from '@prismicio/types';
import Conditional from 'components/common/Conditional';
import DesktopFeaturedNews from 'components/NewsPage/components/DesktopFeaturedNews';
import {
  TShowCardProps,
  TSideBarProps,
} from 'components/NewsPage/components/Sidebar/interface';
import {
  BookNowCTA,
  Card,
  Container,
} from 'components/NewsPage/components/Sidebar/styles';
import { getObject } from 'components/ShowPages/parseShowPage';
import Button from 'UI/Button';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import useWindowSize from 'hooks/useWindowSize';
import { trackEvent } from 'utils/analytics';
import { convertUidToUrl } from 'utils/urlUtils';
import { StarIcon } from 'const/descriptorIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  NEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';
import { LOCATION, MUSIC_ICON } from 'assets/SvgIcons';

export const Ratings = (props: {
  averageRating: number;
  reviewCount: number;
}) => {
  const { averageRating, reviewCount } = props;
  return (
    <>
      <Conditional if={averageRating > 0}>
        <span className="rating">
          {averageRating}
          <StarIcon />
        </span>
      </Conditional>
      <Conditional if={averageRating > 0 && reviewCount > 0}>
        <span className="review-count">
          (
          {reviewCount > 999
            ? `${(reviewCount / 1000).toFixed(1)}k`
            : reviewCount}
          )
        </span>
      </Conditional>
    </>
  );
};

const Sidecard: React.FC<TShowCardProps> = ({
  showData,
  showPageUid,
  verticalPoster,
}) => {
  const { host, lang, isDev } = useContext(MBContext);

  let {
    name,
    primarySubCategory,
    reviewCount,
    averageRating,
    microBrandsHighlight,
    listingPrice,
    id,
    primaryCategory,
  } = showData || {};
  const { originalPrice, finalPrice, currencyCode } = listingPrice || {};
  const { detailsObjects } =
    getObject(microBrandsHighlight, [strings.SHOW_PAGE.THEATRE_NAME]) || {};
  const { [strings.SHOW_PAGE.THEATRE_NAME]: theatreName, theatrePageUrl } =
    detailsObjects || {};
  const showPageUrl = convertUidToUrl({
    uid: showPageUid,
    lang,
    isDev,
    hostname: host,
  });

  // const handleRatingsClick = () => {
  //   trackEvent({
  //     eventName: ANALYTICS_EVENTS.NEWS_PAGE.RATINGS_WIDGET_CLICKED,
  //     [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
  //     [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
  //     [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
  //     [ANALYTICS_PROPERTIES.RANKING]: 1,
  //     [ANALYTICS_PROPERTIES.TGID]: id,
  //     [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: name,
  //     [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
  //     [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.name,
  //   });
  // };

  const handleCheckAvailabiltyClicked = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.RANKING]: 1,
      [ANALYTICS_PROPERTIES.TGID]: id,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: name,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.name,
    });

    window.open(showPageUrl, '_blank');
  };

  const handleTheatreCTAClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.THEATRE_PAGE_LINK,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.ARTICLES,
    });
  };

  return (
    <Conditional if={!!id}>
      <Conditional if={!!listingPrice?.finalPrice}>
        <BookNowCTA>
          <h2>
            {strings.BOOK_NOW_CTA}
            {MUSIC_ICON}
          </h2>
        </BookNowCTA>
      </Conditional>
      <Card isShowAvailable={!!listingPrice?.finalPrice}>
        <div className="card-content">
          <div className="card-image">
            <Image
              url={verticalPoster}
              alt={name}
              height="203"
              width="150"
              fill
              fetchPriority="high"
              loading="eager"
            />
          </div>
          <div className="card-info">
            <div className="category-and-ratings">
              <div>{primarySubCategory?.name?.toUpperCase()}</div>
              <div className="ratings-and-reviews">
                {/* <a href="/" onClick={handleRatingsClick}> */}
                <Ratings
                  averageRating={averageRating}
                  reviewCount={reviewCount}
                />
              </div>
            </div>
            <h3>{name}</h3>
            <div className="location" role="button" tabIndex={0}>
              {LOCATION}
              <a href={theatrePageUrl} onClick={handleTheatreCTAClick}>
                <span>{theatreName}</span>
              </a>
            </div>
            <Conditional if={!listingPrice?.finalPrice}>
              <span className="show-unavailable-warning">
                {strings.SHOW_UNAVAILABLE}
              </span>
            </Conditional>
            <Conditional if={listingPrice?.finalPrice}>
              <div className="price-block">
                <PriceBlock
                  showScratchPrice={true}
                  showCashback
                  listingPrice={listingPrice}
                  lang={lang}
                  showSavings
                  id={id}
                  prefix
                  key={'price-block'}
                />
              </div>
            </Conditional>
            <Button
              fillType="fill"
              widthProp="100%"
              borderWidth="8px"
              onClick={handleCheckAvailabiltyClicked}
            >
              {listingPrice?.finalPrice
                ? strings.CHECK_AVAIL
                : strings.MORE_DETAILS}
            </Button>
          </div>
        </div>
      </Card>
    </Conditional>
  );
};

const NewsPageSidebar: React.FC<TSideBarProps> = ({ content }) => {
  const { width } = useWindowSize();
  const {
    tgidMappingData,
    featuredArticles,
    showPageDocuments,
    mediaData,
    tgid,
  } = content;

  const showPageUid = showPageDocuments?.reduce(
    (acc: string, curr: PrismicDocumentWithUID) => {
      return (acc += curr?.data?.tgid === tgidMappingData?.id ? curr.uid : '');
    },
    ''
  );
  const verticalPoster = mediaData.filter((media) => {
    return +media.resourceEntityId == tgid;
  });
  const verticalPosterUrl = verticalPoster[0]?.medias[0]?.url;

  return (
    <Container>
      <Sidecard
        showData={tgidMappingData}
        showPageUid={showPageUid}
        verticalPoster={verticalPosterUrl}
      />
      <Conditional if={width! > 768}>
        <DesktopFeaturedNews
          featuredNewsData={{
            prismicContent: featuredArticles,
          }}
        />
      </Conditional>
    </Container>
  );
};

export default NewsPageSidebar;
