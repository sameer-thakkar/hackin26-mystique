import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import PopulateMeta from 'components/common/NextSeoMeta';
import Tags from 'components/GlobalMbs/Tags';
import Header from 'components/MicrositeV2/Header';
import {
  getAlternateLanguages,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
} from 'utils';
import { getBuyTicketsUrl, groupSlices } from 'utils/helper';
import {
  convertUidToUrl,
  getLogoRedirectionUrl,
  getValidUrl,
} from 'utils/urlUtils';
import { CUSTOM_TYPES } from 'const/index';

const CountryPage = dynamic(() => import('./views/CountryPage'));
const CityPage: ComponentType<React.PropsWithChildren<any>> = dynamic(
  () => import('./views/CityPage')
);
const CollectionPage: ComponentType<React.PropsWithChildren<any>> = dynamic(
  () => import('./views/CollectionPage')
);
const ExperiencePage: ComponentType<React.PropsWithChildren<any>> = dynamic(
  () => import('./views/ExperiencePage')
);
const HomePage: ComponentType<React.PropsWithChildren<any>> = dynamic(
  () => import('./views/HomePage')
);
const LongForm: ComponentType<React.PropsWithChildren<any>> = dynamic(
  () => import('components/MicrositeV2/LongForm')
);

const GlobalMB = (props: any) => {
  let attractions,
    rides: any = [];
  const {
    isMobile,
    uid,
    host,
    lang,
    alternate_languages,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    data: CMSData,
    isDev,
    serverRequestStartTimestamp,
    type,
    ticketsPage,
    tickets,
    experiencesPage,
    cityCollections,
    countryCollections = [],
    collections,
    categoryTourListData,
    ticketPages,
    domainConfig,
  } = props || {};

  const {
    common_header: commonHeader,
    common_footer: commonFooter,
    content_framework: contentFramework,
    collection: globalCollection,
    supply,
    headout_category_id: categoryId,
    headout_collection_id: collectionId,
    headout_tgid: tgid,
    official_website: officialWebsite,
    country_name: countryName,
    city_name: cityName,
    collection_name: collectionName,
    microbrand_url: microbrandUrl,
  } = CMSData ?? {};

  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );

  const isGlobalHomepage = type === CUSTOM_TYPES.GLOBAL_HOMEPAGE;
  const isGlobalCollection = type === CUSTOM_TYPES.GLOBAL_COLLECTION;
  const isGlobalExperience = type === CUSTOM_TYPES.GLOBAL_EXPERIENCE;
  const isGlobalCountry = type === CUSTOM_TYPES.GLOBAL_COUNTRY;
  const isGlobalCity = type === CUSTOM_TYPES.GLOBAL_CITY;

  const commonProps = {
    uid,
    isDev,
    isMobile,
    host,
    lang,
    type,
  };

  const { data: header } = commonHeader || {};
  const { data: footer } = commonFooter || {};

  const {
    attraction: footerAttraction,
    footer_heading: footerHeading,
    theme_override: footerThemeOverride,
    disclaimer_text: disclaimerText,
    body: footerSlices,
  } = footer || {};

  const {
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};

  const { results: collectionsData } = collections || {};
  const { results: cityCollectionsData } = cityCollections || {};
  const { results: countryCollectionsData } = countryCollections || {};

  const cityPageProps = {
    ...commonProps,
    ...CMSData,
    cityCollections: cityCollectionsData,
    ticketPages: ticketPages?.results || [],
  };

  const hasTicketsPage = supply === 'Direct' && (categoryId || collectionId);
  const ticketLink = getBuyTicketsUrl(
    supply,
    categoryId || collectionId,
    tgid,
    ticketsPage?.uid,
    isDev,
    host,
    officialWebsite,
    getHeadoutLanguagecode(lang)
  );

  const currentLanguage = lang.split('-')[0];
  const { data: contentFrameworkData } = contentFramework || {};
  const { body: slices } = contentFrameworkData || {};

  const contentFWSlices = (slices && groupSlices(slices)) || [];

  const cityCollectionRanks = cityCollectionsData
    ?.filter((collection: any) => collection?.data?.rank)
    ?.map((data: any) => data?.data?.rank)
    ?.sort();

  const homePageProps = {
    ...commonProps,
    ...CMSData,
    collections: collectionsData,
    cityCollections: cityCollectionsData,
  };

  const collectionPageProps = {
    ...commonProps,
    ...CMSData,
    tickets,
    ticketsPage,
    totalCityCollections: cityCollectionsData?.length,
    cityCollectionRanks,
  };
  const {
    body: cityPageSlices,
    images: collectionPageBanner,
    banner_images: homePageBanner,
  } = CMSData || {};
  const homePageBannerImages = homePageBanner?.reduce(
    (acc: any, image: any) => {
      const { image_url, alt_text } = image || {};
      if (Object.keys(image_url)?.length) {
        return [...acc, { url: image_url?.url, alt: alt_text }];
      }
    },
    []
  );
  const { items } =
    getSinglePrismicSlice({
      sliceName: 'banner',
      slices: cityPageSlices,
    }) || {};

  const cityPageBanners = items?.reduce((acc: any, image: any) => {
    const { banner_image, alt_text } = image || {};
    if (banner_image) {
      return [
        ...acc,
        {
          url: banner_image,
          alt: alt_text,
        },
      ];
    }
  }, []);
  const collectionPageBannerImages = collectionPageBanner?.reduce(
    (acc: any, image: any) => {
      const { image_url, alt_text } = image || {};
      if (image_url) {
        return [
          ...acc,
          {
            url: image_url,
            alt: alt_text,
          },
        ];
      }
    },
    []
  );

  let finalBannerImages;
  switch (true) {
    case isGlobalHomepage:
      finalBannerImages = homePageBannerImages;
      break;
    case isGlobalCity:
      finalBannerImages = cityPageBanners;
      break;
    case isGlobalCollection:
      finalBannerImages = collectionPageBannerImages;
      break;
  }

  const showTicketsCta = isGlobalCollection || props?.ticketsPage;
  const showHeaderlinks = isGlobalCollection || isGlobalExperience;

  const collectionLinks = cityCollectionsData
    ?.filter((collection: any) => collection?.uid !== uid)
    ?.map((data: any) => ({
      slice_type: 'menu_item',

      primary: {
        label: data?.data?.collection_name,
        url: {
          url: data?.data?.microbrand_url
            ? getValidUrl(data?.data?.microbrand_url?.trim())
            : convertUidToUrl({
                uid: data?.uid,
                isDev,
                hostname: host,
                lang: getHeadoutLanguagecode(lang),
              }),
          target: '_blank',
        },
      },
    }));

  const collectionCountryLinks = countryCollectionsData
    ?.filter((collection: any) => collection?.uid !== uid)
    ?.map((data: any) => ({
      slice_type: 'menu_item',

      primary: {
        label: data?.data?.collection_name,
        url: {
          url: data?.data?.microbrand_url
            ? getValidUrl(data?.data?.microbrand_url?.trim())
            : convertUidToUrl({
                uid: data?.uid,
                isDev,
                hostname: host,
                lang: getHeadoutLanguagecode(lang),
              }),
          target: '_blank',
        },
      },
    }));

  const CITY_TAGS_TITLE = 'Themeparks in';
  const COUNTRY_TAGS_TITLE = 'All Themeparks in';
  const HOMEPAGE_TAGS_TITLE = 'More Themeparks';

  let headerLinks = [];
  if (showHeaderlinks) {
    if (collectionCountryLinks?.length) {
      headerLinks.push({
        slice_type: 'navigation',
        primary: {},
        slices: [
          {
            slice_type: 'nested_menu',
            primary: {
              label: `${CITY_TAGS_TITLE} ${countryName}`,
              url: {},
            },
            slices: collectionCountryLinks,
          },
        ],
      });
    }

    if (collectionLinks?.length) {
      headerLinks.push({
        slice_type: 'navigation',
        primary: {},
        slices: [
          {
            slice_type: 'nested_menu',
            primary: {
              label: `${CITY_TAGS_TITLE} ${cityName}`,
              url: {},
            },
            slices: collectionLinks,
          },
        ],
      });
    }
  }

  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    host,
  });

  const filterByExperienceType = (arr: any[], experienceType: string) => {
    const data = arr?.filter((d) => d?.experience_type === experienceType);
    return data;
  };

  if (isGlobalCollection && experiencesPage) {
    const hasExperiences = Object.keys(experiencesPage)?.length;
    if (hasExperiences) {
      const experiencesData = experiencesPage?.data?.body
        ?.filter((slice: any) => slice?.slice_type === 'experiences')
        ?.reduce((acc: any, curr: any) => acc + curr);

      attractions = [
        ...filterByExperienceType(experiencesData?.items, 'Attraction'),
      ];
      rides = [...filterByExperienceType(experiencesData?.items, 'Ride')];
    }
  }

  let pageMarkup;

  const globalExperienceProps = {
    global_collection: globalCollection,
    categoryTourListData,
  };

  const { uid: parentUid } = globalCollection || {};

  const countryPageProps = {
    ...CMSData,
    collections: collectionsData,
    cityCollections: cityCollectionsData,
    ticketPages: ticketPages?.results || [],
  };

  switch (type) {
    case 'global_country':
      pageMarkup = <CountryPage {...countryPageProps} />;
      break;
    case 'global_city':
      pageMarkup = <CityPage {...cityPageProps} />;
      break;
    case 'global_collection':
      pageMarkup = <CollectionPage {...collectionPageProps} />;
      break;
    case 'global_experience':
      pageMarkup = (
        <ExperiencePage
          {...CMSData}
          {...commonProps}
          {...globalExperienceProps}
        />
      );
      break;
    default:
      pageMarkup = <HomePage {...homePageProps} />;
  }

  const selfCanonicalLink = convertUidToUrl({ uid });

  return (
    <>
      <Conditional if={!microbrandUrl}>
        <PopulateMeta
          {...{
            prismicData: {
              ...CMSData,
              ...header,
              canonical_link: selfCanonicalLink,
            },
            datePublished,
            dateModified,
            serverRequestStartTimestamp,
            languages: alternateLanguages,
            isMobile,
            bannerImages: finalBannerImages,
            logoUrl: logoUrl,
          }}
        />
        <Header
          isMobile={isMobile}
          allTours={[]}
          host={host}
          enableDropdownLinks={showHeaderlinks}
          dropdownLinks={[]}
          logoUrl={logoUrl}
          logoAltText={whiteLabelName || ''}
          // @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
          logoRedirectionURL={logoRedirectionUrl}
          enableSearch={false}
          enableBuyTickets={showTicketsCta}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          headerSlices={headerLinks}
          hasLanguageSelector={false}
          languageProps={null}
          isGlobalMb={true}
          buyTicketsLink={ticketLink}
        />
        {pageMarkup}
        <Conditional if={contentFWSlices.length}>
          <LongForm
            slicesArray={contentFWSlices}
            props={{
              isMobile,
              host,
              uid,
              isGlobalMb: true,
              isGlobalCity,
              cityName,
              isGlobalCollection,
              collectionName,
              experiencePageUid: experiencesPage?.uid,
              ...(rides?.length && {
                rides,
              }),
              // @ts-expect-error TS(2454): Variable 'attractions' is used before being assign... Remove this comment to see the full error message
              ...(attractions?.length && {
                attractions,
              }),
              ...(hasTicketsPage && {
                tickets: {
                  pageUID: ticketsPage?.uid,
                  ...tickets,
                },
              }),
            }}
            hasToursSection={false}
          />
        </Conditional>
        <Conditional
          if={
            cityCollectionsData?.length && !isGlobalHomepage && !isGlobalCountry
          }
        >
          <Tags
            collections={cityCollectionsData}
            uid={isGlobalExperience ? parentUid : uid}
            title={`${CITY_TAGS_TITLE} ${cityName}`}
          />
        </Conditional>
        <Conditional if={countryCollectionsData?.length && !isGlobalHomepage}>
          <Tags
            collections={countryCollectionsData}
            uid={uid}
            title={`${COUNTRY_TAGS_TITLE} ${countryName}`}
          />
        </Conditional>
        <Conditional if={collectionsData?.length && isGlobalHomepage}>
          <Tags
            collections={collectionsData}
            uid={uid}
            title={`${HOMEPAGE_TAGS_TITLE}`}
          />
        </Conditional>
        <Footer
          currentLanguage={currentLanguage}
          attraction={footerAttraction || 'attraction'}
          primaryHeading={footerHeading}
          themeOverride={footerThemeOverride}
          disclaimerText={disclaimerText}
          slices={footerSlices || []}
          logoURL={logoUrl}
          logoAlt={whiteLabelName || ''}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        />
      </Conditional>
    </>
  );
};

export default GlobalMB;
