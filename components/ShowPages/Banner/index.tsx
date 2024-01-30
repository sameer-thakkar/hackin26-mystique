import { useContext, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@headout/aer';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import LinkResolver from 'components/LinkResolver';
import { IShowPageBannerProps } from 'components/ShowPages/Banner/interface';
import {
  Banner,
  BannerContent,
  BannerImage,
  BannerImageWrapper,
  SpecialOfferBooster,
  SpecialOfferBoosterMobile,
  VideoWrapper,
} from 'components/ShowPages/Banner/styles';
import StickyFooter from 'components/ShowPages/stickyFooter';
import StickyHeader from 'components/ShowPages/stickyHeader';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { createBookingURL, getNakedDomain, getTagPageMap } from 'utils';
import {
  getProductCommonProperties,
  sendVariablesToDataLayer,
  trackEvent,
} from 'utils/analytics';
import { fetchCalendarInventory } from 'utils/apiUtils';
import { dateToString } from 'utils/dateUtils';
import { sendLog } from 'utils/logger';
import { getTagPageLink } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { descriptorIcons } from 'const/descriptorIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUTTON_LOADING_DURATION,
} from 'const/index';
import { PRODUCT_VIDEOS } from 'const/ShowPageProductVideos';
import { strings } from 'const/strings';
import Location from 'assets/location';
import PlayCircle from 'assets/playCircle';
import Star from 'assets/star';

const ShowPageBanner = ({
  detailsObjects,
  tgid,
  uid,
  isMobile,
  tourGroupData,
  currentLanguage,
  tagsArray,
  hostname,
  hasSpecialOffer,
  isProd,
}: IShowPageBannerProps) => {
  const {
    listingPrice,
    name,
    imageUploads,
    primaryCategory,
    primarySubCategory,
    primaryCollection,
    descriptors,
    reviewCount,
    reviewsDetails,
    flowType,
  } = tourGroupData ?? {};
  const { averageRating } = reviewsDetails ?? {};
  const { originalPrice, finalPrice } = listingPrice ?? {};
  const save = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  const currency = useRecoilValue(currencyAtom);
  const pageMetaData = useRecoilValue(metaAtom);

  const productImage = imageUploads?.length
    ? imageUploads[1] || imageUploads[0]
    : null;
  const isShowPoster = imageUploads?.length === 1; //TODO - revert after showpage revamp

  const { nakedDomain, biLink, redirectToHeadoutBookingFlow } =
    useContext(MBContext);

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain || getNakedDomain(hostname),
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
    redirectToHeadoutBookingFlow,
    currency,
    flowType,
  });

  const [isButtonLoading, setButtonLoading] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [nextAvailable, setNextAvailable] = useState('');
  const LTT_TAG_PAGE_MAP = getTagPageMap();

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const videoCode = PRODUCT_VIDEOS[tgid] ? PRODUCT_VIDEOS[tgid] : null;
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const videoAvailable = !!PRODUCT_VIDEOS[tgid];
  const isTourAvailable = !!listingPrice;
  const ref = useRef(null);

  const { NEXT_AVAILABLE } = strings || {};
  const REOPENING_STRING = `${NEXT_AVAILABLE}`;
  const { [strings.SHOW_PAGE.THEATRE_NAME]: theatreName, theatrePageUrl } =
    detailsObjects || {};

  let showDetails = {};
  Object.keys(detailsObjects)?.forEach((key) => {
    switch (key) {
      case strings.SHOW_PAGE.OPENING_DATE:
      case strings.SHOW_PAGE.CLOSING_DATE:
        if (
          !!detailsObjects[strings.SHOW_PAGE.OPENING_DATE] &&
          !!detailsObjects[strings.SHOW_PAGE.CLOSING_DATE]
        ) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          showDetails['EXTENDED_VALIDITY'] = `${dateToString(
            detailsObjects[strings.SHOW_PAGE.OPENING_DATE]
          )} - ${dateToString(detailsObjects[strings.SHOW_PAGE.CLOSING_DATE])}`;
        }
        break;
      case strings.SHOW_PAGE.DURATION:
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        showDetails['DURATION'] = detailsObjects[key];
        break;
      case strings.SHOW_PAGE.AGE_LIMIT:
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        showDetails['USER'] = detailsObjects[key];
        break;
    }
  });
  descriptors?.forEach((descriptor: any) => {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    showDetails[descriptor?.code] =
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      strings.DESCRIPTORS[descriptor?.code] || descriptor.name;
  });

  const bannerChange = () => {
    setIsVideo(!isVideo);
    trackVideoPlayed();
  };

  ANALYTICS_PROPERTIES;
  useEffect(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGIDS]: [tgid],
      [ANALYTICS_PROPERTIES.MB_NAME]: name,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });

    sendVariablesToDataLayer({
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.name,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.name,
    });
  }, []);
  useEffect(() => {
    const fetchReopeningDate = async () => {
      try {
        const { sortedInventoryDates } =
          (await fetchCalendarInventory({
            tgid: parseInt(tgid),
            currency,
          })) ?? {};

        const [firstAvailableDate] = sortedInventoryDates ?? [];
        setNextAvailable(dateToString(firstAvailableDate));
      } catch (e) {
        Sentry.captureException(e);
        sendLog({ err: e });
      }
    };
    if (isTourAvailable) {
      fetchReopeningDate();
    }
  }, [tgid, isTourAvailable, hostname]);

  useHistoryTraversal({
    action: () => {
      setButtonLoading(false);
    },
  });

  const trackBookNowClick = () => {
    const { originalPrice, finalPrice, currencyCode } = listingPrice ?? {};
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: name,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.code,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };
  const handleScroll = () => {
    const top = window.pageYOffset;
    // @ts-expect-error TS(2339): Property 'clientHeight' does not exist on type 'nu... Remove this comment to see the full error message
    const { clientHeight, offsetTop } = ref?.current;

    if (clientHeight + offsetTop >= top) {
      setShowStickyNav(false);
    } else {
      setShowStickyNav(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trackVideoPlayed = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_VIDEO_PLAYED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
    });
  };

  return (
    <>
      <StickyHeader
        tgid={tgid}
        tourGroupData={tourGroupData}
        currentLanguage={currentLanguage}
        nextAvailable={nextAvailable}
        showComponent={!isMobile && showStickyNav}
        isAvailable={isTourAvailable}
        bookingUrl={bookingUrl}
        isButtonLoading={isButtonLoading}
        setButtonLoading={setButtonLoading}
      />
      <Conditional if={isMobile}>
        <StickyFooter
          tgid={tgid}
          currentLanguage={currentLanguage}
          isAvailable={isTourAvailable}
          bookingUrl={bookingUrl}
          tourGroupData={tourGroupData}
        />
      </Conditional>

      <Banner>
        {isVideo && videoAvailable ? (
          <VideoWrapper>
            <div
              className="video-container is-active"
              onClick={trackVideoPlayed}
              role="button"
              tabIndex={0}
            >
              <div>
                <iframe
                  title="YouTube video player"
                  src={`https://www.youtube.com/embed/${videoCode}?autoplay=1`}
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  width="100%"
                  height="100%"
                >
                  {' '}
                </iframe>
              </div>
            </div>
          </VideoWrapper>
        ) : (
          <BannerImageWrapper>
            <Conditional if={hasSpecialOffer && isMobile}>
              <SpecialOfferBoosterMobile>
                <Emoji symbol="🤑" label="money-mouth-face" />{' '}
                {strings.SPECIAL_OFFER}
              </SpecialOfferBoosterMobile>
            </Conditional>
            <div className="banner-image-container is-active">
              <Conditional if={productImage}>
                <BannerImage>
                  <Image
                    url={productImage?.url || ''}
                    alt={name}
                    fill
                    height={500}
                    width={isShowPoster && !isMobile ? 2000 : 1000}
                    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | nu... Remove this comment to see the full error message
                    quality={null}
                    priority
                    fitCrop={!isShowPoster && !isMobile}
                    autoCrop={!isShowPoster && !isMobile} //TODO - revert after showpage revamp
                    blurFill={isShowPoster && !isMobile} //TODO - revert after showpage revamp
                  />
                </BannerImage>
              </Conditional>
              <Conditional if={videoAvailable}>
                <div
                  className="play-button"
                  onClick={bannerChange}
                  role="button"
                  tabIndex={0}
                >
                  {PlayCircle}
                </div>
              </Conditional>
            </div>
          </BannerImageWrapper>
        )}
      </Banner>
      <BannerContent ref={ref}>
        <Conditional if={hasSpecialOffer && !isMobile}>
          <SpecialOfferBooster>
            <Emoji symbol="🤑" label="money-mouth-face" />{' '}
            {strings.SPECIAL_OFFER}
          </SpecialOfferBooster>
        </Conditional>
        <div className="top-text-wrapper">
          {isTourAvailable
            ? `${REOPENING_STRING} ${nextAvailable}`
            : strings.SHOW_CLOSED}
        </div>
        <div className="heading-wrapper">
          <div>
            <h1>{name}</h1>
            <Conditional if={isMobile}>
              <Conditional if={theatrePageUrl}>
                <a href={theatrePageUrl}>
                  <div className="theater-wrapper">
                    {Location} {theatreName}
                  </div>
                </a>
              </Conditional>
              <Conditional if={!theatrePageUrl}>
                <div className="theater-wrapper">
                  {Location} {theatreName}
                </div>
              </Conditional>

              <div className="priceBlockWrapper">
                <PriceBlock
                  listingPrice={listingPrice}
                  lang={currentLanguage}
                  showSavings
                  showScratchPrice
                  showCashback
                  prefix
                  isShowPage
                  save={save}
                />
                <Conditional if={reviewCount > 0}>
                  <div className="ratings-reviews-wrapper">
                    <span className="ratings-wrapper">
                      {averageRating} <Star color={COLORS.TEXT.CANDY_1} />{' '}
                    </span>
                    (
                    {reviewCount > 999
                      ? `${(reviewCount / 1000).toFixed(1)}k`
                      : reviewCount}
                    )
                  </div>
                </Conditional>
              </div>
            </Conditional>
            {tagsArray.map((element: string, index: number) => {
              if (element) {
                return (
                  <LinkResolver
                    key={index}
                    url={getTagPageLink({
                      url: LTT_TAG_PAGE_MAP[element],
                      lang: currentLanguage,
                      uid,
                      isProd,
                    })}
                  >
                    <div className="tags-wrapper" key={index}>
                      {element}
                    </div>
                  </LinkResolver>
                );
              }
            })}
          </div>
          <Conditional if={!isMobile}>
            <div className="right-pricing">
              <Conditional if={listingPrice}>
                <div className="priceBlockWrapper">
                  <PriceBlock
                    listingPrice={listingPrice}
                    lang={currentLanguage}
                    showSavings
                    showScratchPrice
                    prefix
                    showCashback
                    isShowPage
                    save={save}
                  />
                </div>
              </Conditional>
              <div className="buy-button-wrapper">
                <Button
                  tabIndex={0}
                  size="medium"
                  color="purps"
                  variant="primary"
                  isLoading={isButtonLoading}
                  disabled={!listingPrice}
                  onClick={() => {
                    if (isButtonLoading) return;
                    setButtonLoading(true);
                    setTimeout(
                      () => setButtonLoading(false),
                      BUTTON_LOADING_DURATION
                    );
                    trackBookNowClick();
                    window.open(bookingUrl, '_self', 'noopener, noreferrer');
                  }}
                  text={
                    listingPrice ? strings.CHECK_AVAIL : strings.UNAVAILABLE
                  }
                />
              </div>
            </div>
          </Conditional>
          <Conditional if={!isMobile}>
            <div className="theater-reviews-wrapper">
              <Conditional if={theatrePageUrl}>
                <a href={theatrePageUrl}>
                  <span>
                    {Location} {theatreName}
                  </span>
                </a>
              </Conditional>
              <Conditional if={!theatrePageUrl}>
                <span>
                  {Location} {theatreName}
                </span>
              </Conditional>
              <Conditional if={reviewCount > 0}>
                <span>
                  <span className="ratings-wrapper">
                    <Star color={COLORS.TEXT.CANDY_1} /> {averageRating}
                  </span>
                  (
                  {reviewCount > 999
                    ? `${(reviewCount / 1000).toFixed(1)}k Reviews`
                    : reviewCount}
                  )
                </span>
              </Conditional>
            </div>
          </Conditional>
        </div>
        <div className="details-wrapper">
          {Object.keys(showDetails)?.map((key, index) => {
            const ShowDetailsSvg = descriptorIcons[key];
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (!showDetails[key]) {
              return null;
            }
            return (
              <div className="individual-wrapper" key={index}>
                {/* @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                <ShowDetailsSvg /> {showDetails[key]}
              </div>
            );
          })}
        </div>
      </BannerContent>
    </>
  );
};

export default ShowPageBanner;
