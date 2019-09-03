import Prismic from "prismic-javascript";
import { apiEndpoint } from "../../prismic-config";

function getPage(api, uid, documents) {
  return api
    .query(Prismic.Predicates.any("document.tags", [uid]))
    .then(response => {
      return documents.concat(response.results);
    });
}

const fullDomain = req =>
  req.headers["x-forwarded-proto"] + "://" + req.headers.host;

export default function handle(req, res) {
  const url = fullDomain(req);
  let uid;
  if (url.includes("localhost:")) {
    uid = req.query.uid;
  } else {
    uid = req.headers.host;
  }
  Prismic.getApi(apiEndpoint, { req })
    .then(api => {
      return getPage(api, uid, []);
    })
    .then(documents => {
      let body = "";
      documents.forEach(doc => {
        if (doc.data.is_variant_page !== "Yes") {
          // skip all A/B variant pages from sitemap
          console.log(doc);
          body += `${doc.data.domain_name}\r\n`;
        }
      });
      res.send(body);
    })
    .catch(err => {
      res.status(500).send(`Error: ${err.message}`);
    });
}
