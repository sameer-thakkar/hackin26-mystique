import React from 'react';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';

const Microsite = dynamic(() => import('../components/Microsite'));
const SubPage = dynamic(() => import('../components/SubPage'));
const ErrorPage = dynamic(() => import('next/error'));

import { Client } from '../prismic-config';
import { CONTENT_TYPES, DESIGN } from '../constants';
import MicroBrand from '../components/MicroBrand/MicroBrand';
import { withoutTrailingSlash, reflect } from '../utils/helper';
import EnvironmentContext from '../contexts/environmentContext';
import '../static/styles.css';

const getPropsFromReq = ({ host, pathname }) => {
    const languages = ['en', 'es', 'it', 'fr', 'pt', 'de', 'nl'];
    const langMap = {
        en: 'en-us',
        es: 'es-es',
        it: 'it-it',
        fr: 'fr-fr',
        pt: 'pt-pt',
        nl: 'nl-nl',
        de: 'de-de',
    };

    const pathnameSlugs = withoutTrailingSlash(pathname)
        .split('/')
        .filter(item => item);

    let requestedLang = pathnameSlugs[0];

    const isLangValid = languages.includes(requestedLang);
    if (isLangValid) {
        pathnameSlugs.shift();
    } else {
        requestedLang = 'en';
    }

    const uid = `${withoutTrailingSlash(`${host}/${pathnameSlugs.join('/')}`)}`
        .replace('stage.', '')
        .replace(/\//g, '.');

    return {
        uid,
        lang: langMap[requestedLang],
    };
};

export default class Page extends React.Component<any, any> {
    static async getInitialProps({ req, query, res }) {
        const serverRequestStartTimestamp = Math.floor(new Date().getTime());
        try {
            const isDev = req
                ? !!query.mystique_uid
                : window.location.search.includes('mystique_uid');
            let redirectUID;

            if (isDev) {
                redirectUID = query.mystique_uid.split('.');
            } else {
                const { uid } = getPropsFromReq({
                    host: req.headers.host,
                    pathname: req ? req.url.split('?')[0].split('#')[0] : null,
                });
                redirectUID = uid.split('.');
            }
            redirectUID.shift();
            redirectUID = redirectUID.join('.');

            const [redirect, { payload: props }] = await Promise.all(
                [
                    Client(req)
                        .getByUID(CONTENT_TYPES.REDIRECT, redirectUID)
                        .then(r => {
                            const redirectUrl = r.data.redirect_url.url;
                            if (res && redirectUrl) {
                                res.writeHead(302, { Location: redirectUrl });
                                res.end();
                            }
                        }),
                    Page.getMicrositeData({
                        req,
                        query,
                        reqPathname: req
                            ? req.url.split('?')[0].split('#')[0]
                            : null,
                    }),
                ].map(reflect)
            );

            try {
                const redirectTo = props.CMSContent
                    ? props.CMSContent.data.data.redirect_url
                    : null;

                if (redirectTo && redirectTo.url) {
                    if (res) {
                        res.writeHead(302, {
                            Location: redirectTo.url,
                        });
                        res.end();
                    } else {
                        Router.push(redirectTo.url);
                    }
                    return;
                }
            } catch (e) {}

            if (process.browser) (window as any).prismic.setupEditButton();
            if (res) {
                if (props.statusCode) {
                    // statusCode here implies non 2xx statusCode
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
            : window.location.search.includes('mystique_uid');

        try {
            let uid, lang, pathname;
            if (req) {
                // server render
                pathname = reqPathname;
                if (isDev) {
                    const {
                        mystique_uid: queryParamUID,
                        lang: queryParamLang,
                    } = query;
                    uid = queryParamUID;
                    lang = queryParamLang;
                } else {
                    const { uid: reqUID, lang: reqLang } = getPropsFromReq({
                        host: req.headers.host,
                        pathname,
                    });
                    uid = reqUID;
                    lang = reqLang;
                }
            } else {
                if (isDev) {
                    const qsObject: any = window.location.search
                        .replace('?', '')
                        .split('&')
                        .reduce((accum, item) => {
                            const qs = item.split('=');
                            return {
                                ...accum,
                                [qs[0]]: qs[1],
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
                        pathname,
                    });
                    uid = reqUID;
                    lang = reqLang;
                }
            }

            let initial_tgids = [];

            const { CMSContent, ContentType, statusCode } = await Client(req)
                .getByUID(CONTENT_TYPES.MICROSITE, uid, {
                    lang,
                })
                .then(async res => {
                    let completeMicrosite = { data: res };
                    if (
                        completeMicrosite.data &&
                        completeMicrosite.data.uid == uid
                    ) {
                        const itemsParent =
                            completeMicrosite.data.data.body1[0];
                        const tours = itemsParent ? itemsParent.items : [];
                        const offers = tours
                            .filter(tour => tour.offer__free_tour.id)
                            .map(tour => tour.offer__free_tour.id);
                        const uniqueOfferIds = offers.filter(
                            (id, index) => offers.indexOf(id) === index
                        );
                        if (uniqueOfferIds.length)
                            (completeMicrosite as any).offerData = await Client(
                                req
                            )
                                .getByIDs(uniqueOfferIds)
                                .then(offerData => {
                                    offerData.results.map(offer => {
                                        initial_tgids.push(
                                            offer.data.offer_tgid
                                        );
                                    });
                                    return offerData;
                                });
                        const baseLangData =
                            lang !== 'en'
                                ? await Client(req)
                                      .getByUID(CONTENT_TYPES.MICROSITE, uid, {
                                          lang: 'en-us',
                                      })
                                      .then(res => res)
                                : {};

                        const strKeys = [
                            'title',
                            'description',
                            'gtm_id',
                            'seo_keywords',
                            'google_site_verification',
                            'bing_site_verification',
                            'noindex',
                            'nofollow',
                            'page_url',
                            'enable_earliest_availability',
                            'blackout_start_date',
                            'blackout_end_date',
                            'cta_url_suffix',
                            'block_n_days_group_booking',
                        ];
                        const objKeys = [
                            'header_scripts',
                            'image',
                            'favicon',
                            'other_meta_tags',
                        ];

                        const strValues = strKeys.reduce(
                            (acc, elem) => ({
                                ...acc,
                                [elem]:
                                    completeMicrosite.data.data[elem] ||
                                    baseLangData.data[elem],
                            }),
                            {}
                        );

                        const objValues = objKeys.reduce(
                            (acc, elem) => ({
                                ...acc,
                                [elem]: Object.keys(
                                    completeMicrosite.data.data[elem]
                                ).length
                                    ? completeMicrosite.data.data[elem]
                                    : baseLangData.data[elem],
                            }),
                            {}
                        );

                        const footerID =
                            completeMicrosite.data.data.footer_ref.id ||
                            baseLangData.data.footer_ref.id;
                        if (footerID) {
                            const customFooter = await Client(req).getByID(
                                footerID
                            );
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
                                    canonical_link:
                                        completeMicrosite.data.data
                                            .canonical_link ||
                                        completeMicrosite.data.data.page_url,
                                    logo_redirection_url: completeMicrosite.data
                                        .data.logo_redirection_url.url
                                        ? completeMicrosite.data.data
                                              .logo_redirection_url
                                        : baseLangData.data
                                              .logo_redirection_url,
                                    enable_earliest_availability:
                                        baseLangData.data
                                            .enable_earliest_availability,
                                    enable_powered_by_headout_logo: completeMicrosite
                                        .data.data
                                        .enable_powered_by_headout_logo
                                        ? completeMicrosite.data.data
                                              .enable_powered_by_headout_logo ===
                                          'Yes'
                                        : baseLangData.data
                                              .enable_powered_by_headout_logo ===
                                          'Yes',
                                    baseLangPageTitle: baseLangData.data.title,
                                },
                            },
                        };

                        return {
                            CMSContent: micrositeData,
                            ContentType: CONTENT_TYPES.MICROSITE,
                        };
                    } else {
                        const propsFromHeader = [
                            'header_links',
                            'logo',
                            'link_to_logo_file',
                            'logo_alt_text',
                            'enable_group_booking',
                            'header_links',
                            'logo_redirection_url',
                            'localization',
                            'enable_localization_menu',
                            'group_booking_disclaimer',
                        ].map(prop => `${CONTENT_TYPES.HEADER}.${prop}`);
                        const propsFromLinkedMicrosite = [
                            'gtm_id',
                            'header_scripts',
                            'title',
                            'description',
                            'image',
                            'favicon',
                            'seo_keywords',
                            'google_site_verification',
                            'bing_site_verification',
                            'canonical_link',
                            'noindex',
                            'nofollow',
                            'other_meta_tags',
                            'blackout_start_date',
                            'blackout_end_date',
                            'block_n_days_group_booking',
                            'enable_powered_by_headout_logo',
                            'group_form_blocked_days',
                        ].map(prop => `${CONTENT_TYPES.MICROSITE}.${prop}`);

                        return await Client(req)
                            .getByUID(CONTENT_TYPES.CONTENT_PAGE, uid, {
                                fetchLinks: [
                                    ...propsFromHeader,
                                    ...propsFromLinkedMicrosite,
                                ],
                                lang,
                            })
                            .then(page => {
                                if (!(page && page.data)) {
                                    return {
                                        statusCode: 404,
                                    };
                                }
                                // console.log(JSON.stringify(page, null, 4));
                                let completePage = {
                                    ...page,
                                    featured: {
                                        image: page.data.featured_image.url
                                            ? page.data.featured_image
                                            : page.data.featured_image_link,
                                        title: page.data.featured_title,
                                    },
                                    subs: {},
                                };

                                let subComponents = [];
                                page.data.footer_ref.id &&
                                    subComponents.push(page.data.footer_ref.id);
                                let SubComponentPromise = Client(req).getByIDs(
                                    subComponents
                                );

                                return Promise.all([SubComponentPromise]).then(
                                    (res: any) => {
                                        completePage.subs = res[0].results;
                                        return {
                                            CMSContent: completePage,
                                            ContentType:
                                                CONTENT_TYPES.CONTENT_PAGE,
                                        };
                                    }
                                );
                            });
                    }
                });

            if (statusCode) {
                return {
                    statusCode,
                };
            }

            if (ContentType === CONTENT_TYPES.CONTENT_PAGE) {
                return {
                    CMSContent,
                    ContentType,
                    uid,
                    lang,
                    isDev,
                    host,
                };
            }

            if (ContentType === CONTENT_TYPES.MICROSITE) {
                const MBDesign = CMSContent.data.data.design || '';
                const { items: uncategorizedToursList } = CMSContent.data.data
                    .body1[0] || { items: [] };

                const all_tours_tab_tgids =
                    CMSContent.data.data.all_tours.reduce((accum, tour) => {
                        return [...accum, tour.primary.tgid];
                    }, []) || [];

                let labelIds;
                if (all_tours_tab_tgids.length) {
                    labelIds = CMSContent.data.data.content_order.reduce(
                        (accum, label) => {
                            return [...accum, label.label.id];
                        },
                        []
                    );
                    CMSContent.data.data.labels = await Client(req)
                        .getByIDs(labelIds)
                        .then(res => {
                            return res.results;
                        });
                }

                const idsToFetchFromScorpio = uncategorizedToursList.reduce(
                    (accum, tour) => {
                        const {
                            tgid,
                            tour_title_override: title,
                            marketing_highlights_override: descriptors,
                            tour_description_override: highlights,
                        } = tour;
                        const hasHighlights = highlights.filter(
                            item => item.text
                        );
                        if (!title || !hasHighlights || !descriptors) {
                            return [...accum, tgid];
                        }
                        return accum;
                    },
                    [...initial_tgids, ...all_tours_tab_tgids]
                );

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
                const tgidToScroll = (function getScrollTgid() {
                    const pathname = req ? req.url : window.location.pathname;
                    const doesTgidExist = pathname.includes('tgid');
                    if (doesTgidExist) {
                        const tgidToScroll = pathname.split('=').pop();
                        return tgidToScroll;
                    }
                    return null;
                })();
                return {
                    CMSContent,
                    ContentType,
                    scorpioData,
                    uid,
                    lang,
                    host,
                    MBDesign,
                    isDev,
                    tgidToScroll,
                };
            }
        } catch (error) {
            console.log(error);
            return {
                statusCode: 500,
            };
        }
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
            case CONTENT_TYPES.MICROSITE + DESIGN.V2:
                Component = (
                    <MicroBrand
                        data={CMSContent.data}
                        lang={lang}
                        host={host}
                        isDev={isDev}
                        scorpioData={scorpioData}
                        serverRequestStartTimestamp={
                            serverRequestStartTimestamp
                        }
                    />
                );
                break;
            case CONTENT_TYPES.MICROSITE:
            case CONTENT_TYPES.MICROSITE + DESIGN.V1:
                Component = (
                    <Microsite
                        data={CMSContent.data}
                        scorpioData={scorpioData}
                        offerData={CMSContent.offerData}
                        host={host}
                        pathname={pathname}
                        isDev={isDev}
                        tgidToScroll={tgidToScroll}
                        serverRequestStartTimestamp={
                            serverRequestStartTimestamp
                        }
                    />
                );
                break;
            case CONTENT_TYPES.CONTENT_PAGE:
                Component = (
                    <SubPage
                        {...CMSContent}
                        isDev={isDev}
                        host={host}
                        serverRequestStartTimestamp={
                            serverRequestStartTimestamp
                        }
                    />
                );
                break;
            default:
                Component = <ErrorPage statusCode={500} />;
                break;
        }

        return (
            <EnvironmentContext.Provider
                value={{
                    isDev,
                    windowUrl,
                }}
            >
                {Component}
            </EnvironmentContext.Provider>
        );
    }
}
