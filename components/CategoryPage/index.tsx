import { TCategoryPageProps } from 'components/CategoryPage/interface';
import Conditional from 'components/common/Conditional';
import CategoryPageBanner from 'components/MicrositeV2/CategoryPageBanner';
import BrowseByCategoriesSection from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection';
import CategoryCarouselsSection from 'components/MicrositeV2/LttLandingPageV2/CategoryCarouselsSection';
import TopLttShowsSection from 'components/MicrositeV2/LttLandingPageV2/TopLttShowsSection';
import { LTD_COLLECTION_ID } from 'const/index';
import { strings } from 'const/strings';
import { CategoryPageWrapper } from './styles';

const CategoryPage: React.FC<TCategoryPageProps> = ({
  isMobile,
  heroProps,
  allTours,
  breadcrumbs,
  categoryProps,
  categoryTourListData,
  primarySubCategoryId,
  browseByCategoriesRef,
}) => {
  const { LTT_LANDING_PAGE } = strings;
  const { categories } = categoryProps;
  const categoriesToRender: Array<Record<string, any>> =
    categories?.filter(
      (category: Record<string, any>) =>
        category.id !== LTD_COLLECTION_ID &&
        category.ranking?.popularity?.length
    ) ?? [];

  return (
    <>
      <CategoryPageBanner
        isMobile={isMobile}
        heading={heroProps?.banners[0]?.bannerHeading}
        bannerImgUrl={
          isMobile
            ? heroProps?.banners[0]?.mobile_url
            : heroProps?.banners[0]?.url
        }
        breadcrumbs={breadcrumbs}
      />
      <CategoryPageWrapper>
        <Conditional if={!isMobile}>
          <BrowseByCategoriesSection
            categoriesToRender={categoriesToRender}
            isMobile={isMobile}
            ref={browseByCategoriesRef}
          />
        </Conditional>
        <div className={isMobile ? '' : 'main-wrapper'}>
          <TopLttShowsSection
            isMobile={isMobile}
            topShows={Object.values(
              primarySubCategoryId
                ? categoryTourListData[primarySubCategoryId]
                : []
            )}
            heading={`${LTT_LANDING_PAGE.TOP_SHOWS}: ${
              categoryTourListData[primarySubCategoryId as number][0]
                ?.primarySubCategoryIdData?.displayName
            }`}
            showBrowseByCategories
            isCategoryPage
            categoriesToRender={categoriesToRender}
          />
          <CategoryCarouselsSection
            categoriesToRender={categoriesToRender}
            allTours={allTours}
            isMobile={isMobile}
            isCategoryPage
          />
        </div>
      </CategoryPageWrapper>
    </>
  );
};
export default CategoryPage;
