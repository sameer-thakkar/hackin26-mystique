import React from "react";
import JSONTree from "react-json-tree";
import Microsite from "../components/Microsite";
import SubPage from "../components/SubPage";
import PrismicReact from "prismic-reactjs";
import Prismic from "prismic-javascript";
import fetch from "isomorphic-unfetch";
import {
  Client,
  apiEndpoint,
  hrefResolver,
  linkResolver
} from "../prismic-config";
import { CONTENT_TYPES } from "../constants";

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
        query,
        reqPathname: req ? req.url.split("?")[0].split("#")[0] : null
      });
      if (process.browser) (window as any).prismic.setupEditButton();
      return props;
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  static async getMicrositeData({ req, query, reqPathname }) {
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
        pathname = reqPathname;
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
      let initial_tgids = [];
      const { CMSContent, ContentType } = await Client(req)
        .getByUID(CONTENT_TYPES.MICROSITE, uid, {
          lang
        })
        .then(async res => {
          let completeMicrosite = { data: res };
          if (completeMicrosite.data && completeMicrosite.data.uid == uid) {
            let tours = completeMicrosite.data.data.body1[0].items || [];
            let offers = tours
              .filter(tour => tour.offer__free_tour.id)
              .map(tour => tour.offer__free_tour.id);
            let uniqueOfferIds = offers.filter(
              (id, index) => offers.indexOf(id) === index
            );
            if (uniqueOfferIds.length)
              (completeMicrosite as any).offerData = await Client(req)
                .getByIDs(uniqueOfferIds)
                .then(offerData => {
                  offerData.results.map(offer => {
                    initial_tgids.push(offer.data.offer_tgid);
                  });
                  return offerData;
                });

            return {
              CMSContent: completeMicrosite,
              ContentType: CONTENT_TYPES.MICROSITE
            };
          } else {
            return await Client(req)
              .getByUID(CONTENT_TYPES.CONTENT_PAGE, uid)
              .then(page => {
                let completePage = {
                  body: page.data.body,
                  featured: {
                    image: page.data.featured_image,
                    title: page.data.featured_title
                  },
                  subs: {}
                };

                let subComponents = [];
                page.data.header_ref.id &&
                  subComponents.push(page.data.header_ref.id);
                page.data.footer_ref.id &&
                  subComponents.push(page.data.footer_ref.id);
                let SubComponentPromise = Client(req).getByIDs(subComponents);

                return Promise.all([SubComponentPromise]).then((res: any) => {
                  completePage.subs = res[0].results;
                  return {
                    CMSContent: completePage,
                    ContentType: CONTENT_TYPES.CONTENT_PAGE
                  };
                });
              });
          }
        });
      if (ContentType === CONTENT_TYPES.MICROSITE) {
        const { items: uncategorizedToursList } = CMSContent.data.data.body1[0];

        const idsToFetchFromScorpio = uncategorizedToursList.reduce(
          (accum, tour) => {
            const {
              tgid,
              tour_title_override: title,
              marketing_highlights_override: descriptors,
              tour_description_override: highlights
            } = tour;
            const hasHighlights = highlights.filter(item => item.text);
            if (!title || !hasHighlights || !descriptors) {
              return [...accum, tgid];
            }
            return accum;
          },
          [...initial_tgids]
        );

        const scorpioResponses = await Promise.all(
          idsToFetchFromScorpio.map(id =>
            fetch(
              `https://api.headout.com/api/v5/tour-group/get/${id}?language=${
                lang.split("-")[0]
              }`
            ).then(r => r.json())
          )
        );

        const scorpioData = scorpioResponses.reduce(
          (accum, response: any, idx) => ({
            ...accum,
            [idsToFetchFromScorpio[idx]]: {
              title: response.name,
              highlights: response.microBrandsHighlight,
              descriptors: response.microBrandsDescriptor,
              productHighlights: response.highlights,
              productTitle: response.name
            }
          }),
          {}
        );
        return {
          CMSContent,
          ContentType,
          scorpioData,
          uid,
          lang
        };
      } else {
        return {
          CMSContent,
          ContentType,
          uid,
          lang
        };
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  render() {
    const { CMSContent, scorpioData, ContentType, uid, lang } = this.props;
    if (ContentType === CONTENT_TYPES.MICROSITE) {
      return (
        <Microsite
          data={CMSContent.data}
          scorpioData={scorpioData}
          uid={uid}
          lang={lang}
          key={CMSContent.data.id}
          offerData={CMSContent.offerData}
        />
      );
    } else if (ContentType === CONTENT_TYPES.CONTENT_PAGE) {
      return <SubPage {...CMSContent} key={uid} />;
    }
    return (
      <div>
        <JSONTree data={CMSContent} invertTheme />
      </div>
    );
  }
}
