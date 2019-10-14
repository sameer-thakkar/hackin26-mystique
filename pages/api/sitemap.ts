import Prismic from "prismic-javascript";
import { apiEndpoint } from "../../prismic-config";
import builder from "xmlbuilder";
import { CONTENT_TYPES } from "../../constants";
import parse from "url-parse";

const withHttps = url =>
  (url.startsWith("http") ? url : `https://${url}`).replace("http:", "https:");

const withTrailingSlash = url =>
  url.charAt(url.length - 1) !== "/" ? `${url}/` : url;

function getPage(api, uid, documents) {
  return api
    .query(Prismic.Predicates.any("document.tags", [uid]), {
      lang: "*",
      pageSize: 100
    })
    .then(response => {
      return documents.concat(response.results);
    });
}

const createLoc = doc => {
  const pageUrl = doc.data.page_url;
  if (doc.type === CONTENT_TYPES.MICROSITE) {
    if (doc.lang === "en-us") {
      return pageUrl;
    }
    const langParam = doc.lang.split("-")[0];
    const { host, pathname } = parse(pageUrl, true);
    // lang is not english and it's a MB with a pathname
    // eg. experiment pages with /home urls or MBs on pathname
    if (pathname.length) {
      if (
        pathname.startsWith(`/${langParam}`) &&
        (pathname === `/${langParam}` || pathname.startsWith(`/${langParam}/`))
      ) {
        return `https://${host}${pathname}`;
      }
      return `https://${host}/${langParam}${pathname}`;
    }
    return `${pageUrl}/${langParam}`;
  }
  return pageUrl;
};

const createImg = doc => {
  if (doc.type === CONTENT_TYPES.MICROSITE) {
    if (doc.data.image && doc.data.image.url) {
      return {
        "image:image": {
          "image:loc": doc.data.image.url
        }
      };
    }
    return {};
  }
  return {};
};

export default function handle(req, res) {
  let uid;
  if (req.query.mystique_uid) {
    uid = req.query.mystique_uid;
  } else {
    uid = req.headers.host.replace("stage.", "");
  }

  const xmlDoc = {
    urlset: {
      "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@xmlns:image": "http://www.google.com/schemas/sitemap-image/1.1",
      "@xsi:schemaLocation":
        "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd",
      "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      url: []
    }
  };

  Prismic.getApi(apiEndpoint, { req })
    .then(api => {
      return getPage(api, uid, []);
    })
    .then(documents => {
      documents
        .filter(doc =>
          [CONTENT_TYPES.MICROSITE, CONTENT_TYPES.CONTENT_PAGE].includes(
            doc.type
          )
        )
        .reduce(
          (accum, item) => {
            if (item.type === CONTENT_TYPES.MICROSITE) {
              return [[...accum[0], item], accum[1]];
            }
            return [accum[0], [...accum[1], item]];
          },
          [[], []]
        )
        .reduce((accum, item) => [...accum, ...item])
        .filter(doc => doc.data.is_excluded_from_sitemap !== "Yes")
        .forEach(doc => {
          xmlDoc.urlset.url.push({
            loc: withTrailingSlash(withHttps(createLoc(doc))),
            lastmod: new Date(doc.last_publication_date).toISOString(),
            ...createImg(doc)
          });
        });
      const xml = builder.create(xmlDoc, { encoding: "utf-8" });
      const xmlStr = xml.end();
      res.setHeader("Content-Type", "application/xml");
      res.send(xmlStr);
      res.end();
    })
    .catch(err => {
      res.status(500).send(`Error: ${err.message}`);
    });
}
