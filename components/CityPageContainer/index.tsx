import dynamic from 'next/dynamic';
import { ICityPageProps } from 'components/CityPageContainer/interface';
import Mailer from 'components/CityPageContainer/Mailer';
import { Container } from 'components/CityPageContainer/styles';
import VideoBanner from 'components/CityPageContainer/VideoBanner';
import Conditional from 'components/common/Conditional';
import { EMAIL_SUBCRIPTION } from 'const/index';
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

      <Conditional if={popularEntities?.length > 2}>
        <PopularCategories popularEntities={popularEntities} {...utilProps} />
      </Conditional>

      <Conditional if={showExploreSection}>
        <ExploreCity
          exploreSectionData={exploreSectionData}
          {...utilProps}
          mbCityDisplayName={mbCityDisplayName}
        />
      </Conditional>

      <Conditional
        if={nearbyTopCollectionsData.nearbyTopCollections?.length > 2}
      >
        <BeyondCity
          mbCityDisplayName={mbCityDisplayName}
          nearbyTopCollectionsData={nearbyTopCollectionsData}
          {...utilProps}
        />
      </Conditional>
      <Conditional if={cityGuideData?.length}>
        <CityGuide
          mbCityDisplayName={mbCityDisplayName}
          cityGuideData={cityGuideData}
          {...utilProps}
        />
      </Conditional>
      <Conditional if={nearbyCitiesData?.length > 2}>
        <NearbyCities cities={nearbyCitiesData} {...utilProps} />
      </Conditional>
      <Mailer
        isMobile={isMobile}
        heading={strings.formatString(HEADING, mbCityDisplayName)}
        subHeading={SUBHEADING}
        eventName={EMAIL_SUBCRIPTION.CITY_PAGE_EVENT}
      />
    </Container>
  );
};

export default CityPageContainer;
