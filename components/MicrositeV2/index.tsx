import React, { Component } from 'react';
import { HomePage } from './views/HomePage';
import { SearchPage } from './views/SearchPage';
import { PAGETYPE, CURRENCY_SYMBOL_MAP } from '../../constants';
import { MobileProductPage } from './views/ProductPage';
import { withRouter } from 'next/router';
import populateHead from '../common/meta';
import { InteractionContextProvider } from '../../contexts/Interaction';
import { docCookies, genManualSlice } from '../../utils/helper';
import allToursParser from '../../utils/allToursParser';
import { tourListApiParser } from '../../utils/dataParsers';
class MicrositeV2 extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: props.isMobile,
      cardPrices: {},
      currencySymbol: '',
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
  sendVariableToDataLayer = (JSONObject) => {
    if (window && (window as any).dataLayer) {
      (window as any).dataLayer.push(JSONObject);
    }
  };
  componentDidMount() {
    const isMobile = window.innerWidth < 768;
    const { all_tours: allTours } = this.props.data.data;
    const allTgids = allTours.map((tour) => tour.primary.tgid);

    fetch(`https://api.headout.com/api/v5/tour-group/list?ids[]=${allTgids}`)
      .then((res) => {
        let HSID = res.headers.get('x-h-sid');
        if (!docCookies.hasItem('h-sid')) {
          const nakedDomain = window.location.host
            .replace('stage.', '')
            .split('.')
            .slice(1)
            .join('.');
          docCookies.setItem(
            'h-sid',
            HSID,
            (new Date().getTime() / 1000) * 2,
            '/',
            nakedDomain,
            false
          );
        } else {
          HSID = docCookies.getItem('h-sid');
        }
        this.sendVariableToDataLayer({ 'h-sid': HSID });
        return res.json();
      })
      .then((jsonTours) => {
        const cardPrices = tourListApiParser(jsonTours);
        const currencySymbol =
          CURRENCY_SYMBOL_MAP[jsonTours.tourGroups[0]?.listingPrice?.currency];
        this.setState({
          cardPrices: cardPrices,
          currencySymbol: currencySymbol,
          isFetched: true,
        });
      });
    // && (response.listingPrice.finalPrice > response.listingPrice.originalPrice)
    const directTgid = this.props.router.query.tgid;
    if (isMobile && directTgid) {
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

  changePage = (page) => {
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

  componentDidUpdate() {
    if (this.state.page.name == PAGETYPE.HOMEPAGE) {
      window.scrollTo(0, this.state.scrollY);
    }
  }

  render() {
    const { data: CMSContent, host, scorpioData } = this.props;
    const {
      commonFooter,
      contentFramework,
      commonHeader,
    } = this.props.data.refs;
    const {
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      lang,
      isDev,
      pathname,
      serverRequestStartTimestamp,
    } = this.props;
    const { uid: currentDomain, data: CMSData } = CMSContent;
    const { localization: languages } = CMSData;
    const currentLanguage = CMSContent.lang.substring(0, 2);
    const { isMobile } = this.state;
    const languageProps = {
      currentDomain,
      currentLanguage,
      languages,
      languageDropdown: CMSContent.data.enable_localization_menu === 'Yes',
    };

    const dropdownLinksArray = CMSData.dropdown_menu.reduce((acc, item) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    }, []);
    const headerLinks = CMSData.header_links.length
      ? CMSData.header_links
      : commonHeader?.data?.header_links || [];
    const overriddenHeaderData = { ...CMSData, ...commonHeader?.data };
    const headerProps = {
      showGroupBooking: overriddenHeaderData.enable_group_booking === 'Yes',
      hasLanguageSelector:
        overriddenHeaderData.enable_localization_menu === 'Yes',
      headerLinks,
      logoUrl:
        overriddenHeaderData.logo.url || overriddenHeaderData.link_to_logo_file,
      logoAltText:
        overriddenHeaderData.logo.alt || overriddenHeaderData.logo_alt_text,
      logoRedirectionURL: overriddenHeaderData.logo_redirection_url.url || '/',
      enableBuyTickets:
        overriddenHeaderData.enable_buy_tickets_shortcut === 'Yes',
      enableSearch: overriddenHeaderData.enable_search == 'Yes',
      recommendedTours:
        (overriddenHeaderData.search_recommend_csv &&
          overriddenHeaderData.search_recommend_csv
            .split(',')
            .map((tgid) => parseInt(tgid))) ||
        [],
      enableDropdownLinks: overriddenHeaderData.enable_dropdown == 'Yes',
      dropdownLinks: dropdownLinksArray,
      hasPoweredByHeadoutLogo:
        overriddenHeaderData.enable_powered_by_headout_logo,
    };
    // TODO: Add Interaction Field on Primic and Map it to Each Banner
    const heroProps = {
      banners: CMSData.images.reduce((accum, image) => {
        return [
          ...accum,
          {
            url: image.uploaded_image.url || image.image_src.url,
            mobile_url:
              image.mobile_banner_uploaded.url || image.mobile_banner_url.url,
            interaction: image.interaction,
            alt: image.uploaded_image.alt || image.image_alt,
          },
        ];
      }, []),
    };

    const { cardPrices, currencySymbol, isFetched, ready } = this.state;
    const pricingData = {
      cardPrices,
      currencySymbol,
      isFetched,
    };
    const allTours = allToursParser(CMSData, scorpioData, pricingData);

    const groupBooking = {
      hasGroupBooking: CMSData.enable_group_booking == 'Yes',
      excludedTourIds: CMSData.group_booking_excluded_tgids
        .filter((ele) => ele.tgid)
        .reduce((acc, tour) => {
          return [...acc, tour.tgid];
        }, []),
    };
    const tgidsOrderByPrice: any = isFetched
      ? Object.values(allTours)
          .sort((a: any, b: any) => a.price - b.price)
          .reduce((acc: any, tour: any) => {
            return [...acc, tour.tgid];
          }, [])
      : null;
    const raw_category = (CMSData.body[0] && CMSData.body[0].items) || [];
    let categories = raw_category.reduce((accum, category) => {
      let tgid_ranking = category.ranking
        .split(',')
        .map((tgid) => parseInt(tgid))
        .filter((tgid) => allTours[tgid] && allTours[tgid].available);

      return [
        ...accum,
        {
          ranking: {
            popularity: tgid_ranking,
            price: isFetched
              ? tgidsOrderByPrice.filter((tgid) => tgid_ranking.includes(tgid))
              : null,
          },
          name: category.category_name,
          image: category.category_image.url,
          rank: 0,
        },
      ];
    }, []);
    const directCategory = this.props.router.query.cat;
    if (directCategory) {
      const catRegex = new RegExp(directCategory, 'gi');
      const index = categories.findIndex((cat) => catRegex.test(cat.name));
      if (index > -1) {
        categories[index].rank = 1;
        categories = categories.sort((catA, catB) => catB.rank - catA.rank);
      }
    }
    const directTheater = this.props.router.query.theater;
    let hightlightSlice = {};
    if (directTheater) {
      const theaterNameRegex = new RegExp(directTheater, 'gi');
      const toursArray: any = Object.values(allTours);
      const tours = toursArray.filter((tour) =>
        theaterNameRegex.test(tour.content_theater)
      );
      if (tours.length) {
        // description={slice.primary.carousel_description}
        //     heading={slice.primary.carousel_heading}
        const slice = genManualSlice({
          type: 'category_carousel',
          primary: {
            carousel_heading: tours[0].content_theater,
            carousel_description: '',
            csv_tgids: tours.map((t) => t.tgid).join(','),
          },
          items: [],
        });
        hightlightSlice = slice;
      }
    }

    const categoryProps = {
      categories,
      active: 0,
    };

    const { favicon, footer_logo_link, footer_logo } = this.props.data.data;
    const heroSectionSlice = [...this.props.data.data.body4, hightlightSlice];
    const commonFooterProps = commonFooter ? commonFooter.data : null;
    const MBData = {
      footer: {
        favicon,
        logo: footer_logo.url ? footer_logo : footer_logo_link,
        ...commonFooterProps,
      },
      isMobile,
      host,
      header: {
        ...headerProps,
        headerSlices: commonHeader?.data?.body,
        languageProps,
      },
      heroProps,
      categoryProps,
      allTours,
      groupBooking,
      scorpioData,
      heroSectionSlice,
      contentFramework: contentFramework?.data,
      alertPopup: CMSContent?.data?.alert_popup,
      showCovid19Alert: CMSContent?.data.show_covid19_alert,
    };

    const directTgid = isMobile ? null : this.props.router.query.tgid;

    const longFormContent = this.props.data.data.body2;
    let activePage = this.state.page.name;

    return (
      <InteractionContextProvider {...categoryProps}>
        {populateHead({
          ...this.props.data.data,
          first_publication_date: datePublished,
          last_publication_date: dateModified,
          lang,
          originalHost: host,
          isDev,
          pathname,
          currentLanguage,
          serverRequestStartTimestamp,
        })}
        <div
          style={{
            display: activePage == PAGETYPE.HOMEPAGE ? 'block' : 'none',
          }}
        >
          <HomePage
            {...MBData}
            isMobile={this.state.isMobile}
            changePage={this.changePage}
            openCategory={this.openCategory}
            longFormContent={longFormContent}
            isFetched={isFetched}
            host={host}
            uid={currentDomain}
            directTgid={directTgid}
            ready={ready}
          />
        </div>
        {activePage == PAGETYPE.MOBILE_PRODUCT_PAGE ? (
          <MobileProductPage
            changePage={this.changePage}
            tour={allTours[this.state.page.tgid]}
            host={host}
            uid={currentDomain}
            currentLanguage={currentLanguage}
            tgid={this.state.page.tgid}
          />
        ) : null}
        {activePage == PAGETYPE.SEARCH ? (
          <SearchPage
            allTours={allTours}
            headerProps={headerProps}
            isMobile={isMobile}
            changePage={this.changePage}
          />
        ) : null}
        <style global jsx>{`
          * {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
      </InteractionContextProvider>
    );
  }
}

export default withRouter(MicrositeV2);
