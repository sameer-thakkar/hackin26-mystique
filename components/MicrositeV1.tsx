import React, { ComponentType, useEffect, useState } from 'react';
import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import { useRecoilValue } from 'recoil';
import { currencyAtom } from 'store/atoms/currency';
import { useWindowWidth } from '@react-hook/window-size';
import { InteractionContextProvider } from 'contexts/Interaction';
import { ProductsContextProvider } from 'contexts/Products';
import Banner from 'components/Banner';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import LongForm from 'components/common/LongForm';
import PopulateProducts from 'components/PopulateProducts';
import TextBanner from 'components/TextBanner';
import Conditional from 'components/common/Conditional';
import { withAmp } from 'components/common/withAmp';
import MultiBannerWrapper from 'UI/MultiBannerWrapper';
import {
  getAlternateLanguages,
  isSafetyIncluded,
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
} from 'const/index';
import { strings } from 'const/strings';
import { fetchTourList } from 'utils/apiUtils';
import { tourListApiParser } from 'utils/dataParsers';
import PopulateMeta from 'components/common/NextSeoMeta';
import renderShortCodes from 'utils/shortCodes';

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

const CoverSlicesWrapper = styled.div`
  margin-bottom: 32px;
`;

const MicrositeV1 = (props) => {
  const {
    toursList: uncategorizedToursList,
    tgidToScroll,
    isAmp,
    data,
    offerData,
    mbTheme,
    scorpioData: scorpioDataUncategorised,
    activeCurrency,
    host,
    isDev,
    serverRequestStartTimestamp,
    categoryTourListData,
  } = props;
  const [isMobile, setIsMobile] = useState(props?.isMobile);
  const windowWidth = useWindowWidth();

  const currency = useRecoilValue(currencyAtom);
  const [initialCurrency] = useState(currency);
  const [freeTourPopupOpen, toggleFreeTourPopup] = useState(false);
  const [covidAlertActive, toggleCovidAlert] = useState(false);
  const [groupBookingModalActive, toggleGroupBookingModal] = useState(false);

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
    page_url: pageUrl,
    auto_banner: autoBanner,
    hide_banner_cta: hideBannerCTA,
    banner_limit: bannerLimit,
    body1: uncategorizedTours,
    show_covid19_alert: showCovid19Alert,
    body4: coverSlices,
    currencies_list,
    group_booking_excluded_tgids: groupBookingExcludedTgids,
    microbrand_type: microbrandTypeCMS,
    microbrand_cards: microbrandCards,
    microbrand_cards_heading: microbrandCardsHeadingCMS,
    alert_popup: alertPopupCMS,
    disclaimer: disclaimerCMS,
    show_disclaimer: showDisclaimerCMS,
    footer_logo: footerLogoCMS,
    footer_logo_link: footerLogoLinkCMS,
    footer_logo_alt: footerLogoAltCMS,
    invert_footer_logo_color: invertFooterLogoColorCMS,
    powered_by_superbrand: poweredBySuperbrandCMS,
    theme_override: themeOverrideCMS,
    instant_checkout: instantCheckout = false,
    enable_earliest_availability: enableEarliestAvailability,
    baseLangPageTitle,
  } = micrositeData || {};

  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    isAmp,
    host,
    uid
  );

  const { data: commonFooterData } = commonFooter || {};
  const { data: secondaryFooterData } = secondaryFooter || {};
  const {
    attraction: attractionCFoot,
    body: slicesCFoot,
    logo: logoCFoot,
    powered_by_superbrand: poweredBySuperbrandCFoot,
    footer_heading: footerHeadingCFoot,
    invert_logo_color: invertLogoColorCFoot,
    theme_override: themeOverrideCFoot,
    disclaimer_text: disclaimerTextCFoot,
    show_disclaimer: showDisclaimerCFoot,
    microbrand_type: microbrandTypeCFoot,
  } = commonFooterData || {};
  const { footer_heading: footerHeadingSFoot, body: slicesSFoot } =
    secondaryFooterData || {};

  const headerCurrencies = currencies_list.filter((c) => c?.currency);

  const currentLanguage = getLangObject(lang).short;
  const isCategorisedTours = Object.keys(categoryTourListData)?.length > 0;
  const {
    scorpioData: scorpioDataCategorised,
    orderedTours: categorizedToursList,
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
  const initialScorpioData = isCategorisedTours
    ? scorpioDataCategorised
    : scorpioDataUncategorised;
  const [scorpioData, setScorpioData] = useState(initialScorpioData);

  const footerLogoURL =
    logoCFoot?.url || footerLogoCMS?.url || footerLogoLinkCMS?.url;
  const footerAttractionName = attractionCFoot || attractionCMS || 'attraction';
  const footerPoweredByHeadout =
    poweredBySuperbrandCFoot || poweredBySuperbrandCMS || false;
  const invertFooterLogoColor =
    invertLogoColorCFoot || invertFooterLogoColorCMS;

  const footerLogoAlt = logoCFoot?.alt || footerLogoCMS.alt || footerLogoAltCMS;
  let footerThemeOverride = themeOverrideCFoot || THEMES.INHERIT;
  footerThemeOverride = themeOverrideCMS || THEMES.INHERIT;

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
    disable_amp: disableAMP,
    dropdown_menu,
  } = withCommonHeaderOverrides;
  const logoRedirectionURL = commonHeader
    ? !isHeaderInherited
      ? commonHeader?.data?.logo_redirection_url
      : micrositeData.logo_redirection_url
    : micrositeData.logo_redirection_url;

  disableAMP = micrositeData?.disable_amp || disableAMP;
  const { url: logoUrl } = linkedLogo;
  const { url: uploadedLogoUrl, alt: altText } = uploadedLogo;

  const dropdownLinks =
    dropdown_menu?.reduce((acc, item) => {
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
  const microbrandType = microbrandTypeCFoot || microbrandTypeCMS;
  const showDisclaimer = showDisclaimerCFoot || showDisclaimerCMS;
  const microbrandCardsHeading = microbrandCardsHeadingCMS
    ? microbrandCardsHeadingCMS
    : null;
  let groupBookingTourTitles = [];

  let alertPopup = null;
  if (alertPopupCMS?.id) {
    alertPopup = alertPopupCMS;
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

  const sortTours = (tgidToScroll, toursArray, isCategorisedTours) => {
    if (!tgidToScroll) return toursArray;
    if (tgidToScroll) {
      return toursArray?.reduce((accum = [], item) => {
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
    ? orderedTours?.map((tour) => tour.tgid)
    : [];

  const slices = contentFramework?.data?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];

  const hasTourListContentFW: boolean = !!contentFWSlices.find(
    (slice) => slice.slice_type === 'tours_list'
  );

  const isReady = Object.values(scorpioData || {})?.length > 0;
  const pricingData = {
    isFetched: isReady,
    cardPrices: scorpioData,
  };
  const allTours = allToursParser(
    micrositeData,
    scorpioData,
    pricingData,
    isAmp
  );

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

  const hasSafe = Object.values(scorpioData || {}).some((tour: any) =>
    isSafetyIncluded(tour.allTags)
  );

  const finalHeaderSlices = !isHeaderInherited
    ? groupSlices(headerSlices || [], ALLOW_IMMEDIEATE_NESTING)
    : [];
  const finalHeaderLinks =
    headerLinks && !isHeaderInherited ? headerLinks : null;
  useEffect(() => {
    if (initialCurrency !== currency) {
      fetchTourList({
        tgids: orderedTgids,
        language: currentLanguage,
        currency,
      })
        .then((res) => res.json())
        .then((data) => {
          const formattedData = tourListApiParser(data);
          setScorpioData(formattedData);
        });
    }
  }, [currency]);

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

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGIDS]: orderedTgids,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: renderedBaseLangPageTitle,
    });

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.LANGUAGE,
      value: currentLanguage,
    });

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_TITLE,
      value: renderedBaseLangPageTitle,
    });
  }, []);

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
    (tour) => scorpioData?.[tour?.tgid]?.available
  );

  const isToursAvailable = availableTours?.length > 0;
  const closeGroupBookingModal = () => toggleGroupBookingModal(false);
  const tourListSection = (
    <PopulateProducts
      currency={currency}
      uncategorizedTours={orderedTours}
      scorpioData={scorpioData}
      uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
      uid={uid}
      isAmp={isAmp}
      currentLanguage={currentLanguage}
      bookNowText={bookNowText}
      readMoreText={readMoreText}
      showLessText={showLessText}
      productOffer={productOffer}
      hasOffer={hasOffer}
      togglePopup={onTogglePopup}
      pageUrl={pageUrl}
      isMobile={isAmp || isMobile}
      host={host}
      mbTheme={mbTheme}
      instantCheckout={instantCheckout}
      enableEarliestAvailability={enableEarliestAvailability}
      disable_amp={disableAMP}
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
            isAmp,
            bannerImages: finalBannerImages,
          }}
        />
        <Header
          languages={alternateLanguages}
          headerLinks={finalHeaderLinks}
          logoUrl={logoUrl || uploadedLogoUrl || null}
          logoAltText={altText || logoAltText}
          currentLanguage={currentLanguage ? currentLanguage : null}
          uid={uid}
          openGroupBookingModal={openGroupBookingModal}
          isMobile={isAmp || isMobile}
          showGroupBooking={showGroupBooking}
          enableBuyTickets={isToursAvailable ? enableBuyTickets : false}
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
              onChange={(option) => {
                window.location.href = option.value;
              }}
              iconPosition={'left'}
              icon={LOCATION}
              addPadding={true}
              toggleIcon={false}
            />
          </div>
        </Conditional>
        <Conditional if={mbTheme !== THEMES.MIN_BLUE}>
          <Banner
            bannerImages={finalBannerImages ? finalBannerImages : null}
            bannerHeading={bannerHeading ? bannerHeading : null}
            bannerSubtext={bannerSubtext}
            bannerCtaText={bannerCtaText ? bannerCtaText : null}
            currentLanguage={currentLanguage ? currentLanguage : null}
            isMobile={isAmp || isMobile}
            boxed={true}
            hideCTA={isToursAvailable ? hideBannerCTA : true}
            isAmp={isAmp}
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
            <LongForm content={coverSlices} isMobile={isAmp || isMobile} />
          </CoverSlicesWrapper>
        </Conditional>
        <MultiBannerWrapper
          hasSafe={hasSafe}
          isAmp={isAmp}
          isMobile={isMobile}
        />

        <Conditional if={hasTours && !hasTourListContentFW && isToursAvailable}>
          {tourListSection}
        </Conditional>

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
        <ProductsContextProvider allTours={allTours} ready={isReady}>
          <InteractionContextProvider>
            <Conditional if={longFormContent}>
              <LongForm
                tourListSection={tourListSection}
                content={[...longFormContent, ...contentFWSlices]}
                isMobile={isAmp || isMobile}
                isAmp={isAmp}
              />
            </Conditional>
          </InteractionContextProvider>
        </ProductsContextProvider>
        <Footer
          currentLanguage={currentLanguage}
          attraction={footerAttractionName}
          logoURL={footerLogoURL}
          logoAlt={footerLogoAlt}
          hasPoweredByHeadoutLogo={footerPoweredByHeadout}
          showDisclaimer={showDisclaimer}
          disclaimerText={disclaimerText}
          microbrandType={microbrandType}
          slices={!isFooterInherited ? slicesCFoot || [] : []}
          invertLogoColor={invertFooterLogoColor}
          themeOverride={footerThemeOverride}
          secondaryHeading={footerHeadingSFoot}
          primaryHeading={footerHeadingCFoot}
          secondarySlices={!isFooterInherited ? slicesSFoot || [] : []}
        />
        <Conditional if={hasOffer}>
          <FreeTourPopup
            popupState={freeTourPopupOpen}
            togglePopup={onTogglePopup}
            productOffer={offerPopup}
            scorpioData={scorpioData}
            isMobile={isAmp || isMobile}
          />
        </Conditional>
      </div>
    </div>
  );
};

export default withAmp(MicrositeV1);
