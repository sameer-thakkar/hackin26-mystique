import React from "react";
import ReactHtmlParser from "react-html-parser";
import Head from "next/head";
import parse from "url-parse";

const withoutTrailingSlash = url =>
  url.charAt(url.length - 1) === "/" ? url.substr(0, url.length - 1) : url;

function getSchemaJson(data) {
  const {
    page_url: pageUrl,
    title,
    favicon,
    description,
    datePublished,
    dateModified
  } = data;
  const { origin, href } = parse(pageUrl, true);
  const microbrandUrl = withoutTrailingSlash(origin);
  const contentPageUrl = withoutTrailingSlash(href);
  const langCode = data.lang ? data.lang.substring(0, 2) : "en-us";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${microbrandUrl}/#website`,
        url: `${microbrandUrl}/`,
        name: `${title}`,
        potentialAction: {
          "@type": "SearchAction",
          target: `${microbrandUrl}/?s={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ImageObject",
        "@id": `${contentPageUrl}/#primaryimage`,
        url: `${favicon.url}`,
        width: 1727,
        height: 453
      },
      {
        "@type": "WebPage",
        "@id": `${contentPageUrl}/#webpage`,
        url: `${contentPageUrl}/`,
        inLanguage: `${langCode}`,
        name: `${title}`,
        isPartOf: { "@id": `${microbrandUrl}/#website` },
        primaryImageOfPage: {
          "@id": `${contentPageUrl}/#primaryimage`
        },
        description,
        datePublished,
        dateModified
      }
    ]
  };
}

export default data => {
  const {
    title,
    description,
    favicon,
    image,
    nofollow,
    noindex,
    gtm_id: gtmID,
    canonical_link: canonicalLink,
    other_meta_tags: otherMetaTags = [],
    header_scripts: headerScripts = [],
    seo_keywords: seoKeywords,
    google_site_verification: googleSiteVerification,
    bing_site_verification: bingSiteVerification,
    localization: languages = [],
    logo
  } = data;

  const robotsContent = [];
  if (nofollow === "True") {
    robotsContent.push("nofollow");
  }
  if (noindex === "True") {
    robotsContent.push("noindex");
  }

  const imageUrl = image ? image.url : logo ? logo.url : null;

  const dynamicMeta = (
    <React.Fragment>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="twitter:title" content={title} />

      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href={`${favicon.url}`} />

      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />

      {imageUrl ? (
        <React.Fragment>
          <meta name="image" content={imageUrl} />
          <meta property="og:image" content={imageUrl} />
          <meta name="twitter:image" content={imageUrl} />
        </React.Fragment>
      ) : null}

      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />

      {seoKeywords ? <meta name="keywords" content={seoKeywords} /> : null}
      {googleSiteVerification ? (
        <meta
          name="google-site-verification"
          content={googleSiteVerification}
        />
      ) : null}
      {bingSiteVerification ? (
        <meta name="msvalidate.01" content={bingSiteVerification} />
      ) : null}

      {canonicalLink ? <link rel="canonical" href={canonicalLink} /> : null}

      {robotsContent.length ? (
        <meta name="robots" content={robotsContent.join(", ")} />
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSchemaJson(data))
        }}
      />

      {gtmID ? (
        <React.Fragment>
          <script
            dangerouslySetInnerHTML={{
              __html: `//<![CDATA[
            var dataLayer = dataLayer || [];
          //]]>
          `
            }}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `//<![CDATA[
            var dataLayer_content = [];
            dataLayer.push( dataLayer_content );//]]>`
            }}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `//<![CDATA[
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            '//www.googletagmanager.com/gtm.'+'js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmID}');//]]>`
            }}
          ></script>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );

  const metaTags = otherMetaTags.map(meta => ReactHtmlParser(meta.meta_tag));
  const scriptTags = headerScripts
    .map(script => script.script_tag)
    .filter(str => str)
    .map(str => str.replace("<script>", "").replace("</script>", ""))
    .map((item, index) => (
      <script key={index} dangerouslySetInnerHTML={{ __html: item }} />
    ));
  const hrefLangs = languages.map(({ language }) => {
    let langCode = language.split("-")[1].toLowerCase();

    return (
      <link
        rel="alternate"
        hrefLang={langCode}
        href={`/${langCode === "en" ? "" : `${langCode}/`}`}
      />
    );
  });
  return (
    <Head>
      {dynamicMeta}
      {metaTags}
      {hrefLangs}
      {scriptTags}
    </Head>
  );
};
