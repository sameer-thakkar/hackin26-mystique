import dynamic from 'next/dynamic';
import Breadcrumbs from 'components/Breadcrumbs';
import Conditional from 'components/common/Conditional';
import { Container, MainContent } from 'components/NewsPage/ArticlePage/styles';
import PageContent from 'components/NewsPage/components/Content';
import NewsMeta from 'components/NewsPage/components/NewsMeta';
import NewsPageSidebar from 'components/NewsPage/components/Sidebar';
import Trailer from 'components/NewsPage/components/Trailer';
import { TNewsPageProps } from 'components/NewsPage/interface';
import CategorySlider from 'components/ShowPages/CategorySlider';
import { formatDateToString } from 'utils/dateUtils';
import { getLangObject } from 'utils/helper';
import { NEWS_PAGE_DATE_FORMAT } from 'const/index';
import { strings } from 'const/strings';
import { uniqueArticlesWithoutRepetition } from '../utils';

const DesktopMoreReads = dynamic(() =>
  import(
    /*webpackChunkName: "DesktopMoreReads"*/ 'components/NewsPage/components/DesktopMoreReads'
  )
);
const MobileMoreReads = dynamic(() =>
  import(
    /*webpackChunkName: "MobileMoreReads"*/ 'components/NewsPage/components/MobileMoreReads'
  )
);
const MobileFeaturedNews = dynamic(() =>
  import(
    /*webpackChunkName: "MobileFeauturedNews"*/ 'components/NewsPage/components/MobileFeaturedNews'
  )
);

const ArticlePage: React.FC<TNewsPageProps> = (props) => {
  const { lang, data: CMSContent, isMobile } = props;

  const {
    data,
    first_publication_date,
    tgidMappingData,
    featuredArticles,
    articlesWithSameTgid,
    CFData,
    trailerSectionData,
    showPageDocuments,
    subCategoryData,
    mediaData,
    videoData,
  } = CMSContent;

  const { refs, heading, authorName, bannerImage, tgid, breadcrumbs } = data;

  const { contentFramework } = refs;

  const currentLanguage = getLangObject(lang).code;

  const formattedPublishedDateAndTime = formatDateToString(
    new Date(first_publication_date),
    'EN',
    NEWS_PAGE_DATE_FORMAT
  );
  const uniqueArticlesWithSameTgidData = uniqueArticlesWithoutRepetition(
    featuredArticles,
    articlesWithSameTgid
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
              showPageDocuments: showPageDocuments.results,
              mediaData,
              tgid,
            }}
          />
        </MainContent>
        <Conditional if={!isMobile}>
          <DesktopMoreReads
            content={{
              uniqueArticlesWithSameTgidData,
              featuredArticles,
              CFData,
            }}
          />
        </Conditional>
        <Conditional if={isMobile}>
          <MobileMoreReads
            content={{
              uniqueArticlesWithSameTgidData,
              featuredArticles,
              CFData,
            }}
            heading={strings.NEWS_PAGE.MORE_READS}
            showAllNewsCTA
            showMoreCTAText={''}
            numberOfArticlesToShow={10}
            initialArticlesToShow={3}
          />
          <MobileFeaturedNews
            featuredNewsContent={{
              content: featuredArticles,
              CFData,
            }}
          />
        </Conditional>
      </Container>
      <Trailer
        content={{
          trailerSectionData,
          CFData,
          showPageDocuments: showPageDocuments.results,
          tgid,
          videoData,
        }}
        isMobile={isMobile}
      />
      <Conditional if={subCategoryData?.length > 0}>
        <Container>
          <h2>{strings.NEWS_PAGE.POPULAR_SHOWS}</h2>
          <CategorySlider
            cards={subCategoryData}
            isMobile={isMobile}
            allShowPagesDocuments={showPageDocuments.results}
            currentLanguage={currentLanguage}
            categoryName={tgidMappingData?.primarySubCategoryName?.name}
            isNewsPage
          />
        </Container>
      </Conditional>
    </>
  );
};
export default ArticlePage;
