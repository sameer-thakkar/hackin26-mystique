import { useEffect } from 'react';
import Head from 'next/head';
import { useRecoilState, useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import dayjs from 'dayjs';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import PopulateMeta from 'components/common/NextSeoMeta';
import Reviews from 'components/common/Reviews';
import ReviewsPageBanner from 'components/MicrositeV2/CategoryPageBanner';
import Header from 'components/MicrositeV2/Header';
import DesktopMoreReads from 'components/NewsPage/components/DesktopMoreReads';
import MobileMoreReads from 'components/NewsPage/components/MobileMoreReads';
import VerticalProductCardSlide from 'components/NewsPage/components/VerticalProductCardSlide';
import ReviewsPageMainContent from 'components/ReviewsPage/components/MainContent';
import { getAlternateLanguages, getHeadoutLanguagecode } from 'utils';
import { sendVariablesToDataLayer, trackEvent } from 'utils/analytics';
import { checkIfLTTMB, getLangObject } from 'utils/helper';
import { titleCase } from 'utils/stringUtils';
import {
  convertUidToUrl,
  getLogoRedirectionUrl,
  getShowpageBreadcrumbUid,
} from 'utils/urlUtils';
import { gtmAtom } from 'store/atoms/gtm';
import { hsidAtom } from 'store/atoms/hsid';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PLATFORM,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  PAGE_TYPES,
  REVIEWS_PAGE_BANNER_ILLUSTRATION,
  REVIEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';
import { TReviewsPageProps } from './interface';
import { PageWrapper } from './styles';
import { getSlicesUsedInReviewsPage, getTrackingObject } from './utils';

const ReviewsPage: React.FC<TReviewsPageProps> = (props) => {
  const { eventsReady } = useRecoilValue(gtmAtom);
  const hsid = useRecoilState(hsidAtom);
  let {
    host,
    domainConfig,
    lang,
    data: CMSContent,
    isMobile,
    uid,
    isDev,
    serverRequestStartTimestamp,
  } = props;

  const {
    alternate_languages,
    data: CMSData,
    breadcrumbs,
    tgidData,
    showPageData,
    mediaData,
    reviewsData,
    featuredNewsArticlesData,
    newsArticlesWithSameTgidData,
    newsLandingPageUrl,
    collectionReviewsData,
    popularShowsData,
    last_publication_date,
    first_publication_date,
  } = CMSContent ?? {};

  const { name, media, listingPrice, reviewsDetails, primarySubCategory } =
    tgidData ?? {};
  const { averageRating, ratingsCount, reviewsCount } = reviewsDetails ?? {};

  const {
    title,
    description,
    author_name: prismicDocAuthorName,
    header_ref: commonHeader,
    primary_footer_ref: commonFooter,
    secondary_footer_ref: secondaryFooter,
    content_framework: contentFramework,
    tagged_city: taggedCity,
    tagged_country: taggedCountry,
    tagged_collection: taggedCollection,
    tagged_category: taggedCategory,
    tagged_sub_category: taggedSubCategory,
    tagged_mb_type: taggedMbType,
  } = CMSData ?? {};

  const {
    faviconUrl,
    logo: { logoUrl = '' } = {},
    showPoweredLogo = true,
    name: whiteLabelName,
  } = domainConfig || {};
  const productImageUrl = media?.productImages[0]?.url ?? '';
  const { REVIEWS_PAGE } = strings;
  const { BANNER_HEADING } = REVIEWS_PAGE;
  const isLTT = checkIfLTTMB(uid);
  const organisationName = isLTT
    ? 'London Theatre Tickets'
    : 'Broadway Show Tickets';

  const showPageUrl = convertUidToUrl({
    uid: showPageData[0]?.uid,
    lang,
    hostname: host,
    isDev,
  });

  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );
  const currentLanguage = getLangObject(lang).code;
  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    host,
  });
  const { detailedReviewSlice, criticsReviewSlice } =
    getSlicesUsedInReviewsPage(contentFramework);
  const selfCanonicalLink = convertUidToUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
  });
  const bannerHeading = titleCase(
    strings.formatString(BANNER_HEADING, name) as string
  );

  useEffect(() => {
    if (!eventsReady) return;
    sendVariablesToDataLayer({
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.TGIDS]: tgidData?.id,
      [ANALYTICS_PROPERTIES.CITY]: taggedCity,
      [ANALYTICS_PROPERTIES.COUNTRY]: taggedCountry,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: taggedCollection,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: taggedCategory,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: taggedSubCategory,
      [ANALYTICS_PROPERTIES.MB_TYPE]: taggedMbType,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.REVIEWS_PAGE,
      [ANALYTICS_PROPERTIES.HSID]: hsid,
      [ANALYTICS_PROPERTIES.MB_NAME]: title,
      [ANALYTICS_PROPERTIES.PLATFORM_NAME]: isMobile
        ? ANALYTICS_PLATFORM.MOBILE
        : ANALYTICS_PLATFORM.DESKTOP,
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
    });
  }, [eventsReady]);

  const moreReadsSectionCtaClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.REVIEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_NEWS,
      [ANALYTICS_PROPERTIES.SECTION]: REVIEWS_PAGE_SECTIONS.MORE_READS,
    });
  };

  const moreReadsTrackingObject = getTrackingObject(
    REVIEWS_PAGE_SECTIONS.MORE_READS
  );

  const reviewsSectionTrackingObject = getTrackingObject(
    REVIEWS_PAGE_SECTIONS.REVIEWS
  );

  const criticReviews = criticsReviewSlice?.items?.map(
    (item: Record<string, any>) => {
      const { rating, review, review_date, author_name, origin_website } =
        item ?? {};
      const reviewText = asText(review);
      return {
        '@type': 'Review',
        name: 'Critic Brand Review of Show Name',
        reviewBody: reviewText,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: rating,
          bestRating: '5',
          worstRating: '1',
        },
        datePublished: review_date,
        author: { '@type': 'Person', name: author_name },
        publisher: { '@type': 'Organization', name: origin_website },
      };
    }
  );

  const detailedReview = {
    '@type': 'Review',
    name: 'Here’s what we think: Review by Headout',
    reviewBody: asText(detailedReviewSlice?.primary?.description ?? ''),
    datePublished: first_publication_date,
    author: { '@type': 'Person', name: prismicDocAuthorName },
    publisher: { '@type': 'Organization', name: organisationName },
  };

  const userReviews = reviewsData?.items.map((review: Record<string, any>) => {
    const { content, rating, reviewTime, nonCustomerName } = review;
    return {
      '@type': 'Review',
      name: "Users Name's + Review", //user reviews that we are showing on first load
      reviewBody: content,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rating,
        bestRating: '5',
        worstRating: '1',
      },
      datePublished: dayjs(reviewTime),
      author: { '@type': 'Person', name: nonCustomerName },
    };
  });

  const reviewsSchemaMarkup = `
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "${name}",
        "image": "${productImageUrl}",
        "description":"${description}",
        "offers": {
          "@type": "AggregateOffer",
          "url": "${showPageUrl}",
          "priceCurrency": "${listingPrice?.currencyCode}",
          "lowPrice": "${listingPrice?.finalPrice}" 
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "${averageRating}", 
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "${ratingsCount}",
          "reviewCount": "${reviewsCount}"  
        },
        "review": ${JSON.stringify([
          ...((criticReviews && criticReviews) ?? []),
          ...((userReviews && userReviews) ?? []),
          detailedReview,
        ])}
      }`;

  const seeAllUrl = convertUidToUrl({
    uid: getShowpageBreadcrumbUid(
      primarySubCategory?.displayName,
      checkIfLTTMB(uid)
    ),
    lang: getHeadoutLanguagecode(lang),
  });

  return (
    <>
      <PopulateMeta
        {...{
          prismicData: {
            ...CMSData,
            canonical_link: selfCanonicalLink,
          },
          datePublished: first_publication_date,
          dateModified: last_publication_date,
          serverRequestStartTimestamp,
          languages: alternateLanguages,
          isMobile,
          bannerImages: [],
          faviconUrl,
          logoUrl: logoUrl,
        }}
      />
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: `[${reviewsSchemaMarkup}]` }}
          type="application/ld+json"
        />
      </Head>
      <Header
        isMobile={isMobile}
        allTours={[]}
        host={host}
        dropdownLinks={[]}
        enableDropdownLinks
        logoRedirectionURL={logoRedirectionUrl ?? ''}
        logoAltText={whiteLabelName || ''}
        enableSearch={false}
        enableBuyTickets={false}
        isGlobalMb={false}
        headerSlices={commonHeader?.data?.body}
        hasLanguageSelector
        hideCurrencySelector
        languageProps={{
          uid,
          currentLanguage,
          languages: alternateLanguages,
        }}
        logoUrl={logoUrl}
        hasPoweredByHeadoutLogo
        isEntertainmentLandingPageVisible
        isReviewsPage
      />
      <ReviewsPageBanner
        isMobile={isMobile}
        bannerImgUrl={isMobile ? '' : REVIEWS_PAGE_BANNER_ILLUSTRATION}
        showTrustBoosters
        breadcrumbs={breadcrumbs}
        heading={bannerHeading}
      />
      <PageWrapper>
        <ReviewsPageMainContent
          tgidData={tgidData}
          isMobile={isMobile}
          showPageData={showPageData}
          mediaData={mediaData}
          reviewsData={reviewsData}
          contentFramework={contentFramework}
        />
        <Conditional if={!isMobile}>
          <DesktopMoreReads
            content={{
              uniqueArticlesWithSameTgidData:
                newsArticlesWithSameTgidData?.results,
              featuredArticles: featuredNewsArticlesData,
              newsLandingPageUrl,
            }}
            handleCtaClick={moreReadsSectionCtaClick}
            trackingObject={moreReadsTrackingObject}
          />
        </Conditional>
        <Conditional if={isMobile}>
          <MobileMoreReads
            content={{
              uniqueArticlesWithSameTgidData:
                newsArticlesWithSameTgidData?.results,
              featuredArticles: featuredNewsArticlesData,
            }}
            heading={strings.NEWS_PAGE.MORE_READS}
            showAllNewsCTA
            showMoreCTAText={strings.NEWS_PAGE.LOAD_MORE}
            numberOfArticlesToShow={10}
            initialArticlesToShow={3}
            newsLandingPageUrl={newsLandingPageUrl}
            handleCtaClick={moreReadsSectionCtaClick}
            trackingObject={moreReadsTrackingObject}
          />
        </Conditional>
        <Reviews
          heading={strings.NEWS_PAGE.REVIEWS}
          reviews={collectionReviewsData}
          isMobile={isMobile}
          mediaData={mediaData}
          trackingObject={reviewsSectionTrackingObject}
        />
        {/* Rendering component for both mweb and dweb was required 
        because don't want to make change in the original component. 
        This is being used in many places. */}
        <Conditional if={!isMobile}>
          <VerticalProductCardSlide
            cards={popularShowsData?.subCategoryData}
            isMobile={isMobile}
            mediaData={popularShowsData?.mediaData?.resourceEntityMedias}
            showPageDocuments={popularShowsData?.showPageDocuments}
            seeAllUrl={seeAllUrl}
          />
        </Conditional>
      </PageWrapper>
      <Conditional if={isMobile}>
        <VerticalProductCardSlide
          cards={popularShowsData?.subCategoryData}
          isMobile={isMobile}
          mediaData={popularShowsData?.mediaData?.resourceEntityMedias}
          showPageDocuments={popularShowsData?.showPageDocuments}
          seeAllUrl={seeAllUrl}
        />
      </Conditional>
      <Footer
        currentLanguage={currentLanguage}
        attraction={commonFooter?.data?.attraction || 'attraction'}
        logoURL={logoUrl}
        logoAlt={whiteLabelName || ''}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        disclaimerText={commonFooter?.data?.disclaimer_text}
        slices={commonFooter?.data?.body || []}
        primaryHeading={commonFooter?.data?.footer_heading}
        secondarySlices={secondaryFooter?.data?.body || []}
        secondaryHeading={secondaryFooter?.data?.footer_heading}
        isLTT={isLTT}
      />
    </>
  );
};

export default ReviewsPage;
