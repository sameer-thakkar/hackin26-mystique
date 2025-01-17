import { TCategoryPageProps } from 'components/CategoryPage/interface';
import Conditional from 'components/common/Conditional';
import CategoryPageBanner from 'components/MicrositeV2/CategoryPageBanner';
import BrowseByCategoriesSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/BrowseByCategoriesSection';
import CategoryCarouselsSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/CategoryCarouselsSection';
import TopShowsSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/TopShowsSection';
import { LTD_COLLECTION_ID } from 'const/index';
import { strings } from 'const/strings';
import { CategoryPageWrapper } from './styles';

const CategoryPage: React.FC<React.PropsWithChildren<TCategoryPageProps>> = ({
  isMobile,
  heroProps,
  allTours,
  breadcrumbs,
  categoryProps,
  categoryTourListData,
  primarySubCategoryId,
  browseByCategoriesRef,
  trustBoosters = [],
  isEntertainmentBanner = false,
}) => {
  const { ENTERTAINMENT_MB_LANDING_PAGE } = strings;
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
        trustBoosters={trustBoosters}
        isEntertainmentBanner={isEntertainmentBanner}
      />
      <CategoryPageWrapper>
        <Conditional if={!isMobile && categoriesToRender?.length > 0}>
          <BrowseByCategoriesSection
            categoriesToRender={categoriesToRender}
            isMobile={isMobile}
            ref={browseByCategoriesRef}
            showGridUI={isMobile}
          />
        </Conditional>
        <div className={isMobile ? '' : 'main-wrapper'}>
          <Conditional
            if={categoryTourListData[primarySubCategoryId as number]}
          >
            <TopShowsSection
              isMobile={isMobile}
              topShows={Object?.values(
                primarySubCategoryId
                  ? categoryTourListData?.[primarySubCategoryId] || {}
                  : {}
              )}
              heading={
                categoryTourListData[primarySubCategoryId as number]?.[0]
                  ?.primarySubCategoryIdData?.displayName
                  ? `${ENTERTAINMENT_MB_LANDING_PAGE.TOP_SHOWS}: ${
                      categoryTourListData[primarySubCategoryId as number]?.[0]
                        ?.primarySubCategoryIdData?.displayName
                    }`
                  : ''
              }
              showBrowseByCategories
              isCategoryPage
              categoriesToRender={categoriesToRender}
            />
          </Conditional>
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
