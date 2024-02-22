import dynamic from 'next/dynamic';
import Breadcrumbs from 'components/Breadcrumbs';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import {
  Container,
  MainContent,
  VerticalProductCardContainer,
} from 'components/NewsPage/ArticlePage/styles';
import PageContent from 'components/NewsPage/components/Content';
import NewsMeta from 'components/NewsPage/components/NewsMeta';
import VerticalProductCardSlide from 'components/NewsPage/components/VerticalProductCardSlide';
import { TNewsPageProps } from 'components/NewsPage/interface';
import {
  getTrackingObject,
  uniqueArticlesWithoutRepetition,
} from 'components/NewsPage/utils';
import { trackEvent } from 'utils/analytics';
import { formatDateToString } from 'utils/dateUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  NEWS_PAGE_DATE_FORMAT,
  NEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';

const DesktopMoreReads = dynamic(
  () =>
    import(
      /*webpackChunkName: "DesktopMoreReads"*/ 'components/NewsPage/components/DesktopMoreReads'
    )
);
const MobileMoreReads = dynamic(
  () =>
    import(
      /*webpackChunkName: "MobileMoreReads"*/ 'components/NewsPage/components/MobileMoreReads'
    )
);
const MobileFeaturedNews = dynamic(
  () =>
    import(
      /*webpackChunkName: "MobileFeauturedNews"*/ 'components/NewsPage/components/MobileFeaturedNews'
    )
);
const NewsPageSidebar = dynamic(
  () =>
    import(
      /* webpackChunkName: "NewsPageSidebar" */ 'components/NewsPage/components/Sidebar'
    )
);
const Trailer = dynamic(
  () =>
    import(
      /* webpackChunkName: "Trailer" */ 'components/NewsPage/components/Trailer'
    )
);

const ArticlePage: React.FC<TNewsPageProps> = (props) => {
  const { data: CMSContent, isMobile } = props;

  const {
    data,
    first_publication_date,
    tgidMappingData,
    featuredArticles,
    articlesWithSameTgid,
    trailerSectionData,
    showPageDocuments,
    subCategoryData,
    mediaData,
    videoData,
    newsLandingPageUrl,
  } = CMSContent;

  const {
    content_framework_ref: contentFramework,
    heading,
    author_name: authorName,
    banner_image: bannerImage,
    tgid,
    breadcrumbs,
  } = data;

  const formattedPublishedDateAndTime = formatDateToString(
    new Date(first_publication_date),
    'EN',
    NEWS_PAGE_DATE_FORMAT
  );
  const uniqueArticlesWithSameTgidData = uniqueArticlesWithoutRepetition(
    featuredArticles,
    articlesWithSameTgid
  );
  const moreReadsSectionCTAClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_NEWS,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.MORE_READS,
    });
  };

  const moreReadsTrackingObject = getTrackingObject(
    NEWS_PAGE_SECTIONS.MORE_READS
  );

  return (
    <>
      <Container>
        <Breadcrumbs breadcrumbs={breadcrumbs} isMobile={isMobile} isNewsPage />
        <NewsMeta
          metaContent={{
            heading,
            authorName,
            formattedPublishedDateAndTime,
          }}
        />
        <MainContent>
          <PageContent
            content={{
              bannerImage,
              contentFrameworkSlices: contentFramework?.data?.body,
            }}
          />
          <NewsPageSidebar
            content={{
              tgidMappingData,
              featuredArticles,
              showPageDocuments,
              mediaData,
              tgid,
              newsLandingPageUrl,
            }}
          />
        </MainContent>
        <Conditional if={!isMobile}>
          <LazyComponent>
            <DesktopMoreReads
              content={{
                uniqueArticlesWithSameTgidData,
                featuredArticles,
                newsLandingPageUrl,
              }}
              handleCtaClick={moreReadsSectionCTAClick}
              trackingObject={moreReadsTrackingObject}
            />
          </LazyComponent>
        </Conditional>
        <Conditional if={isMobile}>
          <LazyComponent>
            <MobileMoreReads
              content={{
                uniqueArticlesWithSameTgidData,
                featuredArticles,
              }}
              heading={strings.NEWS_PAGE.MORE_READS}
              showAllNewsCTA
              showMoreCTAText={strings.NEWS_PAGE.LOAD_MORE}
              numberOfArticlesToShow={10}
              initialArticlesToShow={3}
              newsLandingPageUrl={newsLandingPageUrl}
              handleCtaClick={moreReadsSectionCTAClick}
              trackingObject={moreReadsTrackingObject}
            />
            <MobileFeaturedNews
              featuredNewsContent={{
                content: featuredArticles,
              }}
              newsLandingPageUrl={newsLandingPageUrl}
            />
          </LazyComponent>
        </Conditional>
      </Container>
      <LazyComponent>
        <Trailer
          content={{
            trailerSectionData,
            showPageDocuments,
            tgid,
            videoData,
          }}
          isMobile={isMobile}
        />
      </LazyComponent>
      <Conditional if={subCategoryData?.length > 0}>
        <LazyComponent>
          <VerticalProductCardContainer>
            <VerticalProductCardSlide
              cards={subCategoryData}
              isMobile={isMobile}
              mediaData={mediaData}
              showPageDocuments={showPageDocuments}
            />
          </VerticalProductCardContainer>
        </LazyComponent>
      </Conditional>
    </>
  );
};
export default ArticlePage;
