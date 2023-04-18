import Head from 'next/head';
import { LogoJsonLd, SiteLinksSearchBoxJsonLd } from 'next-seo';
import Conditional from 'components/common/Conditional';
import { CollectionDetailsTypes } from 'components/StaticBanner/index';
import { convertUidToUrl, getDomainFromUid, getValidUrl } from 'utils/urlUtils';

export const TrackingScripts = ({
  isDev,
  isPreview,
  originalHost,
}: {
  isDev: boolean;
  isPreview: boolean;
  originalHost: string;
}) => {
  const isNonProd = isDev || isPreview || originalHost.startsWith('stage-');
  const GTM_CONTAINER_ID = 'GTM-5LJWNW3';
  let GTM_AUTH = isNonProd
    ? 'psi3hURmBLey31qAhn7cPA'
    : 'ueaj9d1HgXEpkUp-zbbP0Q';
  let GTM_ENV = isNonProd ? 'env-27' : 'env-1';
  GTM_AUTH = `&gtm_auth=${GTM_AUTH}`;
  GTM_ENV = `&gtm_preview=${GTM_ENV}&gtm_cookies_win=x`;

  return (
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `//<![CDATA[
				var dataLayer = dataLayer || [];
			//]]>
			`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `//<![CDATA[
				var dataLayer_content = [];
				dataLayer.push( dataLayer_content );//]]>`,
        }}
      />
      <script
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
      />
    </Head>
  );
};

export const WebpageJsonLD = ({
  uid,
  lang,
  title,
  favicon = '',
  logo,
  description,
  datePublished,
  dateModified,
  hasSearchEnabled,
}: {
  uid: string;
  lang: string;
  title: string;
  logo: string;
  favicon: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  hasSearchEnabled?: boolean;
}) => {
  const contentPageUrl = convertUidToUrl({ uid, lang });
  const microbrandUrl = contentPageUrl
    ? getValidUrl(new URL(contentPageUrl).hostname)
    : '';
  // NEXT-SEO doesn't have components for webpage/website. Migrate this once they release the same
  const baseSchema = [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${microbrandUrl}/#website`,
          url: `${microbrandUrl}`,
          name: `${title}`,
        },
        {
          '@type': 'ImageObject',
          '@id': `${contentPageUrl}#primaryimage`,
          url: `${favicon}`,
          width: 1727,
          height: 453,
        },
        {
          '@type': 'WebPage',
          '@id': `${contentPageUrl}#webpage`,
          url: `${contentPageUrl}`,
          inLanguage: `${lang}`,
          name: `${title}`,
          isPartOf: { '@id': `${microbrandUrl}/#website` },
          primaryImageOfPage: {
            '@id': `${contentPageUrl}#primaryimage`,
          },
          description,
          datePublished,
          dateModified,
        },
      ],
    },
  ];
  const domainName = getDomainFromUid(uid);
  // If no path then we assume it is the homepage. (interim solution)
  const isHomepage =
    // @ts-expect-error TS(2769): No overload matches this call.
    uid.split(domainName)?.filter((string) => string.length)?.length === 0;

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(baseSchema) }}
        />
      </Head>
      <Conditional if={isHomepage}>
        <LogoJsonLd logo={logo} url={microbrandUrl} />
      </Conditional>
      <Conditional if={isHomepage && hasSearchEnabled}>
        <SiteLinksSearchBoxJsonLd
          url={microbrandUrl}
          potentialActions={[
            {
              target: `${microbrandUrl}/?s`,
              queryInput: 'search_term_string',
            },
          ]}
        />
      </Conditional>
    </>
  );
};

export const MystiquePerfScript = ({
  serverRequestStartTimestamp,
}: {
  serverRequestStartTimestamp: string;
}) => (
  <Head>
    <script
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
        mystiquePerf.clientTimestamp = ${Math.floor(new Date().getTime())};
        mystiquePerf.ttl = mystiquePerf.clientTimestamp - mystiquePerf.serverTimestamp;
        mystiquePerf.fired = true;
      }
    `,
      }}
    />
  </Head>
);

export const CollectionAggregatedRatingScript = ({
  collectionDetails,
}: {
  collectionDetails: CollectionDetailsTypes | undefined;
}) => {
  if (!collectionDetails) return null;

  const {
    id,
    displayName: name,
    heroImageUrl,
    cardImageUrl,
    metaDescription: description,
    ratingsCount: ratingCount,
    averageRating: ratingValue,
    listingPrice: lowPrice,
    currency: priceCurrency,
  } = collectionDetails;
  const itemList = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    image: [heroImageUrl || cardImageUrl],
    description,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toPrecision(2),
      bestRating: 5,
      worstRating: 1,
      ratingCount,
    },
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      lowPrice,
      priceCurrency,
    },
  };
  return (
    <Head>
      <script
        key={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </Head>
  );
};
