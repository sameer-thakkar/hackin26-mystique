import React, { Component } from 'react';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import Header from './common/Header';
import Banner from './Banner';
import LongForm from './common/LongForm';
import PopulateHead from './common/meta';
import Footer from './common/Footer';
import PopulateUncategorizedProducts from './PopulateUncategorizedProducts';
import Analytics from '../utils/analytics';
import allToursParser from '../utils/allToursParser';
import Alert from './UI/Alert';
import * as labels from '../constants/localization/labels';
import DismissAlert from './UI/DismissAlert';
import { InteractionContextProvider } from '../contexts/Interaction';
import { docCookies, csvTgidToArray, getLangObject } from '../utils/helper';
import {
  DROPDOWN_ELEMENT,
  ANALYTICS_EVENTS,
  ALLOW_IMMEDIEATE_NESTING,
  THEMES,
} from '../constants';
import { groupSlices } from '../utils/helper';
import { ProductsContextProvider } from '../contexts/Products';
import { tourListApiParser } from '../utils/dataParsers';
import SafeDFBannerWrapper from 'UI/SafeDFBannerWrapper';
import { isSafetyIncluded, getDFValidityFromTags } from 'utils';
import TextBanner from './TextBanner';
import Conditional from './common/Conditional';
import { ResponsiveSelector } from './MicrositeV2/ResponsiveSelector';
import { LOCATION } from 'assets/SvgIcons';

const FreeTourPopup = dynamic(() => import('./FreeTourPopup'), { ssr: false });
const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });
const MicrobrandList = dynamic(() => import('./MicrobrandsList'));

const CoverSlicesWrapper = styled.div`
  margin-bottom: 32px;
`;

export default class MicrositeV1 extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tourPrices: [],
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
      isMobile: props.isMobile,
      covid19AlertOpen: true,
    };
  }

  async componentDidMount() {
    const isMobile = window.innerWidth < 768;
    this.setState({ isMobile });
    const { data, lang } = this.props.data;
    const { analytics } = this.state;
    const { tgidToScroll, toursList } = this.props;
    const uncategorizedTours = data.body1;
    const { baseLangPageTitle } = this.props.data.data;
    const currentLanguage = getLangObject(lang).short;
    const allTourTgids = this.props.data.data.all_tours.reduce((acc, tour) => {
      return [...acc, parseInt(tour.primary.tgid)];
    }, []);
    const checkIfToursAvailable = toursList.length > 0;
    const hasAllTours = allTourTgids.length > 0;

    if (checkIfToursAvailable || hasAllTours) {
      const variantTgids = toursList
        .filter((t) => t.tgid && t.tid)
        .map((t) => ({ tgid: t.tgid, tid: t.tid }));
      const tourGroupTgids = toursList
        .filter((t) => t.tgid && !t.tid)
        .map((t) => t.tgid);

      const fetchTourGroupPrices = fetch(
        `/api/tours/v5/tour-group/list?ids[]=${[
          ...tourGroupTgids,
          ...allTourTgids,
        ]}`
      ).then((res) => {
        const HSID = docCookies.getItem('h-sid');
        analytics.sendHsidToDataLayer({ 'h-sid': HSID });
        return res.json();
      });

      const fetchVariantPrices = variantTgids.map((tourVariant) =>
        fetch(
          `/api/tours/v5/tour-group/inventory/get/${tourVariant.tgid}?for-days=2`
        ).then((res) => res.json())
      );

      const response = await Promise.all([
        fetchTourGroupPrices,
        ...fetchVariantPrices,
      ]).then((res) => res);
      const [tourGroup, ...variants] = response;
      const tourGroupPrices = tourListApiParser(tourGroup);

      const mapVariantPrices = variants.map((tourVariant: any, index) => {
        const inv = tourVariant.inventoryList.find(
          (inventoryList) => inventoryList.tourId == variantTgids[index].tid
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
        const requestQueue = uncategorizedTours[0].items.map((tour) =>
          fetch(`/api/tours/v5/tour-group/inventory/get/${tour.tgid}`)
            .then((res) => res.json())
            .then((response) => response)
        );
        const response = await Promise.all(requestQueue).then((res) =>
          res.reduce((acc: any, tour: any, index) => {
            const tgid = uncategorizedTours[0].items[index].tgid;
            return {
              ...acc,
              [tgid]: tour?.inventoryList?.[0]?.startDate || '',
            };
          }, {})
        );
        this.setState({ earliestAvailabilityQueue: response });
      }
      this.setState({
        tourPrices: tourPrices,
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

  handleClose = () => {
    this.setState({ covid19AlertOpen: false });
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
    const { toursList } = this.props;
    const { refs } = this.props.data;
    const { contentFramework } = refs;
    const {
      localization,
      images: bannerImages,
      heading: bannerHeading,
      cta_text: bannerCtaText,
      page_url: pageUrl,
      auto_banner: autoBanner,
      hide_banner_cta: hideBannerCTA,
      banner_limit: bannerLimit,
    } = this.props.data.data;
    const languages = localization.filter((lang) => lang.language);
    const { uid } = this.props.data;
    const currentLanguage = getLangObject(this.props.data.lang).short;
    const uncategorizedTours = this.props.data.data.body1;
    const tourRanking = uncategorizedTours[0]?.primary?.ranking;
    const checkIfToursAvailable = toursList.length > 0;
    const uncategorizedToursList = toursList;
    const uncategorizedToursHeading = checkIfToursAvailable
      ? uncategorizedTours[0].primary
      : '';

    const footerLogoURL =
      this.props.data.refs?.commonFooter?.data?.logo?.url ||
      this.props.data.data.footer_logo.url ||
      this.props.data.data.footer_logo_link?.url;
    const footerPoweredByHeadout =
      this.props.data.data.powered_by_superbrand ||
      this.props.data.refs?.commonFooter?.data?.powered_by_superbrand ||
      false;

    const footerLogoAlt =
      this.props.data.refs?.commonFooter?.data?.logo?.alt ||
      this.props.data.data.footer_logo.alt ||
      this.props.data.data?.footer_logo_alt;
    let footerThemeOverride =
      this.props.data.refs?.commonFooter?.data?.theme_override ||
      THEMES.INHERIT;
    footerThemeOverride = this.props.data.data.theme_override || THEMES.INHERIT;

    const { commonHeader } = this.props.data.refs;
    const withCommonHeaderOverrides = {
      ...this.props.data.data,
      ...commonHeader?.data,
    };
    let {
      link_to_logo_file: linkedLogo,
      body2: longFormContent,
      logo: uploadedLogo,
      logo_alt_text: logoAltText,
      book_now_text: bookNowText,
      read_more_text: readMoreText,
      show_less_text: showLessText,
      enable_powered_by_superbrand_logo: hasPoweredByHeadoutLogo,
      enable_localization_menu: hasLanguageSelector,
      enable_group_booking: enableGroupBooking,
      enable_buy_tickets_shortcut: enableBuyTickets,
      logo_redirection_url: logoRedirectionURL,
      blackout_start_date: blackoutStartDate,
      blackout_end_date: blackoutEndDate,
      block_n_days_group_booking: blockNDaysGroupBooking,
      minimum_pax: minimumPax,
      maximum_pax: maximumPax,
      group_form_blocked_days: blockedDays,
      group_booking_disclaimer: groupBookingDisclaimer,
      body: headerSlices,
      header_links: headerLinks,
      enable_dropdown: enableDropdownLinks,
      dropdown_menu,
    } = withCommonHeaderOverrides;
    const { url: logoUrl } = linkedLogo;
    const { url: uploadedLogoUrl, alt: altText } = uploadedLogo;
    const dropdownLinks =
      dropdown_menu?.reduce((acc, item) => {
        if (item.link)
          return [...acc, { value: item.link.url, label: item.link_text }];
        else return acc;
      }, []) || [];
    const hasDropdownLinks =
      enableDropdownLinks === 'Yes' && dropdownLinks.length;

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

    const { tgidToScroll, mbTheme } = this.props;
    const { analytics } = this.state;

    let alertPopup = null;
    if (this.props.data?.data?.alert_popup?.id) {
      alertPopup = this.props.data.data.alert_popup;
    }

    if (showGroupBooking) {
      uncategorizedToursList
        .filter(function (tour) {
          return !groupBookingExcludedTgids.find(function (excludedTour) {
            return tour.tgid === excludedTour.tgid;
          });
        })
        .forEach((tour) => {
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
      ? uncategorizedToursList.map((tour) => ({
          ...tour,
          earliestAvailability: this.state.earliestAvailabilityQueue[tour.tgid],
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
    };
    const showCovid19Alert = this.props.data?.data?.show_covid19_alert;
    const scorpioData = this.props.scorpioData;
    const CMSData = this.props.data.data;
    const allTours = allToursParser(CMSData, scorpioData, pricingData);

    let finalBannerImages = bannerImages.map((banner) => {
      return {
        url: banner.image_src.url || banner.uploaded_image.url,
        alt: banner.image_alt || banner.uploaded_image.alt,
        mobileUrl:
          banner.mobile_banner_url.url || banner.mobile_banner_uploaded.url,
      };
    });
    if (autoBanner) {
      const tgidArray = csvTgidToArray(tourRanking);
      finalBannerImages = tgidArray
        .map((tgid) => {
          let tour = scorpioData[tgid];
          if (tour)
            return {
              url: `https:${tour.images[0]?.url}`,
              alt: `https:${tour.images[0]?.alt}`,
            };
        })
        .slice(0, bannerLimit || orderedUncategorizedTours.length);
    }

    const coverSlices = this.props.data.data.body4;
    const tours = scorpioData || {};
    const hasSafe = Object.values(tours).some((tour: any) =>
      isSafetyIncluded(tour.allTags)
    );
    const dfTours = Object.values(tours).filter(
      (tour: any) => tour && tour.dfListingPrice
    );
    const [dfExpiryDate, ..._otherValidity] = dfTours
      .map((tour: any) => getDFValidityFromTags(tour.allTags))
      .filter((d) => d)
      .sort((a, b) => (dayjs(a).isAfter(b) ? -1 : 1));

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
              isMobile={this.state.isMobile}
              disclaimer={groupBookingDisclaimer}
              theme={mbTheme}
            />
          )}
          <PopulateHead
            {...{
              ...this.props.data.data,
              localization: languages,
              datePublished,
              dateModified,
              lang,
              isDev,
              originalHost: host,
              currentLanguage,
              serverRequestStartTimestamp,
              mbTheme,
            }}
          />
          <Header
            languages={languages ? languages : null}
            headerLinks={headerLinks ? headerLinks : null}
            logoUrl={logoUrl || uploadedLogoUrl || null}
            logoAltText={altText || logoAltText}
            currentLanguage={currentLanguage ? currentLanguage : null}
            uid={uid}
            dropdown={this.state.dropdown}
            handleDropdownToggle={this.handleDropdownToggle}
            openGroupBookingModal={this.openGroupBookingModal}
            isMobile={this.state.isMobile}
            hasLanguageSelector={hasLanguageSelector}
            showGroupBooking={showGroupBooking}
            enableBuyTickets={enableBuyTickets}
            logoRedirectionURL={logoRedirectionURL?.url || pageUrl}
            host={host}
            hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
            slices={groupSlices(headerSlices || [], ALLOW_IMMEDIEATE_NESTING)}
            dropdownLinks={dropdownLinks}
            hasDropdownLinks={hasDropdownLinks}
          />
          {showCovid19Alert && this.state.covid19AlertOpen ? (
            <DismissAlert
              readMoreLink={labels[currentLanguage].COVID19_ALERT.LINK}
              readMore={labels[currentLanguage].READ_MORE}
              keyText={labels[currentLanguage].COVID19_ALERT.KEY_TEXT}
              text={labels[currentLanguage].COVID19_ALERT.TEXT}
              handleClose={this.handleClose}
            />
          ) : null}
          {this.state.isMobile && hasDropdownLinks ? (
            <div className="main-wrapper city-selector">
              <ResponsiveSelector
                options={dropdownLinks}
                host={host}
                isMobile={this.state.isMobile}
                onChange={(option) => {
                  window.location.href = option.value;
                }}
                iconPosition={'left'}
                icon={LOCATION}
                addPadding={true}
                toggleIcon={false}
              />
            </div>
          ) : null}
          <Conditional if={mbTheme !== THEMES.MIN_BLUE}>
            <Banner
              bannerImages={finalBannerImages ? finalBannerImages : null}
              bannerHeading={bannerHeading ? bannerHeading : null}
              bannerCtaText={bannerCtaText ? bannerCtaText : null}
              currentLanguage={currentLanguage ? currentLanguage : null}
              isMobile={this.state.isMobile}
              boxed={true}
              hideCTA={hideBannerCTA}
              dfExpiryDate={dfExpiryDate || null}
              cooldownDate={dayjs().add(30, 'day')}
            />
          </Conditional>
          <Conditional if={mbTheme === THEMES.MIN_BLUE}>
            <TextBanner bannerHeading={bannerHeading ? bannerHeading : null} />
          </Conditional>
          {alertPopup ? (
            <Alert
              popupUID={alertPopup.uid}
              currentLanguage={currentLanguage}
            />
          ) : null}
          {coverSlices.length ? (
            <CoverSlicesWrapper>
              <LongForm content={coverSlices} isMobile={this.state.isMobile} />
            </CoverSlicesWrapper>
          ) : null}
          <SafeDFBannerWrapper hasSafe={hasSafe} dfExpiryDate={dfExpiryDate} />
          {checkIfToursAvailable ? (
            <PopulateUncategorizedProducts
              uncategorizedTours={orderedUncategorizedTours}
              scorpioData={this.props.scorpioData}
              uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
              tourPrices={this.state.tourPrices}
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
              ranking={tourRanking}
              mbTheme={mbTheme}
              allToursTabContent={allTours}
            />
          ) : null}
          <Conditional
            if={
              isClient &&
              microbrandCards?.filter((mbCard) => mbCard.microbrand_link)
                ?.length
            }
          >
            <MicrobrandList
              microbrandCards={microbrandCards}
              microbrandCardsHeading={microbrandCardsHeading}
            />
          </Conditional>
          <ProductsContextProvider
            allTours={allTours}
            ready={this.state.isFetched}
          >
            <InteractionContextProvider>
              {longFormContent ? (
                <LongForm
                  content={[...longFormContent, ...contentFWSlices]}
                  isMobile={this.state.isMobile}
                />
              ) : null}
            </InteractionContextProvider>
          </ProductsContextProvider>
          <Footer
            currentLanguage={currentLanguage}
            attraction={commonFooter?.data?.attraction || 'attraction'}
            logoURL={footerLogoURL}
            logoAlt={footerLogoAlt}
            hasPoweredByHeadoutLogo={footerPoweredByHeadout}
            showDisclaimer={commonFooter?.data?.show_disclaimer}
            disclaimerText={commonFooter?.data?.disclaimer_text}
            microbrandType={commonFooter?.data?.microbrand_type}
            slices={commonFooter?.data?.body || []}
            invertLogoColor={commonFooter?.data?.invert_logo_color}
            themeOverride={footerThemeOverride}
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
