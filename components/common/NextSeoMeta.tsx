import { useContext } from 'react';
import { useRouter } from 'next/router';
import { NextSeo, NextSeoProps } from 'next-seo';
import { OpenGraph, Twitter } from 'next-seo/lib/types';
import { useRecoilValue } from 'recoil';
import { BANNER_PARAMS } from 'components/Banner';
import Conditional from 'components/common/Conditional';
import {
  BreadcrumbsSchema,
  CollectionAggregatedRatingScript,
  MystiquePerfScript,
  TrackingScripts,
  VideoMetaScript,
  WebpageJsonLD,
} from 'components/common/Scripts';
import { CollectionDetails } from 'components/StaticBanner/index';
import { MBContext } from 'contexts/MBContext';
import {
  getCollectionVideoMeta,
  legacyBooleanCheck,
  shouldDisplayCollectionRatings,
} from 'utils';
import { TBreadcrumbs } from 'utils/breadcrumbsUtils';
import { createAdditionalMetaTag, createHrefLangObj } from 'utils/headUtils';
import { withShortcodes } from 'utils/helper';
import { getStructure } from 'utils/lookerUtils';
import { titleCase } from 'utils/stringUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import { shortcodesAtom } from 'store/atoms/shortcodes';
import {
  FB_DOMAIN_VERIFICATION,
  PAGE_URL_STRUCTURE,
  QUERY_PARAMS,
  SEO_SUBDOMAINS,
  siteNameMappings,
} from 'const/index';

type TBreadcrumbsDetails = {
  breadcrumbs: TBreadcrumbs;
  taggedCity?: string | null;
  primaryCity?: Record<string, any>;
  showName?: string;
};

type PopulateMetaProps = {
  prismicData: { [key: string]: any };
  languages: { [key: string]: string }[];
  datePublished?: string;
  dateModified?: string;
  serverRequestStartTimestamp: string;
  isMobile: boolean;
  collectionDetails?: CollectionDetails;
  bannerImages: { [key: string]: any }[];
  mbTheme?: string;
  faviconUrl: string;
  logoUrl?: string;
  uid?: string;
  breadcrumbsDetails?: TBreadcrumbsDetails;
};

export default function PopulateMeta({
  prismicData,
  datePublished,
  dateModified,
  languages,
  isMobile,
  bannerImages,
  serverRequestStartTimestamp,
  collectionDetails,
  faviconUrl,
  logoUrl,
  uid,
  breadcrumbsDetails,
}: PopulateMetaProps) {
  const {
    noTrack,
    uid: uidFromMBContext,
    isDev,
    isPreview,
    isStage,
    host,
    lang,
    language_full,
  } = useContext(MBContext);
  const { minPrice, bestDiscount } = useRecoilValue(shortcodesAtom);
  const currencyCode = useRecoilValue(currencyAtom);
  const currencyList = useRecoilValue(currencyListAtom);
  const { query } = useRouter();
  const {
    [QUERY_PARAMS.LIMIT]: limit,
    [QUERY_PARAMS.OFFSET]: offset,
    [QUERY_PARAMS.CATEGORY]: category,
  } = query;

  const {
    bing_site_verification: bingSiteVerification,
    canonical_link: canonicalLink,
    description: rawDescription,
    google_site_verification: googleSiteVerification,
    header_scripts: headerScripts = [],
    image,
    noindex,
    seo_keywords: seoKeywords,
    title: rawTitle,
    enable_search,
  } = prismicData || {};

  const pageUrl = convertUidToUrl({
    uid: uidFromMBContext ?? uid ?? '',
    lang,
    isDev,
    hostname: host,
  });

  const baseLangPageUrl = convertUidToUrl({
    uid: uidFromMBContext ?? uid ?? '',
    lang: 'en',
    isDev,
    hostname: host,
  });

  const isSubdomain = baseLangPageUrl
    ? getStructure(new URL(baseLangPageUrl)) === PAGE_URL_STRUCTURE.SUBDOMAIN
    : false;

  let finalNoIndex =
    isStage ||
    isDev ||
    (isSubdomain && !SEO_SUBDOMAINS.includes(baseLangPageUrl))
      ? true
      : legacyBooleanCheck(noindex);
  let finalNoFollow =
    isStage ||
    isDev ||
    (isSubdomain && !SEO_SUBDOMAINS.includes(baseLangPageUrl))
      ? true
      : legacyBooleanCheck(noindex);

  const primaryDomainUrl = pageUrl ? new URL(pageUrl).hostname : '';
  const metaImageUrl = image?.url || logoUrl;
  const metaShortCodeProps = {
    currencyCode,
    currencyList,
    minPrice,
    bestDiscount,
  };
  const title = withShortcodes(rawTitle, metaShortCodeProps).join('');
  const description = withShortcodes(rawDescription, metaShortCodeProps).join(
    ''
  );
  let modifiedCanonicalLink = canonicalLink;

  const { WIDTH } = isMobile ? BANNER_PARAMS.MOBILE : BANNER_PARAMS.DESKTOP;

  const [firstBannerImage] = bannerImages || [];
  const hasSearchEnabled = legacyBooleanCheck(enable_search);
  const jsonLdProps = {
    uid: uidFromMBContext ?? uid ?? '',
    lang,
    title,
    logo: metaImageUrl,
    favicon: faviconUrl,
    description,
    dateModified,
    datePublished,
    hasSearchEnabled,
  };

  if (limit || category || offset) {
    // Paginated routes are marked noindex,follow.
    finalNoFollow = false;
    finalNoIndex = true;
    modifiedCanonicalLink = modifiedCanonicalLink?.split?.('?')?.[0] || pageUrl;
  }

  // Hreflang
  const modifiedLanguageAlternates = [
    {
      url: pageUrl,
      lang,
    },
    ...languages,
  ];

  const languageAlternates = modifiedLanguageAlternates?.reduce(
    // @ts-expect-error TS(2769): No overload matches this call.
    (acc, altLang) => {
      const { url, lang } = altLang;
      const hrefObj = createHrefLangObj({ lang, href: url });
      const array = [
        {
          hrefLang: 'x-default',
          href: url,
        },
        hrefObj,
      ];
      // adding english as x-default
      if (lang === 'en') {
        return [...acc, ...array];
      } else {
        return [...acc, hrefObj];
      }
    },
    []
  );

  // Add meta tags
  const additionalMetaTags = [];
  if (googleSiteVerification)
    additionalMetaTags.push(
      createAdditionalMetaTag({
        name: 'google-site-verification',
        content: googleSiteVerification,
      })
    );
  if (bingSiteVerification)
    additionalMetaTags.push(
      createAdditionalMetaTag({
        name: 'msvalidate.01',
        content: bingSiteVerification,
      })
    );
  if (seoKeywords)
    additionalMetaTags.push(
      createAdditionalMetaTag({
        name: 'keywords',
        content: seoKeywords,
      })
    );

  additionalMetaTags.push(
    createAdditionalMetaTag({
      name: 'facebook-domain-verification',
      content: FB_DOMAIN_VERIFICATION,
    })
  );

  // Add link tags
  const additionalLinkTags = [
    {
      rel: 'icon',
      href: faviconUrl,
    },
  ];

  let siteName = null;
  for (let [siteNameKey, siteNameValue] of siteNameMappings.entries()) {
    const currentUid = uidFromMBContext ?? uid ?? '';

    if (currentUid.includes(siteNameKey)) {
      siteName = siteNameValue;
      break;
    }
  }
  // Open Graph
  const openGraph: OpenGraph = {
    type: 'website',
    url: modifiedCanonicalLink,
    title,
    description,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | un... Remove this comment to see the full error message
    locale: language_full,
    site_name: siteName ?? primaryDomainUrl,
    images: [
      {
        url: firstBannerImage?.url,
        width: parseInt(WIDTH) * 1.5,
        height: 600,
        alt: firstBannerImage?.alt,
      },
    ],
  };
  const twitter: Twitter = {
    site: siteName ?? primaryDomainUrl,
    cardType: 'summary_large_image',
  };
  const metaProps: NextSeoProps = {
    title,
    description,
    noindex: finalNoIndex,
    nofollow: finalNoFollow,
    ...(modifiedCanonicalLink && {
      canonical: modifiedCanonicalLink,
    }),
    ...(languages?.length > 0 && {
      languageAlternates,
    }),
    ...(additionalMetaTags.length > 0 && {
      additionalMetaTags,
    }),
    additionalLinkTags,
    openGraph,
    twitter,
  };

  // Header Scripts
  const scriptTags = headerScripts
    ?.map((script: any) => script.script_tag)
    ?.filter((str: any) => str)
    ?.map((str: any) => str.replace('<script>', '').replace('</script>', ''))
    ?.map((item: any, index: number) => (
      <script key={index} dangerouslySetInnerHTML={{ __html: item }} />
    ));

  const collectionVideoMeta = getCollectionVideoMeta(collectionDetails);
  const { averageRating, ratingsCount } = collectionDetails || {};

  const {
    breadcrumbs = {},
    taggedCity,
    primaryCity,
    showName = '',
  } = breadcrumbsDetails || {};
  const mbCity = titleCase(taggedCity || primaryCity?.displayName || '');

  return (
    <>
      <NextSeo {...metaProps} />
      {scriptTags}
      <Conditional if={!noTrack}>
        <TrackingScripts
          isDev={isDev}
          isPreview={isPreview}
          originalHost={host}
        />
      </Conditional>
      <WebpageJsonLD {...jsonLdProps} />
      <Conditional
        if={shouldDisplayCollectionRatings({ averageRating, ratingsCount })}
      >
        <CollectionAggregatedRatingScript
          collectionDetails={collectionDetails}
        />
      </Conditional>
      <Conditional if={collectionVideoMeta}>
        <VideoMetaScript videoInfo={collectionVideoMeta} />
      </Conditional>
      <Conditional if={Object.keys(breadcrumbs).length > 1}>
        <BreadcrumbsSchema
          breadcrumbs={breadcrumbs}
          mbCity={mbCity}
          showName={showName}
        />
      </Conditional>
      <MystiquePerfScript
        serverRequestStartTimestamp={serverRequestStartTimestamp}
      />
    </>
  );
}

export const MinimalHelmet = ({
  title,
  description,
  faviconUrl,
}: {
  title: string;
  description: string;
  faviconUrl: string;
}) => {
  const seoProps = {
    title,
    description,
    additionalLinkTags: [
      {
        rel: 'icon',
        href: faviconUrl,
      },
    ],
  };
  return <NextSeo {...seoProps} />;
};
