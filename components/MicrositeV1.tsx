import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { scroller } from 'react-scroll';
import Header from './common/Header';
import Banner from './Banner';
import LongForm from './LongForm';
import populateHead from './common/meta';
import Footer from './common/Footer';
import sliceHandler from './Slices';
import PopulateUncategorizedProducts from './PopulateUncategorizedProducts';
import Analytics from '../utils/Analytics';
import allToursParser from '../utils/alltoursParser';
import { docCookies } from '../utils/helper';
import { DROPDOWN_ELEMENT, ANALYTICS_EVENTS } from '../constants';
import { groupSlices } from '../utils/helper';
import { ProductsContextProvider } from '../contexts/Products';

const FreeTourPopup = dynamic(() => import('./FreeTourPopup'), { ssr: false });
const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });
const MicrobrandList = dynamic(() => import('./MicrobrandsList'));

export default class MicrositeV1 extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tourPrices: [],
      currencySymbol: '',
      dropdown: {
        lang: false,
        hamburger: false,
      },
      popupOpen: false,
      showGroupBookingModal: false,
      isFetched: false,
      earliestAvailabilityQueue: [],
      isClient: false,
      analytics: new Analytics(),
      isMobile: null,
    };
  }

  async componentDidMount() {
    const isMobile = window.innerWidth < 768;
    this.setState({ isMobile });
    const { data, lang } = this.props.data;
    const { analytics } = this.state;
    const { tgidToScroll } = this.props;
    const uncategorizedTours = data.body1;
    const { baseLangPageTitle } = this.props.data.data;
    const currentLanguage = lang.substring(0, 2);
    const checkIfToursAvailable =
      uncategorizedTours.length > 0 &&
      uncategorizedTours[0].items[0].tgid != null;

    if (checkIfToursAvailable) {
      const [variantTgids, tourGroupTgids] = uncategorizedTours[0].items.reduce(
        (accum, elem) => {
          if (elem.tour_variant_id) {
            return [
              [...accum[0], { tgid: elem.tgid, tid: elem.tour_variant_id }],
              [...accum[1]],
            ];
          } else {
            return [[...accum[0]], [...accum[1], elem.tgid]];
          }
        },
        [[], []]
      );
      const allTourTgids = this.props.data.data.all_tours.reduce(
        (acc, tour) => {
          return [...acc, parseInt(tour.primary.tgid)];
        },
        []
      );
      const fetchTourGroupPrices = fetch(
        `https://api.headout.com/api/v5/tour-group/list?ids[]=${[
          ...tourGroupTgids,
          ...allTourTgids,
        ]}`
      ).then(res => {
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
        analytics.sendHsidToDataLayer({ 'h-sid': HSID });
        return res.json();
      });

      const fetchVariantPrices = variantTgids.map(tourVariant =>
        fetch(
          `https://api.headout.com/api/v5/tour-group/inventory/get/${tourVariant.tgid}`
        ).then(res => res.json())
      );

      const response = await Promise.all([
        fetchTourGroupPrices,
        ...fetchVariantPrices,
      ]).then(res => res);
      const [tourGroup, ...variants] = response;
      const currencySymbol = tourGroup.currencies.length
        ? tourGroup.currencies[0].localSymbol
        : variants[0].currency.localSymbol;
      const tourGroupPrices = tourGroup.tourGroups.reduce(
        (accum, res, index) => ({
          ...accum,
          [tourGroup.tourGroups[index].id]: {
            price: res.listingPrice ? res.listingPrice.finalPrice : '',
            scratchPrice: res.listingPrice
              ? res.listingPrice.originalPrice
              : '',
          },
        }),
        {}
      );

      const mapVariantPrices = variants.map((tourVariant: any, index) => {
        const inv = tourVariant.inventoryList.find(
          inventoryList => inventoryList.tourId == variantTgids[index].tid
        );
        return {
          tgid: variantTgids[index].tgid,
          tid: variantTgids[index].tid,
          price: inv ? inv.finalPriceProfile.persons[0].price : '',
        };
      });

      const variantPrices = mapVariantPrices.reduce(
        (accum, res, index) => ({
          ...accum,
          [mapVariantPrices[index].tgid]: {
            price: res.price || '',
          },
        }),
        {}
      );

      const tourPrices = Object.assign(tourGroupPrices, variantPrices);

      const {
        enable_earliest_availability: enableEarliestAvailability,
      } = this.props.data.data;
      const showEarliestAvailability = enableEarliestAvailability === 'Yes';

      if (showEarliestAvailability) {
        const requestQueue = uncategorizedTours[0].items.map(tour =>
          fetch(
            `https://api.headout.com/api/v5/tour-group/inventory/get/${tour.tgid}`
          )
            .then(res => res.json())
            .then(response => response)
        );
        const response = await Promise.all(requestQueue).then(res =>
          res.map(tour =>
            (tour as any).inventoryList[0]
              ? (tour as any).inventoryList[0].startDate
              : ''
          )
        );
        this.setState({ earliestAvailabilityQueue: response });
      }

      this.setState({
        tourPrices: tourPrices,
        currencySymbol: currencySymbol,
        isFetched: true,
        showEarliestAvailability,
      });
    } else {
      this.setState({
        isClient: true,
      });
    }
    if (tgidToScroll) {
      scroller.scrollTo(tgidToScroll, {
        duration: 1500,
        delay: 100,
        offset: this.state.isMobile ? -80 : -100,
        smooth: 'easeInOutQuint',
      });
    }
    analytics.sendGenericPageEvents({
      Language: currentLanguage,
      'Page Title': baseLangPageTitle,
    });
    analytics.setVariableInDataLayer({
      event: ANALYTICS_EVENTS.COLLECTION_PAGE_VIEWED,
      'Collection Type': 'Microbrand',
    });
  }

  handleDropdownToggle = (elementIdentifier, forceBool = null) => {
    switch (elementIdentifier) {
      case DROPDOWN_ELEMENT.HAMBURGER: {
        this.setState({
          ...this.state,
          dropdown: {
            ...this.state.dropdown,
            hamburger: forceBool ?? !this.state.dropdown.hamburger,
            lang: false,
          },
        });
        break;
      }
      case DROPDOWN_ELEMENT.LANGUAGE_SELECTOR: {
        this.setState({
          ...this.state,
          dropdown: {
            ...this.state.dropdown,
            lang: !this.state.dropdown.lang,
            hamburger: false,
          },
        });
        break;
      }
      default:
        return;
    }
  };

  togglePopup = () => {
    this.state.popupOpen
      ? this.setState({ popupOpen: false })
      : this.setState({ popupOpen: true });
  };

  openGroupBookingModal = () => {
    const { analytics } = this.state;
    analytics.pushToDataLayer({
      event: 'Group Form Viewed',
    });
    this.setState({ showGroupBookingModal: true });
  };
  closeGroupBookingModal = () =>
    this.setState({ showGroupBookingModal: false });

  render() {
    const { url: logoUrl } = this.props.data.data.link_to_logo_file;
    const { url: uploadedLogoUrl, alt: altText } = this.props.data.data.logo;
    const { logo_alt_text: logoAltText } = this.props.data.data;
    const { alternate_languages: alternateLanguages, refs } = this.props.data;
    const { contentFramework } = refs;
    const {
      localization,
      header_links: headerLinks,
      images: bannerImages,
      heading: bannerHeading,
      cta_text: bannerCtaText,
      page_url: pageUrl,
    } = this.props.data.data;
    const languages = localization.filter(lang => lang.language);
    const { uid } = this.props.data;
    const currentLanguage = this.props.data.lang.substring(0, 2);
    const uncategorizedTours = this.props.data.data.body1;
    const checkIfToursAvailable =
      uncategorizedTours.length > 0 &&
      uncategorizedTours[0].items[0].tgid != null;
    const uncategorizedToursList = checkIfToursAvailable
      ? uncategorizedTours[0].items
      : [];
    const uncategorizedToursHeading = checkIfToursAvailable
      ? uncategorizedTours[0].primary
      : '';

    const footerLogoURL =
      this.props.data.refs?.commonFooter?.data?.logo?.url ||
      this.props.data.data.footer_logo.url ||
      this.props.data.data.footer_logo_link?.url;

    const footerLogoAlt =
      this.props.data.refs?.commonFooter?.data?.logo?.alt ||
      this.props.data.data.footer_logo.alt ||
      this.props.data.data?.footer_logo_alt;

    const {
      book_now_text: bookNowText,
      read_more_text: readMoreText,
      show_less_text: showLessText,
      enable_powered_by_headout_logo: hasPoweredByHeadoutLogo,
    } = this.props.data.data;

    const longFormContent = this.props.data.data.body2;
    const {
      has_terms_page: hasTermsPage,
      enable_localization_menu: hasLanguageSelector,
      enable_group_booking: enableGroupBooking,
      enable_earliest_availability: enableEarliestAvailability,
      enable_buy_tickets_shortcut: enableBuyTickets,
      logo_redirection_url: logoRedirectionURL,
      blackout_start_date: blackoutStartDate,
      blackout_end_date: blackoutEndDate,
      block_n_days_group_booking: blockNDaysGroupBooking,
      minimum_pax: minimumPax,
      maximum_pax: maximumPax,
      group_form_blocked_days: blockedDays,
      group_booking_disclaimer: groupBookingDisclaimer,
    } = this.props.data.data;
    const showGroupBooking = enableGroupBooking === 'Yes';
    const { results: productOffer } = this.props.offerData
      ? this.props.offerData
      : { results: [] };
    const hasOffer = productOffer.length > 0;
    const offerPopup = hasOffer ? productOffer[0] : null;
    const {
      group_booking_excluded_tgids: groupBookingExcludedTgids,
    } = this.props.data.data;
    const { commonFooter } = this.props.data.refs;
    const microbrandCards = this.props.data.data.microbrand_cards;
    const microbrandCardsHeading = this.props.data.data.microbrand_cards_heading
      ? this.props.data.data.microbrand_cards_heading
      : null;
    const { isClient, showEarliestAvailability } = this.state;
    let groupBookingTourTitles = [];

    const { tgidToScroll } = this.props;
    const { analytics } = this.state;

    if (showGroupBooking) {
      uncategorizedToursList
        .filter(function(tour) {
          return !groupBookingExcludedTgids.find(function(excludedTour) {
            return tour.tgid === excludedTour.tgid;
          });
        })
        .forEach(tour => {
          groupBookingTourTitles.push({
            value:
              (tour.tour_title_override ||
                this.props.scorpioData[tour.tgid].title) + ` [${tour.tgid}]`,
            label:
              tour.tour_title_override ||
              this.props.scorpioData[tour.tgid].title,
          });
        });
    }

    const uncategorizedToursData = showEarliestAvailability
      ? uncategorizedToursList.map((tour, index) => ({
          ...tour,
          earliestAvailability: this.state.earliestAvailabilityQueue[index],
        }))
      : uncategorizedToursList;

    const orderedUncategorizedTours = tgidToScroll
      ? uncategorizedToursData.reduce((accum = [], item) => {
          if (item.tgid === tgidToScroll) {
            return [item, ...accum];
          } else {
            return [...accum, item];
          }
        }, [])
      : uncategorizedToursData;
    const {
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      lang,
      host,
      isDev,
      serverRequestStartTimestamp,
    } = this.props;
    const slices = contentFramework?.data?.body;
    const contentFWSlices = (slices && groupSlices(slices)) || [];
    const pricingData = {
      isFetched: this.state.isFetched,
      cardPrices: this.state.tourPrices,
      currencySymbol: this.state.currencySymbol,
    };
    const scorpioData = this.props.scorpioData;
    const CMSData = this.props.data.data;
    const allTours = allToursParser(CMSData, scorpioData, pricingData);

    return (
      <div>
        <div className="microsite-container">
          {this.state.showGroupBookingModal && (
            <GroupBooking
              closeGroupBookingModal={() => this.closeGroupBookingModal}
              groupBookingTourTitles={groupBookingTourTitles}
              blackoutStartDate={blackoutStartDate}
              blackoutEndDate={blackoutEndDate}
              blockNDaysGroupBooking={blockNDaysGroupBooking}
              minimumPax={minimumPax ? minimumPax : 10}
              maximumPax={maximumPax ? maximumPax : undefined}
              blockedDays={blockedDays || ''}
              disclaimer={groupBookingDisclaimer}
            />
          )}
          {populateHead({
            ...this.props.data.data,
            localization: languages,
            datePublished,
            dateModified,
            lang,
            isDev,
            originalHost: host,
            currentLanguage,
            serverRequestStartTimestamp,
          })}
          <Header
            languages={languages ? languages : null}
            headerLinks={headerLinks ? headerLinks : null}
            logoUrl={logoUrl || uploadedLogoUrl || null}
            logoAltText={altText || logoAltText}
            currentLanguage={currentLanguage ? currentLanguage : null}
            alternateLanguages={alternateLanguages}
            uid={uid}
            dropdown={this.state.dropdown}
            handleDropdownToggle={this.handleDropdownToggle}
            openGroupBookingModal={this.openGroupBookingModal}
            isMobile={this.state.isMobile}
            hasLanguageSelector={hasLanguageSelector}
            showGroupBooking={showGroupBooking}
            enableBuyTickets={enableBuyTickets}
            logoRedirectionURL={logoRedirectionURL.url || '/'}
            host={host}
            hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
          />
          <Banner
            bannerImages={bannerImages ? bannerImages : null}
            bannerHeading={bannerHeading ? bannerHeading : null}
            bannerCtaText={bannerCtaText ? bannerCtaText : null}
            currentLanguage={currentLanguage ? currentLanguage : null}
            isMobile={this.state.isMobile}
            boxed={true}
          />
          {checkIfToursAvailable ? (
            <PopulateUncategorizedProducts
              uncategorizedTours={orderedUncategorizedTours}
              scorpioData={this.props.scorpioData}
              uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
              tourPrices={this.state.tourPrices}
              currencySymbol={this.state.currencySymbol}
              uid={uid}
              currentLanguage={currentLanguage}
              bookNowText={bookNowText}
              readMoreText={readMoreText}
              showLessText={showLessText}
              productOffer={productOffer}
              hasOffer={hasOffer}
              isFetched={this.state.isFetched}
              togglePopup={this.togglePopup}
              pageUrl={pageUrl}
              isMobile={this.state.isMobile}
              host={host}
              analytics={analytics}
            />
          ) : null}
          {isClient ? (
            <MicrobrandList
              microbrandCards={microbrandCards}
              microbrandCardsHeading={microbrandCardsHeading}
            />
          ) : null}
          <ProductsContextProvider allTours={allTours}>
            {longFormContent ? (
              <LongForm
                content={[...longFormContent, ...contentFWSlices]}
                isMobile={this.state.isMobile}
              />
            ) : null}
            {contentFramework ? (
              <div className="content-fw-wrapper">
                {contentFramework.body?.map((slice, index) => {
                  return sliceHandler(slice);
                })}
              </div>
            ) : null}
          </ProductsContextProvider>
          <Footer
            currentLanguage={currentLanguage}
            attraction={commonFooter?.data?.attraction || 'attraction'}
            logoURL={footerLogoURL}
            logoAlt={footerLogoAlt}
            hasPoweredByHeadoutLogo={
              commonFooter?.data?.powered_by_headout || false
            }
            microbrandType={commonFooter?.data?.microbrand_type}
            slices={commonFooter?.data?.body || []}
          />
          {hasOffer && (
            <FreeTourPopup
              popupState={this.state.popupOpen}
              togglePopup={this.togglePopup}
              productOffer={offerPopup}
              scorpioData={this.props.scorpioData}
              isMobile={this.state.isMobile}
            />
          )}
        </div>
      </div>
    );
  }
}
