import React, { useContext } from 'react';
import Head from 'next/head';
import parse from 'url-parse';
import { MBContext } from 'contexts/MBContext';
import {
  withoutTrailingSlash,
  withTrailingSlash,
  withShortcodes,
} from 'utils/helper';
import { BANNER_PARAMS } from 'components/Banner';
import { getValidUrl } from 'utils/urlUtils';

const withHttps = (url) =>
  (url.startsWith('http') ? url : `https://${url}`).replace('http:', 'https:');

function getSchemaJson(data) {
  const {
    page_url: pageUrl,
    title,
    favicon,
    description,
    datePublished,
    dateModified,
    faq_schema,
  } = data;
  const { origin, href } = parse(pageUrl, true);
  const microbrandUrl = withoutTrailingSlash(origin);
  const contentPageUrl = withoutTrailingSlash(href);
  const langCode = data.lang ? data.lang.substring(0, 2) : 'en-us';
  const faqSchemaExists = faq_schema.length && faq_schema[0].question;
  const baseSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${microbrandUrl}/#website`,
        url: `${microbrandUrl}/`,
        name: `${title}`,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${microbrandUrl}/?s={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ImageObject',
        '@id': `${contentPageUrl}/#primaryimage`,
        url: `${favicon.url}`,
        width: 1727,
        height: 453,
      },
      {
        '@type': 'WebPage',
        '@id': `${contentPageUrl}/#webpage`,
        url: `${contentPageUrl}/`,
        inLanguage: `${langCode}`,
        name: `${title}`,
        isPartOf: { '@id': `${microbrandUrl}/#website` },
        primaryImageOfPage: {
          '@id': `${contentPageUrl}/#primaryimage`,
        },
        description,
        datePublished,
        dateModified,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq_schema.map((obj) => {
      return {
        '@type': 'Question',
        name: `${obj.question}`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${obj.answer}`,
        },
      };
    }),
  };

  if (faqSchemaExists) {
    return [baseSchema, faqSchema];
  }
  return [baseSchema];
}

const PopulateHead = (data) => {
  const {
    title: rawTitle,
    description: rawDescription,
    favicon,
    image,
    nofollow,
    noindex,
    canonical_link: canonicalLink,
    canonical_link_amp: canonicalLinkForAMP,
    header_scripts: headerScripts = [],
    seo_keywords: seoKeywords,
    google_site_verification: googleSiteVerification,
    bing_site_verification: bingSiteVerification,
    localization: languages = [],
    logo,
    page_url: pageUrl,
    isDev,
    currentLanguage,
    originalHost,
    serverRequestStartTimestamp,
    isAmp,
    disable_amp,
    isMobile = false,
    finalBannerImages = [],
  } = data;

  const modifiedCanonicalLink = isMobile
    ? canonicalLinkForAMP || canonicalLink
    : canonicalLink;
  const { isPreview, noTrack } = useContext(MBContext);
  const title = withShortcodes(rawTitle).join('');
  const description = withShortcodes(rawDescription).join('');

  const isNonProd = isDev || isPreview || originalHost.startsWith('stage-');

  const GTM_CONTAINER_ID = 'GTM-5LJWNW3';
  let GTM_AUTH = isNonProd
    ? 'psi3hURmBLey31qAhn7cPA'
    : 'ueaj9d1HgXEpkUp-zbbP0Q';
  let GTM_ENV = isNonProd ? 'env-27' : 'env-1';
  GTM_AUTH = `&gtm_auth=${GTM_AUTH}`;
  GTM_ENV = `&gtm_preview=${GTM_ENV}&gtm_cookies_win=x`;

  const robotsContent = [];
  if (nofollow === 'True') {
    robotsContent.push('nofollow');
  }
  if (noindex === 'True') {
    robotsContent.push('noindex');
  }

  const imageUrl = image ? image.url : logo ? logo.url : null;
  const ImageMeta = imageUrl ? (
    <Head>
      <meta name="image" content={imageUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  ) : null;
  const { ASPECT_RATIO, WIDTH } =
    isMobile || isAmp ? BANNER_PARAMS.MOBILE : BANNER_PARAMS.DESKTOP;
  const imageQuery = `?auto=compress,format&fm=pjpg&w=${
    parseInt(WIDTH) * 1.5
  }&q=75&ar=${ASPECT_RATIO}&fit=crop&crop=faces`;
  const preloadBannerImage = finalBannerImages?.length ? (
    <link
      rel="preload"
      as="image"
      href={`${finalBannerImages[0]?.url}${imageQuery}`}
    />
  ) : null;
  const trackingScripts = (
    <Head>
      <script
        defer
        async
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSchemaJson(data)),
        }}
      />
      <script
        defer
        async
        dangerouslySetInnerHTML={{
          __html: `//<![CDATA[
				var dataLayer = dataLayer || [];
			//]]>
			`,
        }}
      ></script>
      <script
        key={2}
        defer
        async
        dangerouslySetInnerHTML={{
          __html: `//<![CDATA[
				var dataLayer_content = [];
				dataLayer.push( dataLayer_content );//]]>`,
        }}
      ></script>
      <script
        defer
        async
        dangerouslySetInnerHTML={{
          __html: `//<![CDATA[
				(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
				new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '${GTM_AUTH || ''}${
            GTM_ENV || ''
          }';f.parentNode.insertBefore(j,f);
				})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');//]]>`,
        }}
      ></script>
    </Head>
  );
  const pageMeta = (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="twitter:title" content={title} />

      {!isAmp ? <meta name="viewport" content="width=device-width" /> : null}
      <link rel="icon" href={`${favicon.url}`} />

      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />

      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />

      {seoKeywords ? <meta name="keywords" content={seoKeywords} /> : null}
      {preloadBannerImage}
      {googleSiteVerification ? (
        <meta
          name="google-site-verification"
          content={googleSiteVerification}
        />
      ) : null}
      {bingSiteVerification ? (
        <meta name="msvalidate.01" content={bingSiteVerification} />
      ) : null}

      {modifiedCanonicalLink ? (
        <link
          rel="canonical"
          href={withTrailingSlash(withHttps(modifiedCanonicalLink))}
        />
      ) : null}

      {!disable_amp && !isAmp ? (
        <link rel="amphtml" href={`${pageUrl}?amp=1`} />
      ) : isAmp ? null : (
        <link rel="amphtml" />
      )}

      {robotsContent.length ? (
        <meta name="robots" content={robotsContent.join(', ')} />
      ) : null}

      {!isAmp ? (
        <script
          defer
          async
          dangerouslySetInnerHTML={{
            __html: `
              var mystiquePerf = {
                serverTimestamp: ${serverRequestStartTimestamp},
                clientTimestamp: null,
                ttl: null,
                ttlUnits: 'ms',
                fired: false
              };
              if (!mystiquePerf.fired) {
                mystiquePerf.clientTimestamp = ${Math.floor(
                  new Date().getTime()
                )};
                mystiquePerf.ttl = mystiquePerf.clientTimestamp - mystiquePerf.serverTimestamp;
                mystiquePerf.fired = true;
              }
            `,
          }}
        />
      ) : null}
    </Head>
  );

  const AMPImports = (
    <Head>
      <script
        async
        custom-element="amp-carousel"
        src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js"
      ></script>
      <script
        async
        custom-element="amp-selector"
        src="https://cdn.ampproject.org/v0/amp-selector-0.1.js"
      ></script>
      <script
        async
        custom-element="amp-analytics"
        src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
      ></script>
    </Head>
  );

  const scriptTags = headerScripts
    .map((script) => script.script_tag)
    .filter((str) => str)
    .map((str) => str.replace('<script>', '').replace('</script>', ''))
    .map((item, index) => (
      <script key={index} dangerouslySetInnerHTML={{ __html: item }} />
    ));

  const { host, pathname } = parse(getValidUrl(pageUrl));

  const pathnameWithTrailingSlash = pathname.endsWith('/')
    ? pathname
    : `${pathname}/`;

  const getPathName = () => {
    if (pathname.startsWith(`/${currentLanguage}`)) {
      // For language pages
      // For language pages of subpages MBs
      return pathnameWithTrailingSlash.replace(`/${currentLanguage}/`, '');
    }
    // For '/' and subpages like /home/
    return pathnameWithTrailingSlash.replace('/', '');
  };

  const getHref = (langCode, isAmp) => {
    return `https://${host}/${
      langCode === 'en' ? '' : `${langCode}/`
    }${getPathName()}${isAmp ? '?amp=1' : ''}`;
  };

  let allLanguages = [];

  if (languages?.length) {
    allLanguages.push({ language: currentLanguage });
    allLanguages = allLanguages.concat(languages);
  }

  const hrefLangs = allLanguages
    .filter(({ language }) => language?.length)
    .map(({ language }, idx) => {
      let langCode =
        language?.split('-')?.length > 1
          ? language?.split('-')[1]?.toLowerCase()
          : language;
      return (
        <link
          key={`altlang_${idx}`}
          rel="alternate"
          hrefLang={langCode}
          href={getHref(langCode, isAmp)}
        />
      );
    });

  return (
    <>
      {!noTrack && !isAmp ? trackingScripts : null}
      {isAmp ? AMPImports : null}
      {pageMeta}
      {ImageMeta}
      <Head>
        {hrefLangs}
        {!isAmp ? scriptTags : null}
      </Head>
    </>
  );
};

export default PopulateHead;

export const MinimalHelmet: React.FC<any> = ({
  title,
  description,
  favicon,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="twitter:title" content={title} />
      <meta name="viewport" content="width=device-width" />
      <link rel="icon" href={`${favicon?.url}`} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta name="robots" content="nofollow, noindex" />
    </Head>
  );
};
