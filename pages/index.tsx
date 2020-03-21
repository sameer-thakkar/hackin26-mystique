import React from 'react';
import dynamic from 'next/dynamic';
import fetch from 'isomorphic-unfetch';
import { ThemeProvider } from 'styled-components';
import theme from '../theme';
import EnvironmentContext from '../contexts/environmentContext';
import { Client } from '../prismic-config';
import {
  CUSTOM_TYPES,
  DESIGN,
  MICROSITE_STRING_KEYS,
  MICROSITE_OBJECT_KEYS,
  MICROSITE_ARRAY_KEYS,
  COMMON_HEADER_PROPS,
  LINKED_MICROSITE_PROPS,
} from '../constants';
import { redirectTo, getPrismicProps, reflect } from '../utils';
import 'lazysizes';
import '../public/static/styles.css';
import { uncategorizedToursListParser } from '../utils/DataParsers';

const ErrorPage = dynamic(() => import('next/error'));
const Microsite = dynamic(() => import('../components/MicrositeV1'));
const ContentPage = dynamic(() => import('../components/ContentPage'));
const MicrositeV2 = dynamic(() => import('../components/MicrositeV2'));

export default class Page extends React.Component<any, any> {
  static async getInitialProps({ req, query, res }) {
    const serverRequestStartTimestamp = Math.floor(new Date().getTime());
    const pathname =
      req?.url.split('?')[0].split('#')[0] || window.location.pathname;

    // Checking is mystique is running in dev
    const isDev = req
      ? !!query.mystique_uid
      : window.location.search.includes('mystique_uid');

    // Logic to get the redirect uid
    let redirectUID;
    if (isDev) {
      if (req) {
        redirectUID = query.mystique_uid;
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        redirectUID = urlParams.get('mystique_uid');
      }
    } else {
      if (req) {
        redirectUID = req.headers.host;
      } else {
        redirectUID = window.location.host;
      }
    }
    redirectUID = redirectUID.replace('stage.', '');

    /**
     * Asynchronously check if a redirect exists for the request
     * and get the data for microsite or content page
     */
    const [_redirect, { payload: props }] = await Promise.all(
      [
        Client(req)
          .getByUID(CUSTOM_TYPES.REDIRECT, redirectUID)
          .then(r => {
            let redirectURL = r.data?.redirect_to_url?.url;
            if (redirectURL) {
              if (redirectURL[redirectURL.length - 1] === '/')
                redirectURL = redirectURL.slice(0, -1);
              redirectTo({
                res,
                url: `${redirectURL}${pathname !== '/index' ? pathname : ''}`,
                type: r.data?.redirect_type,
              });
            }
          }),
        Page.getData({
          res,
          req,
          query,
          reqPathname: req ? req.url.split('?')[0].split('#')[0] : null,
          isDev,
        }),
      ].map(reflect)
    );

    try {
      const url = props?.CMSContent?.data?.data?.redirect_url?.url;
      if (url) {
        redirectTo({ res, url });
      }

      if (process.browser) (window as any).prismic.setupEditButton();
      if (res) {
        if (props.statusCode) {
          res.statusCode = props.statusCode;
        }
      }
      if (
        req &&
        req.headers.host.startsWith('stage.') &&
        process.env.GIT_BRANCH
      ) {
        res.setHeader('x-git-branch', process.env.GIT_BRANCH);
        res.setHeader('x-git-actor', process.env.GIT_ACTOR);
      }

      return {
        ...props,
        serverRequestStartTimestamp,
        windowUrl: req
          ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}${req.url}`
          : window.location.href,
      };
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  static async getData({
    res: serverResponse,
    req,
    query,
    reqPathname,
    isDev,
  }) {
    const { host } = req.headers || window.location;
    const pathname = reqPathname || window.location.pathname;
    try {
      let uid, lang;
      if (req) {
        // Server side rendering
        if (isDev) {
          const { mystique_uid: queryParamUID, lang: queryParamLang } = query;
          uid = queryParamUID;
          lang = queryParamLang;
        } else {
          const { uid: reqUID, lang: reqLang } = getPrismicProps({
            host,
            pathname,
          });
          uid = reqUID;
          lang = reqLang;
        }
      } else {
        // Client side rendering
        if (isDev) {
          const urlParams = new URLSearchParams(window.location.search);
          uid = urlParams.get('mystique_uid');
          lang = urlParams.get('lang');
        } else {
          const { uid: reqUID, lang: reqLang } = getPrismicProps({
            host,
            pathname,
          });
          uid = reqUID;
          lang = reqLang;
        }
      }

      let initial_tgids = [];

      const { CMSContent, ContentType, statusCode } = await Client(req)
        .getByUID(CUSTOM_TYPES.MICROSITE, uid, {
          lang,
        })
        .then(async res => {
          let completeMicrosite = { data: res };
          if (completeMicrosite.data) {
            if (completeMicrosite.data.uid !== uid) {
              let url = completeMicrosite.data.data?.page_url;
              if (host.slice(0, 5) === 'stage') {
                url = url.split('//');
                url = url.join('//stage.');
              }
              redirectTo({
                res: serverResponse,
                url,
                type: completeMicrosite.data.data.redirect_type,
              });
            } else {
              const itemsParent = completeMicrosite.data.data.body1[0];
              const tours = itemsParent ? itemsParent.items : [];
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
                lang !== 'en'
                  ? await Client(req)
                      .getByUID(CUSTOM_TYPES.MICROSITE, uid, {
                        lang: 'en-us',
                      })
                      .then(res => res)
                  : {};

              const strValues = MICROSITE_STRING_KEYS.reduce(
                (acc, elem) => ({
                  ...acc,
                  [elem]:
                    completeMicrosite.data.data[elem] ||
                    baseLangData.data[elem],
                }),
                {}
              );

              const objValues = MICROSITE_OBJECT_KEYS.reduce(
                (acc, elem) => ({
                  ...acc,
                  [elem]: Object.keys(completeMicrosite.data.data[elem]).length
                    ? completeMicrosite.data.data[elem]
                    : baseLangData.data[elem],
                }),
                {}
              );

              const arrValues = MICROSITE_ARRAY_KEYS.reduce(
                (acc, elem) => ({
                  ...acc,
                  [elem]: completeMicrosite.data.data[elem].length
                    ? completeMicrosite.data.data[elem]
                    : baseLangData.data[elem],
                }),
                {}
              );

              if (
                Object.keys(completeMicrosite.data.data['alert_popup'])
                  .length === 1
              ) {
                completeMicrosite.data.data['alert_popup'] =
                  baseLangData.data['alert_popup'];
              }
              /**
               * References Handler;
               * The final case empty string was added
               * to handle promise resolve more neatly.
               */
              const footerID =
                completeMicrosite.data.data.footer_ref.id ||
                baseLangData.data.footer_ref.id ||
                '';
              const contentSectionId =
                completeMicrosite.data.data.content_framework.id ||
                baseLangData.data.content_framework.id ||
                '';

              const linkedRefIDs = [];
              linkedRefIDs.push(footerID);
              linkedRefIDs.push(contentSectionId);

              const [
                commonFooter,
                contentFramework,
              ] = await this.getRefsArrayByIds(linkedRefIDs, req);

              const micrositeData = {
                ...completeMicrosite,
                data: {
                  ...completeMicrosite.data,
                  refs: {
                    commonFooter,
                    contentFramework,
                  },
                  data: {
                    ...completeMicrosite.data.data,
                    ...strValues,
                    ...objValues,
                    ...arrValues,
                    canonical_link:
                      completeMicrosite.data.data.canonical_link ||
                      completeMicrosite.data.data.page_url,
                    logo_redirection_url: completeMicrosite.data.data
                      .logo_redirection_url.url
                      ? completeMicrosite.data.data.logo_redirection_url
                      : baseLangData.data.logo_redirection_url,
                    enable_earliest_availability:
                      baseLangData.data.enable_earliest_availability,
                    enable_powered_by_headout_logo: completeMicrosite.data.data
                      .enable_powered_by_headout_logo
                      ? completeMicrosite.data.data
                          .enable_powered_by_headout_logo === 'Yes'
                      : baseLangData.data.enable_powered_by_headout_logo ===
                        'Yes',
                    baseLangPageTitle: baseLangData.data.title,
                  },
                },
              };
              return {
                CMSContent: micrositeData,
                ContentType: CUSTOM_TYPES.MICROSITE,
              };
            }
          } else {
            return await Client(req)
              .getByUID(CUSTOM_TYPES.CONTENT_PAGE, uid, {
                fetchLinks: [...COMMON_HEADER_PROPS, ...LINKED_MICROSITE_PROPS],
                lang,
              })
              .then(async page => {
                if (page) {
                  if (page.uid !== uid) {
                    let url = page.data?.page_url;
                    if (host.slice(0, 5) === 'stage') {
                      url = url.split('//');
                      url = url.join('//stage.');
                    }
                    redirectTo({
                      res: serverResponse,
                      url,
                      type: 301,
                    });
                  }
                }
                if (!(page && page.data)) {
                  return {
                    statusCode: 404,
                  };
                }

                // Redirect logic (if redirect exists on content page)
                const url =
                  page.data.microsite_document_ref?.data.redirect_url?.url;
                if (url) {
                  redirectTo({ res: serverResponse, url });
                }

                /**
                 *  Fetching data of referenced custom types which cannot be
                 * fetched using the fetchLink method due to prismic constraints
                 * Currently includes: Common Footer, Content Framework
                 */
                const footerID = page.data.footer_ref.id || '';
                const contentFrameworkID =
                  page.data.content_framework?.id || '';
                const micrositeId = page.data.microsite_document_ref.id || '';

                const linkedRefIDs = [];
                linkedRefIDs.push(footerID);
                linkedRefIDs.push(micrositeId);
                linkedRefIDs.push(contentFrameworkID);
                const [
                  commonFooter,
                  micrositeData,
                  contentFramework,
                ] = await this.getRefsArrayByIds(linkedRefIDs, req);

                let completePage = {
                  ...page,
                  data: {
                    ...page.data,
                    footer_ref: commonFooter,
                    content_framework: contentFramework,
                    microsite: micrositeData,
                  },
                  featured: {
                    image: page.data.featured_image.url
                      ? page.data.featured_image
                      : page.data.featured_image_link,
                    title: page.data.featured_title,
                  },
                };
                return {
                  CMSContent: completePage,
                  ContentType: CUSTOM_TYPES.CONTENT_PAGE,
                };
              });
          }
        });

      if (statusCode) {
        return {
          statusCode,
        };
      }
      /**
       * AllData will yield different sets of Properties based on CUSTOM_TYPE,
       * and finally gets returned with any other common data for CUSTOM_TYPE
       */
      let AllData = {};
      if (ContentType === CUSTOM_TYPES.CONTENT_PAGE) {
        AllData = {
          CMSContent,
          ContentType,
          uid,
          lang,
          isDev,
          host,
        };
      }
      /**
       * Seting a Common Microsite Reference for Content Page & Regular Microsite
       * Added to make tour data available on Content Pages.
       * i.e Contentpage now contains all of the data from its related Microsite.
       */
      let microsite =
        ContentType === CUSTOM_TYPES.CONTENT_PAGE
          ? CMSContent.data.microsite
          : CMSContent.data;

      const all_tours_tab_tgids =
        microsite.data.all_tours.reduce((accum, tour) => {
          return [...accum, tour.primary.tgid];
        }, []) || [];

      let labelIds;
      if (all_tours_tab_tgids.length) {
        labelIds = microsite.data.content_order.reduce((accum, label) => {
          return [...accum, label.label.id];
        }, []);
        microsite.data.labels = await Client(req)
          .getByIDs(labelIds)
          .then(res => {
            return res.results;
          });
      }
      let idsToFetchFromScorpio = [];

      if (ContentType === CUSTOM_TYPES.MICROSITE) {
        const MBDesign = CMSContent.data.data.design || '';
        const { items: uncategorizedToursList } = CMSContent.data.data
          .body1[0] || { items: [] };

        idsToFetchFromScorpio = uncategorizedToursListParser(
          uncategorizedToursList,
          initial_tgids
        );

        const tgidToScroll = (function getScrollTgid() {
          const pathname = req ? req.url : window.location.pathname;
          const doesTgidExist = pathname.includes('tgid');
          if (doesTgidExist) {
            const tgidToScroll = pathname.split('=').pop();
            return tgidToScroll;
          }
          return null;
        })();
        AllData = {
          CMSContent,
          ContentType,
          uid,
          lang,
          host,
          MBDesign,
          isDev,
          tgidToScroll,
        };
      }

      idsToFetchFromScorpio = [
        ...idsToFetchFromScorpio,
        ...all_tours_tab_tgids,
      ];
      const scorpioResponses = await Promise.all(
        idsToFetchFromScorpio.map(id =>
          fetch(
            `https://api.headout.com/api/v5/tour-group/get/${id}?language=${
              lang.split('-')[0]
            }`
          ).then(r => r.json())
        )
      );

      const scorpioData = scorpioResponses.reduce(
        (accum: {}, response: any, idx) => ({
          ...accum,
          [idsToFetchFromScorpio[idx]]: {
            title: response.name,
            highlights: response.microBrandsHighlight,
            descriptors: response.microBrandsDescriptor,
            productHighlights: response.highlights,
            productTitle: response.name,
            images: response.imageUploads,
            averageRating: response.averageRating,
            reviewCount: response.reviewCount,
            ctaBooster: response.callToAction,
            available: !(response.listingPrice == null),
          },
        }),
        {}
      );

      return {
        ...AllData,
        scorpioData,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
      };
    }
  }

  static async getRefsArrayByIds(ref_ids: Array<String>, req: Request) {
    const linkedRefsPromise = Client(req).getByIDs(ref_ids);
    return await Promise.resolve(linkedRefsPromise).then((res: any) => {
      return res.results;
    });
  }

  render() {
    const {
      CMSContent,
      scorpioData,
      ContentType,
      statusCode,
      host,
      MBDesign,
      isDev,
      windowUrl,
      pathname,
      tgidToScroll,
      serverRequestStartTimestamp,
      lang,
    } = this.props;
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />;
    }
    const PAGETYPE = ContentType + (MBDesign || '');
    let Component;
    switch (PAGETYPE) {
      case CUSTOM_TYPES.MICROSITE + DESIGN.V2:
        Component = (
          <MicrositeV2
            data={CMSContent.data}
            lang={lang}
            host={host}
            isDev={isDev}
            scorpioData={scorpioData}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
          />
        );
        break;
      case CUSTOM_TYPES.MICROSITE:
      case CUSTOM_TYPES.MICROSITE + DESIGN.V1:
        Component = (
          <Microsite
            data={CMSContent.data}
            scorpioData={scorpioData}
            offerData={CMSContent.offerData}
            host={host}
            pathname={pathname}
            isDev={isDev}
            tgidToScroll={tgidToScroll}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
          />
        );
        break;
      case CUSTOM_TYPES.CONTENT_PAGE:
        Component = (
          <ContentPage
            {...CMSContent}
            scorpioData={scorpioData}
            isDev={isDev}
            host={host}
            serverRequestStartTimestamp={serverRequestStartTimestamp}
          />
        );
        break;
      default:
        Component = <ErrorPage statusCode={500} />;
        break;
    }

    return (
      <div id="body-wrap">
        <EnvironmentContext.Provider
          value={{
            isDev,
            windowUrl,
          }}
        >
          <ThemeProvider theme={theme}>{Component}</ThemeProvider>
        </EnvironmentContext.Provider>
      </div>
    );
  }
}
