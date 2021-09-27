import { useContext } from 'react';
import { NextSeo, NextSeoProps } from 'next-seo';
import { OpenGraph, Twitter } from 'next-seo/lib/types';
import { MBContext } from 'contexts/MBContext';
import { BANNER_PARAMS } from 'components/Banner';
import Conditional from 'components/common/Conditional';
import {
  AMPImports,
  JsonLD,
  MystiquePerfScript,
  TrackingScripts,
} from 'components/common/Scripts';
import { PRISMIC_LANG_TO_ROUTE_PARAM } from 'const/index';
import { legacyBooleanCheck } from 'utils';
import { createAdditionalMetaTag, createHrefLangObj } from 'utils/headUtils';
import { withShortcodes } from 'utils/helper';
import { addQueryParams, convertUidToUrl } from 'utils/urlUtils';

type PopulateMetaProps = {
  prismicData: { [key: string]: any };
  languages: { [key: string]: string }[];
  datePublished: string;
  dateModified: string;
  currentLanguage: string;
  serverRequestStartTimestamp: string;
  uid: string;
  isDev: boolean;
  isAmp: boolean;
  isMobile: boolean;
  bannerImages: { [key: string]: any }[];
  originalHost: string;
  mbTheme?: string;
};

export default function PopulateMeta({
  prismicData,
  datePublished,
  dateModified,
  languages,
  isDev,
  isAmp,
  isMobile,
  uid,
  currentLanguage,
  bannerImages,
  originalHost,
  serverRequestStartTimestamp,
}: PopulateMetaProps) {
  const { noTrack, isPreview } = useContext(MBContext);
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
    nofollow,
    noindex,
    seo_keywords: seoKeywords,
    title: rawTitle,
    disable_amp: disableAmp,
    enable_search,
  } = prismicData || {};
  const lang = PRISMIC_LANG_TO_ROUTE_PARAM[currentLanguage];
  const pageUrl = convertUidToUrl({
    uid,
    lang,
    isDev,
    hostname: originalHost,
  });
  const primaryDomainUrl = new URL(pageUrl).hostname;
  const logoUrl = image?.url || logo.url;
  const title = withShortcodes(rawTitle).join('');
  const description = withShortcodes(rawDescription).join('');
  const modifiedCanonicalLink = isMobile
    ? canonicalLinkForAMP || canonicalLink
    : canonicalLink;

  const { ASPECT_RATIO, WIDTH } =
    isMobile || isAmp ? BANNER_PARAMS.MOBILE : BANNER_PARAMS.DESKTOP;

  const imageQueryParams = {
    auto: 'compress,format',
    fm: 'pjpg',
    w: `${parseInt(WIDTH) * 1.5}`,
    q: '75',
    ar: `${ASPECT_RATIO}`,
    fit: 'crop',
    crop: 'faces',
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
      // adding english as x-default
      if (lang === 'en') {
        const array = [
          {
            hrefLang: 'x-default',
            href: url,
          },
          hrefObj,
        ];
        acc.push(...array);
      } else {
        acc.push(hrefObj);
      }
      return acc;
    },
    []
  );

  // Add meta tags
  const additionalMetaTags = [];
  if (googleSiteVerification)
    additionalMetaTags.push(
      createAdditionalMetaTag(
        'google-site-verification',
        googleSiteVerification
      )
    );
  if (bingSiteVerification)
    additionalMetaTags.push(
      createAdditionalMetaTag('msvalidate.01', bingSiteVerification)
    );
  if (seoKeywords)
    additionalMetaTags.push(createAdditionalMetaTag('keywords', seoKeywords));

  const ampLinkTag = {
    ...(((!!disableAmp &&
      !isAmp &&
      !uid.includes('www.london-theater-tickets.com')) ||
      isAmp) && {
      href: '?amp=1',
    }),
    rel: 'amphtml',
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
    locale: currentLanguage,
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
    noindex: legacyBooleanCheck(noindex),
    nofollow: legacyBooleanCheck(nofollow),
    ...((canonicalLink || canonicalLinkForAMP) && {
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
          originalHost={originalHost}
        />
      </Conditional>
      <Conditional if={isAmp && !disableAmp}>
        <AMPImports />
      </Conditional>
      <JsonLD {...jsonLdProps} />
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
