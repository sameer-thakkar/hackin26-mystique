import Prismic from "prismic-javascript";
import { apiEndpoint } from "../../prismic-config";
import builder from "xmlbuilder";

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
  if (doc.lang === "en-us") {
    return `https://${doc.uid}/`;
  }
  return `https://${doc.uid}/${doc.lang.split("-")[0]}`;
};

export default function handle(req, res) {
  const url = fullDomain(req);
  let uid;
  if (url.includes("localhost:")) {
    uid = req.query.uid;
  } else {
    uid = req.headers.host;
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
      documents.forEach(doc => {
        if (doc.data.is_variant_page !== "Yes") {
          // skip all A/B variant pages from sitemap
          const { data } = doc;
          xmlDoc.urlset.url.push({
            loc: createLoc(doc),
            lastmod: doc.last_publication_date,
            "image:image": {
              "image:loc": data.image.url
            }
          });
        }
      });
      const xml = builder.create(xmlDoc, { encoding: "utf-8" });
      const xmlStr = xml.end();
      res.send(xmlStr);
    })
    .catch(err => {
      res.status(500).send(`Error: ${err.message}`);
    });
}
