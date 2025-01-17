import Conditional from 'components/common/Conditional';
import VenueLandingPageBanner from 'components/MicrositeV2/CategoryPageBanner';
import VerticalProductCardSlide from 'components/NewsPage/components/VerticalProductCardSlide';
import { THEATRE_LANDING_PAGE_ILLUSTRATION } from 'const/index';
import BrowseByCategories from '../components/BrowseCategories';
import TheatreGrid from '../components/TheatreGrid';
import { TVenueLandingPage } from './interface';
import { PageWrapper } from './styles';

const VenueLandingPage: React.FC<
  React.PropsWithChildren<TVenueLandingPage>
> = ({
  isMobile,
  heading,
  breadcrumbs,
  landingPageData,
  popularShowsData,
  browseCategoriesData,
  hostname,
  language,
}) => {
  return (
    <>
      <VenueLandingPageBanner
        heading={heading}
        isMobile={isMobile}
        bannerImgUrl={isMobile ? '' : THEATRE_LANDING_PAGE_ILLUSTRATION}
        breadcrumbs={breadcrumbs}
      />
      <PageWrapper>
        <TheatreGrid
          data={landingPageData}
          hostname={hostname}
          language={language}
          isMobile={isMobile}
        />
        {/* Rendering component for both mweb and dweb was required 
        because don't want to make change in the original component. 
        This is being used in many places. */}
        <Conditional if={!isMobile}>
          <VerticalProductCardSlide
            cards={popularShowsData?.subCategoryData}
            isMobile={isMobile}
            mediaData={popularShowsData?.mediaData?.resourceEntityMedias}
            showPageDocuments={popularShowsData?.showPageDocuments}
          />
          <BrowseByCategories data={browseCategoriesData} isMobile={isMobile} />
        </Conditional>
      </PageWrapper>
      <Conditional if={isMobile}>
        <BrowseByCategories data={browseCategoriesData} isMobile={isMobile} />
        <VerticalProductCardSlide
          cards={popularShowsData?.subCategoryData}
          isMobile={isMobile}
          mediaData={popularShowsData?.mediaData?.resourceEntityMedias}
          showPageDocuments={popularShowsData?.showPageDocuments}
        />
      </Conditional>
    </>
  );
};

export default VenueLandingPage;
