import React from "react";
import JSONTree from "react-json-tree";
import Microsite from "../components/Microsite";
import PlanYourVisit from "../components/PlanYourVisit";
import PrismicReact from "prismic-reactjs";
import Prismic from "prismic-javascript";
import {
  Client,
  apiEndpoint,
  hrefResolver,
  linkResolver
} from "../prismic-config";

const getPropsFromReq = ({ host, pathname }) => {
  const pathnameWithoutTrailingSlash = pathname =>
    pathname.lastIndexOf("/") === pathname.length - 1
      ? pathname.substr(0, pathname.length - 1)
      : pathname;

  const languages = ["en", "es", "it", "fr", "pt", "de", "nl"];
  const langMap = {
    en: "en-us",
    es: "es-es",
    it: "it-it",
    fr: "fr-fr",
    pt: "pt-pt",
    nl: "nl-nl",
    de: "de-de"
  };

  const pathnameSlugs = pathnameWithoutTrailingSlash(pathname)
    .split("/")
    .filter(item => item);

  let requestedLang = pathnameSlugs[0];

  const isLangValid = languages.includes(requestedLang);
  if (isLangValid) {
    pathnameSlugs.shift();
  } else {
    requestedLang = "en";
  }

  const uid = `${pathnameWithoutTrailingSlash(
    `${host}/${pathnameSlugs.join("/")}`
  )}`
    .replace("microbrand.", "www.")
    .replace(/\//g, ".");

  return {
    uid,
    lang: langMap[requestedLang]
  };
};

export default class Page extends React.Component<any, any> {
  static async getInitialProps({ req, query }) {
    try {
      const props = await Page.getMicrositeData({
        req,
        query
      });
      if (process.browser) (window as any).prismic.setupEditButton();
      return props;
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  static async getMicrositeData({ req, query }) {
    /**
     * www.tickets-amsterdam.com/madame-tussauds
     * www.tickets-amsterdam.com/es/madame-tussauds
     */

    /**
     * if working locally
     *  - read from query param
     *  ?mystique_uid=www.tickets-amsterdam.com.madame-tussauds&lang=es
     *  Output object: {mystique_uid: '',  lang: ''}
     * if working on prod
     *  - deconstruct host and pathname
     *  to create similar output object
     */
    const { host } = req ? req.headers : window.location;
    const isDev = host.includes("localhost:");

    try {
      let uid, lang, pathname;
      if (req) {
        // server render
        pathname = req.url;
        if (isDev) {
          const { mystique_uid: queryParamUID, lang: queryParamLang } = query;
          uid = queryParamUID;
          lang = queryParamLang;
        } else {
          const { uid: reqUID, lang: reqLang } = getPropsFromReq({
            host: req.headers.host,
            pathname
          });
          uid = reqUID;
          lang = reqLang;
        }
      } else {
        if (isDev) {
          const qsObject: any = window.location.search
            .replace("?", "")
            .split("&")
            .reduce((accum, item) => {
              const qs = item.split("=");
              return {
                ...accum,
                [qs[0]]: qs[1]
              };
            }, {});
          uid = qsObject.mystique_uid;
          lang = qsObject.lang;
          pathname = window.location.pathname;
        } else {
          const { host } = window.location;
          pathname = window.location.pathname;
          const { uid: reqUID, lang: reqLang } = getPropsFromReq({
            host,
            pathname
          });
          uid = reqUID;
          lang = reqLang;
        }
      }

      let uidType = "";
      switch (pathname) {
        case "/plan-your-visit":
          uidType = "plan_your_visit";
          break;
        default:
          uidType = "microsite";
      }

      const micrositeData = Client(req).getByUID(uidType, uid, { lang });
      const offerData = Client(req).query(
        Prismic.Predicates.at("document.type", "offer_free_tour")
      );

      const response = await Promise.all([micrositeData, offerData]).then(
        res => {
          return { data: res[0], offerData: res[1] };
        }
      );

      return {
        response,
        uidType,
        uid,
        lang
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  render() {
    const { response, uidType, uid, lang } = this.props;

    if (uidType === "microsite") {
      return (
        <Microsite
          data={response.data}
          uid={uid}
          lang={lang}
          offerData={response.offerData}
        />
      );
    } else if (uidType === "plan_your_visit") {
      return <PlanYourVisit data={response.data} uid={uid} lang={lang} />;
    }
    return (
      <div>
        <JSONTree data={response.data} invertTheme />
      </div>
    );
  }
}
