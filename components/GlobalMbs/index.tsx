import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import PopulateHead from 'components/common/meta';
import Footer from 'components/common/Footer';
import Conditional from 'components/common/Conditional';
import { groupSlices } from 'utils/helper';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';

import Tags from './Tags';
import Header from './Header';
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
  } = props;
  const logo = props?.data?.logo?.url || props?.data?.logo_url;
  const logoAltText = props?.data?.logo?.alt || props?.data?.logo_alt_text;
  const ticketsPage = props?.ticketsPage;
  const tickets = props?.tickets;
  const experiencesPage = props?.attractionsPage;
  const hasTicketsPage =
    props?.data?.supply === 'Direct' && props?.data?.headout_category_id;
  const ticketLink = hasTicketsPage
    ? convertUidToUrl(ticketsPage?.uid)
    : getValidUrl(props?.data?.official_website?.trim());
  const city = CMSContent?.city_name;
  const cityCollections = props?.cityCollections;
  const cityPageProps = {
    ...CMSContent,
    cityCollections: cityCollections?.results,
  };
  const country = CMSContent?.country_name;
  const countryCollections = props?.countryCollections;
  const currentLanguage = lang.split('-')[0];
  const footerLogoURL = footer?.logo?.url;
  const footerLogoAlt = footer?.footer_logo_alt || footer?.footer_logo?.alt;
  const slices = contentFramework?.data?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];

  const cityCollectionRanks = cityCollections?.results
    ?.map((collection) => collection?.data?.rank)
    ?.sort();

  const totalCityCollections = cityCollections?.results?.length;

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

  const collectionLinks = cityCollections?.results
    ?.filter((collection) => collection?.uid !== uid)
    ?.map((data) => {
      return {
        link: convertUidToUrl(data?.uid),
        label: data?.data?.collection_name,
      };
    });
  const headerLinks = showHeaderlinks
    ? [
        {
          link: '/',
          label: `Themeparks in ${city}`,
          multiLevel: collectionLinks,
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

  const hasMicrobrand = CMSContent?.microbrand_url;

  return (
    <>
      <Conditional if={!hasMicrobrand}>
        <PopulateHead
          {...{
            title: CMSContent?.title,
            description: CMSContent?.description,
            image: CMSContent?.image,
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
          logoUrl={logo}
          logoAltText={logoAltText}
          headerLinks={headerLinks}
          showTicketsCta={showTicketsCta}
          ticketsCtaLink={ticketLink}
        />
        <Conditional if={type === 'global_country'}>
          <CountryPage {...CMSContent} uid={uid} />
        </Conditional>
        <Conditional if={type === 'global_city'}>
          <CityPage {...cityPageProps} uid={uid} />
        </Conditional>
        <Conditional if={type === 'global_collection'}>
          <CollectionPage {...collectionPageProps} />
        </Conditional>
        <Conditional if={type === 'global_experience'}>
          <ExperiencePage {...CMSContent} uid={uid} />
        </Conditional>
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
        <Conditional if={cityCollections?.results?.length}>
          <Tags
            collections={cityCollections?.results}
            uid={uid}
            title={`Themeparks in ${city}`}
          />
        </Conditional>
        <Conditional if={countryCollections?.results?.length}>
          <Tags
            collections={countryCollections?.results}
            uid={uid}
            title={`All Themeparks in ${country}`}
          />
        </Conditional>
        <Footer
          currentLanguage={currentLanguage}
          attraction={footer.attraction || 'attraction'}
          primaryHeading={footer?.footer_heading}
          microbrandType={footer.microbrand_type || ''}
          themeOverride={footer.theme_override}
          invertLogoColor={footer.invert_logo_color}
          showDisclaimer={footer.show_disclaimer}
          disclaimerText={footer.disclaimer_text}
          logoURL={footerLogoURL}
          logoAlt={footerLogoAlt}
          slices={footer.body || []}
          hasPoweredByHeadoutLogo={footer.powered_by_superbrand || false}
        />
      </Conditional>
    </>
  );
};

export default GlobalMB;
