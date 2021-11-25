import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWindowWidth } from '@react-hook/window-size';
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';
import { StyledRichContent } from 'UI/RichContent';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import ContentTabs from 'components/ShowPages/ContentTabs';
import ShowPageBanner from 'components/ShowPages/Banner';
import CustomerReview from 'components/ShowPages/CustomerReview';
import FeatureCard from 'components/ShowPages/FeatureCard';
import GoogleMap from 'components/ShowPages/GoogleMap';
import SafeDFBannerWrapper from 'components/ShowPages/SafetyBanner';
import Gallery from 'components/ShowPages/Gallery';
import CategorySlider from 'components/ShowPages/CategorySlider';
import SubHeading from 'components/ShowPages/SubHeading';
import {
  ALLOW_IMMEDIEATE_NESTING,
  REOPENING_TAG,
  FAVICON_LONDON_THEATRE_TICKETS,
} from 'const/index';
import { strings } from 'const/strings';
import {
  getAlternateLanguages,
  getHeadoutLanguagecode,
  legacyBooleanCheck,
} from 'utils';
import { groupSlices, getHostName } from 'utils/helper';
import cloneDeep from 'lodash.clonedeep';
import { StyledAccordion } from 'components/slices/Accordion';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import { fetchReviewsTourGroup, fetchTGIDsByCategoryV2 } from 'utils/apiUtils';
import { StyledAsideModal } from 'components/UI/AsideModal';
import TitleTextCombo from 'components/UI/TitleTextCombo';
import Conditional from 'components/common/Conditional';
import PopulateMeta from 'components/common/NextSeoMeta';
import { ProductJsonLd } from 'next-seo';
import { getProductSchema } from 'utils/schemaUtils';

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
  font-size: 15px;
  max-width: 792px;
  line-height: 24px;
  font-weight: normal;

  h2 {
    font-size: 24px;
    margin: 0 0 24px;
    line-height: 28px;
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
      line-height: 24px;
    }
  }
`;

const AboutTheatreSectionWrapper = styled.div`
  margin: 0 0 64px;
  font-size: 15px;
  max-width: 792px;
  line-height: 24px;
  font-weight: normal;

  h2 {
    font-size: 24px;
    margin: 0 0 24px;
    line-height: 28px;
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
  a {
    color: #114cd6;
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

const ShowPage = ({
  CMSContent,
  host,
  tourGroupData: tempTourGroupData,
  isDev,
  serverRequestStartTimestamp,
}) => {
  const tourGroupData = cloneDeep(tempTourGroupData);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [similarProductData, setSimilarProductData] = useState([]);
  let isReopening = false;
  const isStage = host.includes('stage-');
  const hostname = getHostName(isStage, isDev, host);

  const [isMobile, setIsMobile] = useState(false);
  const width = useWindowWidth();

  const {
    name,
    microBrandsHighlight,
    imageUploads,
    microBrandsDescriptor,
    allTags,
    topReviews,
    currency,
    reviewsDetails,
    listingPrice,
    primarySubCategory,
    city,
  } = tourGroupData || {};

  const { id: primarySubCategoryID, name: primarySubCategoryName } =
    primarySubCategory || {};
  const { code: cityCode } = city || {};

  const { code: currencyCode, localSymbol: currencySymbol } = currency || {};

  allTags.forEach((element) => {
    if (element === REOPENING_TAG) {
      isReopening = true;
    }
  });

  const {
    faqHeading,
    faqSchema,
    tabSchemaHighlight,
    tabSchemaInfo,
    tabHeadingHighlight,
    tabHeadingInfo,
    detailsObjects,
    tabSectionHeading,
    isSafetyBanner,
    showType,
    mapURL,
    highlightsSection,
    aboutTheatreSection,
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
  const categoryName = showType ? showType : primarySubCategoryName;

  const selfCanonicalLink = convertUidToUrl({ uid });
  const tagsArray = [categoryName, ...microBrandsDescriptor.split('\r\n')];
  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    false,
    host,
    uid
  );

  const {
    enable_group_booking: enableGroupBooking,
    logo_redirection_url: logoRedirectionURL,
    tgid,
    favicon,
    canonical_link,
  } = CMSData;

  const { commonHeader } = CMSContent;
  const headerLinks = commonHeader?.data?.header_links || [];
  const dropdownLinksArray = commonHeader?.data?.dropdown_menu?.reduce(
    (acc, item) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    },
    []
  );

  const { logo, body: headerSlices } = commonHeader?.data || {};
  const { url: logoUrl, alt: logoAltText } = logo || {};

  const finalHeaderSlices = groupSlices(
    headerSlices || [],
    ALLOW_IMMEDIEATE_NESTING
  );

  useEffect(() => {
    fetchTGIDsByCategoryV2({
      categoryId: primarySubCategoryID,
      hostname,
      isSubCategory: true,
      city: cityCode,
      language: currentLanguage,
      limit: '100',
    }).then((data) => {
      const { pageData } = data || {};
      const filteredData = pageData?.items?.filter(
        (element) => element.id !== tgid
      );
      if (filteredData?.length) {
        setSimilarProductData(filteredData);
      }
    });
  }, []);

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width]);

  useEffect(() => {
    const reviewTourGroup = async () => {
      const tourGroupReviews = await fetchReviewsTourGroup({
        tgid,
        hostName: hostname,
        limit: 5,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          return data.items.map((element) => {
            return { name: element.nonCustomerName, content: element.content };
          });
        });
      setCustomerReviews(tourGroupReviews);
    };

    reviewTourGroup();
  }, [tgid]);

  const PageURL = convertUidToUrl({ uid, lang, isDev, hostname: host });
  const [bannerImageOne, bannerImageTwo] = imageUploads || [];
  const breadcrumbs = [
    { url: '/', text: 'London Theatre Tickets' },
    {
      url: PageURL,
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
  return (
    <>
      <ShowPageWrapper>
        <PopulateMeta
          {...{
            prismicData: {
              ...CMSData,
              ...commonHeader?.data,
              ...{
                favicon: {
                  url: favicon || FAVICON_LONDON_THEATRE_TICKETS,
                },
                canonical_link: canonical_link || selfCanonicalLink,
              },
            },
            datePublished,
            dateModified,
            serverRequestStartTimestamp,
            languages: alternateLanguages,
            isMobile,
            isAmp: false,
            bannerImages,
          }}
        />
        <Header
          languages={alternateLanguages}
          headerLinks={headerLinks}
          dropdownLinks={dropdownLinksArray}
          currentLanguage={currentLanguage}
          logoUrl={logoUrl}
          logoAltText={logoAltText || ''}
          uid={uid}
          isMobile={isMobile}
          showGroupBooking={legacyBooleanCheck(enableGroupBooking)}
          logoRedirectionURL={logoRedirectionURL?.url || '/'}
          host={host}
          hasPoweredByHeadoutLogo={true}
          slices={finalHeaderSlices}
          isEntertainmentMB={true}
        />
        <ShowPageBanner
          tgid={tgid}
          isMobile={isMobile}
          detailsObjects={detailsObjects}
          tourGroupData={tourGroupData}
          currentLanguage={currentLanguage}
          tagsArray={tagsArray}
          isReopening={isReopening}
          hostname={hostname}
        />
        <Conditional if={isSafetyBanner}>
          <SafeDFBannerWrapper
            marginTop={isMobile ? 0 : 40}
            isShowPage={true}
          />
        </Conditional>
        <Wrapper>
          <HighlightsSectionWrapper>
            <RichText render={highlightsSection?.tab_content} />
          </HighlightsSectionWrapper>
          {isMobile ? (
            <AccordionGroup
              accordions={tabSchemaHighlight.map((element) => {
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
            <>
              <ContentTabs
                tabsArr={tabHeadingHighlight}
                contentArr={tabSchemaHighlight}
              />
            </>
          )}
          <Conditional if={imageUploads.length >= 5}>
            <Gallery galleryArray={imageUploads.slice(2)} isMobile={isMobile} />
          </Conditional>
          <SubHeading content={tabSectionHeading} />
          <AboutTheatreSectionWrapper>
            <RichText render={aboutTheatreSection?.tab_content} />
          </AboutTheatreSectionWrapper>
          {isMobile ? (
            <ComponentWrapper>
              <AccordionGroup
                accordions={tabSchemaInfo.map((element) => {
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
            currencySymbol={currencySymbol}
            allShowPagesDocuments={allShowPagesDocuments}
            currentLanguage={currentLanguage}
            categoryName={categoryName}
          />
          <Breadcrumb links={breadcrumbs} />
        </Wrapper>
        <Footer
          currentLanguage={currentLanguage}
          logoURL={commonFooter?.data?.logo?.url}
          logoAlt={commonFooter?.data?.logo?.alt}
          hasPoweredByHeadoutLogo={
            commonFooter?.data?.powered_by_superbrand || false
          }
          showDisclaimer={commonFooter?.data?.show_disclaimer}
          disclaimerText={commonFooter?.data?.disclaimer_text}
          microbrandType={commonFooter?.data?.microbrand_type}
          slices={commonFooter?.data?.body || []}
          invertLogoColor={commonFooter?.data?.invert_logo_color}
          attraction={commonFooter?.data?.attraction || 'attraction'}
          primaryHeading={commonFooter?.data?.footer_heading}
          isEntertainmentMb={true}
        />
      </ShowPageWrapper>
      {/* @ts-ignore */}
      <ProductJsonLd {...productSchema} />
    </>
  );
};

export default ShowPage;
