import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import Loader from 'components/common/Loader';
import LongForm from 'components/common/LongForm';
import PopulateMeta from 'components/common/NextSeoMeta';
import DismissAlert from 'components/UI/DismissAlert';
import SideNavModal from 'UI/SideNav';
import { InteractionContextProvider } from 'contexts/Interaction';
import { ProductsContextProvider } from 'contexts/Products';
import useABTesting from 'hooks/useABTesting';
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
import { VARIANTS } from 'const/experiments';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  DROPDOWN_ELEMENT,
  MB_CATEGORISATION,
  SLICE_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import { META_OBJ_KEYS, META_STR_KEYS } from './const';
import { StyledContentPage } from './styles';

const GeneralContentPage = dynamic(
  () => import(/* webpackChunkName: "GeneralShoulderPage" */ './General')
);
const AboutPage = dynamic(
  () => import(/* webpackChunkName: "AboutShoulderPage" */ './About')
);
const TimingsPage = dynamic(
  () => import(/* webpackChunkName: "TimingsShoulderPage" */ './Timings')
);
const GroupBooking = dynamic(() => import('../GroupBooking'), { ssr: false });
const CategoryHeader = dynamic(
  () =>
    import(/* webpackChunkName: "CategoryHeader" */ 'components/CategoryHeader')
);

const ContentPage = (props: any) => {
  const [showGroupBookingModal, setShowGroupBookingModal] = useState(false);
  const [groupBookingTourTitles, setGroupBookingTourTitles] = useState(null);
  const [dropdown, setDropdown] = useState({
    lang: false,
    hamburger: false,
  });
  const [covid19AlertOpen, setCovid19AlertOpen] = useState(true);
  const [pageViewEventSet, setPageViewEventSet] = useState(false);
  const [selectedHeading, setSelectedHeading] = useState<string | null>('');

  const intersectionObserver = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions = {
      rootMargin: '0% 0% -80% 0%',
    };
    intersectionObserver.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const targetId = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
          setSelectedHeading(targetId);
        }
      });
    }, observerOptions);

    document
      .querySelectorAll("div[id^='sidenav'], h2[id^='sidenav']")
      .forEach((headings) => {
        if (intersectionObserver.current) {
          intersectionObserver.current.observe(headings);
        }
      });

    const { data, lang } = props;

    const { header_ref, microsite_document_ref, baseLangPageTitle } = data;

    const { enable_group_booking: enableGroupBooking } = header_ref?.data || {};

    const fetchSetGroupBookingTourTitles = async () => {
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
      setGroupBookingTourTitles(groupBookingTourTitles);
    };

    if (legacyBooleanCheck(enableGroupBooking)) {
      fetchSetGroupBookingTourTitles();
    }

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_TITLE,
      value: renderShortCodes(baseLangPageTitle)?.join?.(''),
    });

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.SHOULDER_PAGE_TYPE,
      value: props.data.baseLangCategorisationMetadata.shoulder_page_type,
    });

    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
    };
  }, [props]);

  useEffect(() => {
    const {
      eventsReady,
      data: { baseLangCategorisationMetadata },
    } = props;
    const {
      shoulder_page_type,
      tagged_category: taggedCategoryName,
      tagged_sub_category: taggedSubCategoryName,
      tagged_mb_type: taggedMbType,
    } = (baseLangCategorisationMetadata as TCategorisationMetadata) || {};
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
      setPageViewEventSet(true);
    }
  }, [props, pageViewEventSet]);

  const openGroupBookingModal = () => setShowGroupBookingModal(true);

  const closeGroupBookingModal = () => setShowGroupBookingModal(false);

  const handleClose = () => setCovid19AlertOpen(false);

  const handleDropdownToggle = (elementIdentifier: any, forceBool = null) => {
    switch (elementIdentifier) {
      case DROPDOWN_ELEMENT.HAMBURGER: {
        setDropdown({
          ...dropdown,
          hamburger: forceBool ?? !dropdown.hamburger,
          lang: false,
        });
        break;
      }
      case DROPDOWN_ELEMENT.LANGUAGE_SELECTOR: {
        setDropdown({
          ...dropdown,
          lang: !dropdown.lang,
          hamburger: false,
        });
        break;
      }
      default:
        return;
    }
  };

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
    isMobile,
    collectionData,
  } = props;
  const {
    footer_ref: commonFooter,
    header_ref: commonHeader,
    baseLangIsPoiMb,
    baseLangBannerAndFooterCombinations,
    microsite_document_ref,
    baseLangCategorisationMetadata,
    relatedContentPages,
    poiInfo,
    childPoisInfo,
    body,
    content_framework: contentFramework,
    secondary_footer: secondaryFooter,
  } = CMSData;
  const { SHOULDER_PAGE_TYPE } = MB_CATEGORISATION;
  const { data: micrositeData } = microsite_document_ref ?? {};
  const {
    tagged_city: taggedCity,
    tagged_mb_type: taggedMbType,
    shoulder_page_type,
  } = (baseLangCategorisationMetadata as TCategorisationMetadata) || {};
  const { design: mbDesign } = micrositeData || {};

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

  const strValues = META_STR_KEYS.reduce(
    (acc, elem) => ({
      ...acc,
      [elem]: props.data[elem] || micrositeData?.[elem],
    }),
    {}
  );
  const objValues = META_OBJ_KEYS.reduce(
    (acc, elem) => ({
      ...acc,
      [elem]: Object.keys(props.data[elem]).length
        ? props.data[elem]
        : micrositeData?.[elem],
    }),
    {}
  );
  const modifiedMicrositeData = {
    ...props.data,
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
    header_scripts: microsite_document_ref?.data?.header_scripts,
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
  } = microsite_document_ref?.data || {};

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

  const automatedBreadcrumbsExists = Object.keys(breadcrumbs ?? {}).length > 0;

  const CFWBody: Record<string, any>[] = contentFramework?.data?.body || [];
  const contentFWSlices: Record<string, any>[] = groupSlices(CFWBody);

  const isRevampedPage =
    baseLangIsPoiMb &&
    [SHOULDER_PAGE_TYPE.ABOUT, SHOULDER_PAGE_TYPE.TIMINGS].includes(
      shoulder_page_type || ''
    ) &&
    !(
      shoulder_page_type == SHOULDER_PAGE_TYPE.TIMINGS &&
      !poiInfo?.operatingSchedules?.length
    );
  const breadcrumbsSliceIndex = CFWBody.findIndex(
    ({ slice_type }) => slice_type === SLICE_TYPES.BREADCRUMBS
  );
  const extractedPrismicBreadcrumbs =
    isRevampedPage &&
    !automatedBreadcrumbsExists &&
    breadcrumbsSliceIndex >= 0 &&
    CFWBody?.splice?.(breadcrumbsSliceIndex, 1);

  let extractedBreadcrumbsSlice: Record<string, any>[] = [],
    extractedProductCardsSlice: Record<string, any>[] = [];

  const { side_navigation: sideNavToggle, featured_title: featuredTitle } =
    CMSData;
  const slices = [
    ...(CMSData?.body || []),
    ...(CMSData?.content_framework?.data?.body || []),
  ];
  const extraSideNavItems: string[] = [];

  const {
    isEligible: isPlanYourVisitCardsExpEligible,
    variant: planYourVisitCardsExpVariant,
    isExperimentResolving: isPlanYourVisitCardsExpResolving,
  } = useABTesting({
    experimentId: 'SHOULDER_PAGE_SECTION_RANKING_EXPERIMENT',
    noTrack: false,
    customEligibilityCheckFn: () =>
      SHOULDER_PAGE_TYPE.PLAN_YOUR_VISIT.toLowerCase() ===
      shoulder_page_type?.toLowerCase(),
  });

  const shouldReorderProductCardsExp =
    isPlanYourVisitCardsExpEligible &&
    planYourVisitCardsExpVariant == VARIANTS.TREATMENT;

  if (shouldReorderProductCardsExp) {
    extractedProductCardsSlice = extractSliceByType({
      slices: contentFWSlices,
      sliceType:
        SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD as keyof typeof SLICE_TYPES,
    });
    if (extractedProductCardsSlice?.[0]?.primary?.title) {
      extraSideNavItems.push(extractedProductCardsSlice?.[0]?.primary?.title);
    }
    // besides reordering in the sidebar, also remove from the longform slices
    extractSliceByType({
      slices,
      sliceType:
        SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD as keyof typeof SLICE_TYPES,
    });
  }

  if (isRevampedPage) {
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
    // besides reordering in the sidebar, also remove from the longform slices
    [SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD, SLICE_TYPES.BREADCRUMBS].forEach(
      (sliceType) =>
        extractSliceByType({
          slices,
          sliceType: sliceType as keyof typeof SLICE_TYPES,
        })
    );

    // as we're reordering the product cards, reorder its title in the sidebar
    const productCardsSliceTitle =
      extractedProductCardsSlice?.[0]?.primary?.title ||
      extractedProductCardsSlice?.[0]?.slices?.[0]?.primary?.title;
    if (shoulder_page_type === SHOULDER_PAGE_TYPE.ABOUT) {
      extraSideNavItems.push(
        ...[
          strings.CONTENT_PAGE.QUICK_INFORMATION,
          productCardsSliceTitle,
        ].filter(Boolean)
      );
    } else if (shoulder_page_type === SHOULDER_PAGE_TYPE.TIMINGS) {
      const weekInfoExists = Object.keys(
        poiInfo?.bestTimeToVisit?.week || {}
      ).length;
      const yearInfoExists = Object.keys(
        poiInfo?.bestTimeToVisit?.year || {}
      ).length;
      extraSideNavItems.push(
        ...[
          poiInfo?.name && `${poiInfo?.name} ${strings.CONTENT_PAGE.TIMINGS}`,
          ...(childPoisInfo?.length
            ? childPoisInfo.map(
                (childPoiInfo: any) =>
                  `${childPoiInfo?.name} ${strings.CONTENT_PAGE.TIMINGS}`
              )
            : []),
          productCardsSliceTitle,
          (weekInfoExists || yearInfoExists) &&
            poiInfo?.name &&
            `${strings.CONTENT_PAGE.BEST_TIME_TO_VISIT} ${poiInfo?.name}`,
        ].filter(Boolean)
      );
    }
  }
  const sidenavItems = sideNavHandler(slices);
  const showSideNav = sideNavToggle !== false && sidenavItems?.length > 2;

  const { collectionDetails } = categoryTourListData || {};

  const { id: collectionId, displayName: collectionName } =
    collectionDetails || {};

  const collectionFeaturedImage = {
    url:
      featured_image.url ||
      featured_image_link.url ||
      collectionData?.collection?.heroImageUrl,
    alt:
      collectionData?.displayName || featured_image.alt || featured_image_alt,
  };

  const productCardsSlicePosition = breadcrumbsSliceIndex >= 0 ? 3 : 2;

  const longFormContent = [...body, ...contentFWSlices];

  if (shouldReorderProductCardsExp && extractedProductCardsSlice.length) {
    longFormContent.splice(
      productCardsSlicePosition,
      0,
      ...extractedProductCardsSlice
    );
  }

  const sideNavItems = [
    ...(shouldReorderProductCardsExp ? sidenavItems?.splice(0, 2) : []),
    ...extraSideNavItems,
    ...sidenavItems,
  ];

  const PRODUCT_CARDS_LIMIT = 4;

  if (isPlanYourVisitCardsExpResolving && isPlanYourVisitCardsExpEligible)
    return <Loader />;

  return (
    <div className="page-wrapper">
      {showGroupBookingModal && groupBookingTourTitles && (
        <GroupBooking
          closeGroupBookingModal={() => closeGroupBookingModal}
          groupBookingTourTitles={groupBookingTourTitles}
          blackoutStartDate={blackoutStartDate}
          blackoutEndDate={blackoutEndDate}
          blockNDaysGroupBooking={blockNDaysGroupBooking}
          minimumPax={minimumPax ? minimumPax : 10}
          maximumPax={maximumPax ? minimumPax : undefined}
          blockedDays={blockedDays || ''}
          isMobile={isMobile}
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
          isMobile: isMobile,
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
        dropdown={dropdown}
        handleDropdownToggle={handleDropdownToggle}
        isMobile={isMobile}
        showGroupBooking={showGroupBooking}
        logoRedirectionURL={logoRedirectionUrl || micrositeRefPageUrl}
        showTicketRedirectionURL={
          showTicketRedirectionURL?.url ||
          logoRedirectionUrl ||
          micrositeRefPageUrl
        }
        host={host}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        openGroupBookingModal={openGroupBookingModal}
        slices={groupSlices(commonHeader?.data?.body, ALLOW_IMMEDIATE_NESTING)}
        primaryCity={primaryCity}
        taggedCity={taggedCity}
        categoryHeaderMenu={categoryHeaderMenu}
        categoryHeaderMenuExists={categoryHeaderMenuExists}
      />
      <Conditional
        if={
          categoryHeaderMenuExists &&
          Object.keys(categoryHeaderMenu).length > 0 &&
          !isMobile
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
      <Conditional if={showCovid19Alert && covid19AlertOpen}>
        <DismissAlert
          readMoreLink={strings.COVID19_ALERT.LINK}
          readMore={strings.READ_MORE}
          keyText={strings.COVID19_ALERT.KEY_TEXT}
          text={strings.COVID19_ALERT.TEXT}
          handleClose={handleClose}
        />
      </Conditional>
      <Conditional if={showSideNav}>
        <SideNavModal
          items={sideNavItems}
          isMobile={!!isMobile}
          collectionId={collectionId}
          collectionName={collectionName}
          pageTitle={featuredTitle}
          visibleHeading={selectedHeading || null}
        />
      </Conditional>
      <Conditional if={!isRevampedPage}>
        <GeneralContentPage
          alertPopup={alertPopup}
          featuredImage={featuredImage}
          currentLanguage={currentLanguage}
          breadcrumbs={breadcrumbs}
          taggedCity={taggedCity}
          primaryCity={primaryCity}
          isMobile={isMobile}
          data={CMSData}
          automatedBreadcrumbsExists={automatedBreadcrumbsExists}
        />
      </Conditional>
      <Conditional
        if={isRevampedPage && shoulder_page_type === SHOULDER_PAGE_TYPE.ABOUT}
      >
        <AboutPage
          featuredImage={featured_image_link?.url && featuredImage}
          data={CMSData}
          parentProps={props}
          breadcrumbs={breadcrumbs}
          taggedCity={taggedCity}
          primaryCity={primaryCity}
          isMobile={isMobile}
          relatedContentPages={relatedContentPages}
          poiInfo={poiInfo}
          automatedBreadcrumbsExists={automatedBreadcrumbsExists}
          categoryTourListData={categoryTourListData}
          extractedBreadcrumbsSlice={extractedBreadcrumbsSlice}
          extractedProductCardsSlice={extractedProductCardsSlice}
        />
      </Conditional>
      <Conditional
        if={isRevampedPage && shoulder_page_type === SHOULDER_PAGE_TYPE.TIMINGS}
      >
        <TimingsPage
          featuredImage={collectionFeaturedImage}
          data={CMSData}
          parentProps={props}
          breadcrumbs={breadcrumbs}
          taggedCity={taggedCity}
          primaryCity={primaryCity}
          isMobile={isMobile}
          relatedContentPages={relatedContentPages}
          poiInfo={poiInfo}
          childPoisInfo={childPoisInfo}
          automatedBreadcrumbsExists={automatedBreadcrumbsExists}
          categoryTourListData={categoryTourListData}
          extractedProductCardsSlice={extractedProductCardsSlice}
          // @ts-ignore
          extractedPrismicBreadcrumbs={extractedPrismicBreadcrumbs}
        />
      </Conditional>
      <StyledContentPage>
        <ProductsContextProvider ready={false}>
          <InteractionContextProvider>
            <LongForm
              content={longFormContent}
              prismicDocsForListicle={prismicDocsForListicle}
              collectionsInListicles={collectionsInListicles}
              automatedBreadcrumbsExists={automatedBreadcrumbsExists}
              isContentPage
              trackProductCardsViewed={isPlanYourVisitCardsExpEligible}
              {...props}
              {...(shouldReorderProductCardsExp && {
                categoryTourListData: {
                  ...categoryTourListData,
                  productCardsLimit: PRODUCT_CARDS_LIMIT,
                },
              })}
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
          shoulder_page_type === SHOULDER_PAGE_TYPE.DIRECTIONS ||
          shoulder_page_type === SHOULDER_PAGE_TYPE.PLAN_YOUR_VISIT
        }
        isLTT={isLTT}
      />
    </div>
  );
};

export default ContentPage;
