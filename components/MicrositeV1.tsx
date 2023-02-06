import React, { ComponentType, useEffect, useState } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import { useWindowWidth } from '@react-hook/window-size';
import { useRecoilValue } from 'recoil';
import { currencyAtom } from 'store/atoms/currency';
import { gtmAtom } from 'store/atoms/gtm';
import { mediaUpgradeExperimentAtom } from 'store/atoms/mediaupgrade';
import { InteractionContextProvider } from 'contexts/Interaction';
import { ProductsContextProvider } from 'contexts/Products';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import LongForm from 'components/common/LongForm';
import PopulateMeta from 'components/common/NextSeoMeta';
import PopulateProducts from 'components/PopulateProducts';
import TextBanner from 'components/TextBanner';
import Conditional from 'components/common/Conditional';
import {
  getAlternateLanguages,
  getHeadoutLanguagecode,
  legacyBooleanCheck,
} from 'utils';
import { sendVariableToDataLayer, trackEvent } from 'utils/analytics';
import allToursParser from 'utils/allToursParser';
import { csvTgidToArray, getLangObject, groupSlices } from 'utils/helper';
import { LOCATION } from 'assets/SvgIcons';
import {
  ANALYTICS_EVENTS,
  ALLOW_IMMEDIEATE_NESTING,
  THEMES,
  PAGE_TYPES,
  ANALYTICS_PROPERTIES,
  MEDIAUPGRADE_EXPERIMENT_PROPERTIES,
} from 'const/index';
import { strings } from 'const/strings';
import renderShortCodes from 'utils/shortCodes';
import { getLogoRedirectionUrl, convertUidToUrl } from 'utils/urlUtils';

const FreeTourPopup = dynamic(() => import('./FreeTourPopup'), { ssr: false });
const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });
const MicrobrandList = dynamic(() => import('./MicrobrandsList'));
const Alert = dynamic(() => import('UI/Alert'), { ssr: false });
const DismissAlert = dynamic(() => import('UI/DismissAlert'), { ssr: false });
const ResponsiveSelector: ComponentType<any> = dynamic(
  () =>
    import('components/MicrositeV2/ResponsiveSelector').then(
      (m) => m.ResponsiveSelector
    ),
  { ssr: false }
);
const Banner = dynamic(() => import('components/Banner'));
const StaticBanner = dynamic(() => import('components/StaticBanner/index'));

const CoverSlicesWrapper = styled.div`
  margin-bottom: 32px;
`;

const MicrositeV1 = (props: any) => {
  const {
    toursList: uncategorizedToursList,
    tgidToScroll,
    data,
    offerData,
    mbTheme,
    scorpioData: scorpioDataUncategorised,
    host,
    isDev,
    serverRequestStartTimestamp,
    categoryTourListData,
    domainConfig,
    aggregatedRatingDetails,
  } = props;

  const [isMobile, setIsMobile] = useState(props?.isMobile);
  const windowWidth = useWindowWidth();

  const currency = useRecoilValue(currencyAtom);
  const mediaUpgradeExperiment = useRecoilValue(mediaUpgradeExperimentAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const [freeTourPopupOpen, toggleFreeTourPopup] = useState(false);
  const [covidAlertActive, toggleCovidAlert] = useState(false);
  const [groupBookingModalActive, toggleGroupBookingModal] = useState(false);
  const [
    isExperimentViewedTriggered,
    setIsExperimentViewedTriggered,
  ] = useState(false);

  const {
    refs,
    uid,
    lang,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    data: micrositeData,
    alternate_languages,
  } = data;
  const {
    contentFramework,
    commonFooter,
    secondaryFooter,
    commonHeader,
  } = refs;
  const {
    attraction: attractionCMS,
    images: bannerImages,
    heading: bannerHeading,
    banner_subtext: bannerSubtext,
    banner_cta_text: bannerCtaText,
    auto_banner: autoBanner,
    hide_banner_cta: hideBannerCTA,
    banner_limit: bannerLimit,
    body1: uncategorizedTours,
    show_covid19_alert: showCovid19Alert,
    body4: coverSlices,
    currencies_list,
    group_booking_excluded_tgids: groupBookingExcludedTgids,
    microbrand_cards: microbrandCards,
    microbrand_cards_heading: microbrandCardsHeadingCMS,
    alert_popup: alertPopupCMS,
    disclaimer: disclaimerCMS,
    show_disclaimer: showDisclaimerCMS,
    theme_override: themeOverrideCMS,
    instant_checkout: instantCheckout = false,
    enable_earliest_availability: enableEarliestAvailability,
    baseLangPageTitle,
    baseLangShowBannerSubtext,
    baseLangisPartnered,
  } = micrositeData || {};

  const pageUrl = convertUidToUrl({ uid, lang: getHeadoutLanguagecode(lang) });

  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );

  const { data: commonFooterData } = commonFooter || {};
  const { data: secondaryFooterData } = secondaryFooter || {};
  const {
    attraction: attractionCFoot,
    body: slicesCFoot,
    footer_heading: footerHeadingCFoot,
    theme_override: themeOverrideCFoot,
    disclaimer_text: disclaimerTextCFoot,
    show_disclaimer: showDisclaimerCFoot,
  } = commonFooterData || {};
  const { footer_heading: footerHeadingSFoot, body: slicesSFoot } =
    secondaryFooterData || {};

  const headerCurrencies = currencies_list.filter((c: any) => c?.currency);

  const currentLanguage = getLangObject(lang).code;
  const isCategorisedTours = Object.keys(categoryTourListData)?.length > 0;
  const {
    scorpioData: scorpioDataCategorised,
    orderedTours: categorizedToursList,
    collectionVideo,
  } = categoryTourListData || {};
  const tourRanking = uncategorizedTours[0]?.primary?.ranking;
  const hasTours = isCategorisedTours
    ? categorizedToursList
    : uncategorizedToursList.length > 0;
  const uncategorizedToursHeading = hasTours
    ? isCategorisedTours
      ? ''
      : uncategorizedTours[0].primary
    : '';
  const scorpioData = isCategorisedTours
    ? scorpioDataCategorised
    : scorpioDataUncategorised;

  const {
    faviconUrl,
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};

  const footerAttractionName = attractionCFoot || attractionCMS || 'attraction';
  let footerThemeOverride = themeOverrideCFoot || THEMES.INHERIT;
  footerThemeOverride = themeOverrideCMS || THEMES.INHERIT;

  const isHeaderInherited =
    commonHeader?.lang !== getLangObject(currentLanguage).locale;
  const isFooterInherited =
    commonFooter?.lang !== getLangObject(currentLanguage).locale;
  const isSecondaryFooterInherited =
    secondaryFooter?.lang !== getLangObject(currentLanguage).locale;
  const withCommonHeaderOverrides = {
    ...micrositeData,
    ...commonHeader?.data,
  };
  let {
    body2: longFormContent,
    book_now_text: bookNowText,
    read_more_text: readMoreText,
    show_less_text: showLessText,
    enable_group_booking: enableGroupBooking,
    enable_buy_tickets_shortcut: enableBuyTickets,
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
  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    host,
  });

  const dropdownLinks =
    dropdown_menu?.reduce((acc: any, item: any) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    }, []) || [];
  const hasDropdownLinks =
    legacyBooleanCheck(enableDropdownLinks) && dropdownLinks.length;

  const showGroupBooking = legacyBooleanCheck(enableGroupBooking);
  const { results: productOffer } = offerData ? offerData : { results: [] };
  const hasOffer = productOffer.length > 0;
  const offerPopup = hasOffer ? productOffer[0] : null;
  const disclaimerText = disclaimerTextCFoot || RichText.asText(disclaimerCMS);
  const showDisclaimer = showDisclaimerCFoot || showDisclaimerCMS;
  const microbrandCardsHeading = microbrandCardsHeadingCMS
    ? microbrandCardsHeadingCMS
    : null;
  let groupBookingTourTitles: any = [];

  let alertPopup = null;
  if (alertPopupCMS?.id) {
    alertPopup = alertPopupCMS;
  }

  if (showGroupBooking) {
    uncategorizedToursList
      .filter(function (tour: any) {
        return !groupBookingExcludedTgids.find(function (excludedTour: any) {
          return tour.tgid === excludedTour.tgid;
        });
      })
      .forEach((tour: any) => {
        groupBookingTourTitles.push({
          value:
            (tour.tour_title_override || scorpioData[tour.tgid]?.title) +
            ` [${tour.tgid}]`,
          label: tour.tour_title_override || scorpioData[tour.tgid]?.title,
        });
      });
  }

  const sortTours = (
    tgidToScroll: any,
    toursArray: any,
    isCategorisedTours: any
  ) => {
    if (!tgidToScroll) return toursArray;
    if (tgidToScroll) {
      return toursArray?.reduce((accum = [], item: any) => {
        const tgid = isCategorisedTours ? +tgidToScroll : tgidToScroll;
        if (item.tgid === tgid) {
          return [item, ...accum];
        } else {
          return [...accum, item];
        }
      }, []);
    }
  };

  const orderedTGIDRanking = csvTgidToArray(tourRanking);
  const orderedUncategorizedTours = isCategorisedTours
    ? sortTours(tgidToScroll, categorizedToursList, isCategorisedTours)
    : sortTours(tgidToScroll, uncategorizedToursList, isCategorisedTours);

  const orderedTours =
    isCategorisedTours || tgidToScroll
      ? orderedUncategorizedTours
      : orderedTGIDRanking?.length
      ? [...orderedUncategorizedTours]?.sort((tourA, tourB) => {
          return (
            orderedTGIDRanking?.indexOf(parseInt(tourA.tgid)) -
            orderedTGIDRanking?.indexOf(parseInt(tourB.tgid))
          );
        })
      : orderedUncategorizedTours;

  const orderedTgids = orderedTours?.length
    ? orderedTours?.map((tour: any) => tour.tgid)
    : [];

  const slices = contentFramework?.data?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];

  const hasTourListContentFW: boolean = !!contentFWSlices.find(
    (slice: any) => slice.slice_type === 'tours_list'
  );

  const isReady = Object.values(scorpioData || {})?.length > 0;
  const pricingData = {
    isFetched: isReady,
    cardPrices: scorpioData,
  };

  const allTours = allToursParser(micrositeData, scorpioData, pricingData);

  let finalBannerImages = bannerImages.map((banner: any) => {
    return {
      url: banner.image_src.url || banner.uploaded_image.url,
      alt: banner.image_alt || banner.uploaded_image.alt,
      mobileUrl:
        banner.mobile_banner_url?.url ||
        banner.mobile_banner_uploaded?.url ||
        '',
    };
  });
  if (autoBanner) {
    const tgidArray = csvTgidToArray(tourRanking);
    finalBannerImages = tgidArray
      .map((tgid: any) => {
        let tour = scorpioData[tgid];
        if (tour)
          return {
            url: `https:${tour.images[0]?.url}`,
            alt: `https:${tour.images[0]?.alt}`,
          };
      })
      .slice(0, bannerLimit || orderedUncategorizedTours.length);
  }

  const finalHeaderSlices = !isHeaderInherited
    ? groupSlices(headerSlices || [], ALLOW_IMMEDIEATE_NESTING)
    : [];
  const finalHeaderLinks =
    headerLinks && !isHeaderInherited ? headerLinks : null;

  useEffect(() => {
    setIsMobile(windowWidth < 768);
  }, [windowWidth]);

  useEffect(() => {
    if (tgidToScroll) {
      scroller.scrollTo(tgidToScroll, {
        duration: 1500,
        delay: 100,
        offset: isMobile ? -80 : -100,
        smooth: 'easeInOutQuint',
      });
    }

    const renderedBaseLangPageTitle = renderShortCodes(
      baseLangPageTitle
    )?.join?.('');

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.LANGUAGE,
      value: currentLanguage,
    });

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_TITLE,
      value: renderedBaseLangPageTitle,
    });
  }, []);

  useEffect(() => {
    if (!eventsReady) return;

    const { isNewMediaSite, isOldMediaSite } = mediaUpgradeExperiment;
    if (isNewMediaSite) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
        [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
          MEDIAUPGRADE_EXPERIMENT_PROPERTIES.NAME,
        [ANALYTICS_PROPERTIES.EXPERIMENT_VARIANT]:
          MEDIAUPGRADE_EXPERIMENT_PROPERTIES.TREATMENT,
      });
      setIsExperimentViewedTriggered(true);
    } else if (isOldMediaSite) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
        [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
          MEDIAUPGRADE_EXPERIMENT_PROPERTIES.NAME,
        [ANALYTICS_PROPERTIES.EXPERIMENT_VARIANT]:
          MEDIAUPGRADE_EXPERIMENT_PROPERTIES.CONTROL,
      });
      setIsExperimentViewedTriggered(true);
    }
  }, [eventsReady]);

  useEffect(() => {
    if (!eventsReady) return;
    const renderedBaseLangPageTitle = renderShortCodes(
      baseLangPageTitle
    )?.join?.('');

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGIDS]: orderedTgids,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: renderedBaseLangPageTitle,
    });
  }, [eventsReady]);

  const onTogglePopup = () => {
    toggleFreeTourPopup(!freeTourPopupOpen);
  };

  const onCovidAlertClose = () => {
    toggleCovidAlert(false);
  };

  const openGroupBookingModal = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.GROUP_FORM_VIEWED,
    });

    toggleGroupBookingModal(true);
  };

  const availableTours = orderedTours?.filter(
    (tour: any) => scorpioData?.[tour?.tgid]?.available
  );

  const isToursAvailable = availableTours?.length > 0;
  const { isNewMediaSite } = mediaUpgradeExperiment;
  const closeGroupBookingModal = () => toggleGroupBookingModal(false);
  const tourListSection = (
    <PopulateProducts
      currency={currency}
      uncategorizedTours={orderedTours}
      scorpioData={scorpioData}
      uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
      uid={uid}
      currentLanguage={currentLanguage}
      bookNowText={bookNowText}
      readMoreText={readMoreText}
      showLessText={showLessText}
      productOffer={productOffer}
      hasOffer={hasOffer}
      togglePopup={onTogglePopup}
      pageUrl={pageUrl}
      isMobile={isMobile}
      host={host}
      mbTheme={mbTheme}
      instantCheckout={instantCheckout}
      enableEarliestAvailability={enableEarliestAvailability}
      mediaUpgradeExperiment={mediaUpgradeExperiment}
      bannerVideo={collectionVideo}
    />
  );
  return (
    <div>
      <div className="microsite-container">
        <Conditional if={groupBookingModalActive}>
          <GroupBooking
            closeGroupBookingModal={() => closeGroupBookingModal}
            groupBookingTourTitles={groupBookingTourTitles}
            blackoutStartDate={blackoutStartDate}
            blackoutEndDate={blackoutEndDate}
            blockNDaysGroupBooking={blockNDaysGroupBooking}
            minimumPax={minimumPax ? minimumPax : 10}
            maximumPax={maximumPax ? maximumPax : undefined}
            blockedDays={blockedDays || ''}
            isMobile={isMobile}
            disclaimer={groupBookingDisclaimer}
            theme={mbTheme}
          />
        </Conditional>
        <PopulateMeta
          {...{
            prismicData: micrositeData,
            datePublished,
            dateModified,
            serverRequestStartTimestamp,
            languages: alternateLanguages,
            isMobile,
            bannerImages: finalBannerImages,
            faviconUrl,
            logoUrl: logoUrl,
            ...(isNewMediaSite && {
              aggregatedRatingDetails,
            }),
          }}
        />
        <Header
          languages={alternateLanguages}
          headerLinks={finalHeaderLinks}
          logoUrl={logoUrl}
          logoAltText={whiteLabelName || ''}
          currentLanguage={currentLanguage ? currentLanguage : null}
          uid={uid}
          openGroupBookingModal={openGroupBookingModal}
          isMobile={isMobile}
          showGroupBooking={showGroupBooking}
          enableBuyTickets={isToursAvailable ? enableBuyTickets : false}
          logoRedirectionURL={logoRedirectionUrl || pageUrl}
          host={host}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          slices={finalHeaderSlices}
          dropdownLinks={!isHeaderInherited ? dropdownLinks : null}
          hasDropdownLinks={!isHeaderInherited ? hasDropdownLinks : null}
          headerCurrencies={headerCurrencies}
        />
        <Conditional if={showCovid19Alert && covidAlertActive}>
          <DismissAlert
            readMoreLink={strings.COVID19_ALERT.LINK}
            readMore={strings.READ_MORE}
            keyText={strings.COVID19_ALERT.KEY_TEXT}
            text={strings.COVID19_ALERT.TEXT}
            handleClose={onCovidAlertClose}
          />
        </Conditional>
        <Conditional if={isMobile && hasDropdownLinks}>
          <div className="main-wrapper city-selector">
            <ResponsiveSelector
              options={dropdownLinks}
              host={host}
              isMobile={isMobile}
              onChange={(option: any) => {
                window.location.href = option.value;
              }}
              iconPosition={'left'}
              icon={LOCATION}
              addPadding={true}
              toggleIcon={false}
            />
          </div>
        </Conditional>
        <Conditional if={mbTheme !== THEMES.MIN_BLUE && !isNewMediaSite}>
          <Banner
            bannerImages={finalBannerImages ? finalBannerImages : null}
            bannerHeading={bannerHeading ? bannerHeading : null}
            bannerCtaText={bannerCtaText ? bannerCtaText : null}
            bannerSubtext={bannerSubtext}
            showBannerSubtext={baseLangShowBannerSubtext}
            isPartnered={baseLangisPartnered}
            // @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
            currentLanguage={currentLanguage ? currentLanguage : null}
            isMobile={isMobile}
            boxed={true}
            hideCTA={isToursAvailable ? hideBannerCTA : true}
            orderedTgids={orderedTgids}
          />
        </Conditional>
        <Conditional if={isNewMediaSite}>
          <StaticBanner
            bannerVideo={collectionVideo}
            bannerImages={finalBannerImages ? finalBannerImages : null}
            bannerHeading={bannerHeading ? bannerHeading : null}
            showBannerSubtext={baseLangShowBannerSubtext}
            isMobile={isMobile}
            aggregatedRatingDetails={aggregatedRatingDetails}
            isExperimentViewedTriggered={isExperimentViewedTriggered}
            isPartnered={baseLangisPartnered}
          />
        </Conditional>
        <Conditional if={mbTheme === THEMES.MIN_BLUE}>
          <TextBanner bannerHeading={bannerHeading ? bannerHeading : null} />
        </Conditional>
        <Conditional if={alertPopup}>
          <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
        </Conditional>
        <Conditional if={coverSlices?.length}>
          <CoverSlicesWrapper>
            <LongForm content={coverSlices} isMobile={isMobile} />
          </CoverSlicesWrapper>
        </Conditional>

        <Conditional if={hasTours && !hasTourListContentFW && isToursAvailable}>
          {tourListSection}
        </Conditional>

        <Conditional
          if={
            microbrandCards?.filter((mbCard: any) => mbCard.microbrand_link)
              ?.length
          }
        >
          <MicrobrandList
            microbrandCards={microbrandCards}
            microbrandCardsHeading={microbrandCardsHeading}
          />
        </Conditional>
        <ProductsContextProvider allTours={allTours} ready={isReady}>
          <InteractionContextProvider>
            <Conditional if={longFormContent}>
              <LongForm
                tourListSection={tourListSection}
                content={[...longFormContent, ...contentFWSlices]}
                isMobile={isMobile}
              />
            </Conditional>
          </InteractionContextProvider>
        </ProductsContextProvider>
        <Footer
          currentLanguage={currentLanguage}
          attraction={footerAttractionName}
          logoURL={logoUrl}
          logoAlt={whiteLabelName || ''}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          showDisclaimer={showDisclaimer}
          disclaimerText={disclaimerText}
          slices={!isFooterInherited ? slicesCFoot || [] : []}
          themeOverride={footerThemeOverride}
          secondaryHeading={footerHeadingSFoot}
          primaryHeading={footerHeadingCFoot}
          secondarySlices={!isSecondaryFooterInherited ? slicesSFoot || [] : []}
        />
        <Conditional if={hasOffer}>
          <FreeTourPopup
            popupState={freeTourPopupOpen}
            togglePopup={onTogglePopup}
            productOffer={offerPopup}
            scorpioData={scorpioData}
            isMobile={isMobile}
          />
        </Conditional>
      </div>
    </div>
  );
};

export default MicrositeV1;
