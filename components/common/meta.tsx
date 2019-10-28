import React from "react";
import ReactHtmlParser from "react-html-parser";
import Head from "next/head";
import parse from "url-parse";

const withoutTrailingSlash = url =>
  url.charAt(url.length - 1) === "/" ? url.substr(0, url.length - 1) : url;

const withTrailingSlash = url =>
  url.charAt(url.length - 1) !== "/" ? `${url}/` : url;

const withHttps = url =>
  (url.startsWith("http") ? url : `https://${url}`).replace("http:", "https:");

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
    canonical_link: canonicalLink,
    other_meta_tags: otherMetaTags = [],
    header_scripts: headerScripts = [],
    seo_keywords: seoKeywords,
    google_site_verification: googleSiteVerification,
    bing_site_verification: bingSiteVerification,
    localization: languages = [],
    logo,
    page_url: pageUrl,
    isDev
  } = data;
  const amplitude_key = isDev
    ? process.env.AMPLITUDE_DEV
    : process.env.AMPLITUDE_PROD;

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

      {canonicalLink ? (
        <link
          rel="canonical"
          href={withTrailingSlash(withHttps(canonicalLink))}
        />
      ) : null}

      {robotsContent.length ? (
        <meta name="robots" content={robotsContent.join(", ")} />
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSchemaJson(data))
        }}
      />

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
            })(window,document,'script','dataLayer','GTM-TR8SRJG');//]]>`
        }}
      ></script>

      {amplitude_key ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
            ;r.type="text/javascript"
            ;r.integrity="sha384-a+mq7tiLwde/00Oc7avFHLn/ttGfdAq1rtZc7u97SEzIiyYoT2IsOKWCkAThwdEu"
            ;r.crossOrigin="anonymous";r.async=true
            ;r.src="https://cdn.amplitude.com/libs/amplitude-5.3.0-min.gz.js"
            ;r.onload=function(){if(!e.amplitude.runQueuedFunctions){
            console.log("[Amplitude] Error: could not load SDK")}}
            ;var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)
            ;function s(e,t){e.prototype[t]=function(){
            this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
            var o=function(){this._q=[];return this}
            ;var a=["add","append","clearAll","prepend","set","setOnce","unset"]
            ;for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[]
            ;return this}
            ;var l=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
            ;for(var p=0;p<l.length;p++){s(c,l[p])}n.Revenue=c
            ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId"]
            ;function v(e){function t(t){e[t]=function(){
            e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
            for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
            e=(!e||e.length===0?"$default_instance":e).toLowerCase()
            ;if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]}
            ;e.amplitude=n})(window,document);

            amplitude.getInstance().init('${amplitude_key}');`
          }}
        ></script>
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
