import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ErrorPage from 'next/error';
import Head from 'next/head';
import ServerCookies from 'cookies';
import styled from 'styled-components';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { useRecoilValue } from 'recoil';
import { ProductJsonLd } from 'next-seo';
import { useWindowWidth } from '@react-hook/window-size';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COOKIE,
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_SHOWPAGE_UID,
  DEFAULT_SHOWPAGE_HOSTNAME,
  FAVICON_LONDON_THEATRE_TICKETS,
  LanguagesUnion,
  LANGUAGE_MAP,
} from 'const/index';
import { strings } from 'const/strings';
import { StyledRichContent } from 'UI/RichContent';
import { expandFontToken } from 'const/typography';
import PopulateMeta from 'components/common/NextSeoMeta';
import { StyledAsideModal } from 'UI/AsideModal';
import {
  convertUidToUrl,
  getFormattedUrlSlug,
  getLogoRedirectionUrl,
  getShowpageBreadcrumbUid,
  getValidUrl,
} from 'utils/urlUtils';
import {
  generateDescriptor,
  shouldUseDynamicShowPage,
} from 'utils/productUtils';
import {
  fetchDomainConfig,
  fetchProductData,
  fetchTourGroupReviews,
  fetchTourGroupsByCategory,
  fetchTourGroupSlots,
} from 'utils/apiUtils';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { getProductSchema } from 'utils/schemaUtils';
import { getDurationISO, getPrevDate } from 'utils/dateUtils';
import { getUniqueArrayItemsBy } from 'utils/arrayUtils';
import TitleTextCombo from 'UI/TitleTextCombo';
import { StyledAccordion } from 'components/slices/Accordion';
import { checkIfLTTMB, getHostName, groupSlices } from 'utils/helper';
import Header from 'components/common/Header';
import {
  createBookingURL,
  getHeadoutLanguagecode,
  redirectTo,
  refsArrayToObject,
  renderError,
} from 'utils';
import ShowPageBanner from 'components/ShowPages/Banner/index';
import Conditional from 'components/common/Conditional';
import SpecialOfferBanner from 'components/ShowPages/SpecialOfferBanner';
import ContentTabs from 'components/ShowPages/ContentTabs';
import Gallery from 'components/ShowPages/Gallery';
import SubHeading from 'components/ShowPages/SubHeading';
import GoogleMap from 'components/ShowPages/GoogleMap';
import CustomerReview from 'components/ShowPages/CustomerReview';
import FeatureCard from 'components/ShowPages/FeatureCard';
import CategorySlider from 'components/ShowPages/CategorySlider';
import Footer from 'components/common/Footer';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import { gtmAtom } from 'store/atoms/gtm';
import { MBContext } from 'contexts/MBContext';
import { getRefsArrayByIds, getShowPageCollections } from 'utils/prismicUtils';
import { Client } from 'config/prismic-config';

const Breadcrumb = dynamic(() => import('components/ShowPages/BreadCrumb'));
const AccordionGroup = dynamic(() =>
  import('components/slices/AccordionGroup')
);

const ShowPageWrapper = styled.div`
  ${StyledAsideModal} {
    padding: 0 40px 70px;
  }
`;

const Wrapper = styled.div`
  body {
    overflow: hidden;
  }
  max-width: 1200px;
  margin: 64px auto 0;
  padding: 0 16px;
  ${TitleTextCombo} {
    margin-bottom: 0;
  }
  ${StyledAccordion} {
    padding: 24px 0;
    border-bottom: 1px solid #e2e2e2 !important;
    grid-row-gap: 12px;
  }
  ${StyledRichContent} {
    max-width: 792px;
  }
  @media (max-width: 768px) {
    margin: 40px auto 0;
    ${StyledRichContent} {
      font-size: 14px !important;
      ul {
        padding-inline-start: 0;
        list-style-position: inside;
      }
      li {
        font-weight: normal;
        padding-left: 1.5rem;
        text-indent: -1.5em;
      }
      p {
        margin-bottom: 10px;
      }
    }
  }
`;

const ComponentWrapper = styled.div`
  margin: 48px 0 32px;
  h2 {
    font-size: 18px;
  }
  @media (max-width: 768px) {
    margin: 24px 0 32px;
  }
`;

const HighlightsSectionWrapper = styled.div`
  margin: 0 0 64px;
  max-width: 792px;
  ${expandFontToken('Paragraph/Large')}

  h2 {
    ${expandFontToken('Heading/Large')}
    margin: 0 0 24px;
  }
  ul {
    padding-inline-start: 0;
    list-style-position: inside;
  }
  li::marker {
    margin: 0;
  }
  li {
    margin-bottom: 12px;
    padding-left: 1.5rem;
    text-indent: -1.5em;
  }
  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    margin: 0 0 24px;

    h2 {
      font-size: 18px;
      margin: 0 0 16px;
      line-height: 24px;
    }
  }
`;

const AboutTheatreSectionWrapper = styled.div`
  margin: 0 0 64px;
  max-width: 792px;
  ${expandFontToken('Paragraph/Large')}

  h2 {
    ${expandFontToken('Heading/Large')}
    margin: 0 0 24px;
  }
  ul {
    padding-inline-start: 0;
    list-style-position: inside;
  }
  li {
    margin-bottom: 12px;
    font-weight: normal;
    padding-left: 1.5rem;
    text-indent: -1.5em;
  }
  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    margin: 0 0 24px;

    h2 {
      font-size: 18px;
      margin: 0 0 16px;
    }
  }
`;

const ExperiencePage = ({
  id,
  lang,
  host,
  hostname,
  uid,
  isDev,
  productData,
  domainConfig,
  CMSContent,
  inventorySlotData,
  serverRequestStartTimestamp,
}: any) => {
  const [customerReviews, setCustomerReviews] = useState([]);
  const [similarProductData, setSimilarProductData] = useState([]);
  const currency = useRecoilValue(currencyAtom);

  const [isMobile, setIsMobile] = useState(false);
  const width = useWindowWidth();
  const { nakedDomain } = useContext(MBContext);

  const {
    name,
    listingPrice,
    microBrandsDescriptor,
    microBrandsHighlight,
    imageUploads,
    topReviews,
    reviewsDetails,
    primarySubCategory,
    city,
    startLocation,
    endLocation,
    variants,
    flowType,
  } = productData || {};

  const { slots }: SimplifiedSlotsData = inventorySlotData || {};

  const { id: primarySubCategoryID, name: primarySubCategoryName } =
    primarySubCategory || {};
  const { code: cityCode } = city || {};

  // @ts-expect-error TS(2339): Property 'code' does not exist on type '{}'.
  const { code: currencyCode } = currency || {};

  const {
    faviconUrl,
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};

  const { commonHeader, commonFooter, allShowPagesDocuments } =
    CMSContent || {};
  const {
    body: headerSlices,
    header_links: headerLinks = [],
    dropdown_menu: dropdownMenu,
  } = commonHeader?.data || {};
  const dropdownLinksArray = dropdownMenu?.reduce((acc: any, item: any) => {
    if (item.link)
      return [...acc, { value: item.link.url, label: item.link_text }];
    else return acc;
  }, []);
  const finalHeaderSlices = groupSlices(
    headerSlices || [],
    ALLOW_IMMEDIATE_NESTING
  );

  const {
    faqHeading,
    faqSchema,
    tabSchemaHighlight,
    tabSchemaInfo,
    tabHeadingHighlight,
    tabHeadingInfo,
    detailsObjects,
    tabSectionHeading,
    mapURL,
    highlightsSection,
    aboutTheatreSection,
    specialOffer,
    hasSpecialOffer,
  } = parseShowPageData(microBrandsHighlight);

  const currentLanguage = getHeadoutLanguagecode(lang);
  const pageMetaData = useRecoilValue(metaAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);

  const selfCanonicalLink = convertUidToUrl({ uid, lang: currentLanguage });
  const updatedDescriptors = generateDescriptor({
    v2Descriptors: microBrandsDescriptor?.split('\r\n'),
    lang: currentLanguage,
    isShowPage: true,
  });

  const tagsArray = [primarySubCategoryName, ...updatedDescriptors];

  useEffect(() => {
    fetchTourGroupsByCategory({
      categoryId: primarySubCategoryID,
      hostname,
      isSubCategory: true,
      city: cityCode,
      language: currentLanguage,
      limit: '100',
    }).then((data) => {
      const { pageData } = data || {};
      const filteredData = pageData?.items?.filter(
        (element: any) => element.id !== id
      );
      if (filteredData?.length) {
        setSimilarProductData(filteredData);
      }
    });
  }, []);

  useEffect(() => {
    if (eventsReady) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
        [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
        [ANALYTICS_PROPERTIES.TGIDS]: [id],
        ...getCommonEventMetaData(pageMetaData),
      });
    }
  }, [eventsReady]);

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width]);

  useEffect(() => {
    const reviewTourGroup = async () => {
      const data = await fetchTourGroupReviews({
        tgid: id,
        hostname,
        limit: 5,
      });

      const tourGroupReviews = data?.items?.map((review: any) => ({
        name: review?.nonCustomerName,
        content: review?.content,
      }));

      setCustomerReviews(tourGroupReviews);
    };

    reviewTourGroup();
  }, [hostname, id]);

  if (!shouldUseDynamicShowPage()) {
    return <ErrorPage statusCode={404} />;
  }

  const pageUrl = convertUidToUrl({
    uid,
    lang: currentLanguage,
    isDev,
    hostname,
  });
  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: currentLanguage,
    isDev,
    host,
  });
  const [bannerImageOne, bannerImageTwo] = imageUploads || [];

  const isLTT = checkIfLTTMB(uid);

  const breadcrumbs = [
    {
      url: convertUidToUrl({
        uid: getShowpageBreadcrumbUid('', isLTT),
        lang: currentLanguage,
        isDev,
        hostname,
      }),
      text: isLTT
        ? strings.ENTERTAINMENT_MB.LTT.MB_NAME
        : strings.ENTERTAINMENT_MB.BROADWAY.MB_NAME,
    },
    {
      url: convertUidToUrl({
        uid: getShowpageBreadcrumbUid(primarySubCategoryName, isLTT),
        lang: currentLanguage,
        isDev,
        hostname,
      }),
      text: primarySubCategoryName,
    },
    {
      url: pageUrl,
      text: name + ' - ' + strings.TICKETS,
    },
  ];

  const bannerImages = [
    {
      url: getValidUrl(bannerImageTwo?.url) || getValidUrl(bannerImageOne?.url),
      alt: name,
    },
  ];

  const productSchema = getProductSchema({
    productName: name,
    price: listingPrice?.finalPrice,
    currencySymbol: currencyCode,
    images: imageUploads,
    topReviews,
    reviewsDetails,
  });

  const { addressLine1, addressLine2, postalCode, cityName, state } =
    startLocation || endLocation || {};
  const productImages = imageUploads?.map((image: any) => image?.url);
  const showDescription = tabSchemaHighlight?.[0]?.tab_content?.[0]?.text;
  const showDuration = detailsObjects?.[strings.SHOW_PAGE.DURATION];
  const showDurationISO = getDurationISO(showDuration);
  const theatreSeatingCapacity = (aboutTheatreSection as any)?.tab_content[1]?.text?.split(
    ' '
  )[2];
  const showBookingUrl = createBookingURL({
    nakedDomain,
    lang: currentLanguage,
    tgid: id,
    currency,
    flowType,
  });
  const pricingValidFromDate = getPrevDate(inventorySlotData?.fromDate);

  let offerSchema: any = [];
  variants
    ?.filter((variant: any) => variant?.listingPrice)
    ?.map((variant: any) => {
      offerSchema.push({
        '@type': 'Offer',
        name: variant?.name,
        price: variant.listingPrice?.finalPrice,
        priceCurrency: variant.listingPrice?.currencyCode,
        validFrom: pricingValidFromDate,
        url: showBookingUrl,
        availability: 'https://schema.org/InStock',
      });
    });

  const uniqueDateTimeSlots = getUniqueArrayItemsBy(slots, [
    'startDate',
    'startTime',
  ]);

  const eventSchemaMarkup = uniqueDateTimeSlots
    ?.slice(0, 9)
    ?.map((slot) => {
      const { endTime, startTime, startDate } = slot || {};
      return `
      {
        "@context": "https://schema.org",
        "@type": "TheaterEvent",
        "name": "${name}",
        "description": "${showDescription}",
        "inLanguage": "English",
        "image": [${productImages?.map((image: any) => `"${image}"`)}],
        "startDate": "${startDate}T${startTime}",
        "duration": "${showDurationISO}",
        "endDate": "${startDate}T${endTime}",
        "maximumAttendeeCapacity": "${theatreSeatingCapacity}",
        "typicalAgeRange": "${detailsObjects?.[strings.SHOW_PAGE.AGE_LIMIT]}",
        "url": "${pageUrl}",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "${addressLine1}",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "${addressLine1}",
            "addressLocality": "${addressLine2}",
            "postalCode": "${postalCode}",
            "addressRegion": "${state ?? cityName}",
            "addressCountry": "${city?.country?.code}"
          }
        },
        "performer": {
          "@type": "TheaterGroup",
          "name": "${name} Cast"
        },
        "offers": [${offerSchema?.map((
          // @ts-expect-error TS(7006): Parameter 'variant' implicitly has an 'any' type.
          variant
        ) => JSON.stringify(variant))}]
      }`;
    })
    ?.join(',');

  return (
    <>
      <ShowPageWrapper>
        <PopulateMeta
          {...{
            prismicData: {
              ...commonHeader?.data,
              ...{
                canonical_link: selfCanonicalLink,
              },
            },
            serverRequestStartTimestamp,
            languages: [],
            isMobile,
            bannerImages,
            faviconUrl: faviconUrl || FAVICON_LONDON_THEATRE_TICKETS,
            logoUrl,
            uid,
          }}
        />
        {/* @ts-expect-error TS(2322): Type '{ reviews?: { author: { type: string; name: ... Remove this comment to see the full error message */}
        <ProductJsonLd {...productSchema} />
        <Head>
          <script
            dangerouslySetInnerHTML={{ __html: `[${eventSchemaMarkup}]` }}
            type="application/ld+json"
          />
        </Head>

        <Header
          headerLinks={headerLinks}
          dropdownLinks={dropdownLinksArray}
          currentLanguage={currentLanguage}
          logoUrl={logoUrl}
          logoAltText={whiteLabelName || ''}
          uid={uid}
          isMobile={isMobile}
          showGroupBooking={false}
          logoRedirectionURL={logoRedirectionUrl}
          host={host}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          slices={finalHeaderSlices}
          isEntertainmentMB={true}
        />
        <ShowPageBanner
          tgid={id}
          uid={uid}
          isMobile={isMobile}
          detailsObjects={detailsObjects}
          tourGroupData={productData}
          currentLanguage={currentLanguage}
          tagsArray={tagsArray}
          hostname={hostname}
          hasSpecialOffer={hasSpecialOffer}
        />
        <Conditional if={hasSpecialOffer}>
          <SpecialOfferBanner
            marginTop={isMobile ? 0 : 40}
            isShowPage={true}
            specialOffer={specialOffer}
          />
        </Conditional>
        <Wrapper>
          <HighlightsSectionWrapper>
            <RichText render={(highlightsSection as any)?.tab_content} />
          </HighlightsSectionWrapper>
          {isMobile ? (
            <AccordionGroup
              accordions={tabSchemaHighlight.map((element: any) => {
                return {
                  heading: element.tab_name,
                  content: element.tab_content,
                };
              })}
              heading={''}
              useSchema={true}
              isOpenOverride={false}
            />
          ) : (
            <ContentTabs
              tabsArr={tabHeadingHighlight}
              contentArr={tabSchemaHighlight}
            />
          )}
          <Conditional if={imageUploads?.length >= 5}>
            <Gallery
              galleryArray={imageUploads?.slice(2)}
              isMobile={isMobile}
            />
          </Conditional>
          <SubHeading content={tabSectionHeading} />
          <AboutTheatreSectionWrapper>
            <RichText render={(aboutTheatreSection as any)?.tab_content} />
          </AboutTheatreSectionWrapper>
          {isMobile ? (
            <ComponentWrapper>
              <AccordionGroup
                accordions={tabSchemaInfo.map((element: any) => {
                  return {
                    heading: element.tab_name,
                    content: element.tab_content,
                  };
                })}
                heading={''}
                useSchema={true}
                isOpenOverride={false}
              />
            </ComponentWrapper>
          ) : (
            <>
              <ContentTabs
                tabsArr={tabHeadingInfo}
                contentArr={tabSchemaInfo}
              />
            </>
          )}
          <GoogleMap mapURL={mapURL} />
          <AccordionGroup
            accordions={faqSchema}
            heading={faqHeading}
            useSchema={true}
          />
          <Conditional if={customerReviews?.length}>
            <>
              <SubHeading content={strings.CUSTOMER_REVIEW_HEADING} />
              <CustomerReview cards={customerReviews} isMobile={isMobile} />
            </>
          </Conditional>
          <FeatureCard />
          <SubHeading content={strings.CATEGORY_SLIDER_HEADING} />
          <CategorySlider
            cards={similarProductData}
            isMobile={isMobile}
            allShowPagesDocuments={allShowPagesDocuments}
            currentLanguage={currentLanguage}
            categoryName={primarySubCategoryName}
          />
          <Breadcrumb links={breadcrumbs} />
        </Wrapper>
        <Footer
          currentLanguage={currentLanguage}
          logoURL={logoUrl}
          logoAlt={whiteLabelName || ''}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          disclaimerText={commonFooter?.data?.disclaimer_text}
          slices={commonFooter?.data?.body || []}
          attraction={commonFooter?.data?.attraction || 'attraction'}
          primaryHeading={commonFooter?.data?.footer_heading}
          isEntertainmentMb={true}
        />
      </ShowPageWrapper>
    </>
  );
};

ExperiencePage.getInitialProps = async ({ req, res, query, asPath }: any) => {
  const serverCookies = new ServerCookies(req, res);
  const currency = serverCookies?.get(COOKIE.CURRENT_CURRENCY);
  const { host } = req?.headers || window?.location;
  const { lang, id } = query;
  const isStage = host.includes('stage-');
  const isDev = host.includes('localhost');
  const hostname = getHostName(isStage, isDev, host);
  let uid;
  if (isDev) {
    uid =
      (req ? query.host : window.location.search.includes('host')) ||
      DEFAULT_SHOWPAGE_HOSTNAME;
  } else {
    const { host } = req ? req.headers : window.location;
    uid = host.replace('stage-', '');
  }
  const productData = await fetchProductData({
    id,
    lang,
    hostname,
    currency,
  }).then((data) => data);

  if (!shouldUseDynamicShowPage()) {
    return renderError({ res, statusCode: 404 });
  }

  const { urlSlugs } = productData;
  const currentUrlPath = asPath.split('?')[0];
  const queryParams =
    asPath.indexOf('?') !== -1 ? `?${asPath.split('?')[1]}` : '';
  const formattedSlug = getFormattedUrlSlug(urlSlugs, lang);

  if (formattedSlug && currentUrlPath !== formattedSlug) {
    return redirectTo({
      res,
      url: `${formattedSlug}${queryParams}`,
      type: 301,
    });
  }
  const prismicLang = LANGUAGE_MAP[lang as LanguagesUnion]?.locale || 'en-us';

  const domainConfig = await fetchDomainConfig(uid);
  const allDocuments = await getShowPageCollections({
    pageSize: 100,
    page: 1,
    prevResults: [],
    lang: prismicLang,
  });

  // Adding this temporarily to pull common header and footer data from Prismic
  const page = await Client(req).getByUID(
    CUSTOM_TYPES.SHOW_PAGE,
    DEFAULT_PRISMIC_SHOWPAGE_UID,
    {
      lang: prismicLang,
    }
  );
  const { common_footer, common_header } = page?.data || {};
  const refArray = await getRefsArrayByIds(
    [common_header.id, common_footer.id],
    req
  );
  const { commonHeader, commonFooter } = refsArrayToObject(refArray);
  const CMSContent = {
    commonFooter,
    commonHeader,
    allShowPagesDocuments: allDocuments,
  };
  const inventorySlotData = await fetchTourGroupSlots({
    tgid: id,
    hostname,
    forDays: 10,
  });
  const serverRequestStartTimestamp = Math.floor(new Date().getTime());

  return {
    id,
    lang: lang || 'en',
    host,
    hostname,
    uid,
    isDev,
    productData,
    domainConfig,
    CMSContent,
    inventorySlotData,
    serverRequestStartTimestamp,
  };
};

export default ExperiencePage;
