import React from 'react';
import dynamic from 'next/dynamic';
import Banner from 'components/CatAndSubCatPage/Banner';
import { CatAndSubCatPageProps } from 'components/CatAndSubCatPage/interface';
import { CatAndSubCatPageContainer } from 'components/CatAndSubCatPage/styles';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';

const SubCategoryPills = dynamic(
  () =>
    import(
      /* webpackChunkName: "SubCategoryPills" */ 'components/CatAndSubCatPage/SubCategoryPills'
    )
);
const TopCollectionsCarousel = dynamic(
  () =>
    import(
      /* webpackChunkName: "TopCollectionsCarousel" */ 'components/CatAndSubCatPage/TopCollectionsCarousel'
    )
);
const SubCategoryCards = dynamic(
  () =>
    import(
      /* webpackChunkName: "SubCategoryCards" */ 'components/CatAndSubCatPage/SubCategoryCards'
    )
);
const SubCategoryCarousels = dynamic(
  () =>
    import(
      /* webpackChunkName: "SubCategoryCarousels" */ 'components/CatAndSubCatPage/SubCategoryCarousels'
    )
);
const CityCategoriesCarousel = dynamic(
  () =>
    import(
      /* webpackChunkName: "CityCategoriesCarousel" */ 'components/CatAndSubCatPage/CityCategoriesCarousel'
    )
);

const CatAndSubCatPage: React.FC<
  React.PropsWithChildren<CatAndSubCatPageProps>
> = (props) => {
  const { catAndSubCatPageData, breadcrumbs, primaryCity, isMobile } = props;
  const {
    isSubCategoryPage,
    taggedCity,
    categoryData,
    subCategoryData,
    pageHeading,
    subCategoryPills,
    topCollectionsCarousel,
    subCategoryCarousels,
    subCategoryCards,
    subCategoryCardsRanking,
    cityCategoriesCarousel,
  } = catAndSubCatPageData;

  const hasTopCollectionsCarousel =
    !isSubCategoryPage && topCollectionsCarousel?.length > 0;
  const hasSubCategoryCarousels = subCategoryCarousels?.some(
    (subCategoryCarousel) => subCategoryCarousel?.carouselData?.length > 0
  );
  const hasSubCategoryCards = isSubCategoryPage && subCategoryCards?.length > 0;

  return (
    <CatAndSubCatPageContainer>
      <Banner
        pageHeading={pageHeading}
        breadcrumbs={breadcrumbs}
        taggedCity={taggedCity}
        primaryCity={primaryCity}
        isMobile={isMobile}
      />
      <Conditional if={subCategoryPills?.length > 1}>
        <SubCategoryPills
          subCategoryPills={subCategoryPills}
          subCategoryData={subCategoryData}
          isSubCategoryPage={isSubCategoryPage}
          isMobile={isMobile}
        />
      </Conditional>
      <Conditional if={hasTopCollectionsCarousel}>
        <TopCollectionsCarousel
          topCollectionsCarousel={topCollectionsCarousel}
          taggedCity={taggedCity}
          categoryData={categoryData}
          subCategoryData={subCategoryData}
          isMobile={isMobile}
        />
      </Conditional>
      <Conditional if={!isSubCategoryPage}>
        <SubCategoryCarousels
          subCategoryCarousels={subCategoryCarousels}
          isMobile={isMobile}
        />
      </Conditional>
      <Conditional if={hasSubCategoryCards}>
        <SubCategoryCards
          subCategoryCards={subCategoryCards}
          subCategoryCardsRanking={subCategoryCardsRanking}
          subCategoryData={subCategoryData}
          isMobile={isMobile}
        />
      </Conditional>
      <LazyComponent
        target={
          !hasTopCollectionsCarousel &&
          !hasSubCategoryCarousels &&
          !hasSubCategoryCards
            ? 'NONE'
            : 'USER'
        }
        placeHolderHeight={isMobile ? '24.5rem' : '32.25rem'}
      >
        <Conditional if={cityCategoriesCarousel?.length > 0}>
          <CityCategoriesCarousel
            cityCategoriesCarousel={cityCategoriesCarousel}
            isMobile={isMobile}
          />
        </Conditional>
      </LazyComponent>
    </CatAndSubCatPageContainer>
  );
};

export default CatAndSubCatPage;
