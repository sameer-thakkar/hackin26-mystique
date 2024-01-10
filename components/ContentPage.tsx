import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import LongForm from 'components/common/LongForm';
import PopulateMeta from 'components/common/NextSeoMeta';
import Masthead from 'components/Masthead';
import Alert from 'components/UI/Alert';
import DismissAlert from 'components/UI/DismissAlert';
import SideNavModal from 'UI/SideNav';
import { InteractionContextProvider } from 'contexts/Interaction';
import { ProductsContextProvider } from 'contexts/Products';
import {
  getAlternateLanguages,
  getBannerAndFooterSubtext,
  getHeadoutLanguagecode,
  isCollectionMB,
  legacyBooleanCheck,
} from 'utils';
import {
  sendVariablesToDataLayer,
  sendVariableToDataLayer,
  trackEvent,
} from 'utils/analytics';
import { fetchTourListV6 } from 'utils/apiUtils';
import {
  checkIfCategoryHeaderExists,
  getLangObject,
  groupSlices,
} from 'utils/helper';
import renderShortCodes from 'utils/shortCodes';
import sideNavHandler from 'utils/sideNavUtils';
import { convertUidToUrl, getLogoRedirectionUrl } from 'utils/urlUtils';
import COLORS from 'const/colors';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  DROPDOWN_ELEMENT,
  SHOULDER_PAGE_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';

const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });
const CategoryHeader = dynamic(
  () =>
    import(/* webpackChunkName: "CategoryHeader" */ 'components/CategoryHeader')
);
const Breadcrumbs = dynamic(
  () => import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
);

const ContentWrapper = styled.main`
  margin-top: 0;
`;

const StyledContentPage = styled.div`
  display: grid;
  grid-row-gap: 4rem;
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
    margin-bottom: 1rem;
  }

  .slice-block.breadcrumbs + .slice-block {
    margin-top: -2rem;

    p {
      margin: 0;
    }
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

  .slice-block.rich_text p + h2 {
    margin: 1.5rem 0 0.25rem;
  }

  @media (max-width: 768px) {
    grid-row-gap: 3rem;
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
    .slice-block.rich_text p + h2 {
      margin: 1.25rem 0 0.25rem;
    }
  }
`;

class ContentPage extends Component<any, any> {
  constructor(props: any) {
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
      selectedHeading: '',
    };
  }

  intersectionObserver: IntersectionObserver | null = null;
  async componentDidMount() {
    const observerOptions = {
      rootMargin: '0% 0% -80% 0%',
    };
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const targetId = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
          this.setState({
            ...this.state,
            selectedHeading: targetId,
          });
        }
      });
    }, observerOptions);

    document
      .querySelectorAll("div[id^='sidenav'], h2[id^='sidenav']")
      .forEach((headings) => {
        if (this.intersectionObserver) {
          this.intersectionObserver.observe(headings);
        }
      });

    const { data, lang } = this.props;

    const { header_ref, microsite_document_ref, baseLangPageTitle } = data;

    const { enable_group_booking: enableGroupBooking } = header_ref?.data || {};

    if (legacyBooleanCheck(enableGroupBooking)) {
      let groupBookingTourTitles: any = [];

      const { group_booking_excluded_tgids: groupBookingExcludedTgids, body1 } =
        microsite_document_ref?.data;
      let tours = body1?.[0]?.items || [];
      let filteredTours = tours.filter(function (tour: any) {
        return !groupBookingExcludedTgids.find(function (excludedTour: any) {
          return tour.tgid === excludedTour.tgid;
        });
      });
      const toursData = await fetchTourListV6({
        tgids: filteredTours.map((t: any) => t.tgid),
        hostname: window.location.origin,
        language: getHeadoutLanguagecode(lang),
      });

      const groupBookingTourData = toursData?.tourGroups?.reduce(
        (acc: any, tour: any) => {
          return {
            ...acc,
            [tour.id]: {
              title: tour.name,
            },
          };
        },
        {}
      );

      filteredTours.map(async (tour: any) => {
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

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.SHOULDER_PAGE_TYPE,
      value: this.props.data.baseLangCategorisationMetadata.shoulder_page_type,
    });
  }

  componentDidUpdate() {
    const {
      eventsReady,
      data: { baseLangCategorisationMetadata },
    } = this.props;
    const {
      shoulder_page_type,
      tagged_category: taggedCategoryName,
      tagged_sub_category: taggedSubCategoryName,
      tagged_mb_type: taggedMbType,
    } = (baseLangCategorisationMetadata as TCategorisationMetadata) || {};
    const { pageViewEventSet } = this.state;
    if (!eventsReady) return;

    if (!pageViewEventSet) {
      sendVariablesToDataLayer({
        ...(taggedCategoryName && {
          [ANALYTICS_PROPERTIES.CATEGORY_NAME]: taggedCategoryName,
        }),
        ...(taggedSubCategoryName && {
          [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: taggedSubCategoryName,
        }),
        ...(taggedMbType && {
          [ANALYTICS_PROPERTIES.MB_TYPE]: taggedMbType,
        }),
      });

      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
        [ANALYTICS_PROPERTIES.SHOULDER_PAGE_TYPE]: shoulder_page_type ?? '',
      });
      this.setState({ pageViewEventSet: true });
    }
  }

  componentWillUnmount() {
    if (this.intersectionObserver) {
      this?.intersectionObserver.disconnect();
    }
  }

  openGroupBookingModal = () => this.setState({ showGroupBookingModal: true });
  closeGroupBookingModal = () =>
    this.setState({ showGroupBookingModal: false });

  handleClose = () => {
    this.setState({ covid19AlertOpen: false });
  };

  handleDropdownToggle = (elementIdentifier: any, forceBool = null) => {
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
      data: CMSData,
      categoryTourListData,
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      lang,
      isDev,
      serverRequestStartTimestamp,
      uid,
      host,
      domainConfig,
      primaryCity,
      categoryHeaderMenu,
      breadcrumbs,
      prismicDocsForListicle,
      collectionsInListicles,
    } = this.props;
    const {
      footer_ref: commonFooter,
      header_ref: commonHeader,
      content_framework: contentFramework,
      baseLangIsPoiMb,
      baseLangBannerAndFooterCombinations,
      body,
      microsite_document_ref,
      secondary_footer: secondaryFooter,
      side_navigation: sideNavToggle,
      baseLangCategorisationMetadata,
    } = CMSData;

    const { data: micrositeData } = microsite_document_ref ?? {};
    const {
      tagged_city: taggedCity,
      tagged_mb_type: taggedMbType,
      shoulder_page_type,
    } = (baseLangCategorisationMetadata as TCategorisationMetadata) || {};

    const apiReady = tourAPIData !== null;
    const slices = [
      ...(CMSData?.body || []),
      ...(CMSData?.content_framework?.data?.body || []),
    ];

    const { design: mbDesign } = micrositeData || {};

    const CFWBody = contentFramework?.data?.body;
    const contentFWSlices = groupSlices(CFWBody || []);

    const alternateLanguages = getAlternateLanguages(
      alternate_languages,
      isDev,
      host,
      uid
    );
    const sidenavItems = sideNavHandler(slices);
    const showSideNav = sideNavToggle !== false && sidenavItems?.length > 2;
    /* Using the condition sideNavToggle !== false because we want to keep side nav enabled by default for all content pages.
     For new docs, we have set the default value as true, but older docs- the value comes as null. Hence the above condition. */

    // START Data extraction for populating head
    const contentPageHasOtherMetaTags = CMSData.other_meta_tags.filter(
      ({ meta_tag }: any) => meta_tag
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
        [elem]: this.props.data[elem] || micrositeData[elem],
      }),
      {}
    );
    const objValues = objKeys.reduce(
      (acc, elem) => ({
        ...acc,
        [elem]: Object.keys(this.props.data[elem]).length
          ? this.props.data[elem]
          : micrositeData[elem],
      }),
      {}
    );
    const modifiedMicrositeData = {
      ...this.props.data,
      ...strValues,
      ...objValues,
    };
    const isCollectionMicrobrand = isCollectionMB(taggedMbType);
    const bannerAndFooterSubtext = getBannerAndFooterSubtext(
      baseLangIsPoiMb,
      baseLangBannerAndFooterCombinations
    );

    const pageUrl = convertUidToUrl({
      uid,
      lang: getHeadoutLanguagecode(lang),
    });
    const micrositeRefPageUrl = convertUidToUrl({
      uid: microsite_document_ref.uid,
      lang: getHeadoutLanguagecode(microsite_document_ref.lang),
    });

    const headProps = {
      ...modifiedMicrositeData,
      header_scripts: microsite_document_ref.data.header_scripts,
      canonical_link: CMSData.canonical_link || pageUrl,
      other_meta_tags: contentPageHasOtherMetaTags
        ? CMSData.other_meta_tags
        : microsite_document_ref.other_meta_tags,
      faq_schema: CMSData.faq_schema,
    };
    // END Data extraction for populating head

    const {
      enable_group_booking: enableGroupBooking,
      show_ticket_option_url: showTicketRedirectionURL,
      group_booking_disclaimer: groupBookingDisclaimer,
      header_links: headerLinks,
      show_ticket_menu: showTicketMenu,
    } = commonHeader?.data || {};

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
    } = CMSData ?? {};
    const featuredImage = {
      url: featured_image_link.url || featured_image.url,
      alt: featured_image_alt || featured_image.alt,
    };
    const { collectionDetails } = categoryTourListData || {};
    const { id: collectionId, displayName: collectionName } =
      collectionDetails || {};
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
    const categoryHeaderMenuExists = checkIfCategoryHeaderExists({
      mbDesign,
      mbType: taggedMbType,
    });

    const automatedBreadcrumbsExists =
      Object?.keys(breadcrumbs ?? {}).length > 0;
    const breadcrumbsDetails = {
      breadcrumbs,
      taggedCity,
      primaryCity,
    };

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
            breadcrumbsDetails,
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
            ALLOW_IMMEDIATE_NESTING
          )}
          primaryCity={primaryCity}
          taggedCity={taggedCity}
          categoryHeaderMenu={categoryHeaderMenu}
          categoryHeaderMenuExists={categoryHeaderMenuExists}
        />
        <Conditional
          if={
            categoryHeaderMenuExists &&
            Object.keys(categoryHeaderMenu).length > 0 &&
            !this.state.isMobile
          }
        >
          <CategoryHeader
            categoryHeaderMenu={categoryHeaderMenu}
            primaryCity={primaryCity}
            taggedCity={taggedCity}
            languages={alternateLanguages}
            currentLanguage={currentLanguage}
            isMobile={false}
          />
        </Conditional>
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
          />
          <Conditional if={alertPopup}>
            <Alert
              popupUID={alertPopup?.uid}
              currentLanguage={currentLanguage}
            />
          </Conditional>
          <Conditional if={showSideNav}>
            <SideNavModal
              items={sidenavItems}
              isMobile={this.props.isMobile}
              collectionId={collectionId}
              collectionName={collectionName}
              pageTitle={featuredTitle}
              visibleHeading={this.state.selectedHeading}
            />
          </Conditional>
          <Conditional if={automatedBreadcrumbsExists}>
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              taggedCity={taggedCity}
              primaryCity={primaryCity}
              isContentPage={true}
              isMobile={this.state.isMobile}
            />
          </Conditional>
          <StyledContentPage>
            <ProductsContextProvider ready={apiReady}>
              <InteractionContextProvider>
                <LongForm
                  content={[...body, ...contentFWSlices]}
                  prismicDocsForListicle={prismicDocsForListicle}
                  collectionsInListicles={collectionsInListicles}
                  automatedBreadcrumbsExists={automatedBreadcrumbsExists}
                  isContentPage
                  {...this.props}
                />
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
          disclaimerText={
            isCollectionMicrobrand
              ? bannerAndFooterSubtext
              : commonFooter?.data?.disclaimer_text
          }
          slices={commonFooter?.data?.body || []}
          secondarySlices={secondaryFooter?.data?.body || []}
          primaryHeading={commonFooter?.data?.footer_heading}
          secondaryHeading={secondaryFooter?.data?.footer_heading}
          showGmapsDisclaimer={
            shoulder_page_type === SHOULDER_PAGE_TYPES.DIRECTIONS ||
            shoulder_page_type === SHOULDER_PAGE_TYPES.PLAN_YOUR_VISIT
          }
        />
      </div>
    );
  }
}

export default ContentPage;
