import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import Header from 'components/MicrositeV2/Header';
import PopulateMeta from 'components/common/NextSeoMeta';
import Tags from 'components/GlobalMbs/Tags';
import Footer from 'components/common/Footer';
import { groupSlices } from 'utils/helper';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import { CUSTOM_TYPES } from 'const/index';
import { getSinglePrismicSlice, getAlternateLanguages } from 'utils';

const CountryPage = dynamic(() => import('./views/CountryPage'));
const CityPage: ComponentType<any> = dynamic(() => import('./views/CityPage'));
const CollectionPage: ComponentType<any> = dynamic(() =>
  import('./views/CollectionPage')
);
const ExperiencePage: ComponentType<any> = dynamic(() =>
  import('./views/ExperiencePage')
);
const HomePage: ComponentType<any> = dynamic(() => import('./views/HomePage'));
const LongForm: ComponentType<any> = dynamic(() =>
  import('components/MicrositeV2/LongForm')
);

const GlobalMB = (props) => {
  let attractions,
    rides = [];
  const {
    isMobile,
    uid,
    host,
    lang,
    alternate_languages,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    data: CMSContent,
    commonHeader,
    commonFooter,
    contentFramework,
    isDev,
    serverRequestStartTimestamp,
    type,
    ticketsPage,
    tickets,
    experiencesPage,
    allCurrencies: currencies,
    cityCollections,
    countryCollections = [],
    collections,
  } = props || {};

  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    false
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
    microbrand_type: footerMbType,
    theme_override: footerThemeOverride,
    invert_logo_color: invertLogoColor,
    show_disclaimer: showDisclaimer,
    disclaimer_text: disclaimerText,
    body: footerSlices,
    powered_by_superbrand: poweredBy,
  } = footer || {};

  const {
    supply,
    headout_category_id: categoryId,
    official_website: officialWebsite,
    country_name: countryName,
    city_name: cityName,
    collection_name: collectionName,
    microbrand_url: microbrandUrl,
  } = CMSContent || {};

  const { logo } = header || {};
  const { url: logoUrl, alt: logoAltText } = logo || {};
  const { results: collectionsData } = collections || {};
  const { results: cityCollectionsData } = cityCollections || {};
  const { results: countryCollectionsData } = countryCollections || {};

  const cityPageProps = {
    ...commonProps,
    ...CMSContent,
    currencies,
    cityCollections: cityCollectionsData,
  };

  const hasTicketsPage = supply === 'Direct' && categoryId;
  const ticketLink = hasTicketsPage
    ? ticketsPage?.uid
      ? convertUidToUrl({ uid: ticketsPage?.uid, isDev })
      : getValidUrl(officialWebsite?.trim())
    : getValidUrl(officialWebsite?.trim());

  const currentLanguage = lang.split('-')[0];
  const footerLogoURL = footer?.logo?.url;
  const footerLogoAlt = footer?.footer_logo_alt || footer?.footer_logo?.alt;
  const { data: contentFrameworkData } = contentFramework || {};
  const { body: slices } = contentFrameworkData || {};

  const contentFWSlices = (slices && groupSlices(slices)) || [];

  const cityCollectionRanks = cityCollectionsData
    ?.filter((collection) => collection?.data?.rank)
    ?.map((data) => data?.data?.rank)
    ?.sort();

  const homePageProps = {
    ...commonProps,
    ...CMSContent,
    collections: collectionsData,
    cityCollections: cityCollectionsData,
  };

  const collectionPageProps = {
    ...commonProps,
    ...CMSContent,
    tickets,
    ticketsPage,
    totalCityCollections: cityCollectionsData?.length,
    cityCollectionRanks,
  };
  const {
    body: cityPageSlices,
    images: collectionPageBanner,
    banner_images: homePageBanner,
  } = CMSContent || {};
  const homePageBannerImages = homePageBanner?.reduce((acc, image) => {
    const { image_url, alt_text } = image || {};
    if (Object.keys(image_url)?.length) {
      acc.push({ url: image_url?.url, alt: alt_text });
    }
    return acc;
  }, []);
  const { items } =
    getSinglePrismicSlice({
      sliceName: 'banner',
      slices: cityPageSlices,
    }) || {};

  const cityPageBanners = items?.reduce((acc, image) => {
    const { banner_image, alt_text } = image || {};
    if (banner_image) {
      acc.push({
        url: banner_image,
        alt: alt_text,
      });
    }
    return acc;
  }, []);
  const collectionPageBannerImages = collectionPageBanner?.reduce(
    (acc, image) => {
      const { image_url, alt_text } = image || {};
      if (image_url) {
        acc.push({
          url: image_url,
          alt: alt_text,
        });
      }
      return acc;
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
    ?.filter((collection) => collection?.uid !== uid)
    ?.map((data) => ({
      slice_type: 'menu_item',
      primary: {
        label: data?.data?.collection_name,
        url: {
          url: data?.data?.microbrand_url
            ? getValidUrl(data?.data?.microbrand_url?.trim())
            : convertUidToUrl({ uid: data?.uid }),
          target: '_blank',
        },
      },
    }));

  const CITY_TAGS_TITLE = 'Themeparks in';
  const COUNTRY_TAGS_TITLE = 'All Themeparks in';
  const HOMEPAGE_TAGS_TITLE = 'More Themeparks';

  const headerLinks =
    showHeaderlinks && collectionLinks?.length
      ? [
          {
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
          },
        ]
      : [];

  const filterByExperienceType = (arr: any[], experienceType: string) => {
    const data = arr?.filter((d) => d?.experience_type === experienceType);
    return data;
  };

  if (isGlobalCollection && experiencesPage) {
    const hasExperiences = Object.keys(experiencesPage)?.length;
    if (hasExperiences) {
      const experiencesData = experiencesPage?.data?.body
        ?.filter((slice) => slice?.slice_type === 'experiences')
        ?.reduce((acc, curr) => acc + curr);

      attractions = [
        ...filterByExperienceType(experiencesData?.items, 'Attraction'),
      ];
      rides = [...filterByExperienceType(experiencesData?.items, 'Ride')];
    }
  }

  let pageMarkup;

  switch (type) {
    case 'global_country':
      pageMarkup = <CountryPage {...CMSContent} {...commonProps} />;
      break;
    case 'global_city':
      pageMarkup = <CityPage {...cityPageProps} />;
      break;
    case 'global_collection':
      pageMarkup = <CollectionPage {...collectionPageProps} />;
      break;
    case 'global_experience':
      pageMarkup = <ExperiencePage {...CMSContent} {...commonProps} />;
      break;
    default:
      pageMarkup = <HomePage {...homePageProps} />;
  }

  return (
    <>
      <Conditional if={!microbrandUrl}>
        <PopulateMeta
          {...{
            prismicData: { ...CMSContent, ...header },
            uid,
            datePublished,
            dateModified,
            originalHost: host,
            serverRequestStartTimestamp,
            languages: alternateLanguages,
            currentLanguage: lang,
            isDev,
            isMobile,
            isAmp: false,
            bannerImages: finalBannerImages,
          }}
        />
        <Header
          isMobile={isMobile}
          allTours={[]}
          host={host}
          enableDropdownLinks={showHeaderlinks}
          dropdownLinks={[]}
          logoUrl={logoUrl}
          logoAltText={logoAltText}
          enableSearch={false}
          enableBuyTickets={showTicketsCta}
          hasPoweredByHeadoutLogo={false}
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
            uid={uid}
            title={`${CITY_TAGS_TITLE} ${cityName}`}
            isDev={isDev}
          />
        </Conditional>
        <Conditional if={countryCollectionsData?.length && !isGlobalHomepage}>
          <Tags
            collections={countryCollectionsData}
            uid={uid}
            title={`${COUNTRY_TAGS_TITLE} ${countryName}`}
            isDev={isDev}
          />
        </Conditional>
        <Conditional if={collectionsData?.length && isGlobalHomepage}>
          <Tags
            collections={collectionsData}
            uid={uid}
            title={`${HOMEPAGE_TAGS_TITLE}`}
            isDev={isDev}
          />
        </Conditional>
        <Footer
          currentLanguage={currentLanguage}
          attraction={footerAttraction || 'attraction'}
          primaryHeading={footerHeading}
          microbrandType={footerMbType || ''}
          themeOverride={footerThemeOverride}
          invertLogoColor={invertLogoColor}
          showDisclaimer={showDisclaimer}
          disclaimerText={disclaimerText}
          logoURL={footerLogoURL}
          logoAlt={footerLogoAlt}
          slices={footerSlices || []}
          hasPoweredByHeadoutLogo={poweredBy || false}
        />
      </Conditional>
    </>
  );
};

export default GlobalMB;
