import dynamic from 'next/dynamic';
import { ICityPageProps } from 'components/CityPageContainer/interface';
import Mailer from 'components/CityPageContainer/Mailer';
import { Container } from 'components/CityPageContainer/styles';
import VideoBanner from 'components/CityPageContainer/VideoBanner';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import { ANALYTICS_EVENTS } from 'const/index';
import { strings } from 'const/strings';

const TopAttractions = dynamic(() =>
  import(
    /* webpackChunkName: "TopAttractions" */ 'components/CityPageContainer/TopAttractions'
  )
);
const NearbyCities = dynamic(() =>
  import(
    /* webpackChunkName: "NearbyCities" */ 'components/CityPageContainer/NearbyCities'
  )
);
const CityGuide = dynamic(() =>
  import(
    /* webpackChunkName: "CityGuide" */ 'components/CityPageContainer/CityGuide'
  )
);
const BeyondCity = dynamic(() =>
  import(
    /* webpackChunkName: "BeyondCity" */ 'components/CityPageContainer/BeyondCity'
  )
);
const PopularCategories = dynamic(() =>
  import(
    /* webpackChunkName: "PopularCategories" */ 'components/CityPageContainer/PopularCategories'
  )
);
const ExploreCity = dynamic(() =>
  import(
    /* webpackChunkName: "ExploreCity" */ 'components/CityPageContainer/ExploreCity'
  )
);

const CityPageContainer = ({
  cityPageData,
  isMobile,
  lang,
  host,
  isDev,
  prismicBannerImages,
}: ICityPageProps) => {
  const {
    nearbyAndCurrentCityData: { nearbyCitiesData, currentCityData },
    cityGuideData,
    nearbyTopCollectionsData,
    cityTopCollectionsData,
    categoriesData: { popularEntities, exploreSectionData },
    cityPageBannerData,
  } = cityPageData;

  const utilProps = { host, isDev, isMobile, lang };
  const { displayName: mbCityDisplayName } = currentCityData;

  const { categoriesData, subCategoriesData } = exploreSectionData;
  const showExploreSection =
    Object.keys(categoriesData).length || Object.keys(subCategoriesData).length;

  const { HEADING, SUBHEADING } = strings.CITY_PAGE.MAILER;

  const hasPopularEntities = popularEntities?.length > 2;

  return (
    <Container>
      <VideoBanner
        currentCityData={currentCityData}
        cityPageBannerData={cityPageBannerData}
        prismicBannerImages={prismicBannerImages}
        isMobile={isMobile}
      />
      <Conditional if={cityTopCollectionsData?.length}>
        <TopAttractions
          cityTopCollectionsData={cityTopCollectionsData}
          {...utilProps}
        />
      </Conditional>

      <Conditional if={hasPopularEntities}>
        <PopularCategories popularEntities={popularEntities} {...utilProps} />
      </Conditional>

      <Conditional if={showExploreSection}>
        <LazyComponent target={!hasPopularEntities ? 'NONE' : 'USER'}>
          <ExploreCity
            exploreSectionData={exploreSectionData}
            {...utilProps}
            mbCityDisplayName={mbCityDisplayName}
          />
        </LazyComponent>
      </Conditional>

      <Conditional
        if={nearbyTopCollectionsData.nearbyTopCollections?.length > 2}
      >
        <LazyComponent
          target={!hasPopularEntities && !showExploreSection ? 'NONE' : 'USER'}
        >
          <BeyondCity
            mbCityDisplayName={mbCityDisplayName}
            nearbyTopCollectionsData={nearbyTopCollectionsData}
            {...utilProps}
          />
        </LazyComponent>
      </Conditional>
      <Conditional if={cityGuideData?.length}>
        <LazyComponent>
          <CityGuide
            mbCityDisplayName={mbCityDisplayName}
            cityGuideData={cityGuideData}
            {...utilProps}
          />
        </LazyComponent>
      </Conditional>
      <Conditional if={nearbyCitiesData?.length > 2}>
        <LazyComponent>
          <NearbyCities cities={nearbyCitiesData} {...utilProps} />
        </LazyComponent>
      </Conditional>
      <LazyComponent>
        <Mailer
          isMobile={isMobile}
          heading={strings.formatString(HEADING, mbCityDisplayName)}
          subHeading={SUBHEADING}
          eventName={ANALYTICS_EVENTS.SUBSCRIBED_SUCCESSFULLY}
          isCatOrSubCatPage={false}
        />
      </LazyComponent>
    </Container>
  );
};

export default CityPageContainer;
