import React, { Component } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { Client } from 'config/prismic-config';
import { ProductsContextProvider } from 'contexts/Products';
import { InteractionContextProvider } from 'contexts/Interaction';
import DismissAlert from 'components/UI/DismissAlert';
import Alert from 'components/UI/Alert';
import PopulateMeta from 'components/common/NextSeoMeta';
import Masthead from 'components/Masthead';
import Footer from 'components/common/Footer';
import sliceHandler from 'components/Slices';
import Header from 'components/common/Header';
import Conditional from 'components/common/Conditional';
import {
  getAlternateLanguages,
  legacyBooleanCheck,
  getHeadoutLanguagecode,
} from 'utils';
import allToursParser from 'utils/allToursParser';
import { tourListApiParser } from 'utils/dataParsers';
import { groupSlices, getLangObject } from 'utils/helper';
import { sendVariableToDataLayer, trackEvent } from 'utils/analytics';
import renderShortCodes from 'utils/shortCodes';
import { getLogoRedirectionUrl, convertUidToUrl } from 'utils/urlUtils';
import { strings } from 'const/strings';
import {
  DROPDOWN_ELEMENT,
  FULL_WIDTH_SLICES,
  ALLOW_IMMEDIEATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { fetchTourListV6 } from 'utils/apiUtils';

const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });

const ContentWrapper = styled.main`
  margin-top: 0;
`;

const StyledContentPage = styled.div`
  display: grid;
  grid-row-gap: 72px;
  margin-top: 0;
  margin-bottom: 72px;

  .page_tabs + div {
    margin-top: -64px;
  }

  .slice-block h2 {
    margin: 0.2em 0;
    position: relative;
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Heading/Large')}
  }
  .slice-block h3 {
    position: relative;
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Heading/Small')}
  }

  .slice-block > h2 {
    margin-bottom: 20px;
  }

  .slice-block p {
    ${expandFontToken('Paragraph/Large')}
    color: ${COLORS.GRAY.G2};
    margin-bottom: 15px;
  }

  .slice-block ul {
    ${expandFontToken('Paragraph/Large')}
    padding-left: 20px;
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
    color: ${COLORS.TEXT.CANDY_1};
  }

  .product {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid ${COLORS.GRAY.G6};
    /*box-shadow: 0 1px 2px rgba(0,0,0,.18);*/
    margin-bottom: 40px;
    border-radius: 5px;
    padding: 20px 40px;
  }

  .products:last-child {
    margin-bottom: 70px;
  }

  .products .product .product-left .product-heading {
    color: ${COLORS.GRAY.G2};
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
    .page_tabs + div {
      margin-top: -48px;
    }
    .slice-block h2 {
      ${expandFontToken('Heading/Regular')}
    }
    .product .product-left {
      width: 100%;
    }
    .slice-block p,
    .slice-block .more-reads-text-text {
      ${expandFontToken('Paragraph/Medium')}
    }

    .slice-block ul {
      ${expandFontToken('Paragraph/Medium')}
    }
    .slice-block h3,
    .slice-block .more-reads-text-heading,
    .products .product .product-left .product-heading {
      ${expandFontToken('Heading/XS')}
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
      pageViewEventSet: false,
    };
  }

  async componentDidMount() {
    const {
      enable_group_booking: enableGroupBooking,
    } = this.props.data.header_ref.data;
    const { data } = this.props;

    const { microsite, baseLangPageTitle } = data;
    const { all_tours } = microsite?.data;
    const allTourTgids = all_tours
      .filter((tour_slice) => tour_slice?.primary?.tgid)
      .map((tour_slice) => tour_slice.primary.tgid);
    this.setState({
      ...this.state,
      isMobile: window.innerWidth < 768,
    });
    if (allTourTgids.length > 0) {
      const toursData = await fetchTourListV6({
        tgids: allTourTgids,
        hostname: window.location.origin,
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
      const toursData = await fetchTourListV6({
        tgids: filteredTours.map((t) => t.tgid),
        hostname: window.location.origin,
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

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_TITLE,
      value: renderShortCodes(baseLangPageTitle)?.join?.(''),
    });
  }

  componentDidUpdate() {
    const { data, eventsReady } = this.props;
    const { baseLangPageTitle } = data;
    const { pageViewEventSet } = this.state;
    if (!eventsReady) return;

    if (!pageViewEventSet) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
        [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.CONTENT_PAGE,
        [ANALYTICS_PROPERTIES.LANGUAGE]: this.props.lang,
        [ANALYTICS_PROPERTIES.PAGE_TITLE]: baseLangPageTitle,
      });
      this.setState({ pageViewEventSet: true });
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
      domainConfig,
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

    const allTours = allToursParser(microsite?.data, scorpioData, {
      cardPrices: tourAPIData,
      isFetched: apiReady,
    });
    const { is_entertainment_mb: isEntertainmentMb } = microsite?.data || {};
    const CFWBody = contentFramework?.data?.body;
    const contentFWSlices = groupSlices(CFWBody || []);

    const alternateLanguages = getAlternateLanguages(
      alternate_languages,
      isDev,
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

    const pageUrl = convertUidToUrl({
      uid,
      lang: getHeadoutLanguagecode(lang),
    });
    const micrositeRefPageUrl = convertUidToUrl({
      uid: microsite_document_ref.uid,
      lang: getHeadoutLanguagecode(microsite_document_ref.lang),
    });

    const headProps = {
      ...micrositeData,
      header_scripts: microsite_document_ref.data.header_scripts,
      canonical_link: this.props.data.canonical_link || pageUrl,
      other_meta_tags: contentPageHasOtherMetaTags
        ? this.props.data.other_meta_tags
        : microsite_document_ref.other_meta_tags,
      faq_schema: this.props.data.faq_schema,
    };
    // END Data extraction for populating head

    const {
      enable_group_booking: enableGroupBooking,
      show_ticket_option_url: showTicketRedirectionURL,
      group_booking_disclaimer: groupBookingDisclaimer,
      header_links: headerLinks,
      show_ticket_menu: showTicketMenu,
    } = commonHeader.data;

    const {
      blackout_start_date: blackoutStartDate,
      blackout_end_date: blackoutEndDate,
      block_n_days_group_booking: blockNDaysGroupBooking,
      minimum_pax: minimumPax,
      maximum_pax: maximumPax,
      group_form_blocked_days: blockedDays,
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

    const showGroupBooking = legacyBooleanCheck(enableGroupBooking);
    const currentLanguage = getLangObject(lang).code;
    const {
      faviconUrl,
      logo: { logoUrl = '', showPoweredLogo = true } = {},
      name: whiteLabelName,
    } = domainConfig || {};
    const logoRedirectionUrl = getLogoRedirectionUrl({
      uid,
      lang: currentLanguage,
      isDev,
      host,
    });
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
            bannerImages: [featuredImage],
            faviconUrl,
            logoUrl: logoUrl,
          }}
        />

        <Header
          languages={alternateLanguages}
          headerLinks={headerLinks}
          showTicketMenu={showTicketMenu}
          currentLanguage={currentLanguage}
          logoUrl={logoUrl}
          logoAltText={whiteLabelName || ''}
          uid={uid}
          dropdown={this.state.dropdown}
          handleDropdownToggle={this.handleDropdownToggle}
          isMobile={this.state.isMobile}
          showGroupBooking={showGroupBooking}
          logoRedirectionURL={logoRedirectionUrl || micrositeRefPageUrl}
          showTicketRedirectionURL={
            showTicketRedirectionURL?.url ||
            logoRedirectionUrl ||
            micrositeRefPageUrl
          }
          host={host}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
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
          <Masthead
            title={featuredTitle}
            image={featuredImage?.url ? featuredImage : null}
            isMobile={this.state.isMobile}
            isEntertainmentMb={isEntertainmentMb}
          />
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
          logoURL={logoUrl}
          logoAlt={whiteLabelName || ''}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          showDisclaimer={commonFooter?.data?.show_disclaimer}
          disclaimerText={commonFooter?.data?.disclaimer_text}
          slices={commonFooter?.data?.body || []}
          secondarySlices={secondaryFooter?.data?.body || []}
          primaryHeading={commonFooter?.data?.footer_heading}
          secondaryHeading={secondaryFooter?.data?.footer_heading}
        />
      </div>
    );
  }
}

export default ContentPage;
