import React, { Component } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Header from './common/Header';
import sliceHandler from './Slices';
import Footer from './common/Footer';
import Masthead from './Masthead';
import populateHead from './common/meta';
import Alert from './UI/Alert';
import DismissAlert from './UI/DismissAlert';
import * as labels from '../public/static/localization/labels';
import { Client } from '../prismic-config';
import { DROPDOWN_ELEMENT } from '../constants';
import { groupSlices } from '../utils/helper';

const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });

export default class ContentPage extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showGroupBookingModal: false,
      groupBookingTourTitles: null,
      dropdown: {
        lang: false,
        hamburger: false,
      },
      isMobile: false,
      covid19AlertOpen: true,
    };
  }
  async componentDidMount() {
    const {
      enable_group_booking: enableGroupBooking,
    } = this.props.data.header_ref.data;
    this.setState({ isMobile: window.innerWidth < 768 });
    if (enableGroupBooking === 'Yes') {
      let groupBookingTourTitles = [];
      let res = await Client().getByIDs([
        this.props.data.microsite_document_ref.id,
      ]);
      const {
        group_booking_excluded_tgids: groupBookingExcludedTgids,
        body1,
      } = res.results[0].data;
      let lang = this.props.data.microsite_document_ref.lang.split('-')[0];
      let tours = body1[0].items || [];
      let filteredTours = tours.filter(function(tour) {
        return !groupBookingExcludedTgids.find(function(excludedTour) {
          return tour.tgid === excludedTour.tgid;
        });
      });

      filteredTours.map(async (tour, index) => {
        if (!tour.tour_title_override) {
          let tourTitle = await fetch(
            `https://api.headout.com/api/v5/tour-group/get/${tour.tgid}?language=${lang}`
          ).then(r => r.json());
          groupBookingTourTitles.push({
            value: tourTitle.name + ` [${tour.tgid}]`,
            label: tourTitle.name,
          });
        } else {
          groupBookingTourTitles.push({
            value: tour.tour_title_override + ` [${tour.tgid}]`,
            label: tour.tour_title_override,
          });
        }
      });
      this.setState({
        groupBookingTourTitles,
      });
    }
  }

  openGroupBookingModal = () => this.setState({ showGroupBookingModal: true });
  closeGroupBookingModal = () =>
    this.setState({ showGroupBookingModal: false });

  handleClose = () => {
    this.setState({ covid19AlertOpen: false });
  };

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

  render() {
    const { groupBookingTourTitles } = this.state;
    const {
      featured,
      data,
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      lang,
      isDev,
      serverRequestStartTimestamp,
      alternate_languages,
      uid,
      host,
    } = this.props;
    const {
      footer_ref: commonFooter,
      header_ref: commonHeader,
      content_framework: contentFramework,
      body,
      microsite_document_ref,
    } = data;

    const CFWBody = contentFramework?.data?.body;
    const contentFWSlices = groupSlices(CFWBody || []);

    // Data extraction for populating head
    const contentPageHasOtherMetaTags = data.other_meta_tags.filter(
      ({ meta_tag }) => meta_tag
    );
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
    ];
    const objKeys = ['image', 'other_meta_tags'];
    const strValues = strKeys.reduce(
      (acc, elem) => ({
        ...acc,
        [elem]: this.props.data[elem] || microsite_document_ref.data[elem],
      }),
      {}
    );
    const objValues = objKeys.reduce(
      (acc, elem) => ({
        ...acc,
        [elem]: Object.keys(this.props.data[elem]).length
          ? this.props.data[elem]
          : microsite_document_ref.data[elem],
      }),
      {}
    );
    const micrositeData = {
      ...this.props.data,
      ...strValues,
      ...objValues,
    };
    const headProps = {
      ...micrositeData,
      favicon: microsite_document_ref.data.favicon,
      header_scripts: microsite_document_ref.data.header_scripts,
      canonical_link:
        this.props.data.canonical_link || this.props.data.page_url,
      other_meta_tags: contentPageHasOtherMetaTags
        ? this.props.data.other_meta_tags
        : microsite_document_ref.other_meta_tags,
      faq_schema: this.props.data.faq_schema,
    };

    const {
      enable_group_booking: enableGroupBooking,
      logo_redirection_url: logoRedirectionURL,
      group_booking_disclaimer: groupBookingDisclaimer,
      localization,
      enable_localization_menu,
      logo,
      logo_alt_text: logoAltText,
      header_links: headerLinks,
    } = commonHeader.data;

    const {
      blackout_start_date: blackoutStartDate,
      blackout_end_date: blackoutEndDate,
      block_n_days_group_booking: blockNDaysGroupBooking,
      minimum_pax: minimumPax,
      maximum_pax: maximumPax,
      group_form_blocked_days: blockedDays,
      enable_powered_by_headout_logo: hasPoweredByHeadoutLogo,
      page_url: pageUrl,
      alert_popup: alertPopup,
      show_covid19_alert: showCovid19Alert,
    } = microsite_document_ref.data;

    const showGroupBooking = enableGroupBooking === 'Yes';
    const currentLanguage = lang.split('-')[0];

    return (
      <div className="page-wrapper">
        {this.state.showGroupBookingModal && groupBookingTourTitles && (
          <GroupBooking
            closeGroupBookingModal={() => this.closeGroupBookingModal}
            groupBookingTourTitles={groupBookingTourTitles}
            blackoutStartDate={blackoutStartDate}
            blackoutEndDate={blackoutEndDate}
            blockNDaysGroupBooking={blockNDaysGroupBooking}
            minimumPax={minimumPax ? minimumPax : 10}
            maximumPax={maximumPax ? minimumPax : undefined}
            blockedDays={blockedDays || ''}
            disclaimer={groupBookingDisclaimer}
          />
        )}
        {populateHead({
          ...headProps,
          datePublished,
          dateModified,
          lang,
          isDev,
          originalHost: host,
          serverRequestStartTimestamp,
          localization,
          currentLanguage,
        })}
        <Header
          languages={localization}
          headerLinks={headerLinks}
          currentLanguage={currentLanguage}
          logoUrl={logo.url}
          logoAltText={logoAltText || logo.alt || ''}
          alternateLanguages={alternate_languages}
          uid={uid}
          dropdown={this.state.dropdown}
          handleDropdownToggle={this.handleDropdownToggle}
          isMobile={this.state.isMobile}
          showGroupBooking={showGroupBooking}
          hasLanguageSelector={enable_localization_menu}
          logoRedirectionURL={logoRedirectionURL?.url || pageUrl}
          host={host}
          hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
          openGroupBookingModal={this.openGroupBookingModal}
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
        <main
          className={classNames({
            'content-wrapper': !featured.image.url,
          })}
        >
          {featured.image.url && (
            <Masthead title={featured.title} image={featured.image.url} />
          )}
          {alertPopup ? (
            <Alert
              popupUID={alertPopup?.uid}
              currentLanguage={currentLanguage}
            />
          ) : null}

          <div className="subpage-container">
            {[...body, ...contentFWSlices].map((slice, index) => (
              <div
                key={index}
                className={`${
                  slice.slice_type !== 'background' ? 'slice-wrapper' : ''
                } slice-block ${slice.slice_type}`}
              >
                {sliceHandler(slice)}
              </div>
            ))}
          </div>
        </main>
        <Footer
          currentLanguage={currentLanguage}
          attraction={commonFooter?.data?.attraction || 'attraction'}
          logoURL={commonFooter?.data?.logo?.url}
          logoAlt={commonFooter?.data?.logo?.alt}
          hasPoweredByHeadoutLogo={
            commonFooter?.data?.powered_by_headout || false
          }
          microbrandType={commonFooter?.data?.microbrand_type}
          slices={commonFooter?.data?.body || []}
          invertLogoColor={commonFooter?.data?.invert_logo_color}
        />
      </div>
    );
  }
}
