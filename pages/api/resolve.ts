import Prismic from "prismic-javascript";
import { apiEndpoint } from "../../prismic-config";

export default function handle(req, res) {
  const { uid, type, lang, ref } = req.query;

  Prismic.getApi(apiEndpoint, { req })
    .then(api =>
      api.getByUID(type, uid, {
        lang,
        ref
      })
    )
    .then(response => {
      res.writeHead(302, {
        Location: response.data.page_url
      });
      res.end();
    });
}
