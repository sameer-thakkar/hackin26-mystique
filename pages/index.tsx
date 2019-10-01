import React from "react";
import Microsite from "../components/Microsite";
import SubPage from "../components/SubPage";
import ErrorPage from "next/error";
import fetch from "isomorphic-unfetch";
import { Client } from "../prismic-config";
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
    .replace("stage.", "")
    .replace(/\//g, ".");

  return {
    uid,
    lang: langMap[requestedLang]
  };
};

export default class Page extends React.Component<any, any> {
  static async getInitialProps({ req, query, res }) {
    try {
      const props = await Page.getMicrositeData({
        req,
        query,
        reqPathname: req ? req.url.split("?")[0].split("#")[0] : null
      });
      if (process.browser) (window as any).prismic.setupEditButton();
      if (props.statusCode && res) {
        res.statusCode = props.statusCode;
      }
      if (req && req.headers.host.startsWith("stage.")) {
        res.setHeader("x-git-branch", process.env.GIT_BRANCH);
        res.setHeader("x-git-actor", process.env.GIT_ACTOR);
      }
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
    const isDev = req
      ? !!query.mystique_uid
      : window.location.search.includes("mystique_uid");

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

      const { CMSContent, ContentType, statusCode } = await Client(req)
        .getByUID(CONTENT_TYPES.MICROSITE, uid, {
          lang
        })
        .then(async res => {
          let completeMicrosite = { data: res };
          if (completeMicrosite.data && completeMicrosite.data.uid == uid) {
            const tours = completeMicrosite.data.data.body1[0].items || [];
            const offers = tours
              .filter(tour => tour.offer__free_tour.id)
              .map(tour => tour.offer__free_tour.id);
            const uniqueOfferIds = offers.filter(
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
            const baseLangData =
              lang !== "en"
                ? await Client(req)
                    .getByUID(CONTENT_TYPES.MICROSITE, uid, {
                      lang: "en-us"
                    })
                    .then(res => res)
                : {};

            const strKeys = [
              "title",
              "description",
              "gtm_id",
              "seo_keywords",
              "google_site_verification",
              "bing_site_verification",
              "canonical_link",
              "noindex",
              "nofollow",
              "page_url"
            ];
            const objKeys = [
              "header_scripts",
              "image",
              "favicon",
              "other_meta_tags"
            ];

            const strValues = strKeys.reduce(
              (acc, elem) => ({
                ...acc,
                [elem]:
                  completeMicrosite.data.data[elem] || baseLangData.data[elem]
              }),
              {}
            );

            const objValues = objKeys.reduce(
              (acc, elem) => ({
                ...acc,
                [elem]: Object.keys(completeMicrosite.data.data[elem]).length
                  ? completeMicrosite.data.data[elem]
                  : baseLangData.data[elem]
              }),
              {}
            );

            const footerID =
              completeMicrosite.data.data.footer_ref.id ||
              baseLangData.data.footer_ref.id;
            if (footerID) {
              const customFooter = await Client(req).getByID(footerID);
              completeMicrosite.data.data.customFooter = customFooter;
            }

            const micrositeData = {
              ...completeMicrosite,
              data: {
                ...completeMicrosite.data,
                data: {
                  ...completeMicrosite.data.data,
                  ...strValues,
                  ...objValues,
                  logo_redirection_url: completeMicrosite.data.data
                    .logo_redirection_url.url
                    ? completeMicrosite.data.data.logo_redirection_url
                    : baseLangData.data.logo_redirection_url
                }
              }
            };

            return {
              CMSContent: micrositeData,
              ContentType: CONTENT_TYPES.MICROSITE
            };
          } else {
            const propsFromHeader = [
              "header_links",
              "logo",
              "link_to_logo_file",
              "logo_alt_text",
              "enable_group_booking",
              "header_links",
              "logo_redirection_url"
            ].map(prop => `${CONTENT_TYPES.HEADER}.${prop}`);

            const propsFromLinkedMicrosite = [
              "gtm_id",
              "header_scripts",
              "title",
              "description",
              "image",
              "favicon",
              "seo_keywords",
              "google_site_verification",
              "bing_site_verification",
              "canonical_link",
              "noindex",
              "nofollow",
              "other_meta_tags"
            ].map(prop => `${CONTENT_TYPES.MICROSITE}.${prop}`);

            return await Client(req)
              .getByUID(CONTENT_TYPES.CONTENT_PAGE, uid, {
                fetchLinks: [...propsFromHeader, ...propsFromLinkedMicrosite]
              })
              .then(page => {
                if (!(page && page.data)) {
                  return {
                    statusCode: 404
                  };
                }
                // console.log(JSON.stringify(page, null, 4));
                let completePage = {
                  ...page,
                  featured: {
                    image: page.data.featured_image.url
                      ? page.data.featured_image
                      : page.data.featured_image_link,
                    title: page.data.featured_title
                  },
                  subs: {}
                };

                let subComponents = [];
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

      if (statusCode) {
        return {
          statusCode
        };
      }

      if (ContentType === CONTENT_TYPES.CONTENT_PAGE) {
        return {
          CMSContent,
          ContentType,
          uid,
          lang
        };
      }

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
          lang,
          host
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500
      };
    }
  }

  render() {
    const {
      CMSContent,
      scorpioData,
      ContentType,
      statusCode,
      host
    } = this.props;
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />;
    }

    switch (ContentType) {
      case CONTENT_TYPES.MICROSITE:
        return (
          <Microsite
            data={CMSContent.data}
            scorpioData={scorpioData}
            offerData={CMSContent.offerData}
            host={host}
          />
        );
      case CONTENT_TYPES.CONTENT_PAGE:
        return <SubPage {...CMSContent} />;
      default:
        return <ErrorPage statusCode={500} />;
    }
  }
}
