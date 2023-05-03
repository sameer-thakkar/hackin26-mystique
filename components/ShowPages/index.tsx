import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRecoilValue } from 'recoil';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { ProductJsonLd } from 'next-seo';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import cloneDeep from 'lodash.clonedeep';
import { useWindowWidth } from '@react-hook/window-size';
import styled from 'styled-components';
import { metaAtom } from 'store/atoms/meta';
import { gtmAtom } from 'store/atoms/gtm';
import { currencyAtom } from 'store/atoms/currency';
import { StyledRichContent } from 'UI/RichContent';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import ContentTabs from 'components/ShowPages/ContentTabs';
import ShowPageBanner from 'components/ShowPages/Banner';
import CustomerReview from 'components/ShowPages/CustomerReview';
import FeatureCard from 'components/ShowPages/FeatureCard';
import GoogleMap from 'components/ShowPages/GoogleMap';
import Gallery from 'components/ShowPages/Gallery';
import CategorySlider from 'components/ShowPages/CategorySlider';
import SubHeading from 'components/ShowPages/SubHeading';
import SpecialOfferBanner from 'components/ShowPages/SpecialOfferBanner';
import TitleTextCombo from 'components/UI/TitleTextCombo';
import Conditional from 'components/common/Conditional';
import PopulateMeta from 'components/common/NextSeoMeta';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import { StyledAsideModal } from 'components/UI/AsideModal';
import { StyledAccordion } from 'components/slices/Accordion';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  FAVICON_LONDON_THEATRE_TICKETS,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import {
  getAlternateLanguages,
  getHeadoutLanguagecode,
  legacyBooleanCheck,
} from 'utils';
import { groupSlices, getHostName, checkIfLTTMB } from 'utils/helper';
import {
  convertUidToUrl,
  getValidUrl,
  getShowpageBreadcrumbUid,
  getLogoRedirectionUrl,
} from 'utils/urlUtils';
import {
  fetchTourGroupReviews,
  fetchTourGroupsByCategory,
} from 'utils/apiUtils';
import { generateDescriptor } from 'utils/productUtils';
import { getPrevDate, getDurationISO } from 'utils/dateUtils';
import { getProductSchema } from 'utils/schemaUtils';
import { getUniqueArrayItemsBy } from 'utils/arrayUtils';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';

const Breadcrumb = dynamic(() => import('./BreadCrumb'));
const AccordionGroup = dynamic(() => import('../slices/AccordionGroup'));

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
    margin-bottom: 0px;
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

const ShowPage = (props: any) => {
  const {
    CMSContent,
    host,
    tourGroupData: tempTourGroupData,
    inventorySlotData,
    isDev,
    serverRequestStartTimestamp,
    domainConfig,
  } = props;
  const tourGroupData = cloneDeep(tempTourGroupData);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [similarProductData, setSimilarProductData] = useState([]);
  const isStage = host.includes('stage-');
  const hostname = getHostName(isStage, isDev, host);
  const currency = useRecoilValue(currencyAtom);

  const [isMobile, setIsMobile] = useState(props?.isMobile);
  const width = useWindowWidth();

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
  } = tourGroupData || {};

  const { slots }: SimplifiedSlotsData = inventorySlotData || {};

  const { id: primarySubCategoryID, name: primarySubCategoryName } =
    primarySubCategory || {};
  const { code: cityCode } = city || {};

  const {
    faviconUrl,
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};

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

  const { commonFooter, allShowPagesDocuments } = CMSContent;

  const {
    uid,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    data: CMSData,
    alternate_languages,
    lang,
  } = CMSContent;

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
  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );

  const {
    enable_group_booking: enableGroupBooking,
    tgid,
    canonical_link,
  } = CMSData;

  const { commonHeader } = CMSContent;
  const headerLinks = commonHeader?.data?.header_links || [];
  const dropdownLinksArray = commonHeader?.data?.dropdown_menu?.reduce(
    (acc: any, item: any) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    },
    []
  );

  const { body: headerSlices } = commonHeader?.data || {};

  const finalHeaderSlices = groupSlices(
    headerSlices || [],
    ALLOW_IMMEDIATE_NESTING
  );

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
        (element: any) =>
          element.id !== tgid &&
          !!allShowPagesDocuments?.find(
            (doc: any) => doc.data.tgid === element.id
          )
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
        [ANALYTICS_PROPERTIES.TGIDS]: [tgid],
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
        tgid,
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
  }, [tgid]);

  const pageUrl = convertUidToUrl({
    uid,
    lang: currentLanguage,
    isDev,
    hostname: host,
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
        hostname: host,
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
        hostname: host,
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
    currencySymbol: currency || '',
    images: imageUploads,
    topReviews,
    reviewsDetails,
  });

  const { addressLine1, addressLine2, postalCode, cityName, state } =
    startLocation || endLocation || {};
  const productImages = imageUploads?.map((image: any) => image?.url);
  const showDescription = tabSchemaHighlight?.[0]?.tab_content?.[0]?.text;
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const showDuration = detailsObjects?.[strings.SHOW_PAGE.DURATION];
  const showDurationISO = getDurationISO(showDuration);
  const theatreSeatingCapacity = (aboutTheatreSection as any)?.tab_content[1]?.text?.split(
    ' '
  )[2];

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
        url: pageUrl,
        availability: 'https://schema.org/InStock',
      });
    });

  const uniqueDateTimeSlots = getUniqueArrayItemsBy(slots, [
    'startDate',
    'startTime',
  ]);

  const eventSchemaMarkup = uniqueDateTimeSlots
    ?.slice(0, 30)
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
        "typicalAgeRange": "${
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          detailsObjects?.[strings.SHOW_PAGE.AGE_LIMIT]
        }",
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
              ...CMSData,
              ...commonHeader?.data,
              ...{
                canonical_link: canonical_link || selfCanonicalLink,
              },
            },
            datePublished,
            dateModified,
            serverRequestStartTimestamp,
            languages: alternateLanguages,
            isMobile,
            bannerImages,
            faviconUrl: faviconUrl || FAVICON_LONDON_THEATRE_TICKETS,
            logoUrl: logoUrl,
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
          languages={alternateLanguages}
          headerLinks={headerLinks}
          dropdownLinks={dropdownLinksArray}
          currentLanguage={currentLanguage}
          logoUrl={logoUrl}
          logoAltText={whiteLabelName || ''}
          uid={uid}
          isMobile={isMobile}
          showGroupBooking={legacyBooleanCheck(enableGroupBooking)}
          logoRedirectionURL={logoRedirectionUrl}
          host={host}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          slices={finalHeaderSlices}
          isEntertainmentMB={true}
        />
        <ShowPageBanner
          tgid={tgid}
          uid={uid}
          isMobile={isMobile}
          detailsObjects={detailsObjects}
          tourGroupData={tourGroupData}
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
          <Conditional if={imageUploads.length >= 5}>
            <Gallery galleryArray={imageUploads.slice(2)} isMobile={isMobile} />
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
          <Conditional if={customerReviews.length}>
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

export default ShowPage;
