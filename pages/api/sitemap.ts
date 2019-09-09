import Prismic from "prismic-javascript";
import { apiEndpoint } from "../../prismic-config";
import builder from "xmlbuilder";
import { CONTENT_TYPES } from "../../constants";

function getPage(api, uid, documents) {
  return api
    .query(Prismic.Predicates.any("document.tags", [uid]), { lang: "*" })
    .then(response => {
      return documents.concat(response.results);
    });
}

const fullDomain = req =>
  req.headers["x-forwarded-proto"] + "://" + req.headers.host;

const createLoc = doc => {
  if (doc.type === CONTENT_TYPES.MICROSITE) {
    if (doc.lang === "en-us") {
      return `https://${doc.uid}/`;
    }
    return `https://${doc.uid}/${doc.lang.split("-")[0]}`;
  }
  return doc.data.page_url;
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
  const url = fullDomain(req);
  let uid;
  if (url.includes("localhost:")) {
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
            loc: createLoc(doc),
            lastmod: doc.last_publication_date,
            ...createImg(doc)
          });
        });
      const xml = builder.create(xmlDoc, { encoding: "utf-8" });
      const xmlStr = xml.end();
      res.send(xmlStr);
    })
    .catch(err => {
      res.status(500).send(`Error: ${err.message}`);
    });
}
