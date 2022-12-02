import { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { MBContext } from 'contexts/MBContext';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import StickyHeader from 'components/ShowPages/stickyHeader';
import StickyFooter from 'components/ShowPages/stickyFooter';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import PriceBlock, { SavedTag } from 'UI/PriceBlock';
import Image from 'UI/Image';
import { PLAY_CIRCLE, LOCATION, STAR } from 'assets/SvgIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { PRODUCT_VIDEOS } from 'const/ShowPageProductVideos';
import { strings } from 'const/strings';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { descriptorIcons } from 'const/descriptorIcons';
import { FONTS } from 'const/fonts';
import { createBookingURL } from 'utils';
import { dateToString } from 'utils/dateUtils';
import { fetchCalendarInventory } from 'utils/apiUtils';
import {
  getProductCommonProperties,
  sendVariablesToDataLayer,
  trackEvent,
} from 'utils/analytics';

const Banner = styled.div`
  width: 100%;
  height: 560px;
  text-align: center;

  img {
    width: 100%;
  }

  @media (max-width: 768px) {
    height: 234px;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
    transition: all 0.7s ease;
    -webkit-transition: all 0.7s ease;
  }

  .video-container.is-active {
    opacity: 1;
    z-index: 2;
  }

  div {
    height: 100% !important;
  }
`;

const BannerImageWrapper = styled.div`
  width: 100%;
  height: 100%;

  .banner-image-container {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.7s ease;
    -webkit-transition: all 0.7s ease;
    overflow: hidden;
  }

  .is-active {
    opacity: 1;
    z-index: 2;
  }

  .play-button {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    cursor: pointer;
  }
`;

const BannerImage = styled.div`
  width: 100%;
  height: 100%;
`;

const BannerContent = styled.div`
  margin: -2em auto 3rem;
  position: relative;
  max-width: 1200px;
  z-index: 2;
  background: ${COLORS.BRAND.WHITE};
  padding: 32px 30px 0;
  border-radius: 8px 8px 0px 0px;

  .heading-wrapper {
    border-bottom: 1px solid ${COLORS.GRAY.G6};
    padding-bottom: 32px;
    display: grid;
    grid-template-columns: 70% 30%;
  }

  .top-text-wrapper {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
  }

  h1 {
    ${expandFontToken(FONTS.HEADING_LARGE)}
    margin: 0.5rem 0 1rem;
  }

  .tags-wrapper {
    display: inline-block;
    color: ${COLORS.GRAY.G3};
    background: ${COLORS.GRAY.G7};
    padding: 6px 8px;
    margin: 0 8px 0 0;
    border-radius: 2px;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }

  .right-pricing {
    text-align: right;
    display: grid;
    grid-template-areas: 'price cta';
    align-items: center;
  }

  .priceBlockWrapper {
    border-right: 1px solid ${COLORS.GRAY.G6};
    grid-area: price;

    .price-block-from {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
      text-align: left;
      margin-bottom: 0.125rem;
    }
  }

  .tour-price {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.HEADING_REGULAR)}
    display: flex;
    flex-direction: column;
    .prefix {
      text-align: left;
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }
  }

  .tour-scratch-price {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    text-align: left;
  }

  .buy-button,
  .unavailable-button {
    ${expandFontToken(FONTS.BUTTON_MEDIUM)}
    padding: 12px 20px;
    border-radius: 8px;
    margin: 0px 16px;
    border: none;
    max-width: 160px;
    width: 100%;
    display: block;
    text-align: center;
    grid-area: cta;
  }
  .buy-button {
    background: ${COLORS.BRAND.PURPS};
    color: ${COLORS.BRAND.WHITE};
    display: block;
    cursor: pointer;
  }
  .unavailable-button {
    background: ${COLORS.GRAY.G5};
    color: ${COLORS.BRAND.WHITE};
    margin: 0;
    align-items: unset;
    justify-self: end;
  }

  .theater-reviews-wrapper {
    ${expandFontToken(FONTS.UI_LABEL_LARGE)}
    margin-top: 1.5rem;

    .ratings-wrapper {
      ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}
      margin: 0rem 0.5rem 0rem 1.5rem;
      color: ${COLORS.BRAND.CANDY};
    }

    svg {
      margin-right: 0.5rem;
    }
  }

  .details-wrapper {
    display: grid;
    grid-template-columns: auto auto auto auto;
    padding-top: 0.5rem;
    ${expandFontToken(FONTS.UI_LABEL_LARGE)}
    color: ${COLORS.GRAY.G2};

    .individual-wrapper {
      margin-top: 1.5rem;
    }

    svg {
      position: relative;
      top: 0.1rem;
      margin-right: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    padding: 24px 16px 0;

    .heading-wrapper {
      grid-template-columns: auto;
      padding-bottom: 1.5rem;
    }

    .right-pricing {
      margin-top: 20px;
      text-align: left;
    }

    .buy-button {
      display: none;
    }

    .details-wrapper {
      grid-template-columns: auto;
      padding-top: 0.5rem;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}

      .individual-wrapper {
        margin-top: 1rem;
      }
    }

    h1 {
      ${expandFontToken(FONTS.HEADING_REGULAR)}
      margin: 0.5rem 0 0.5rem;
    }

    .top-text-wrapper {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }

    .tour-price {
      font-size: 17px;
      line-height: 20px;
    }

    .tour-scratch-price {
      font-size: 12px;
    }

    .price-block-from {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
      margin-bottom: 0.25rem;
    }

    .priceBlockWrapper {
      display: flex;
      justify-content: space-between;
      border: 0;
      padding: 0rem 0rem 1.5rem;
      margin-bottom: 24px;
      border-bottom: 1px solid ${COLORS.GRAY.G6};
    }

    .tags-wrapper {
      margin: 0.375rem 0.313rem 0 0;
    }

    ${SavedTag} {
      font-weight: normal;
      font-size: 10px;
      line-height: 12px;
    }

    .theater-wrapper {
      margin-bottom: 1rem;
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}

      svg {
        margin-right: 0.3rem;
        position: relative;
        top: 0.2rem;
      }
    }

    .ratings-reviews-wrapper {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    }

    .ratings-wrapper {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
      color: ${COLORS.BRAND.CANDY};
    }
  }
`;

const SpecialOfferBooster = styled.div`
  position: absolute;
  top: -16px;
  padding: 6px 8px 7px;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;

const SpecialOfferBoosterMobile = styled.div`
  position: absolute;
  top: 68px;
  left: 16px;
  z-index: 3;
  padding: 4px 6px;
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
`;

const ShowPageBanner = ({
  detailsObjects,
  tgid,
  isMobile,
  tourGroupData,
  currentLanguage,
  tagsArray,
  hostname,
  hasSpecialOffer,
}) => {
  const {
    listingPrice,
    name,
    imageUploads,
    primaryCategory,
    primarySubCategory,
    primaryCollection,
    descriptors,
    reviewCount,
    reviewsDetails: { averageRating },
  } = tourGroupData ?? {};

  const { originalPrice, finalPrice } = listingPrice ?? {};
  const save = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);

  const currency = useRecoilValue(currencyAtom);
  const pageMetaData = useRecoilValue(metaAtom);

  const productImage = imageUploads.length
    ? imageUploads[1] || imageUploads[0]
    : null;

  const { nakedDomain, biLink, redirectToHeadoutBookingFlow } = useContext(
    MBContext
  );

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
    redirectToHeadoutBookingFlow,
    currency,
  });

  const [isVideo, setIsVideo] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [nextAvailable, setNextAvailable] = useState('');

  const videoCode = PRODUCT_VIDEOS[tgid] ? PRODUCT_VIDEOS[tgid] : null;
  const videoAvailable = !!PRODUCT_VIDEOS[tgid];
  const isTourAvailable = !!listingPrice;
  const ref = useRef(null);

  const { NEXT_AVAILABLE } = strings || {};
  const REOPENING_STRING = `${NEXT_AVAILABLE}`;
  const BannerTitle = `${name} - ${strings.TICKETS}`;

  const theaterName = detailsObjects?.[strings.SHOW_PAGE.THEATRE_NAME];

  let showDetails = {};
  Object.keys(detailsObjects)?.forEach((key) => {
    switch (key) {
      case strings.SHOW_PAGE.OPENING_DATE:
      case strings.SHOW_PAGE.CLOSING_DATE:
        if (
          !!detailsObjects[strings.SHOW_PAGE.OPENING_DATE] &&
          !!detailsObjects[strings.SHOW_PAGE.CLOSING_DATE]
        ) {
          showDetails['EXTENDED_VALIDITY'] = `${dateToString(
            detailsObjects[strings.SHOW_PAGE.OPENING_DATE]
          )} - ${dateToString(detailsObjects[strings.SHOW_PAGE.CLOSING_DATE])}`;
        }
        break;
      case strings.SHOW_PAGE.DURATION:
        showDetails['DURATION'] = detailsObjects[key];
        break;
      case strings.SHOW_PAGE.AGE_LIMIT:
        showDetails['USER'] = detailsObjects[key];
        break;
    }
  });
  descriptors?.forEach((descriptor) => {
    showDetails[descriptor?.code] =
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
      [ANALYTICS_PROPERTIES.MB_NAME]: BannerTitle,
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
      const { sortedInventoryDates } =
        (await fetchCalendarInventory({
          tgid: parseInt(tgid),
        })) ?? {};

      const [firstAvailableDate] = sortedInventoryDates ?? [];
      setNextAvailable(dateToString(firstAvailableDate));
    };
    if (isTourAvailable) {
      fetchReopeningDate();
    }
  }, [tgid, isTourAvailable, hostname]);

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
      [ANALYTICS_PROPERTIES.CITY]: pageMetaData?.city?.code,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };
  const handleScroll = () => {
    const top = window.pageYOffset;
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
                    url={productImage?.url}
                    alt={name}
                    objectFit="cover"
                    height={500}
                    width={1000}
                    quality={null}
                    dontLazyLoad={true}
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
                  {PLAY_CIRCLE}
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
            <h1>{BannerTitle}</h1>
            <Conditional if={isMobile}>
              <div className="theater-wrapper">
                {LOCATION} {theaterName}
              </div>
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
                      {averageRating} {STAR(COLORS.BRAND.CANDY)}{' '}
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
            {tagsArray.map((element, index) => {
              if (element) {
                return (
                  <div className="tags-wrapper" key={index}>
                    {element}
                  </div>
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
              <Conditional if={listingPrice}>
                <div
                  role="button"
                  tabIndex={0}
                  className="buy-button"
                  onClick={() => {
                    trackBookNowClick();
                    window.open(bookingUrl, '_self', 'noopener, noreferrer');
                  }}
                >
                  {strings.CHECK_AVAIL}
                </div>
              </Conditional>
              <Conditional if={!listingPrice}>
                <button className="unavailable-button" disabled>
                  {strings.UNAVAILABLE}
                </button>
              </Conditional>
            </div>
          </Conditional>
          <Conditional if={!isMobile}>
            <div className="theater-reviews-wrapper">
              <span>
                {LOCATION} {theaterName}
              </span>
              <Conditional if={reviewCount > 0}>
                <span>
                  <span className="ratings-wrapper">
                    {STAR(COLORS.BRAND.CANDY)} {averageRating}
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
            if (!showDetails[key]) {
              return null;
            }
            return (
              <div className="individual-wrapper" key={index}>
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
