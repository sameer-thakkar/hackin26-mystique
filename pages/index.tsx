import React from "react";
import JSONTree from "react-json-tree";
import Microsite from "../components/Microsite";
import PlanYourVisit from "../components/PlanYourVisit";
import PrismicReact from "prismic-reactjs";
import {
  Client,
  apiEndpoint,
  hrefResolver,
  linkResolver
} from "../prismic-config";

const getPropsFromReq = req => {
  const host = req.headers.host;
  const pathname = req.url;

  const pathnameWithoutTrailingSlash = pathname =>
    pathname.lastIndexOf("/") === pathname.length - 1
      ? pathname.substr(0, pathname.length - 1)
      : pathname;

  const languages = ["en", "es", "it"];
  const langMap = {
    en: "en-us",
    es: "es-es",
    it: "it-it"
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
    try {
      const { mystique_uid: queryParamUID, lang: queryParamLang } = query;
      const { host } = req.headers;
      const pathname = req.url;

      let uidType = "";
      switch (pathname) {
        case "/plan-your-visit":
          uidType = "plan_your_visit";
          break;
        default:
          uidType = "microsite";
      }

      const isDev = host.includes("localhost:");
      let uid;
      let lang;
      if (isDev) {
        uid = queryParamUID;
        // TODO: make queryParamLang accept `en`, `es` kind of input
        lang = queryParamLang;
      } else {
        const { uid: reqUID, lang: reqLang } = getPropsFromReq(req);
        uid = reqUID;
        lang = reqLang;
      }
      const data = await Client(req).getByUID(uidType, uid, { lang });
      return {
        data,
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
    const { data, uidType, uid, lang } = this.props;

    if (uidType === "microsite") {
      return <Microsite data={data} uid={uid} lang={lang} />;
    } else if (uidType === "plan_your_visit") {
      return <PlanYourVisit data={data} uid={uid} lang={lang} />;
    }
    return (
      <div>
        <JSONTree data={data} invertTheme />
      </div>
    );
  }
}
