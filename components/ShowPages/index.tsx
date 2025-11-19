import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ProductJsonLd } from 'next-seo';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { PrismicRichText } from '@prismicio/react';
import { useWindowWidth } from '@react-hook/window-size';
import cloneDeep from 'lodash.clonedeep';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import LazyComponent from 'components/common/LazyComponent';
import PopulateMeta from 'components/common/NextSeoMeta';
import ShowPageBanner from 'components/ShowPages/Banner/index';
import CategorySlider from 'components/ShowPages/CategorySlider';
import ContentTabs from 'components/ShowPages/ContentTabs';
import CustomerReview from 'components/ShowPages/CustomerReview';
import FeatureCard from 'components/ShowPages/FeatureCard';
import Gallery from 'components/ShowPages/Gallery';
import GoogleMap from 'components/ShowPages/GoogleMap';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import { SpecialOfferBanner } from 'components/ShowPages/SpecialOfferBanner';
import SubHeading from 'components/ShowPages/SubHeading';
import { StyledAccordion } from 'components/slices/Accordion';
import { StyledAsideModal } from 'components/UI/AsideModal';
import TitleTextCombo from 'components/UI/TitleTextCombo';
import { StyledRichContent } from 'UI/RichContent';
import {
  getAlternateLanguages,
  getHeadoutLanguagecode,
  legacyBooleanCheck,
} from 'utils';
import {
  getCommonEventMetaData,
  sendVariablesToDataLayer,
  trackEvent,
} from 'utils/analytics';
import {
  fetchTourGroupReviews,
  fetchTourGroupsByCategory,
} from 'utils/apiUtils';
import { getUniqueArrayItemsBy } from 'utils/arrayUtils';
import { getDurationISO, getPrevDate } from 'utils/dateUtils';
import { checkIfLTTMB, getHostName, groupSlices } from 'utils/helper';
import { generateDescriptor } from 'utils/productUtils';
import { getProductSchema } from 'utils/schemaUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import {
  convertUidToUrl,
  getLogoRedirectionUrl,
  getValidUrl,
} from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { gtmAtom } from 'store/atoms/gtm';
import { metaAtom } from 'store/atoms/meta';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';

const AccordionGroup = dynamic(() => import('../slices/AccordionGroup'));
const Breadcrumbs = dynamic(
  () => import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
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
    breadcrumbs,
  } = props;
  const tourGroupData = cloneDeep(tempTourGroupData);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [similarProductData, setSimilarProductData] = useState([]);
  const hostname = getHostName(isDev, host);
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

  const { id: primarySubCategoryID, displayName: primarySubCategoryName } =
    primarySubCategory || {};
  const { code: cityCode } = city || {};

  const {
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

  const {
    uid,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    data: CMSData,
    alternate_languages,
    lang,
    allShowPagesDocuments,
  } = CMSContent;

  const currentLanguage = getHeadoutLanguagecode(lang);
  const pageMetaData = useRecoilValue(metaAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);

  const selfCanonicalLink = convertUidToUrl({ uid, lang: currentLanguage });
  const isLTT = checkIfLTTMB(uid);

  const updatedDescriptors = generateDescriptor({
    v2Descriptors: microBrandsDescriptor,
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
    tagged_category: taggedCategoryName,
    tagged_sub_category: taggedSubCategoryName,
    tagged_mb_type: taggedMbType,
    common_header: commonHeader,
    common_footer: commonFooter,
  } = CMSData;

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
      sendVariablesToDataLayer({
        ...(taggedCategoryName && {
          [ANALYTICS_PROPERTIES.CATEGORY_NAME]: taggedCategoryName,
        }),
        ...(taggedSubCategoryName && {
          [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: taggedSubCategoryName,
        }),
        ...(taggedMbType && {
          [ANALYTICS_PROPERTIES.MB_TYPE]: taggedMbType,
        }),
      });

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
        language: currentLanguage,
      });

      const tourGroupReviews = data?.items
        ?.filter(
          (review: Record<string, any>) =>
            review?.nonCustomerName && review?.content
        )
        ?.map((review: any) => ({
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
  const showDuration = detailsObjects?.[strings.SHOW_PAGE.DURATION];
  const showDurationISO = getDurationISO(showDuration);
  const theatreSeatingCapacity = (
    aboutTheatreSection as any
  )?.tab_content[1]?.text?.split(' ')[2];

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
        "offers": [${offerSchema?.map(
          (
            // @ts-expect-error TS(7006): Parameter 'variant' implicitly has an 'any' type.
            variant
          ) => JSON.stringify(variant)
        )}]
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
            logoUrl: logoUrl,
            breadcrumbsDetails: {
              breadcrumbs,
              showName: name,
            },
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
          isEntertainmentMB
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
          isProd={!isDev}
        />
        <Conditional if={hasSpecialOffer}>
          <SpecialOfferBanner
            marginTop={isMobile ? 0 : 40}
            isShowPage
            specialOffer={specialOffer}
          />
        </Conditional>
        <Wrapper>
          <HighlightsSectionWrapper>
            <PrismicRichText
              field={(highlightsSection as any)?.tab_content}
              components={shortCodeSerializer}
            />
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
              useSchema
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
            <PrismicRichText
              field={(aboutTheatreSection as any)?.tab_content}
              components={shortCodeSerializer}
            />
          </AboutTheatreSectionWrapper>
          <LazyComponent>
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
                  useSchema
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
          </LazyComponent>
          <LazyComponent>
            <GoogleMap mapURL={mapURL} />
          </LazyComponent>
          <LazyComponent>
            <AccordionGroup
              accordions={faqSchema}
              heading={faqHeading}
              useSchema
            />
          </LazyComponent>
          <Conditional if={customerReviews.length}>
            <LazyComponent>
              <SubHeading content={strings.CUSTOMER_REVIEW_HEADING} />
              <CustomerReview cards={customerReviews} isMobile={isMobile} />
            </LazyComponent>
          </Conditional>
          <LazyComponent>
            <FeatureCard />
          </LazyComponent>
          <Conditional if={similarProductData?.length}>
            <LazyComponent>
              <SubHeading content={strings.CATEGORY_SLIDER_HEADING} />
              <CategorySlider
                cards={similarProductData}
                isMobile={isMobile}
                allShowPagesDocuments={allShowPagesDocuments}
                currentLanguage={currentLanguage}
                categoryName={primarySubCategoryName}
              />
            </LazyComponent>
          </Conditional>
          <LazyComponent>
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              showName={name}
              isShowPage
              isMobile={isMobile}
            />
          </LazyComponent>
        </Wrapper>
        <LazyComponent>
          <Footer
            currentLanguage={currentLanguage}
            logoURL={logoUrl}
            logoAlt={whiteLabelName || ''}
            hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
            disclaimerText={commonFooter?.data?.disclaimer_text}
            // As of December 2024, footer displays only secondary footer Items to be consistent with Kirby
            secondarySlices={commonFooter?.data?.body || []}
            secondaryHeading={commonFooter?.data?.footer_heading}
            attraction={commonFooter?.data?.attraction || 'attraction'}
            isEntertainmentMb
            isLTT={isLTT}
          />
        </LazyComponent>
      </ShowPageWrapper>
    </>
  );
};

export default ShowPage;
