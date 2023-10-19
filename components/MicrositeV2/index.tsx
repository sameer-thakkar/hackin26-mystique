import React, { Component, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import Conditional from 'components/common/Conditional';
import PopulateMeta from 'components/common/NextSeoMeta';
import { InteractionContextProvider } from 'contexts/Interaction';
import { getAlternateLanguages } from 'utils';
import allToursParser from 'utils/allToursParser';
import { fetchTourListV6 } from 'utils/apiUtils';
import { tourListApiParser } from 'utils/dataParsers';
import {
  checkIfBroadwayMB,
  checkIfLTTMB,
  genManualSlice,
  getLangObject,
} from 'utils/helper';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { MicrositeV2GlobalStyle } from 'const/globalStyles/micrositeV2';
import { PAGETYPE, QUERY_PARAMS, THEMES } from 'const/index';

const HomePage: ComponentType<any> = dynamic(() =>
  import(/* webpackChunkName: "HomePage" */ './views/HomePage').then(
    (mod) => mod.HomePage
  )
);
const SearchPage: ComponentType<any> = dynamic(
  () =>
    import(/* webpackChunkName: "SearchPage" */ './views/SearchPage').then(
      (mod) => mod.SearchPage
    ),
  { ssr: false }
);
const MobileProductPage: ComponentType<any> = dynamic(
  () =>
    import(
      /* webpackChunkName: "MobileProductPage" */ './views/ProductPage'
    ).then((mod) => mod.MobileProductPage),
  { ssr: false }
);

class MicrositeV2 extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isMobile: props.isMobile,
      cardPrices: {},
      isFetched: false,
      directTgid: null,
      page: {
        name: PAGETYPE.HOMEPAGE,
        activeCategory: 0,
        tgid: null,
      },
      scrollY: 0,
      ready: false,
    };
  }

  sendVariableToDataLayer = (JSONObject: any) => {
    if (window && (window as any).dataLayer) {
      (window as any).dataLayer.push(JSONObject);
    }
  };

  componentDidMount() {
    const isMobile = window.innerWidth <= 768;
    const { all_tours: allTours } = this.props.data.data;
    const allTgids = allTours.map((tour: any) => tour.primary.tgid);
    const isLTT = checkIfLTTMB(this.props.data.uid);
    const isBroadway = checkIfBroadwayMB(this.props.data.uid);
    if (allTours.length > 0) {
      fetchTourListV6({
        tgids: allTgids,
        hostname: window.location.origin,
      }).then((jsonTours) => {
        const cardPrices = tourListApiParser(jsonTours);
        this.setState({
          cardPrices: cardPrices,
          isFetched: true,
        });
      });
    } else {
      this.setState({
        cardPrices: {},
        isFetched: true,
      });
    }

    const directTgid = this.props.router.query.tgid;
    if (isMobile && directTgid && !isLTT && !isBroadway) {
      this.setState({
        page: {
          name: PAGETYPE.MOBILE_PRODUCT_PAGE,
          tgid: directTgid,
        },
      });
    }
    this.setState({
      isMobile: isMobile,
      ready: true,
    });
  }

  changePage = (page: any) => {
    const newState = { ...this.state };
    newState.page = { ...page };
    if (newState.page.name !== PAGETYPE.HOMEPAGE) {
      newState.scrollY = window.scrollY;
    }
    window.scrollTo(0, 0);
    this.setState(newState);
  };

  openCategory = (index = 0) => {
    const page = {
      activeCategory: index,
      name: PAGETYPE.CATEGORY,
    };
    this.changePage(page);
  };

  shouldComponentUpdate(nextProps: any) {
    // We have state in top-level component, any state update causes whole page to re-render
    // need to refactor break-down the logic and move it all to their relevant components.
    const { query } = this.props.router;
    const { query: updatedQuery } = nextProps.router;
    const { limit } = query;
    const { limit: updatedLimit } = updatedQuery;
    return limit === updatedLimit;
  }

  componentDidUpdate() {
    if (this.state.page.name == PAGETYPE.HOMEPAGE) {
      window.scrollTo(0, this.state.scrollY);
    }
  }

  render() {
    const {
      data: CMSContent,
      host,
      scorpioData,
      categoryTourListData,
      domainConfig,
      primaryCity,
      categoryHeaderMenu,
      isMobile,
      breadcrumbs,
    } = this.props;
    const {
      commonFooter,
      contentFramework,
      commonHeader,
      secondaryFooter,
    } = this.props.data.refs;
    const { isDev, serverRequestStartTimestamp } = this.props;
    const {
      uid,
      data: CMSData,
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      alternate_languages,
    } = CMSContent;

    const alternateLanguages = getAlternateLanguages(
      alternate_languages,
      isDev,
      host,
      uid
    );
    const isServer = typeof window === 'undefined';
    const {
      dropdown_menu: dropdownMenu,
      header_links,
      images: CMSImages,
      heading: CMSHeading,
      enable_group_booking,
      group_booking_excluded_tgids,
      body: CMSBody,
      baseLangIsPoiMb,
      baseLangBannerAndFooterCombinations,
      baseLangCategorisationMetadata,
    } = CMSData || {};
    const {
      tagged_city: taggedCity,
      tagged_category: taggedCategoryName,
      tagged_sub_category: taggedSubCategoryName,
      tagged_mb_type: taggedMbType,
    } = (baseLangCategorisationMetadata as TCategorisationMetadata) || {};
    const currentLanguage = getLangObject(CMSContent.lang).code;
    const languageProps = {
      uid,
      currentLanguage,
      languages: alternateLanguages,
    };

    const dropdownLinksArray = dropdownMenu.reduce((acc: any, item: any) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    }, []);

    const headerLinks = header_links?.length
      ? header_links
      : commonHeader?.data?.header_links || [];
    const overriddenHeaderData = { ...CMSData, ...commonHeader?.data };
    const headerProps = {
      showGroupBooking: overriddenHeaderData.enable_group_booking === 'Yes',
      headerLinks,
      logoRedirectionURL:
        getLogoRedirectionUrl({ uid, lang: currentLanguage, isDev, host }) ||
        '/',
      enableBuyTickets:
        overriddenHeaderData.enable_buy_tickets_shortcut === 'Yes',
      enableSearch: overriddenHeaderData.enable_search == 'Yes',
      recommendedTours:
        (overriddenHeaderData.search_recommend_csv &&
          overriddenHeaderData.search_recommend_csv
            .split(',')
            .map((tgid: any) => parseInt(tgid))) ||
        [],
      enableDropdownLinks: overriddenHeaderData.enable_dropdown == 'Yes',
      dropdownLinks: dropdownLinksArray,
    };

    const { cardPrices, isFetched, ready } = this.state;
    const pricingData = {
      cardPrices,
      isFetched,
    };

    const groupBooking = {
      hasGroupBooking: enable_group_booking == 'Yes',
      excludedTourIds: group_booking_excluded_tgids
        .filter((ele: any) => ele.tgid)
        .reduce((acc: any, tour: any) => {
          return [...acc, tour.tgid];
        }, []),
    };

    const hasCategoryTourList = categoryTourListData
      ? Object.keys(categoryTourListData)?.length > 1 &&
        CMSBody?.filter((body: any) => body.slice_type === 'tour_list_category')
          ?.length > 0
      : false;
    let tourListCategorySortBy,
      tourListCategories,
      tourListCategoryAllTours = {};

    // Category Tour List carousel
    if (hasCategoryTourList) {
      const tourListSlice = CMSBody?.filter(
        (body: any) => body.slice_type === 'tour_list_category'
      )?.reduce((acc: any, curr: any) => acc + curr);
      tourListCategorySortBy = tourListSlice?.primary?.disable_sort_selector;
      tourListCategories = tourListSlice?.items?.map((item: any) => {
        const {
          collection,
          category,
          sub_category,
          exclude_tgids,
          category_name,
          max_price_filter,
          cta_url,
        } = item || {};
        const re = /\s*(?:,)\s*/g;
        const excludedTgids = exclude_tgids
          ? exclude_tgids?.replace(/\\n/g, '')?.split(re).map(Number)
          : [];

        const maxPrice = max_price_filter || Number.MAX_VALUE;
        const tgidData =
          categoryTourListData[collection] ||
          categoryTourListData[category] ||
          categoryTourListData[sub_category];

        const filteredData = tgidData?.filter((product: any) => {
          const { tgid, primaryCategory, primarySubCategory, price } =
            product || {};
          if (collection) {
            if (category) {
              return (
                !excludedTgids.includes(tgid) &&
                primaryCategory?.id === category &&
                price <= maxPrice
              );
            } else if (sub_category) {
              return (
                !excludedTgids.includes(tgid) &&
                primarySubCategory?.id === sub_category &&
                price <= maxPrice
              );
            } else {
              return !excludedTgids.includes(tgid) && price <= maxPrice;
            }
          } else if (category && sub_category) {
            return (
              !excludedTgids.includes(tgid) &&
              primarySubCategory?.id === sub_category &&
              price <= maxPrice
            );
          } else {
            return !excludedTgids.includes(tgid) && price <= maxPrice;
          }
        });
        let tgids, prices;
        if (filteredData?.length) {
          tgids = filteredData?.map((d: any) => d?.tgid);
          prices = filteredData
            ?.sort((a: any, b: any) => {
              return a?.listingPrice?.finalPrice - b?.listingPrice?.finalPrice;
            })
            ?.map((data: any) => data?.tgid);
        }

        tgidData?.forEach((data: any) => {
          const { tgid } = data;
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          tourListCategoryAllTours[tgid] = data;
        });
        return {
          id: collection || category || sub_category,
          name: category_name,
          image:
            category?.category_image_url?.url || category?.category_image?.url,
          ctaUrl: cta_url,
          rank: 0,
          ranking: {
            popularity: tgids?.length ? tgids : [],
            price: prices?.length ? prices : [],
          },
          sliceData: {
            collectionId: collection,
            primaryCatId: category,
            primarySubCatId: sub_category,
          },
        };
      });
    }

    const allTours = hasCategoryTourList
      ? tourListCategoryAllTours
      : allToursParser(CMSData, scorpioData, pricingData);
    const tgidsOrderByPrice: any = isFetched
      ? Object.values(allTours)
          .sort(
            (a: any, b: any) =>
              a.listingPrice?.finalPrice - b.listingPrice?.finalPrice
          )
          .reduce((acc: any, tour: any) => {
            return [...acc, tour.tgid];
          }, [])
      : null;

    const uncategorizedTours = CMSBody?.filter(
      (body: any) => body.slice_type === 'csv_ranking'
    );

    const rawCategory = uncategorizedTours?.length
      ? uncategorizedTours?.reduce((acc: any, curr: any) => acc + curr)
      : {};

    const raw_category = (rawCategory && rawCategory?.items) || [];
    const hideSortBySelector =
      rawCategory.primary?.disable_sort_selector || false;
    let categories;

    if (!hasCategoryTourList) {
      categories = raw_category?.reduce((accum: any, category: any) => {
        let tgid_ranking = category.ranking
          ?.split(',')
          ?.map((tgid: any) => parseInt(tgid))
          ?.filter((tgid: any) => allTours[tgid] && allTours[tgid].available);

        return [
          ...accum,
          {
            ranking: {
              popularity: tgid_ranking,
              price: isFetched
                ? tgidsOrderByPrice?.filter((tgid: any) =>
                    tgid_ranking?.includes(tgid)
                  )
                : null,
            },
            name: category?.category_name,
            image: category?.category_image?.url,
            rank: 0,
          },
        ];
      }, []);
    } else {
      categories = tourListCategories;
    }

    const directCategory = this.props.router.query[QUERY_PARAMS.CATEGORY];
    if (isServer && directCategory) {
      const catRegex = new RegExp(directCategory, 'gi');
      const index = categories.findIndex((cat: any) => catRegex.test(cat.name));
      if (index > -1) {
        categories[index].rank = 1;
        // categories = categories.sort((catA, catB) => catB.rank - catA.rank);
      }
    }
    const directTheater = this.props.router.query.theater;
    let hightlightSlice = {};
    if (isServer && directTheater) {
      const theaterNameRegex = new RegExp(directTheater, 'gi');
      const toursArray: any = Object.values(allTours);
      const tours = toursArray.filter((tour: any) =>
        theaterNameRegex.test(tour.content_theater)
      );
      if (tours.length) {
        const slice = genManualSlice({
          type: 'category_carousel',
          primary: {
            carousel_heading: tours[0].content_theater,
            carousel_description: '',
            csv_tgids: tours.map((t: any) => t.tgid).join(','),
          },
          items: [],
        });
        hightlightSlice = slice;
      }
    }

    const categoryProps = {
      categories,
      active: 0,
      hideSortBySelector: hasCategoryTourList
        ? tourListCategorySortBy
        : hideSortBySelector,
    };

    const {
      theme_override,
      is_entertainment_mb: isEntertainmentMb,
    } = this.props.data.data;

    const [listicleContent] = this.props.data.data.body;
    const { primary } = listicleContent || {};

    const {
      islisticle: isListicle,
      csv_months_to_display_for_listicle: displayMonths,
    } = primary || {};

    const heroSectionSlice = [...this.props.data.data.body4, hightlightSlice];
    const commonFooterProps = commonFooter ? commonFooter.data : null;
    let themeOverride = theme_override || THEMES.INHERIT;
    themeOverride =
      themeOverride === THEMES.INHERIT
        ? commonFooterProps?.theme_override
        : themeOverride;
    const { disclaimer } = this.props.data.data;

    const heroProps = {
      banners: CMSImages.reduce((accum: any, image: any) => {
        return [
          ...accum,
          {
            url: image.uploaded_image.url || image.image_src.url,
            mobile_url:
              image.mobile_banner_uploaded?.url ||
              image.mobile_banner_url?.url ||
              '',
            interaction: image.interaction,
            alt: image.uploaded_image.alt || image.image_alt_,
            showPageUrl: image.onclick_url,
            bannerHeading: image.main_heading,
            bannerSubText: image.sub_text,
            desktopVideoLink: image?.desktop_video_link?.url,
            mobileVideoLink: image?.mobile_video_link?.url,
          },
        ];
      }, []),
      coverHeading: CMSHeading,
    };

    const MBData = {
      footer: {
        themeOverride: themeOverride || THEMES.INHERIT,
        disclaimer,
        ...commonFooterProps,
        secondaryFooter,
      },
      isMobile,
      isEntertainmentMb,
      host,
      header: {
        ...headerProps,
        headerSlices: commonHeader?.data?.body,
        languageProps,
      },
      heroProps,
      categoryProps,
      allTours: allTours,
      groupBooking,
      hasCategoryTourList,
      categoryTourListData,
      scorpioData,
      heroSectionSlice,
      contentFramework: contentFramework?.data,
      alertPopup: CMSContent?.data?.alert_popup,
      showCovid19Alert: CMSContent?.data.show_covid19_alert,
      domainConfig,
      mbDesign: CMSContent?.data?.design,
      mbType: CMSContent?.data?.tagged_mb_type,
      primaryCity,
      taggedCity,
      taggedCategoryName,
      taggedSubCategoryName,
      taggedMbType,
      categoryHeaderMenu,
      baseLangIsPoiMb,
      baseLangBannerAndFooterCombinations,
      alternateLanguages,
      breadcrumbs,
    };

    const isLTT = checkIfLTTMB(this.props.data.uid);
    const directTgid = this.props.router.query.tgid;
    const longFormContent = this.props.data.data.body2;
    let activePage = this.state.page.name;
    const breadcrumbsDetails = {
      breadcrumbs,
      taggedCity,
      primaryCity,
    };

    return (
      <InteractionContextProvider
        {...categoryProps}
        queryCategory={directCategory}
        directTgid={Number(directTgid)}
      >
        <MicrositeV2GlobalStyle />
        <PopulateMeta
          {...{
            prismicData: CMSData,
            datePublished,
            dateModified,
            serverRequestStartTimestamp,
            languages: alternateLanguages,
            isMobile: this.state.isMobile,
            bannerImages: heroProps?.banners,
            faviconUrl: domainConfig?.faviconUrl,
            logoUrl: domainConfig?.logo?.logoUrl,
            breadcrumbsDetails,
          }}
        />

        <div
          style={{
            display: activePage == PAGETYPE.HOMEPAGE ? 'block' : 'none',
          }}
        >
          <HomePage
            {...MBData}
            isMobile={isMobile}
            changePage={this.changePage}
            openCategory={this.openCategory}
            longFormContent={longFormContent}
            isFetched={isFetched}
            host={host}
            uid={uid}
            directTgid={directTgid}
            ready={ready}
            isListicle={isListicle}
            displayMonths={displayMonths}
            isDev={isDev}
          />
        </div>
        <Conditional if={activePage == PAGETYPE.MOBILE_PRODUCT_PAGE}>
          <MobileProductPage
            changePage={this.changePage}
            tour={allTours[this.state.page.tgid]}
            host={host}
            uid={uid}
            currentLanguage={currentLanguage}
            tgid={this.state.page.tgid}
            isEntertainmentMb={isEntertainmentMb}
            hasCategoryTourList={hasCategoryTourList}
          />
        </Conditional>
        <Conditional if={activePage == PAGETYPE.SEARCH}>
          <SearchPage
            allTours={allTours}
            headerProps={headerProps}
            isMobile={isMobile}
            changePage={this.changePage}
            currentLanguage={currentLanguage}
            isLTT={isLTT}
          />
        </Conditional>
      </InteractionContextProvider>
    );
  }
}

export default withRouter(MicrositeV2);
