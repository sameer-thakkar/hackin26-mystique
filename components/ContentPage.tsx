import React, { Component } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { ProductsContextProvider } from 'contexts/Products';
import { InteractionContextProvider } from 'contexts/Interaction';
import { withAmp } from 'components/common/withAmp';
import DismissAlert from 'components/UI/DismissAlert';
import { Client } from 'config/prismic-config';
import Alert from 'components/UI/Alert';
import PopulateMeta from 'components/common/NextSeoMeta';
import Masthead from 'components/Masthead';
import Footer from 'components/common/Footer';
import sliceHandler from 'components/Slices';
import Header from 'components/common/Header';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import { COLORS, SOLEIL } from 'const/ui-constants';
import {
  DROPDOWN_ELEMENT,
  FULL_WIDTH_SLICES,
  ALLOW_IMMEDIEATE_NESTING,
} from 'const/index';
import { getAlternateLanguages, legacyBooleanCheck } from 'utils';
import allToursParser from 'utils/allToursParser';
import { tourListApiParser } from 'utils/dataParsers';
import { groupSlices, getLangObject } from 'utils/helper';

const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });

const ContentWrapper = styled.main`
  margin-top: 0;
`;

const StyledContentPage = styled.div`
  display: grid;
  grid-row-gap: 72px;
  margin-top: 72px;
  margin-bottom: 72px;

  .slice-block h2 {
    font-size: 24px;
    margin: 0.2em 0;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.SEMIBOLD};
    position: relative;
    line-height: 1.4;
    color: #444444;
  }
  .slice-block h3 {
    font-weight: 500;
    font-size: 22px;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.SEMIBOLD};
    position: relative;
    line-height: 1.4;
    color: #444444;
  }

  .slice-block > h2 {
    margin-bottom: 20px;
  }

  .slice-block p {
    color: #444444;
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    margin-bottom: 15px;
    line-height: 30px;
  }

  .slice-block ul {
    padding-left: 20px;
  }

  .slice-block ul li,
  .slice-block ol li {
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    color: #444444;
    line-height: 40px;
  }

  .ticket_card_shoulder_page ul li,
  .ticket_card_shoulder_page ol li {
    line-height: 22px;
  }

  .product .product-left p {
    margin: 0;
  }
  .product .product-left {
    width: 75%;
    display: grid;
    grid-row-gap: 10px;
  }

  a {
    text-decoration: none;
    color: ${COLORS.LIGHTER_LINK_BLUE};
  }

  .product {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid #ebebeb;
    /*box-shadow: 0 1px 2px rgba(0,0,0,.18);*/
    margin-bottom: 40px;
    border-radius: 5px;
    padding: 20px 40px;
  }

  .products:last-child {
    margin-bottom: 70px;
  }

  .products .product .product-left .product-heading {
    color: #444444;
    margin: 0;
  }

  .slice-wrapper.slice-block {
    width: 100%;
  }

  .slice-wrapper .block-img img {
    max-width: 100%;
  }

  .ticket_card_shoulder_page {
    margin: 0 auto;
    padding: 0;
  }

  @media (max-width: 768px) {
    grid-row-gap: 52px;
    margin-top: 52px;
    .slice-block h2 {
      font-size: 20px;
    }
    .product .product-left {
      width: 100%;
    }
    .slice-block p,
    .slice-block .more-reads-text-text {
      font-size: 16px;
    }
    .slice-block h3,
    .slice-block .more-reads-text-heading,
    .products .product .product-left .product-heading {
      font-size: 18px;
    }
    .product {
      display: block;
      padding: 0 20px;
    }
    .slice-wrapper.slice-block {
      padding: 0 16px;
      width: calc(100% - 32px);
    }
  }
`;

class ContentPage extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showGroupBookingModal: false,
      groupBookingTourTitles: null,
      tourAPIData: null,
      currency: '',
      dropdown: {
        lang: false,
        hamburger: false,
      },
      isMobile: props.isMobile,
      covid19AlertOpen: true,
    };
  }

  async componentDidMount() {
    const {
      enable_group_booking: enableGroupBooking,
    } = this.props.data.header_ref.data;
    const { data } = this.props;

    const { microsite } = data;
    const { all_tours } = microsite?.data;
    const allTourTgids = all_tours
      .filter((tour_slice) => tour_slice?.primary?.tgid)
      .map((tour_slice) => tour_slice.primary.tgid);
    this.setState({
      ...this.state,
      isMobile: window.innerWidth < 768,
    });
    if (allTourTgids.length > 0) {
      const toursData = await fetch(
        `/api/tours/v6/tour-groups/?ids[]=${[...allTourTgids]}`
      ).then((res) => {
        return res.json();
      });

      const tourAPIData = tourListApiParser(toursData);

      const currency = toursData?.currencies[0]?.localSymbol;
      this.setState({
        ...this.state,
        tourAPIData,
        currency,
      });
    }

    if (legacyBooleanCheck(enableGroupBooking)) {
      let groupBookingTourTitles = [];
      let res = await Client().getByIDs([
        this.props.data.microsite_document_ref.id,
      ]);
      const {
        group_booking_excluded_tgids: groupBookingExcludedTgids,
        body1,
      } = res.results[0].data;
      let tours = body1[0]?.items || [];
      let filteredTours = tours.filter(function (tour) {
        return !groupBookingExcludedTgids.find(function (excludedTour) {
          return tour.tgid === excludedTour.tgid;
        });
      });
      const toursData = await fetch(
        `/api/tours/v6/tour-groups/?ids[]=${[
          ...filteredTours.map((t) => t.tgid),
        ]}`
      ).then((res) => {
        return res.json();
      });

      const groupBookingTourData = toursData?.tourGroups?.reduce(
        (acc, tour) => {
          return {
            ...acc,
            [tour.id]: {
              title: tour.name,
            },
          };
        },
        {}
      );

      filteredTours.map(async (tour) => {
        if (!tour.tour_title_override) {
          groupBookingTourTitles.push({
            value: groupBookingTourData[tour.tgid].title + ` [${tour.tgid}]`,
            label: groupBookingTourData[tour.tgid].title,
          });
        } else {
          groupBookingTourTitles.push({
            value: tour.tour_title_override + ` [${tour.tgid}]`,
            label: tour.tour_title_override,
          });
        }
      });
      this.setState({
        ...this.state,
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
    const { groupBookingTourTitles, tourAPIData } = this.state;
    const {
      alternate_languages,
      data,
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      lang,
      isDev,
      serverRequestStartTimestamp,
      uid,
      host,
      scorpioData,
      isAmp,
    } = this.props;
    const {
      footer_ref: commonFooter,
      header_ref: commonHeader,
      content_framework: contentFramework,
      microsite,
      body,
      microsite_document_ref,
      secondaryFooter,
    } = data;
    const apiReady = tourAPIData !== null;
    const allTours = allToursParser(
      microsite?.data,
      scorpioData,
      {
        cardPrices: tourAPIData,
        isFetched: apiReady,
      },
      isAmp
    );
    const CFWBody = contentFramework?.data?.body;
    const contentFWSlices = groupSlices(CFWBody || []);

    const alternateLanguages = getAlternateLanguages(
      alternate_languages,
      isDev,
      isAmp,
      host,
      uid
    );

    // START Data extraction for populating head
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
    const {
      header_ref: {
        data: { disable_amp: disableAMP },
      },
    } = micrositeData;
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
      disable_amp: disableAMP,
    };
    // END Data extraction for populating head

    const {
      enable_group_booking: enableGroupBooking,
      logo_redirection_url: logoRedirectionURL,
      show_ticket_option_url: showTicketRedirectionURL,
      group_booking_disclaimer: groupBookingDisclaimer,
      enable_localization_menu,
      logo,
      logo_alt_text: logoAltText,
      header_links: headerLinks,
      show_ticket_menu: showTicketMenu,
      hide_locales_content_page: hideLangugageDropdown,
    } = commonHeader.data;

    const {
      blackout_start_date: blackoutStartDate,
      blackout_end_date: blackoutEndDate,
      block_n_days_group_booking: blockNDaysGroupBooking,
      minimum_pax: minimumPax,
      maximum_pax: maximumPax,
      group_form_blocked_days: blockedDays,
      page_url: pageUrl,
      alert_popup: alertPopup,
      show_covid19_alert: showCovid19Alert,
    } = microsite_document_ref.data;

    const {
      featured_image,
      featured_image_link,
      featured_image_alt,
      featured_title: featuredTitle,
    } = data;
    const featuredImage = {
      url: featured_image_link.url || featured_image.url,
      alt: featured_image_alt || featured_image.alt,
    };

    const hasPoweredByHeadoutLogo =
      commonHeader.data.enable_powered_by_superbrand_logo ||
      microsite.data.enable_powered_by_superbrand_logo;
    const showGroupBooking = legacyBooleanCheck(enableGroupBooking);
    const currentLanguage = getLangObject(lang).short;
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
            isMobile={this.state.isMobile}
            disclaimer={groupBookingDisclaimer}
          />
        )}
        <PopulateMeta
          {...{
            prismicData: headProps,
            datePublished,
            dateModified,
            serverRequestStartTimestamp,
            languages: alternateLanguages,
            isMobile: this.state.isMobile,
            isAmp,
            bannerImages: [featuredImage],
          }}
        />

        <Header
          languages={alternateLanguages}
          headerLinks={headerLinks}
          showTicketMenu={showTicketMenu}
          hideLangugageDropdown={hideLangugageDropdown}
          currentLanguage={currentLanguage}
          logoUrl={logo.url}
          logoAltText={logoAltText || logo.alt || ''}
          uid={uid}
          dropdown={this.state.dropdown}
          handleDropdownToggle={this.handleDropdownToggle}
          isMobile={this.state.isMobile}
          showGroupBooking={showGroupBooking}
          hasLanguageSelector={enable_localization_menu}
          logoRedirectionURL={logoRedirectionURL?.url || pageUrl}
          showTicketRedirectionURL={
            showTicketRedirectionURL?.url || logoRedirectionURL?.url || pageUrl
          }
          host={host}
          hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
          openGroupBookingModal={this.openGroupBookingModal}
          slices={groupSlices(
            commonHeader?.data?.body,
            ALLOW_IMMEDIEATE_NESTING
          )}
        />
        <Conditional if={showCovid19Alert && this.state.covid19AlertOpen}>
          <DismissAlert
            readMoreLink={strings.COVID19_ALERT.LINK}
            readMore={strings.READ_MORE}
            keyText={strings.COVID19_ALERT.KEY_TEXT}
            text={strings.COVID19_ALERT.TEXT}
            handleClose={this.handleClose}
          />
        </Conditional>
        <ContentWrapper>
          <Conditional if={featuredImage?.url}>
            <Masthead
              title={featuredTitle}
              image={featuredImage}
              isMobile={this.state.isMobile}
            />
          </Conditional>
          <Conditional if={alertPopup}>
            <Alert
              popupUID={alertPopup?.uid}
              currentLanguage={currentLanguage}
            />
          </Conditional>
          <StyledContentPage>
            <ProductsContextProvider allTours={allTours} ready={apiReady}>
              <InteractionContextProvider>
                {[...body, ...contentFWSlices].map((slice, index) => {
                  const sliceComponent = (
                    <div
                      key={index}
                      className={`${
                        !FULL_WIDTH_SLICES.includes(slice.slice_type)
                          ? 'slice-wrapper'
                          : ''
                      } slice-block ${slice.slice_type}`}
                    >
                      {sliceHandler(slice, {
                        isMobile: this.state.isMobile,
                        ...this.props,
                      })}
                    </div>
                  );

                  return sliceComponent;
                })}
              </InteractionContextProvider>
            </ProductsContextProvider>
          </StyledContentPage>
        </ContentWrapper>
        <Footer
          currentLanguage={currentLanguage}
          attraction={commonFooter?.data?.attraction || 'attraction'}
          logoURL={commonFooter?.data?.logo?.url}
          logoAlt={commonFooter?.data?.logo?.alt}
          hasPoweredByHeadoutLogo={
            commonFooter?.data?.powered_by_superbrand || false
          }
          showDisclaimer={commonFooter?.data?.show_disclaimer}
          disclaimerText={commonFooter?.data?.disclaimer_text}
          microbrandType={commonFooter?.data?.microbrand_type}
          slices={commonFooter?.data?.body || []}
          invertLogoColor={commonFooter?.data?.invert_logo_color}
          secondarySlices={secondaryFooter?.data?.body || []}
          primaryHeading={commonFooter?.data?.footer_heading}
          secondaryHeading={secondaryFooter?.data?.footer_heading}
        />
      </div>
    );
  }
}

export default withAmp(ContentPage);
