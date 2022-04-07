import { useContext } from 'react';
import { NextSeo, NextSeoProps } from 'next-seo';
import { OpenGraph, Twitter } from 'next-seo/lib/types';
import { MBContext } from 'contexts/MBContext';
import { BANNER_PARAMS } from 'components/Banner';
import Conditional from 'components/common/Conditional';
import {
  AMPImports,
  WebpageJsonLD,
  MystiquePerfScript,
  TrackingScripts,
} from 'components/common/Scripts';
import { legacyBooleanCheck } from 'utils';
import { createAdditionalMetaTag, createHrefLangObj } from 'utils/headUtils';
import { withShortcodes } from 'utils/helper';
import { addQueryParams, convertUidToUrl } from 'utils/urlUtils';
import { useRouter } from 'next/router';
import { QUERY_PARAMS } from 'const/index';

type PopulateMetaProps = {
  prismicData: { [key: string]: any };
  languages: { [key: string]: string }[];
  datePublished: string;
  dateModified: string;
  serverRequestStartTimestamp: string;
  isAmp: boolean;
  isMobile: boolean;
  bannerImages: { [key: string]: any }[];
  mbTheme?: string;
};

export default function PopulateMeta({
  prismicData,
  datePublished,
  dateModified,
  languages,
  isAmp,
  isMobile,
  bannerImages,
  serverRequestStartTimestamp,
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
  const { query } = useRouter();
  const {
    [QUERY_PARAMS.LIMIT]: limit,
    [QUERY_PARAMS.OFFSET]: offset,
    [QUERY_PARAMS.CATEGORY]: category,
  } = query;

  const {
    bing_site_verification: bingSiteVerification,
    canonical_link: canonicalLink,
    canonical_link_amp: canonicalLinkForAMP,
    description: rawDescription,
    favicon,
    google_site_verification: googleSiteVerification,
    header_scripts: headerScripts = [],
    logo,
    image,
    noindex,
    seo_keywords: seoKeywords,
    title: rawTitle,
    disable_amp: disableAmp,
    enable_search,
  } = prismicData || {};
  const pageUrl = convertUidToUrl({
    uid,
    lang,
    isDev,
    hostname: host,
  });
  let finalNoIndex = isStage || isDev ? true : legacyBooleanCheck(noindex);
  let finalNoFollow = isStage || isDev ? true : legacyBooleanCheck(noindex);

  const primaryDomainUrl = new URL(pageUrl).hostname;
  const logoUrl = image?.url || logo?.url;
  const title = withShortcodes(rawTitle).join('');
  const description = withShortcodes(rawDescription).join('');
  let modifiedCanonicalLink = isMobile
    ? canonicalLinkForAMP || canonicalLink
    : canonicalLink;

  const { ASPECT_RATIO, WIDTH } =
    isMobile || isAmp ? BANNER_PARAMS.MOBILE : BANNER_PARAMS.DESKTOP;

  /**
   * imgix query params need to be in exactly the same order as the query params for links of Image component for preloading to work
   */
  const imageQueryParams = {
    auto: 'compress,format',
    w: `${parseInt(WIDTH) * 1.5}`,
    q: '75',
    fit: 'crop',
    ar: `${ASPECT_RATIO}`,
    fm: 'pjpg',
    exp: '-10',
  };

  const [preloadBannerImage] = bannerImages || [];
  const bannerImage = addQueryParams(preloadBannerImage?.url, imageQueryParams);
  const hasSearchEnabled = legacyBooleanCheck(enable_search);
  const jsonLdProps = {
    uid,
    lang,
    title,
    logo: logoUrl,
    favicon: favicon?.url,
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

  const ampLinkTag = {
    rel: 'amphtml',
    ...(!disableAmp &&
      !isAmp &&
      !uid.includes('www.london-theater-tickets.com') &&
      !uid.includes('www.themeparkstickets.com') && {
        href: '?amp=1',
      }),
  };

  // Add link tags
  const additionalLinkTags = [
    ampLinkTag,
    {
      rel: 'icon',
      href: favicon?.url,
    },
  ];
  if (preloadBannerImage) {
    additionalLinkTags.push({
      rel: 'preload',
      // @ts-ignore
      as: 'image',
      href: bannerImage,
    });
  }

  // Open Graph
  const openGraph: OpenGraph = {
    type: 'website',
    url: modifiedCanonicalLink,
    title,
    description,
    locale: language_full,
    site_name: '',
    images: [
      {
        url: bannerImage,
        width: parseInt(WIDTH) * 1.5,
        height: 600,
        alt: preloadBannerImage?.alt,
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
    ?.map((script) => script.script_tag)
    ?.filter((str) => str)
    ?.map((str) => str.replace('<script>', '').replace('</script>', ''))
    ?.map((item, index) => (
      <script key={index} dangerouslySetInnerHTML={{ __html: item }} />
    ));

  return (
    <>
      <NextSeo {...metaProps} />
      <Conditional if={!isAmp}>{scriptTags}</Conditional>
      <Conditional if={!noTrack && !isAmp}>
        <TrackingScripts
          isDev={isDev}
          isPreview={isPreview}
          originalHost={host}
        />
      </Conditional>
      <Conditional if={isAmp && !disableAmp}>
        <AMPImports />
      </Conditional>
      <WebpageJsonLD {...jsonLdProps} />
      <Conditional if={!isAmp}>
        <MystiquePerfScript
          serverRequestStartTimestamp={serverRequestStartTimestamp}
        />
      </Conditional>
    </>
  );
}

export const MinimalHelmet = ({
  title,
  description,
  favicon,
}: {
  title: string;
  description: string;
  favicon: { [key: string]: any };
}) => {
  const seoProps = {
    title,
    description,
    additionalLinkTags: [
      {
        rel: 'icon',
        href: favicon?.url,
      },
    ],
  };
  return <NextSeo {...seoProps} />;
};
