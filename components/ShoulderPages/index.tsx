import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import LongForm from 'components/common/LongForm';
import PopulateMeta from 'components/common/NextSeoMeta';
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
import { extractSliceByType } from 'utils/contentPageUtils';
import {
  checkIfCategoryHeaderExists,
  checkIfLTTMB,
  getLangObject,
  groupSlices,
} from 'utils/helper';
import renderShortCodes from 'utils/shortCodes';
import sideNavHandler from 'utils/sideNavUtils';
import { convertUidToUrl, getLogoRedirectionUrl } from 'utils/urlUtils';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  DROPDOWN_ELEMENT,
  SHOULDER_PAGE_TYPES,
  SLICE_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import { StyledContentPage } from './styles';

const GeneralContentPage = dynamic(
  () => import(/* webpackChunkName: "GeneralShoulderPage" */ './General')
);
const AboutPage = dynamic(
  () => import(/* webpackChunkName: "AboutShoulderPage" */ './About')
);
const GroupBooking = dynamic(() => import('../GroupBooking'), { ssr: false });
const CategoryHeader = dynamic(
  () =>
    import(/* webpackChunkName: "CategoryHeader" */ 'components/CategoryHeader')
);

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
      categoryTourListData,
    } = this.props;
    const {
      footer_ref: commonFooter,
      header_ref: commonHeader,
      baseLangIsPoiMb,
      baseLangBannerAndFooterCombinations,
      microsite_document_ref,
      baseLangCategorisationMetadata,
      relatedContentPages,
      poiInfo,
      body,
      content_framework: contentFramework,
      secondary_footer: secondaryFooter,
    } = CMSData;
    const { data: micrositeData } = microsite_document_ref ?? {};
    const {
      tagged_city: taggedCity,
      tagged_mb_type: taggedMbType,
      shoulder_page_type,
    } = (baseLangCategorisationMetadata as TCategorisationMetadata) || {};
    const { design: mbDesign } = micrositeData || {};

    const apiReady = tourAPIData !== null;

    const CFWBody = contentFramework?.data?.body;
    const contentFWSlices: Record<string, any>[] = groupSlices(CFWBody || []);

    const alternateLanguages = getAlternateLanguages(
      alternate_languages,
      isDev,
      host,
      uid
    );

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

    const isLTT = checkIfLTTMB(uid);

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

    const { featured_image, featured_image_link, featured_image_alt } =
      CMSData ?? {};
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
    const categoryHeaderMenuExists = checkIfCategoryHeaderExists({
      mbDesign,
      mbType: taggedMbType,
    });
    const breadcrumbsDetails = {
      breadcrumbs,
      taggedCity,
      primaryCity,
    };

    const automatedBreadcrumbsExists =
      Object.keys(breadcrumbs ?? {}).length > 0;
    const isNotGeneralPage = [SHOULDER_PAGE_TYPES.ABOUT].includes(
      shoulder_page_type || ''
    );

    let extractedBreadcrumbsSlice: Record<string, any>[] = [],
      extractedProductCardsSlice: Record<string, any>[] = [];
    if (isNotGeneralPage) {
      extractedProductCardsSlice = extractSliceByType({
        slices: contentFWSlices,
        sliceType:
          SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD as keyof typeof SLICE_TYPES,
      });
      extractedBreadcrumbsSlice = !automatedBreadcrumbsExists
        ? extractSliceByType({
            slices: contentFWSlices,
            sliceType: SLICE_TYPES.BREADCRUMBS as keyof typeof SLICE_TYPES,
          })
        : [];
    }
    const { side_navigation: sideNavToggle, featured_title: featuredTitle } =
      CMSData;

    const slices = [
      ...(CMSData?.body || []),
      ...(CMSData?.content_framework?.data?.body || []),
    ];
    const extraSideNavItems = [];
    if (shoulder_page_type === SHOULDER_PAGE_TYPES.ABOUT) {
      // as we're reordering the product cards, reorder its title in the sidebar
      extraSideNavItems.push(
        ...[
          strings.CONTENT_PAGE.QUICK_INFORMATION,
          extractedProductCardsSlice?.[0]?.primary?.title,
        ].filter(Boolean)
      );
    }
    const sidenavItems = sideNavHandler(slices);
    const showSideNav = sideNavToggle !== false && sidenavItems?.length > 2;

    const { collectionDetails } = categoryTourListData || {};

    const { id: collectionId, displayName: collectionName } =
      collectionDetails || {};

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
        <Conditional if={showSideNav}>
          <SideNavModal
            items={[...extraSideNavItems, ...sidenavItems]}
            isMobile={!!this.state.isMobile}
            collectionId={collectionId}
            collectionName={collectionName}
            pageTitle={featuredTitle}
            visibleHeading={this.state.selectedHeading || null}
          />
        </Conditional>
        <Conditional if={!isNotGeneralPage}>
          <GeneralContentPage
            alertPopup={alertPopup}
            featuredImage={featuredImage}
            currentLanguage={currentLanguage}
            breadcrumbs={breadcrumbs}
            taggedCity={taggedCity}
            primaryCity={primaryCity}
            isMobile={this.state.isMobile}
            data={CMSData}
            automatedBreadcrumbsExists={automatedBreadcrumbsExists}
          />
        </Conditional>
        <Conditional if={shoulder_page_type === SHOULDER_PAGE_TYPES.ABOUT}>
          <AboutPage
            featuredImage={featured_image_link?.url && featuredImage}
            data={CMSData}
            parentProps={this.props}
            breadcrumbs={breadcrumbs}
            taggedCity={taggedCity}
            primaryCity={primaryCity}
            isMobile={this.state.isMobile}
            relatedContentPages={relatedContentPages}
            poiInfo={poiInfo}
            automatedBreadcrumbsExists={automatedBreadcrumbsExists}
            categoryTourListData={categoryTourListData}
            extractedBreadcrumbsSlice={extractedBreadcrumbsSlice}
            extractedProductCardsSlice={extractedProductCardsSlice}
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
          isLTT={isLTT}
        />
      </div>
    );
  }
}

export default ContentPage;
