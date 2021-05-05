import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import PopulateHead from 'components/common/meta';
import Header from 'components/MicrositeV2/Header';
import Conditional from 'components/common/Conditional';
import Tags from 'components/GlobalMbs/Tags';
import Footer from 'components/common/Footer';
import { groupSlices } from 'utils/helper';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';

const CountryPage = dynamic(() => import('./views/CountryPage'));
const CityPage: ComponentType<any> = dynamic(() => import('./views/CityPage'));
const CollectionPage: ComponentType<any> = dynamic(() =>
  import('./views/CollectionPage')
);
const ExperiencePage: ComponentType<any> = dynamic(() =>
  import('./views/ExperiencePage')
);
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
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    data: CMSContent,
    commonFooter: { data: footer },
    contentFramework,
    isDev,
    serverRequestStartTimestamp,
    type,
    ticketsPage,
    tickets,
    experiencesPage,
    currencies,
    cityCollections,
    countryCollections = [],
  } = props || {};

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
    title,
    description,
    image,
    logo,
    logo_url: logoUrl,
    logo_alt_text: logoAltText,
    supply,
    headout_category_id: categoryId,
    official_website: officialWebsite,
    country_name: countryName,
    city_name: cityName,
    microbrand_url: microbrandUrl,
  } = CMSContent || {};

  const { results: cityCollectionsData } = cityCollections || {};
  const { results: countryCollectionsData } = countryCollections || {};

  const hasTicketsPage = supply === 'Direct' && categoryId;
  const ticketLink = hasTicketsPage
    ? convertUidToUrl(ticketsPage?.uid)
    : getValidUrl(officialWebsite?.trim());
  const cityPageProps = {
    ...CMSContent,
    currencies,
    cityCollections: cityCollectionsData,
  };

  const currentLanguage = lang.split('-')[0];
  const footerLogoURL = footer?.logo?.url;
  const footerLogoAlt = footer?.footer_logo_alt || footer?.footer_logo?.alt;
  const { data: contentFrameworkData } = contentFramework || {};
  const { body: slices } = contentFrameworkData || {};

  const contentFWSlices = (slices && groupSlices(slices)) || [];

  const cityCollectionRanks = cityCollectionsData
    ?.map((collection) => collection?.data?.rank)
    ?.sort();

  const totalCityCollections = cityCollectionsData?.length;

  const collectionPageProps = {
    ...CMSContent,
    tickets,
    uid,
    ticketsPage,
    totalCityCollections,
    cityCollectionRanks,
  };

  const showTicketsCta = type === 'global_collection' || props?.ticketsPage;
  const showHeaderlinks =
    type === 'global_collection' || type === 'global_experience';

  const collectionLinks = cityCollectionsData
    ?.filter((collection) => collection?.uid !== uid)
    ?.map((data) => ({
      slice_type: 'menu_item',
      primary: {
        label: data?.data?.collection_name,
        url: {
          url: convertUidToUrl(data?.uid),
          target: '_blank',
        },
      },
    }));

  const CITY_TAGS_TITLE = 'Themeparks in';
  const COUNTRY_TAGS_TITLE = 'All Themeparks in';

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

  if (type === 'global_collection' && experiencesPage) {
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
      pageMarkup = <CountryPage {...CMSContent} uid={uid} />;
      break;
    case 'global_city':
      pageMarkup = <CityPage {...cityPageProps} uid={uid} />;
      break;
    case 'global_collection':
      pageMarkup = <CollectionPage {...collectionPageProps} />;
      break;
    case 'global_experience':
      pageMarkup = <ExperiencePage {...CMSContent} uid={uid} />;
      break;
  }

  return (
    <>
      <Conditional if={!microbrandUrl}>
        <PopulateHead
          {...{
            title,
            description,
            image,
            favicon: '',
            faq_schema: [],
            first_publication_date: datePublished,
            last_publication_date: dateModified,
            lang,
            originalHost: host,
            isDev,
            currentLanguage: lang,
            serverRequestStartTimestamp,
            isMobile,
          }}
        />
        <Header
          isMobile={isMobile}
          allTours={[]}
          host={host}
          enableDropdownLinks={showHeaderlinks}
          dropdownLinks={[]}
          logoUrl={logo?.url || logoUrl}
          logoAltText={logo?.alt || logoAltText}
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
        <Conditional if={cityCollectionsData?.length}>
          <Tags
            collections={cityCollectionsData}
            uid={uid}
            title={`${CITY_TAGS_TITLE} ${cityName}`}
          />
        </Conditional>
        <Conditional if={countryCollectionsData?.length}>
          <Tags
            collections={countryCollectionsData}
            uid={uid}
            title={`${COUNTRY_TAGS_TITLE} ${countryName}`}
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
