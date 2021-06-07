import { strings } from 'const/strings';
import React, { useEffect, useState } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { legacyBooleanCheck } from 'utils';
import { RichText } from 'prismic-reactjs';

import {
  fetchReviewsTourGroup,
  fetchCategory,
  fetchCurrencyList,
} from '../../utils/apiUtils';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { parseShowPageData } from './parseShowPage';
import ContentTabs from './ContentTabs';
import ShowPageBanner from './Banner';
import CustomerReview from './CustomerReview';
import FeatureCard from './FeatureCard';
import GoogleMap from './GoogleMap';
import SafeDFBannerWrapper from './SafetyBanner';
import Gallery from './Gallery';
import CategorySlider from './CategorySlider';
import SubHeading from './SubHeading';
import PopulateHead from '../common/meta';

const AccordionGroup = dynamic(() => import('../slices/AccordionGroup'));

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 64px auto 0;
  padding: 0 16px;
  @media (max-width: 768px) {
    margin: 40px auto 0;
  }
`;

const ComponentWrapper = styled.div`
  margin: 48px 0 32px;
  h2{
    font-size: 18px;
  }
`;

const HighlightsSectionWrapper = styled.div`
  margin: 0 0 70px;
  font-size: 15px;
  max-width: 776px;
  line-height: 24px;
  h2{
    font-size: 24px;
    margin: 0 0 24px;
  }
  li{
    margin-bottom: 12px;
  }
  @media (max-width: 768px) {
    width:100%;
    font-size: 14px;
    line-height: 20px;
    margin: 0 0 48px;
    
    h2{
      font-size: 18px;
      margin: 0 0 16px;
    }
  }
`;

const ShowPage = ({ CMSContent, host, uid, lang, tourGroupData, isDev }) => {
  const [customerReviews, setCustomerReviews] = useState([]);
  const [similarProductData, setSimilarProductData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState({});

  const [isMobile, setIsMobile] = useState(false);
  const width = useWindowWidth();

  const {
    microBrandsHighlight,
    imageUploads,
    categoriesFromRoot,
    microBrandsDescriptor,
  } = tourGroupData;

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
    highlightsSection
  } = parseShowPageData(microBrandsHighlight);

  const currentLanguage = lang.split('-')[0];
  const categoryId = categoriesFromRoot[categoriesFromRoot.length - 1].id;
  const categoryName = showType
    ? showType
    : categoriesFromRoot[categoriesFromRoot.length - 1].displayName;

  const tagsArray = [categoryName, ...microBrandsDescriptor.split('\r\n')];

  const { commonFooter, allShowPagesDocuments } = CMSContent;

  const {
    data: {
      enable_group_booking: enableGroupBooking,
      logo_redirection_url: logoRedirectionURL,
      localization,
      enable_localization_menu,
      tgid,
      header_links: headerLinks,
      favicon,
      title,
      description,
      canonical_link,
    },
  } = CMSContent;

  const { commonHeader } = CMSContent
  const { data: header } = commonHeader || {};
  const { logo } = header || {};
  const { url: logoUrl, alt: logoAltText } = logo || {};

  useEffect(() => {
    const fetchTourGroupPrices = async () => {
      const categoryData = await fetchCategory(categoryId);

      setSimilarProductData(
        categoryData?.products.filter((element) => element.id != tgid)
      );
    };

    fetchTourGroupPrices();
  }, [categoryId, tgid]);

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width]);

  useEffect(() => {
    const reviewTourGroup = async () => {
      const tourGroupReviews = await fetchReviewsTourGroup(tgid, 5)
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

  useEffect(() => {
    fetchCurrencyList().then((currencyData) => {
      let currencySymbolObject = {};

      currencyData.forEach(({ code, localSymbol }) => {
        currencySymbolObject[code] = localSymbol;
      });

      setCurrencySymbol(currencySymbolObject);
    });
  }, []);

  return (
    <>
      <PopulateHead
        {...{
          title,
          description,
          favicon: {
            url: favicon,
          },
          faq_schema: [],
          lang,
          originalHost: host,
          currentLanguage: lang,
          isMobile,
          canonical_link,
          noindex: isDev ? 'True' : 'False',
        }}
      />
      <Header
        languages={localization}
        headerLinks={headerLinks}
        currentLanguage={currentLanguage}
        logoUrl={logoUrl}
        logoAltText={logoAltText || ''}
        uid={uid}
        isMobile={isMobile}
        showGroupBooking={legacyBooleanCheck(enableGroupBooking)}
        hasLanguageSelector={enable_localization_menu}
        logoRedirectionURL={logoRedirectionURL?.url || '/'}
        host={host}
        hasPoweredByHeadoutLogo={true}
      />
      <ShowPageBanner
        tgid={tgid}
        isMobile={isMobile}
        detailsObjects={detailsObjects}
        tourGroupData={tourGroupData}
        currentLanguage={currentLanguage}
        tagsArray={tagsArray}
      />
      {isSafetyBanner ? (
        <SafeDFBannerWrapper marginTop={40}></SafeDFBannerWrapper>
      ) : null}
      <Wrapper>
        <HighlightsSectionWrapper>
          <RichText render={highlightsSection.tab_content} />
        </HighlightsSectionWrapper>
        {isMobile ?
          <AccordionGroup
            accordions={tabSchemaHighlight.map((element) => {
              return {
                "heading": element.tab_name,
                "content": element.tab_content
              }
            })}
            heading={""}
            useSchema={true}
          />
          :
          <>
            <ContentTabs
              tabsArr={tabHeadingHighlight}
              contentArr={tabSchemaHighlight}
            />
          </>
        }
        <Gallery galleryArray={imageUploads} isMobile={isMobile} />
        {isMobile ?
          <ComponentWrapper>
            <AccordionGroup
              accordions={tabSchemaInfo.map((element) => {
                return {
                  "heading": element.tab_name,
                  "content": element.tab_content
                }
              })}
              heading={tabSectionHeading}
              useSchema={true}
            />
          </ComponentWrapper>
          :
          <>
            <SubHeading content={tabSectionHeading} />
            <ContentTabs tabsArr={tabHeadingInfo} contentArr={tabSchemaInfo} />
          </>
        }
        <GoogleMap mapURL={mapURL} />
        <AccordionGroup
          accordions={faqSchema}
          heading={faqHeading}
          useSchema={true}
        />
        {customerReviews.length ? (
          <>
            <SubHeading content={strings.CUSTOMER_REVIEW_HEADING} />
            <CustomerReview cards={customerReviews} isMobile={isMobile} />
          </>
        ) : null}
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
      />
    </>
  );
};

export default ShowPage;
