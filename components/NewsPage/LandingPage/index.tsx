import Breadcrumbs from 'components/Breadcrumbs';
import Mailer from 'components/CityPageContainer/Mailer';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import Reviews from 'components/common/Reviews';
import LandingPageBanner from 'components/NewsPage/components/LPBanner';
import RecentNews from 'components/NewsPage/components/RecentNews';
import Trailer from 'components/NewsPage/components/Trailer';
import VerticalProductCardSlide from 'components/NewsPage/components/VerticalProductCardSlide';
import { TNewsPageProps } from 'components/NewsPage/interface';
import {
  Container,
  Heading,
  SliderContainer,
} from 'components/NewsPage/LandingPage/styles';
import { EMAIL_SUBCRIPTION } from 'const/index';
import { strings } from 'const/strings';

const NewsLandingPage: React.FC<TNewsPageProps> = (props) => {
  const { data: CMSContent, isMobile } = props;
  const {
    data,
    allArticles,
    featuredArticles,
    collectionReviews,
    CFData,
    trailerSectionData,
    showPageDocuments,
    subCategoryData,
    videoData,
    mediaData,
  } = CMSContent;
  const { heading, breadcrumbs } = data;
  const { HEADING, SUBHEADING } = strings.NEWS_PAGE.MAILER;

  return (
    <>
      <Container>
        <Breadcrumbs breadcrumbs={breadcrumbs} isMobile={isMobile} isNewsPage />
        <Heading>{heading}</Heading>
        <LandingPageBanner
          featuredArticles={featuredArticles}
          CFData={CFData}
        />
        <RecentNews
          allArticles={allArticles}
          CFData={CFData}
          isMobile={isMobile}
        />
      </Container>
      <LazyComponent>
        <Trailer
          content={{
            trailerSectionData,
            CFData,
            showPageDocuments,
            videoData,
          }}
          isMobile={isMobile}
        />
      </LazyComponent>
      <Conditional if={subCategoryData?.length > 0}>
        <Container>
          <LazyComponent>
            <Reviews
              heading={strings.NEWS_PAGE.REVIEWS}
              reviews={collectionReviews?.items}
              isMobile={isMobile}
              mediaData={mediaData}
            />
          </LazyComponent>
        </Container>
        <LazyComponent>
          <Mailer
            isMobile={isMobile}
            heading={'💌 ' + HEADING}
            subHeading={SUBHEADING}
            eventName={EMAIL_SUBCRIPTION.NEWS_PAGE_EVENT}
            isCatOrSubCatPage={false}
          />
        </LazyComponent>
        <SliderContainer>
          <VerticalProductCardSlide
            cards={subCategoryData}
            isMobile={isMobile}
            mediaData={mediaData}
            showPageDocuments={showPageDocuments}
          />
        </SliderContainer>
      </Conditional>
    </>
  );
};

export default NewsLandingPage;
