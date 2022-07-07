import React, { useState, useContext, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import StickyHeader from 'components/ShowPages/stickyHeader';
import StickyFooter from 'components/ShowPages/stickyFooter';
import Conditional from 'components/common/Conditional';
import PriceBlock, { SavedTag } from 'UI/PriceBlock';
import Image from 'UI/Image';
import { PLAY_CIRCLE } from 'assets/SvgIcons';
import { PRODUCT_VIDEOS } from 'const/ShowPageProductVideos';
import { strings } from 'const/strings';
import COLORS from 'const/colors';
import { createBookingURL } from 'utils';
import { dateToString, isDateInThePast } from 'utils/dateUtils';
import { fetchInventory } from 'utils/apiUtils';
import {
  getCommonEventMetaData,
  getProductCommonProperties,
  trackEvent,
} from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import { expandFontToken } from 'const/typography';
import { checkLTT, getCheckAvailText } from 'utils/helper';
import Emoji from 'components/common/Emoji';
import { hsidAtom } from 'store/atoms/hsid';

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
  margin: -2em auto 0;
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
    ${expandFontToken('UI/Label Regular')}
  }

  h1 {
    ${expandFontToken('Heading/Large')}
    margin: 6px 0 12px;
  }

  .tags-wrapper {
    display: inline-block;
    color: ${COLORS.GRAY.G3};
    background: ${COLORS.GRAY.G7};
    padding: 6px 8px;
    margin: 0 8px 0 0;
    border-radius: 2px;
    ${expandFontToken('UI/Label Small')}
  }

  .right-pricing {
    text-align: right;
    display: grid;
    grid-template-areas: 'price cta';
    align-items: center;
  }

  .priceBlockWrapper {
    justify-content: flex-end;
    display: flex;
    border-right: 1px solid ${COLORS.GRAY.G6};
    padding-right: 16px;
    grid-area: 'price';
  }

  .tour-price {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Heading/Regular')}
  }

  .tour-scratch-price {
    color: ${COLORS.GRAY.G4};
    font-size: 14px;
    line-height: 16px;
    text-align: left;
    font-weight: normal;
  }

  .buy-button,
  .unavailable-button {
    ${expandFontToken('Button/Medium')}
    padding: 12px 20px;
    border-radius: 4px;
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

  .details-container {
    display: grid;
    grid-template-columns: auto auto auto auto;
    margin-top: 32px;
  }

  .details-container .key {
    ${expandFontToken('UI/Label Small')}
    color: ${COLORS.GRAY.G4};
    padding-bottom: 4px;
  }

  .details-container .value {
    ${expandFontToken('UI/Label Medium')}
    color: ${COLORS.GRAY.G2};
  }

  @media (max-width: 768px) {
    padding: 24px 16px 0;

    .heading-wrapper {
      grid-template-columns: auto;
      padding-bottom: 24px;
    }

    .individual-container {
      padding-bottom: 32px;
    }

    .right-pricing {
      margin-top: 20px;
      text-align: left;
    }

    .buy-button {
      display: none;
    }

    .details-container {
      grid-template-columns: auto auto;
      margin-top: 24px;
    }

    h1 {
      font-size: 21px;
      margin: 8px 0 16px;
    }

    .top-text-wrapper {
      font-size: 12px;
    }

    .tour-price {
      font-size: 17px;
      line-height: 20px;
    }

    .tour-scratch-price {
      font-size: 12px;
    }

    .details-container .value {
      font-size: 14px;
      line-height: 16px;
    }

    .priceBlockWrapper {
      justify-content: flex-start;
      border: 0;
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid ${COLORS.GRAY.G6};
    }
    .tags-wrapper {
      margin: 4px 4px 0 0;
    }
    ${SavedTag} {
      font-weight: normal;
      font-size: 10px;
      line-height: 12px;
    }
  }
`;

const SpecialOfferBooster = styled.div`
  position: absolute;
  top: -16px;
  padding: 6px 8px 7px;
  font-size: 14px;
  font-weight: 600;
  line-height: 15px;
  text-align: left;
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  .offer-emoji {
    font-weight: 400;
    line-height: 16px;
  }
`;

const SpecialOfferBoosterMobile = styled.div`
  position: absolute;
  top: 68px;
  left: 16px;
  z-index: 3;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  text-align: left;
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2px;

  .offer-emoji {
    font-weight: 400;
    line-height: 12px;
    letter-spacing: 1px;
  }
`;

const ShowPageBanner = ({
  detailsObjects,
  tgid,
  isMobile,
  tourGroupData,
  currentLanguage,
  tagsArray,
  isReopening,
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
  } = tourGroupData ?? {};
  const pageMetaData = useRecoilValue(metaAtom);

  const productImage = imageUploads.length
    ? imageUploads[1] || imageUploads[0]
    : null;

  const { nakedDomain, biLink, uid, redirectToHeadoutBookingFlow } = useContext(
    MBContext
  );

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
    redirectToHeadoutBookingFlow,
  });

  const [isVideo, setIsVideo] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [nextAvailable, setNextAvailable] = useState('');
  const hsid = useRecoilValue(hsidAtom);

  const videoCode = PRODUCT_VIDEOS[tgid] ? PRODUCT_VIDEOS[tgid] : null;
  const videoAvailable = PRODUCT_VIDEOS[tgid] ? true : false;
  const isTourAvailable = listingPrice ? true : false;
  const isLTT = checkLTT(uid);
  const ref = useRef(null);

  const { NEXT_AVAILABLE } = strings || {};
  const REOPENING_STRING = `${NEXT_AVAILABLE}`;
  const BannerTitle = `${name} - ${strings.TICKETS}`;

  const bannerChange = () => {
    setIsVideo(!isVideo);
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.CONTENT_PAGE,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      ...getCommonEventMetaData(pageMetaData),
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
    trackVideoPlayed();
  };

  ANALYTICS_PROPERTIES;
  useEffect(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.CONTENT_PAGE,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGIDS]: [tgid],
      [ANALYTICS_PROPERTIES.MB_NAME]: BannerTitle,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  }, []);
  useEffect(() => {
    const fetchReopeningDate = async () => {
      const { inventoryList } =
        (await fetchInventory({
          tgid,
          hostname,
          useSeatmapPrices: true,
        })) || {};
      const today = dayjs().format('YYYY-MM-DD');

      inventoryList.every(({ startDate }) => {
        if (today <= startDate) {
          setNextAvailable(dateToString(startDate));

          return false;
        }
      });
    };
    if (isTourAvailable) {
      fetchReopeningDate();
    }
  }, [tgid, isTourAvailable, hostname]);

  const trackBookNowClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_BOOK_NOW_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: BannerTitle,
      [ANALYTICS_PROPERTIES.CITY]: pageMetaData?.city?.cityCode,
      [ANALYTICS_PROPERTIES.COUNTRY]: pageMetaData?.country?.code,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });

    const { originalPrice, finalPrice, currencyCode } = listingPrice ?? {};
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: name,
      [ANALYTICS_PROPERTIES.POSITION]: null,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CITY]: pageMetaData?.city?.cityCode,
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
      />
      <Conditional if={isMobile}>
        <StickyFooter
          tgid={tgid}
          currentLanguage={currentLanguage}
          isAvailable={isTourAvailable}
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
                {strings.SHOWPAGE.SPECIAL_OFFER}
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
            {strings.SHOWPAGE.SPECIAL_OFFER}
          </SpecialOfferBooster>
        </Conditional>
        <div className="top-text-wrapper">
          {isTourAvailable
            ? `${REOPENING_STRING} ${nextAvailable}`
            : strings.SHOWPAGE.SHOW_CLOSED}
        </div>
        <div className="heading-wrapper">
          <div>
            <h1>{BannerTitle}</h1>
            <Conditional if={isMobile}>
              <div className="priceBlockWrapper">
                <PriceBlock
                  price={listingPrice}
                  lang={currentLanguage}
                  showSavings={true}
                  showScratchPrice={true}
                  prefix={true}
                />
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
                    price={listingPrice}
                    lang={currentLanguage}
                    showSavings={true}
                    showScratchPrice={true}
                    prefix={true}
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
                    window.open(bookingUrl, '_blank', 'noopener, noreferrer');
                  }}
                >
                  {isLTT
                    ? getCheckAvailText(currentLanguage, hsid)
                    : strings.BANNER_CTA}
                </div>
              </Conditional>
              <Conditional if={!listingPrice}>
                <button className="unavailable-button" disabled>
                  {strings.UNAVAILABLE}
                </button>
              </Conditional>
            </div>
          </Conditional>
        </div>
        <div className="details-container">
          {Object.entries(detailsObjects).map((element, index) => {
            if (
              element[0] === strings.OPENING_DATE &&
              isDateInThePast(element[1])
            ) {
              return null;
            }

            return (
              <div className="individual-container" key={index}>
                <div className="key">
                  {isReopening && element[0] === strings.OPENING_DATE
                    ? strings.REOPENING_DATE
                    : element[0]}
                </div>
                <div className="value">
                  {element[0] === strings.OPENING_DATE
                    ? dateToString(element[1])
                    : element[1]}
                </div>
              </div>
            );
          })}
        </div>
      </BannerContent>
    </>
  );
};

export default ShowPageBanner;
