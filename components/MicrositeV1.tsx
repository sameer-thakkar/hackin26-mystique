import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import { useRecoilValue } from 'recoil';
import { strings } from 'const/strings';
import SafeDFBannerWrapper from 'UI/SafeDFBannerWrapper';
import {
  isSafetyIncluded,
  getDFValidityFromTags,
  legacyBooleanCheck,
} from 'utils';
import { LOCATION } from 'assets/SvgIcons';
import { fetchInventory, fetchTourList } from 'utils/apiUtils';
import { currencyAtom } from 'store/atoms/currency';
import { useWindowWidth } from '@react-hook/window-size';

import Header from './common/Header';
import Banner from './Banner';
import LongForm from './common/LongForm';
import PopulateHead from './common/meta';
import Footer from './common/Footer';
import PopulateUncategorizedProducts from './PopulateUncategorizedProducts';
import Analytics from '../utils/analytics';
import allToursParser from '../utils/allToursParser';
import { InteractionContextProvider } from '../contexts/Interaction';
import { docCookies, csvTgidToArray, getLangObject } from '../utils/helper';
import {
  ANALYTICS_EVENTS,
  ALLOW_IMMEDIEATE_NESTING,
  THEMES,
} from '../constants';
import { groupSlices } from '../utils/helper';
import { ProductsContextProvider } from '../contexts/Products';
import { tourListApiParser } from '../utils/dataParsers';
import TextBanner from './TextBanner';
import Conditional from './common/Conditional';
import { ResponsiveSelector } from './MicrositeV2/ResponsiveSelector';
import { withAmp } from './common/withAmp';

const FreeTourPopup = dynamic(() => import('./FreeTourPopup'), { ssr: false });
const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });
const MicrobrandList = dynamic(() => import('./MicrobrandsList'));
const Alert = dynamic(() => import('UI/Alert'), { ssr: false });
const DismissAlert = dynamic(() => import('UI/DismissAlert'), { ssr: false });

const CoverSlicesWrapper = styled.div`
  margin-bottom: 32px;
`;

const apiCache = {}; // replace with swr.
const MicrositeV1 = (props) => {
  const analytics = new Analytics();
  const [isMobile, setIsMobile] = useState(props?.isMobile);
  const windowWidth = useWindowWidth();

  const [earliestAvailabilityQueue, setEarliestAvailabilityQueue] = useState(
    []
  );
  const currency = useRecoilValue(currencyAtom);
  const [tourPrices, setTourPrices] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  const [showEarliestAvailability, setShowEarliestAvailability] = useState(
    null
  );
  const [freeTourPopupOpen, toggleFreeTourPopup] = useState(false);
  const [covidAlertActive, toggleCovidAlert] = useState(false);
  const [groupBookingModalActive, toggleGroupBookingModal] = useState(false);

  const { toursList, data: prismicData, tgidToScroll } = props;

  const {
    isAmp,
    data,
    offerData,
    mbTheme,
    scorpioData,
    activeCurrency,
  } = props;
  const { refs, uid, lang } = data;
  const {
    contentFramework,
    commonFooter,
    secondaryFooter,
    commonHeader,
  } = refs;
  const { data: micrositeData } = data;
  const {
    localization,
    images: bannerImages,
    heading: bannerHeading,
    banner_subtext: bannerSubtext,
    banner_cta_text: bannerCtaText,
    page_url: pageUrl,
    auto_banner: autoBanner,
    hide_banner_cta: hideBannerCTA,
    banner_limit: bannerLimit,
    body1: uncategorizedTours,
    show_covid19_alert: showCovid19Alert,
    body4: coverSlices,
    currencies_list,
  } = micrositeData;

  const headerCurrencies = currencies_list.filter((c) => c?.currency);

  const currentLanguage = getLangObject(lang).short;
  const tourRanking = uncategorizedTours[0]?.primary?.ranking;
  const checkIfToursAvailable = toursList.length > 0;
  const uncategorizedToursList = toursList;
  const uncategorizedToursHeading = checkIfToursAvailable
    ? uncategorizedTours[0].primary
    : '';

  const footerLogoURL =
    commonFooter?.data?.logo?.url ||
    micrositeData.footer_logo.url ||
    micrositeData.footer_logo_link?.url;
  const footerPoweredByHeadout =
    commonFooter?.data?.powered_by_superbrand ||
    micrositeData.powered_by_superbrand ||
    false;
  const invertFooterLogoColor =
    commonFooter?.data?.invert_logo_color ||
    micrositeData.invert_footer_logo_color;

  const footerLogoAlt =
    commonFooter?.data?.logo?.alt ||
    micrositeData.footer_logo.alt ||
    micrositeData?.footer_logo_alt;
  let footerThemeOverride =
    commonFooter?.data?.theme_override || THEMES.INHERIT;
  footerThemeOverride = micrositeData.theme_override || THEMES.INHERIT;

  const isHeaderInherited =
    commonHeader &&
    commonHeader?.lang !== getLangObject(currentLanguage).paramLang;
  const isFooterInherited =
    commonFooter &&
    commonFooter?.lang !== getLangObject(currentLanguage).paramLang;
  const withCommonHeaderOverrides = {
    ...micrositeData,
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
  const CMSData = micrositeData;
  const { instant_checkout: instantCheckout = false } = CMSData;
  const dropdownLinks =
    dropdown_menu?.reduce((acc, item) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    }, []) || [];
  const hasDropdownLinks =
    legacyBooleanCheck(enableDropdownLinks) && dropdownLinks.length;
  const languages = legacyBooleanCheck(hasLanguageSelector)
    ? localization.filter((lang) => lang.language)
    : [];

  const showGroupBooking = legacyBooleanCheck(enableGroupBooking);
  const { results: productOffer } = offerData ? offerData : { results: [] };
  const hasOffer = productOffer.length > 0;
  const offerPopup = hasOffer ? productOffer[0] : null;
  const {
    group_booking_excluded_tgids: groupBookingExcludedTgids,
  } = micrositeData;
  const disclaimerText =
    commonFooter?.data?.disclaimer_text ||
    RichText.asText(micrositeData.disclaimer);
  const microbrandType =
    commonFooter?.data?.microbrand_type || micrositeData.microbrand_type;
  const showDisclaimer =
    commonFooter?.data?.show_disclaimer || micrositeData.show_disclaimer;
  const microbrandCards = micrositeData.microbrand_cards;
  const microbrandCardsHeading = micrositeData.microbrand_cards_heading
    ? micrositeData.microbrand_cards_heading
    : null;
  let groupBookingTourTitles = [];

  let alertPopup = null;
  if (micrositeData?.alert_popup?.id) {
    alertPopup = micrositeData.alert_popup;
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
            (tour.tour_title_override || scorpioData[tour.tgid]?.title) +
            ` [${tour.tgid}]`,
          label: tour.tour_title_override || scorpioData[tour.tgid]?.title,
        });
      });
  }

  const uncategorizedToursData =
    showEarliestAvailability || instantCheckout
      ? uncategorizedToursList.map((tour) => ({
          ...tour,
          earliestAvailability: earliestAvailabilityQueue[tour.tgid],
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
    host,
    isDev,
    serverRequestStartTimestamp,
  } = props;
  const slices = contentFramework?.data?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const pricingData = {
    isFetched: isFetched,
    cardPrices: tourPrices,
  };
  const allTours = allToursParser(CMSData, scorpioData, pricingData, isAmp);

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

  const tours = scorpioData || {};
  const hasSafe = Object.values(tours).some((tour: any) =>
    isSafetyIncluded(tour.allTags)
  );
  const filterDFTours = ([, tour]: [any, any]) => tour && tour.dfListingPrice;
  const filterMainTourSectionTGIDs = ([tgid]: [any, any]) =>
    orderedUncategorizedTours.findIndex((t) => t.tgid == tgid) > -1;

  const dfTours = Object.entries(tours)
    .filter(filterDFTours)
    .filter(filterMainTourSectionTGIDs)
    .map(([, tours]) => tours);

  const [dfExpiryDate, ..._otherValidity] = dfTours
    .map((tour: any) => getDFValidityFromTags(tour.allTags))
    .filter((d) => d)
    .sort((a, b) => (dayjs(a).isAfter(b) ? -1 : 1));

  const finalHeaderSlices = !isHeaderInherited
    ? groupSlices(headerSlices || [], ALLOW_IMMEDIEATE_NESTING)
    : [];
  const finalHeaderLinks =
    headerLinks && !isHeaderInherited ? headerLinks : null;

  useEffect(() => {
    setIsMobile(windowWidth < 768);
  }, [windowWidth]);

  useEffect(() => {
    const fetchTourGroupPrices = async ({
      finalTgids,
      variantTgids,
      currency,
    }) => {
      if (apiCache[currency]) {
        setTourPrices(apiCache[currency]);
        setIsFetched(true);
        return;
      }
      const tourGroupPricePromise = fetchTourList({
        tgids: finalTgids,
        currency,
      }).then((res) => {
        const HSID = docCookies.getItem('h-sid');
        analytics.sendHsidToDataLayer({ 'h-sid': HSID });
        return res.json();
      });

      const fetchVariantPrices = variantTgids.map(({ tgid }) =>
        fetchInventory({ tgid, 'for-days': 2, currency })
      );

      const [tourGroup, ...variants] = await Promise.all([
        tourGroupPricePromise,
        ...fetchVariantPrices,
      ]);
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
      const finalTourPrices = Object.assign(tourGroupPrices, variantPrices);
      apiCache[currency] = finalTourPrices;
      setTourPrices(finalTourPrices);
      setIsFetched(true);
    };
    const { data } = prismicData;
    const { all_tours } = data;
    const allTourTgids = all_tours.reduce((acc, tour) => {
      return [...acc, parseInt(tour.primary.tgid)];
    }, []);
    const checkIfToursAvailable = toursList.length > 0;
    const hasAllTours = allTourTgids.length > 0;

    const variantTgids = toursList
      .filter((t) => t.tgid && t.tid)
      .map((t) => ({ tgid: t.tgid, tid: t.tid }));
    const tourGroupTgids = toursList
      .filter((t) => t.tgid && !t.tid)
      .map((t) => t.tgid);

    const finalTgids = [...tourGroupTgids, ...allTourTgids];
    if (checkIfToursAvailable || hasAllTours) {
      fetchTourGroupPrices({ finalTgids, variantTgids, currency });
    }
  }, [currency]);

  useEffect(() => {
    const fetchEarlistAvailability = async ({ toursList, currency = null }) => {
      const requestQueue = toursList.map(({ tgid }) =>
        fetchInventory({ tgid, currency })
      );
      const response: Array<any> = await Promise.all(requestQueue).then(
        (res): any =>
          res.reduce((acc: any, tour: any, index) => {
            const tgid = toursList[index].tgid;
            return {
              ...acc,
              [tgid]: {
                startDate: tour?.inventoryList?.[0]?.startDate || '',
                startTime: tour?.inventoryList?.[0]?.startTime || '',
              },
            };
          }, {})
      );
      setEarliestAvailabilityQueue(response);
      setShowEarliestAvailability(true);
    };
    const { data, lang } = prismicData;
    const { baseLangPageTitle } = data;
    const currentLanguage = getLangObject(lang).short;

    const {
      enable_earliest_availability: enableEarliestAvailability,
      instant_checkout: instantCheckout,
    } = data;
    const showEarliestAvailability = legacyBooleanCheck(
      enableEarliestAvailability
    );

    if (showEarliestAvailability || instantCheckout) {
      fetchEarlistAvailability({
        toursList,
      });
    }

    if (tgidToScroll) {
      scroller.scrollTo(tgidToScroll, {
        duration: 1500,
        delay: 100,
        offset: isMobile ? -80 : -100,
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
  }, []);

  const onTogglePopup = () => {
    toggleFreeTourPopup(!freeTourPopupOpen);
  };

  const onCovidAlertClose = () => {
    toggleCovidAlert(false);
  };

  const openGroupBookingModal = () => {
    analytics.pushToDataLayer({
      event: 'Group Form Viewed',
    });
    toggleGroupBookingModal(true);
  };

  const closeGroupBookingModal = () => toggleGroupBookingModal(false);

  return (
    <div>
      <div className="microsite-container">
        {groupBookingModalActive && (
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
        )}
        <PopulateHead
          {...{
            ...micrositeData,
            localization: languages,
            datePublished,
            dateModified,
            lang,
            isDev,
            originalHost: host,
            currentLanguage,
            serverRequestStartTimestamp,
            mbTheme,
            isAmp,
            isMobile,
          }}
        />
        <Header
          languages={languages ? languages : null}
          headerLinks={finalHeaderLinks}
          logoUrl={logoUrl || uploadedLogoUrl || null}
          logoAltText={altText || logoAltText}
          currentLanguage={currentLanguage ? currentLanguage : null}
          uid={uid}
          openGroupBookingModal={openGroupBookingModal}
          isMobile={isAmp || isMobile}
          hasLanguageSelector={hasLanguageSelector}
          showGroupBooking={showGroupBooking}
          enableBuyTickets={enableBuyTickets}
          logoRedirectionURL={logoRedirectionURL?.url || pageUrl}
          host={host}
          hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo}
          slices={finalHeaderSlices}
          dropdownLinks={!isHeaderInherited ? dropdownLinks : null}
          hasDropdownLinks={!isHeaderInherited ? hasDropdownLinks : null}
          isAmp={isAmp}
          headerCurrencies={headerCurrencies}
          currentCurrency={activeCurrency}
        />
        {showCovid19Alert && covidAlertActive ? (
          <DismissAlert
            readMoreLink={strings.COVID19_ALERT.LINK}
            readMore={strings.READ_MORE}
            keyText={strings.COVID19_ALERT.KEY_TEXT}
            text={strings.COVID19_ALERT.TEXT}
            handleClose={onCovidAlertClose}
          />
        ) : null}
        {isMobile && hasDropdownLinks ? (
          <div className="main-wrapper city-selector">
            <ResponsiveSelector
              options={dropdownLinks}
              host={host}
              isMobile={isMobile}
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
            bannerSubtext={bannerSubtext}
            bannerCtaText={bannerCtaText ? bannerCtaText : null}
            currentLanguage={currentLanguage ? currentLanguage : null}
            isMobile={isAmp || isMobile}
            boxed={true}
            hideCTA={hideBannerCTA}
            isAmp={isAmp}
            dfExpiryDate={dfExpiryDate || null}
            cooldownDate={dayjs().add(30, 'day')}
          />
        </Conditional>
        <Conditional if={mbTheme === THEMES.MIN_BLUE}>
          <TextBanner bannerHeading={bannerHeading ? bannerHeading : null} />
        </Conditional>
        {alertPopup ? (
          <Alert popupUID={alertPopup.uid} currentLanguage={currentLanguage} />
        ) : null}
        {coverSlices.length ? (
          <CoverSlicesWrapper>
            <LongForm content={coverSlices} isMobile={isAmp || isMobile} />
          </CoverSlicesWrapper>
        ) : null}
        <SafeDFBannerWrapper
          hasSafe={hasSafe}
          dfExpiryDate={dfExpiryDate}
          isAmp={isAmp}
          isMobile={isMobile}
        />
        {checkIfToursAvailable ? (
          <PopulateUncategorizedProducts
            uncategorizedTours={orderedUncategorizedTours}
            scorpioData={scorpioData}
            uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
            tourPrices={tourPrices}
            uid={uid}
            isAmp={isAmp}
            currentLanguage={currentLanguage}
            bookNowText={bookNowText}
            readMoreText={readMoreText}
            showLessText={showLessText}
            productOffer={productOffer}
            hasOffer={hasOffer}
            isFetched={isFetched}
            togglePopup={onTogglePopup}
            pageUrl={pageUrl}
            isMobile={isAmp || isMobile}
            host={host}
            analytics={analytics}
            ranking={tourRanking}
            mbTheme={mbTheme}
            allToursTabContent={allTours}
            instantCheckout={instantCheckout}
            showEarliestAvailability={showEarliestAvailability}
          />
        ) : null}
        <Conditional
          if={
            microbrandCards?.filter((mbCard) => mbCard.microbrand_link)?.length
          }
        >
          <MicrobrandList
            microbrandCards={microbrandCards}
            microbrandCardsHeading={microbrandCardsHeading}
          />
        </Conditional>
        <ProductsContextProvider allTours={allTours} ready={isFetched}>
          <InteractionContextProvider>
            {longFormContent ? (
              <LongForm
                content={[...longFormContent, ...contentFWSlices]}
                isMobile={isAmp || isMobile}
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
          showDisclaimer={showDisclaimer}
          disclaimerText={disclaimerText}
          microbrandType={microbrandType}
          slices={!isFooterInherited ? commonFooter?.data?.body || [] : []}
          invertLogoColor={invertFooterLogoColor}
          themeOverride={footerThemeOverride}
          secondaryHeading={secondaryFooter?.data?.footer_heading}
          primaryHeading={commonFooter?.data?.footer_heading}
          secondarySlices={
            !isFooterInherited ? secondaryFooter?.data?.body || [] : []
          }
        />
        {hasOffer && (
          <FreeTourPopup
            popupState={freeTourPopupOpen}
            togglePopup={onTogglePopup}
            productOffer={offerPopup}
            scorpioData={scorpioData}
            isMobile={isAmp || isMobile}
          />
        )}
      </div>
    </div>
  );
};

export default withAmp(MicrositeV1);
