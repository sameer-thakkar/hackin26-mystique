import React, { Component } from 'react';
import { HomePage } from './views/HomePage';
import { SearchPage } from './views/SearchPage';
import { PAGETYPE } from '../../constants';
import { MobileProductPage } from './views/ProductPage';
import { withRouter, Router } from 'next/router';
import populateHead from '../common/meta';
import { InteractionContextProvider } from '../../contexts/Interaction';
import { docCookies } from '../../utils/helper';
import { RichText } from 'prismic-reactjs';
import { MBContextProvider } from '../../contexts/MBContext';
class MicrositeV2 extends Component<any, any> {
  state = {
    isMobile: null,
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
  sendVariableToDataLayer = JSONObject => {
    if (window && (window as any).dataLayer) {
      (window as any).dataLayer.push(JSONObject);
    }
  };
  componentDidMount() {
    const isMobile = window.innerWidth < 768;
    const { all_tours: allTours } = this.props.data.data;
    const allTgids = allTours.map(tour => tour.primary.tgid);

    fetch(`https://api.headout.com/api/v5/tour-group/list?ids[]=${allTgids}`)
      .then(res => {
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
      .then(jsonTours => {
        const cardPrices = jsonTours.tourGroups.reduce(
          (accum, response) => ({
            ...accum,
            [response.id]: {
              price: response.listingPrice
                ? response.listingPrice.finalPrice
                : '',
              scratchPrice: response.listingPrice
                ? response.listingPrice.originalPrice
                : '',
            },
          }),
          {}
        );
        const currencySymbol = jsonTours.currencies[0].localSymbol;
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

  changePage = page => {
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
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      lang,
      isDev,
      pathname,
      serverRequestStartTimestamp,
    } = this.props;
    const {
      uid: currentDomain,
      data: CMSData,
      alternate_languages: availableLanguages,
    } = CMSContent;
    const { localization: languages } = CMSData;
    const buttons = {
      see_more_text: CMSContent.data.see_more_text,
    };
    const currentLanguage = CMSContent.lang.substring(0, 2);
    const { isMobile } = this.state;
    const languageProps = {
      currentDomain,
      currentLanguage,
      availableLanguages,
      languages,
      languageDropdown: CMSContent.data.enable_localization_menu === 'Yes',
    };

    const dropdownLinksArray = CMSData.dropdown_menu.reduce((acc, item) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    }, []);
    const headerProps = {
      showGroupBooking: CMSData.enable_group_booking === 'Yes',
      hasLanguageSelector: CMSData.enable_localization_menu === 'Yes',
      headerLinks: CMSData.header_links,
      logoUrl: CMSData.logo.url || CMSData.link_to_logo_file,
      logoAltText: CMSData.logo.alt || CMSData.logo_alt_text,
      logoRedirectionURL: CMSData.logo_redirection_url.url || '/',
      enableSearch: CMSData.enable_search == 'Yes',
      recommendedTours:
        (CMSData.search_recommend_csv &&
          CMSData.search_recommend_csv
            .split(',')
            .map(tgid => parseInt(tgid))) ||
        [],
      enableDropdownLinks: CMSData.enable_dropdown == 'Yes',
      dropdownLinks: dropdownLinksArray,
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

    const labelIDMap = CMSData.labels.reduce((accum, label) => {
      return { ...accum, [label.id]: label.data.label_name };
    }, {});

    const contentOrderLabels = CMSData.content_order.reduce((accum, label) => {
      return [
        ...accum,
        { labelID: label.label.id, globalAlign: label.alignment },
      ];
    }, []);

    const getOrderedContent = blocks => {
      let left = [],
        right = [],
        hidden = [];
      let content = blocks.reduce((accum, block) => {
        return {
          ...accum,
          [block.item_label.id]: {
            content: block.content,
            align: block.alignment,
          },
        };
      }, {});
      contentOrderLabels.forEach(label => {
        if (!content[label.labelID]) return;
        const useGLOBAL = content[label.labelID].align == 'Global';
        let block = {
          label: labelIDMap[label.labelID],
          content: content[label.labelID].content,
          align: useGLOBAL ? label.globalAlign : content[label.labelID].align,
          len: RichText.asText(content[label.labelID].content).length,
          labelId: label.labelID,
        };
        if (block.align == 'Right') right.push(block);
        else if (block.align == 'Left') left.push(block);
        else hidden.push(block);
      });
      return {
        left,
        right,
        hidden,
      };
    };

    const allTours = CMSData.all_tours.reduce((accum, tour) => {
      let tourData = tour.primary;
      const { cardPrices, currencySymbol, isFetched } = this.state;
      return {
        ...accum,
        [tourData.tgid]: {
          title:
            tourData.tour_title_override || scorpioData[tourData.tgid].title,
          highlights: scorpioData[tourData.tgid].highlights,
          descriptors:
            tourData.descriptors || scorpioData[tourData.tgid].descriptors,
          productHighlights: scorpioData[tourData.tgid].productHighlights,
          cardFooter: tourData.card_tags,
          theater: tourData.theater_name,
          contentBlocks: getOrderedContent(tour.items),
          productImage:
            tourData.product_image_override.url ||
            scorpioData[tourData.tgid].images[0]
              ? scorpioData[tourData.tgid].images[0].url
              : '',
          descriptionImage:
            tourData.description_image_override.url ||
            scorpioData[tourData.tgid].images[1]
              ? scorpioData[tourData.tgid].images[1].url
              : '',
          price: isFetched ? cardPrices[tourData.tgid].price : '',
          scratchPrice: isFetched ? cardPrices[tourData.tgid].scratchPrice : '',
          currencySymbol: isFetched ? currencySymbol : '',
          tgid: parseInt(tourData.tgid),
          images: scorpioData[tourData.tgid].images,
          averageRating: scorpioData[tourData.tgid].averageRating,
          reviewCount: scorpioData[tourData.tgid].reviewCount,
          ctaBooster: scorpioData[tourData.tgid].ctaBooster,
          description: tourData.full_description,
          available: scorpioData[tourData.tgid].available,
          overlayBooster: tourData.overlay_booster,
          vendor: tourData.vendor_name,
        },
      };
    }, {});

    const groupBooking = {
      hasGroupBooking: CMSData.enable_group_booking == 'Yes',
      excludedTourIds: CMSData.group_booking_excluded_tgids
        .filter(ele => ele.tgid)
        .reduce((acc, tour) => {
          return [...acc, tour.tgid];
        }, []),
    };
    const { isFetched, ready } = this.state;
    const tgidsOrderByPrice: any = isFetched
      ? Object.values(allTours)
          .sort((a: any, b: any) => a.price - b.price)
          .reduce((acc: any, tour: any) => {
            return [...acc, tour.tgid];
          }, [])
      : null;
    const raw_category = (CMSData.body[0] && CMSData.body[0].items) || [];
    let categories = raw_category.reduce((accum, category) => {
      let cat_id = category.category_name.replace(/\s/g, '_').toLowerCase();
      let tgid_ranking = category.ranking
        .split(',')
        .map(tgid => parseInt(tgid))
        .filter(tgid => allTours[tgid] && allTours[tgid].available);

      return [
        ...accum,
        {
          ranking: {
            popularity: tgid_ranking,
            price: isFetched
              ? tgidsOrderByPrice.filter(tgid => tgid_ranking.includes(tgid))
              : null,
          },
          name: category.category_name,
          image: category.category_image.url,
        },
      ];
    }, []);

    const categoryProps = {
      categories,
      active: 0,
    };

    const { favicon, footer_logo_link, footer_logo } = this.props.data.data;
    const { customFooter, contentFramework } = this.props.data.refs;
    const heroSectionSlice = this.props.data.data.body4;
    const customFooterProps = customFooter ? customFooter.data : null;
    const MBData = {
      footer: {
        favicon,
        logo: footer_logo.url ? footer_logo : footer_logo_link,
        ...customFooterProps,
      },
      isMobile,
      host,
      header: {
        ...headerProps,
        languageProps,
      },
      heroProps,
      categoryProps,
      allTours,
      groupBooking,
      scorpioData,
      heroSectionSlice,
      contentFramework: contentFramework?.data,
    };

    const directTgid = isMobile ? null : this.props.router.query.tgid;

    const longFormContent = this.props.data.data.body2;
    let activePage = this.state.page.name;

    return (
      <MBContextProvider uid={currentDomain} lang={lang} buttons={buttons}>
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
            svg {
              display: flex;
              align-items: center;
            }
          `}</style>
        </InteractionContextProvider>
      </MBContextProvider>
    );
  }
}

export default withRouter(MicrositeV2);
