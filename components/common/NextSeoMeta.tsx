import { useContext } from 'react';
import { NextSeo, NextSeoProps } from 'next-seo';
import { OpenGraph, Twitter } from 'next-seo/lib/types';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { MBContext } from 'contexts/MBContext';
import { BANNER_PARAMS } from 'components/Banner';
import Conditional from 'components/common/Conditional';
import {
  WebpageJsonLD,
  MystiquePerfScript,
  TrackingScripts,
  CollectionAggregatedRatingScript,
} from 'components/common/Scripts';
import { AggregatedRatingDetails } from 'components/StaticBanner/index';
import { legacyBooleanCheck, shouldDisplayCollectionRatings } from 'utils';
import { createAdditionalMetaTag, createHrefLangObj } from 'utils/headUtils';
import { withShortcodes } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import { getStructure } from 'utils/lookerUtils';
import { mediaUpgradeExperimentAtom } from 'store/atoms/mediaupgrade';
import {
  FB_DOMAIN_VERIFICATION,
  QUERY_PARAMS,
  PAGE_URL_STRUCTURE,
  SEO_SUBDOMAINS,
} from 'const/index';

type PopulateMetaProps = {
  prismicData: { [key: string]: any };
  languages: { [key: string]: string }[];
  datePublished: string;
  dateModified: string;
  serverRequestStartTimestamp: string;
  isMobile: boolean;
  aggregatedRatingDetails?: AggregatedRatingDetails;
  bannerImages: { [key: string]: any }[];
  mbTheme?: string;
  faviconUrl: string;
  logoUrl?: string;
};

export default function PopulateMeta({
  prismicData,
  datePublished,
  dateModified,
  languages,
  isMobile,
  bannerImages,
  serverRequestStartTimestamp,
  aggregatedRatingDetails,
  faviconUrl,
  logoUrl,
}: PopulateMetaProps) {
  const {
    noTrack,
    uid,
    isDev,
    isPreview,
    isStage,
    host,
    lang,
    language_full,
  } = useContext(MBContext);
  const { isNewMediaSite } = useRecoilValue(mediaUpgradeExperimentAtom);
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
    uid: uid ?? '',
    lang,
    isDev,
    hostname: host,
  });

  const isSubdomain =
    getStructure(new URL(pageUrl)) === PAGE_URL_STRUCTURE.SUBDOMAIN;

  let finalNoIndex =
    isStage || isDev || (isSubdomain && !SEO_SUBDOMAINS.includes(pageUrl))
      ? true
      : legacyBooleanCheck(noindex);
  let finalNoFollow =
    isStage || isDev || (isSubdomain && !SEO_SUBDOMAINS.includes(pageUrl))
      ? true
      : legacyBooleanCheck(noindex);

  const primaryDomainUrl = new URL(pageUrl).hostname;
  const metaImageUrl = image?.url || logoUrl;
  const title = withShortcodes(rawTitle).join('');
  const description = withShortcodes(rawDescription).join('');
  let modifiedCanonicalLink = canonicalLink;

  const { WIDTH } = isMobile ? BANNER_PARAMS.MOBILE : BANNER_PARAMS.DESKTOP;

  const [firstBannerImage] = bannerImages || [];
  const hasSearchEnabled = legacyBooleanCheck(enable_search);
  const jsonLdProps = {
    uid,
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

  // Open Graph
  const openGraph: OpenGraph = {
    type: 'website',
    url: modifiedCanonicalLink,
    title,
    description,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | un... Remove this comment to see the full error message
    locale: language_full,
    site_name: '',
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
    site: primaryDomainUrl,
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
      {/* @ts-expect-error TS(2322): Type '{ uid: null; lang: string; title: string; lo... Remove this comment to see the full error message */}
      <WebpageJsonLD {...jsonLdProps} />
      <Conditional
        if={
          isNewMediaSite &&
          // @ts-expect-error TS(2345): Argument of type 'AggregatedRatingDetails | undefi... Remove this comment to see the full error message
          shouldDisplayCollectionRatings(aggregatedRatingDetails)
        }
      >
        <CollectionAggregatedRatingScript
          // @ts-expect-error TS(2322): Type 'AggregatedRatingDetails | undefined' is not ... Remove this comment to see the full error message
          aggregatedRatingInfo={aggregatedRatingDetails}
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
