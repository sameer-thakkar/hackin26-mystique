import { ComponentType, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { Button, Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import Header from 'components/MicrositeV2/Header';
import ContentSections from 'components/MicrositeV2/ShowPageV2/ContentSections';
import { TShowPageV2Props } from 'components/MicrositeV2/ShowPageV2/interface';
import ShowPageV2Banner from 'components/MicrositeV2/ShowPageV2/ShowPageBanner';
import ShowPageDescriptorSection from 'components/MicrositeV2/ShowPageV2/ShowPageDescriptorSection';
import ShowPagePricingSection from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection';
import { getUnavailableTicketStylesRecipe } from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/ticketUnavailableStyles';
import ShowPageSeoComponents from 'components/MicrositeV2/ShowPageV2/ShowPageSeoComponents';
import SimilarShows from 'components/MicrositeV2/ShowPageV2/SimilarShows';
import {
  BuyButtonWrapper,
  DateSelectorContainer,
  DateSelectorWrapper,
  FaqWrapper,
  ShowPageWrapper,
} from 'components/MicrositeV2/ShowPageV2/style';
import DesktopMoreReads from 'components/NewsPage/components/DesktopMoreReads';
import MobileMoreReads from 'components/NewsPage/components/MobileMoreReads';
import { PageWrapper } from 'components/ReviewsPage/styles';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import AccordionGroup from 'components/slices/AccordionGroup';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import {
  createBookingURL,
  getAlternateLanguages,
  getHeadoutLanguagecode,
  getNakedDomain,
  getTagPageMap,
} from 'utils';
import {
  getCommonEventMetaData,
  sendVariablesToDataLayer,
  trackEvent,
} from 'utils/analytics';
import { fetchTourGroupsByCollection } from 'utils/apiUtils';
import { checkIfCategoryHeaderExists, getHostName } from 'utils/helper';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { gtmAtom } from 'store/atoms/gtm';
import { hsidAtom } from 'store/atoms/hsid';
import { metaAtom } from 'store/atoms/meta';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BOOLEAN_STATES,
  BUTTON_LOADING_DURATION,
  CASHBACK_TYPES,
  CTA_TYPE,
  NEWS_PAGE_SECTIONS,
  PAGETYPE,
} from 'const/index';
import { strings } from 'const/strings';
import BanSvg from 'assets/banSvg';
import { Pricing, SavePercentElement } from './ShowPagePricingSection/style';

const SearchPage: ComponentType<React.PropsWithChildren<any>> = dynamic(
  () =>
    import(/* webpackChunkName: "SearchPage" */ '../views/SearchPage').then(
      (mod) => mod.SearchPage
    ),
  { ssr: false }
);

const LttShowPageV2 = ({
  CMSContent,
  newsArticlesWithSameTgid,
  featuredNewsArticles,
  newsLandingPageUrl,
  tourGroupData,
  inventorySlotData,
  isMobile,
  serverRequestStartTimestamp,
  domainConfig,
  primaryCity,
  categoryHeaderMenu,
  breadcrumbs,
}: TShowPageV2Props) => {
  const currency = useRecoilValue(currencyAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const pageMetaData = useRecoilValue(metaAtom);
  const { collectionName, collectionId } = pageMetaData;

  const [allTours, setAllTours] = useState([]);
  const [moreShows, setMoreShows] = useState<any[]>([]);
  const [activePage, setActivePage] = useState(null);
  const [isButtonLoading, setButtonLoading] = useState(false);

  const [mwebDateSelectorPopupActive, setMwebdateSelectorPopupActive] =
    useState(false);

  const {
    lang: language,
    isDev,
    host,
    nakedDomain,
    biLink,
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);
  const hostname = getHostName(isDev, host);

  const changePage = (page: any) => {
    setActivePage(page.name);
  };
  const {
    uid,
    data: CMSData,
    alternate_languages,
    lang,
    allShowPagesDocuments,
  } = CMSContent;
  const {
    tagged_mb_type: mbType,
    tgid,
    tagged_city: taggedCity,
    design: mbDesign,
    tagged_category: taggedCategoryName,
    tagged_sub_category: taggedSubCategoryName,
    tagged_mb_type: taggedMbType,
    common_header: commonHeader,
    common_footer: commonFooter,
  } = CMSData;
  const categoryHeaderMenuExists = checkIfCategoryHeaderExists({
    mbDesign,
    mbType,
  });
  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );

  const {
    TicketsUnavailableHeaderMweb,
    TicketsUnavailableTextWrapper,
    SvgWrapper,
    TicketsUnavailableText,
    TicketsUnavailableSubText,
    MoreShowsButtonWrapper,
    TicketsUnavailableMwebContainer,
    TicketsUnavailableHeaderCommon,
  } = getUnavailableTicketStylesRecipe();

  const dropdownLinksArray = commonHeader?.data?.dropdown_menu?.reduce(
    (acc: any, item: any) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    },
    []
  );
  const { header_links: headerLinks = [] } = commonHeader?.data || {};
  const {
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};
  const currentLanguage = getHeadoutLanguagecode(lang);

  const overriddenHeaderData = { ...CMSData, ...commonHeader?.data };
  const headerProps = {
    showGroupBooking: overriddenHeaderData.enable_group_booking === 'Yes',
    headerLinks,
    logoRedirectionURL:
      getLogoRedirectionUrl({ uid, lang: currentLanguage, isDev, host }) || '/',
    enableBuyTickets:
      overriddenHeaderData.enable_buy_tickets_shortcut === 'Yes',
    enableSearch: true,
    recommendedTours:
      (overriddenHeaderData.search_recommend_csv &&
        overriddenHeaderData.search_recommend_csv
          .split(',')
          .map((tgid: any) => parseInt(tgid))) ||
      [],
    enableDropdownLinks: overriddenHeaderData.enable_dropdown == 'Yes',
    dropdownLinks: dropdownLinksArray,
    headerSlices: commonHeader?.data?.body,
    languageProps: {
      uid,
      currentLanguage,
      languages: alternateLanguages,
    },
  };

  const {
    microBrandsHighlight,
    id,
    flowType,
    name = '',
    primaryCategory,
    primarySubCategory,
    city,
    listingPrice,
  } = tourGroupData;

  const { faqSchema } = parseShowPageData(microBrandsHighlight);
  const faqHeading = `${strings.formatString(
    strings.SHOW_PAGE_V2.CONTENT_SECTION_HEADERS
      .FREQUENTLY_ASKED_QUESTIONS_ABOUT,
    name
  )}`;
  const { originalPrice, finalPrice, cashbackValue, cashbackType } =
    listingPrice ?? {};

  const totalDiscount = Number(
    (((originalPrice - finalPrice) / originalPrice) * 100).toFixed(2)
  );
  const showCashbackElement =
    cashbackValue > 0 && cashbackType === CASHBACK_TYPES.PERCENTAGE;
  const hasDiscountElement = totalDiscount > 0 || showCashbackElement;

  const LTT_TAG_PAGE_MAP = getTagPageMap(uid);

  useEffect(() => {
    const fetchCollection = async () => {
      const response =
        (await fetchTourGroupsByCollection({
          collectionId: collectionId!,
          limit: String(allShowPagesDocuments?.length ?? '600'),
          currency: currency ?? '',
          language: currentLanguage,
        })) ?? {};
      const { pageData } = response;
      const allTours = pageData?.items?.map((tour: Record<string, any>) => ({
        ...tour,
        showPageUid: allShowPagesDocuments?.find(
          (doc: Record<string, any>) => doc.data.tgid === tour.id
        )?.uid,
      }));

      setAllTours(allTours ?? []);
    };

    fetchCollection();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollTopTopButton = document.getElementById(
        'scroll-to-top-button'
      );
      if (scrollTopTopButton && isMobile) {
        if (hasDiscountElement) {
          scrollTopTopButton.style.bottom = '9.25rem';
        } else if (!finalPrice) {
          scrollTopTopButton.style.bottom = '10rem';
        } else {
          scrollTopTopButton.style.bottom = '6rem';
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body && isMobile)
      body.style.overflowY = mwebDateSelectorPopupActive ? 'hidden' : 'auto';

    const bannerVideo = document.getElementById(
      'show-page-banner'
    ) as HTMLVideoElement;
    if (!bannerVideo) return;

    if (mwebDateSelectorPopupActive) {
      bannerVideo.pause();
    } else {
      bannerVideo.play();
    }
  }, [mwebDateSelectorPopupActive]);

  const hsid = useRecoilValue(hsidAtom);

  useEffect(() => {
    if (eventsReady) {
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
        [ANALYTICS_PROPERTIES.TGID]: tgid,
        [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
        [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.name,
        [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
        [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.name,
        [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
        [ANALYTICS_PROPERTIES.COLLECTION_NAME]: collectionName,
      });

      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
        [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
        [ANALYTICS_PROPERTIES.TGIDS]: [tgid],
        [ANALYTICS_PROPERTIES.IS_SHOW_PLAYING]: listingPrice?.finalPrice
          ? BOOLEAN_STATES.YES
          : BOOLEAN_STATES.NO,
        ...getCommonEventMetaData(pageMetaData),
      });
    }
  }, [eventsReady]);

  const checkAvailabilityClicked = () => {
    const bookingUrl = createBookingURL({
      nakedDomain: nakedDomain || getNakedDomain(hostname),
      lang: language,
      tgid,
      biLink: biLink,
      redirectToHeadoutBookingFlow,
      currency,
      flowType,
      hsid,
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: id,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currency,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: hasDiscountElement
        ? CTA_TYPE.BIG_CTA
        : CTA_TYPE.SMALL_CTA,
    });

    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), BUTTON_LOADING_DURATION);
    window.open(bookingUrl, '_self', 'noopener');
  };

  useHistoryTraversal({
    action: () => {
      setButtonLoading(false);
    },
  });

  const moreReadsSectionCTAClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOW_PAGE.SHOW_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_NEWS,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.MORE_READS,
    });
  };

  const moreReadsSectionTrackingObject = {
    eventName: ANALYTICS_EVENTS.SHOW_PAGE_SECTION_VIEWED,
    [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.MORE_READS,
  };

  const handleMoreShowsCTAClicked = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.SEE_MORE_SHOWS,
      [ANALYTICS_PROPERTIES.SECTION]: 'Tickets Unavailable',
    });

    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), BUTTON_LOADING_DURATION);
  };

  return (
    <ShowPageWrapper>
      <ShowPageSeoComponents
        CMSContent={CMSContent}
        tourGroupData={tourGroupData}
        inventorySlotData={inventorySlotData}
        isDev={isDev}
        isMobile={isMobile}
        host={host}
        serverRequestStartTimestamp={serverRequestStartTimestamp}
        domainConfig={domainConfig}
      />
      <DateSelectorContainer>
        <Header
          {...headerProps}
          host={host}
          isMobile={isMobile}
          allTours={allTours}
          isEntertainmentMb={true}
          hasLanguageSelector={true}
          hideCurrencySelector
          isEntertainmentMbListicle={false}
          logoUrl={logoUrl}
          logoAltText={whiteLabelName || ''}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          isEntertainmentLandingPageVisible={true}
          primaryCity={primaryCity}
          taggedCity={taggedCity}
          categoryHeaderMenu={categoryHeaderMenu}
          categoryHeaderMenuExists={categoryHeaderMenuExists}
          changePage={changePage}
        />

        <ShowPageV2Banner
          tourGroupData={tourGroupData}
          isMobile={isMobile}
          isDev={isDev}
          breadcrumbs={breadcrumbs}
          taggedCity={taggedCity}
        />

        <ShowPageDescriptorSection
          microBrandsHighlight={microBrandsHighlight}
          isMobile={isMobile}
          tgid={tgid}
        />

        <DateSelectorWrapper
          $visible={!isMobile || mwebDateSelectorPopupActive}
        >
          <ShowPagePricingSection
            tourGroupData={tourGroupData}
            flowType={flowType}
            onClose={() => {
              trackEvent({
                eventName: ANALYTICS_EVENTS.SHOW_PAGE.DATE_SELECTION_CLOSED,
              });
              setMwebdateSelectorPopupActive(false);
            }}
            moreShows={moreShows}
            primarySubCategory={primarySubCategory}
          />
        </DateSelectorWrapper>

        <ContentSections
          name={name}
          tourGroupData={tourGroupData}
          isMobile={isMobile}
        />
      </DateSelectorContainer>
      <PageWrapper>
        <Conditional if={!isMobile}>
          <DesktopMoreReads
            content={{
              uniqueArticlesWithSameTgidData: newsArticlesWithSameTgid,
              featuredArticles: featuredNewsArticles,
              newsLandingPageUrl,
            }}
            handleCtaClick={moreReadsSectionCTAClick}
            trackingObject={moreReadsSectionTrackingObject}
          />
        </Conditional>
        <Conditional if={isMobile}>
          <MobileMoreReads
            content={{
              uniqueArticlesWithSameTgidData: newsArticlesWithSameTgid,
              featuredArticles: featuredNewsArticles,
            }}
            heading={strings.NEWS_PAGE.MORE_READS}
            showAllNewsCTA
            showMoreCTAText={strings.NEWS_PAGE.LOAD_MORE}
            numberOfArticlesToShow={10}
            initialArticlesToShow={3}
            newsLandingPageUrl={newsLandingPageUrl}
            handleCtaClick={moreReadsSectionCTAClick}
            trackingObject={moreReadsSectionTrackingObject}
          />
        </Conditional>
      </PageWrapper>
      <SimilarShows
        tgid={id}
        primarySubCategoryID={primarySubCategory?.id}
        cityCode={city?.code}
        isMobile={isMobile}
        allShowPagesDocuments={allShowPagesDocuments}
        setMoreShows={setMoreShows}
      />

      <FaqWrapper>
        <AccordionGroup
          accordions={faqSchema}
          heading={faqHeading}
          useSchema={true}
        />
      </FaqWrapper>
      <Footer
        currentLanguage={currentLanguage}
        logoURL={logoUrl}
        logoAlt={whiteLabelName || ''}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        disclaimerText={commonFooter?.data?.disclaimer_text}
        // As of December 2024, footer displays only secondary footer Items to be consistent with Kirby
        secondarySlices={commonFooter?.data?.body || []}
        secondaryHeading={commonFooter?.data?.footer_heading}
        attraction={commonFooter?.data?.attraction || 'attraction'}
        isEntertainmentMb={true}
        isLTT={true}
      />

      <Conditional if={isMobile}>
        <BuyButtonWrapper
          hasDiscount={hasDiscountElement}
          longCtaContent={strings.CHECK_AVAIL.length > 25}
        >
          <Conditional if={finalPrice}>
            <div id="mweb-buy-button-pricing">
              <Pricing>
                <div className="pricing">
                  <span className="scratch-price">
                    <span className="price-starting-from">
                      {strings.FROM?.toLowerCase()}{' '}
                    </span>
                    <Conditional if={originalPrice > finalPrice}>
                      <LocalisedPrice
                        currencyCode={currency ?? ''}
                        lang={lang}
                        price={originalPrice}
                        className="original-price"
                        truncateIfLong={true}
                        truncateAfter={3}
                      />
                    </Conditional>
                  </span>
                  <span className="price">
                    <LocalisedPrice
                      currencyCode={currency ?? ''}
                      lang={lang}
                      price={finalPrice}
                    />
                    <Conditional if={totalDiscount > 0}>
                      <SavePercentElement>
                        {strings.formatString(
                          strings.SAVE_PERCENT,
                          `${totalDiscount}`
                        )}
                      </SavePercentElement>
                    </Conditional>
                    <Conditional if={totalDiscount <= 0 && showCashbackElement}>
                      <SavePercentElement>
                        {strings.formatString(
                          strings.CASHBACK,
                          `${cashbackValue}`
                        )}
                      </SavePercentElement>
                    </Conditional>
                  </span>
                </div>
              </Pricing>
            </div>
            <Button
              tabIndex={0}
              as="button"
              btnType="primary"
              onClick={checkAvailabilityClicked}
              primaryText={strings.CHECK_AVAIL}
              size="medium"
              state={isButtonLoading ? 'loading' : 'default'}
              variant="primary"
            />
          </Conditional>
          <Conditional if={!finalPrice}>
            <div className={TicketsUnavailableMwebContainer}>
              <div
                className={cx(
                  TicketsUnavailableHeaderMweb,
                  TicketsUnavailableHeaderCommon
                )}
              >
                <div className={SvgWrapper}>
                  <BanSvg />
                </div>
                <div className={TicketsUnavailableTextWrapper}>
                  <Text className={TicketsUnavailableText}>
                    {strings.SHOW_PAGE_V2.TICKETS_UNAVAILABLE}
                  </Text>
                  <Text className={TicketsUnavailableSubText}>
                    {strings.SHOW_PAGE_V2.TICKETS_UNAVAILABLE_SUBTEXT}
                  </Text>
                </div>
              </div>
              <div className={MoreShowsButtonWrapper}>
                <Button
                  tabIndex={0}
                  as="anchor"
                  href={LTT_TAG_PAGE_MAP[primarySubCategory?.name]}
                  btnType="primary"
                  primaryText={strings.SEE_MORE_SHOWS}
                  size="medium"
                  state={isButtonLoading ? 'loading' : 'default'}
                  variant="primary"
                  onClick={handleMoreShowsCTAClicked}
                />
              </div>
            </div>
          </Conditional>
        </BuyButtonWrapper>
      </Conditional>

      <Conditional if={activePage == PAGETYPE.SEARCH && isMobile}>
        <SearchPage
          allTours={allTours}
          headerProps={headerProps}
          isMobile={isMobile}
          changePage={changePage}
          isLTT={true}
        />
      </Conditional>
    </ShowPageWrapper>
  );
};

export default LttShowPageV2;
