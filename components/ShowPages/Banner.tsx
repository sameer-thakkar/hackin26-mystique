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
import { COLORS } from 'const/ui-constants';
import { createBookingURL } from 'utils';
import { dateToString } from 'utils/dateUtils';
import { fetchInventory } from 'utils/apiUtils';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';

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
  background: ${COLORS.WHITE};
  padding: 32px 30px 0;
  border-radius: 8px 8px 0px 0px;

  .heading-wrapper {
    border-bottom: 1px solid ${COLORS.GREY.G6};
    padding-bottom: 32px;
    display: grid;
    grid-template-columns: 70% 30%;
  }

  .top-text-wrapper {
    font-size: 14px;
    line-height: 16px;
    font-weight: normal;
  }

  h1 {
    font-size: 24px;
    margin: 6px 0 12px;
    line-height: 28px;
  }

  .tags-wrapper {
    display: inline-block;
    color: ${COLORS.GREY.G3};
    background: ${COLORS.GREY.G7};
    padding: 6px 8px;
    margin: 0 8px 0 0;
    border-radius: 2px;
    font-size: 12px;
    line-height: 16px;
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
    border-right: 1px solid ${COLORS.GREY.G6};
    padding-right: 16px;
    grid-area: 'price';
  }

  .tour-price {
    color: ${COLORS.GREY.G2};
    font-weight: 600;
    font-size: 21px;
    line-height: 28px;
  }

  .tour-scratch-price {
    color: ${COLORS.GREY.G4};
    font-size: 14px;
    line-height: 16px;
    text-align: left;
    font-weight: normal;
  }

  .buy-button,
  .unavailable-button {
    padding: 12px 20px;
    border-radius: 4px;
    margin: 0px 16px;
    border: none;
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    letter-spacing: 0.8px;
    max-width: 160px;
    width: 100%;
    display: block;
    text-align: center;
    line-height: 20px;
    grid-area: cta;
  }
  .buy-button {
    background: ${COLORS.PURPS};
    color: ${COLORS.WHITE};
    display: block;
    cursor: pointer;
  }
  .unavailable-button {
    background: ${COLORS.GREY.G5};
    color: ${COLORS.WHITE};
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
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: ${COLORS.GREY.G4};
    padding-bottom: 4px;
  }

  .details-container .value {
    color: ${COLORS.GREY.G2};
    font-size: 15px;
    line-height: 20px;
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
      border-bottom: 1px solid ${COLORS.GREY.G6};
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

const ShowPageBanner = ({
  detailsObjects,
  tgid,
  isMobile,
  tourGroupData,
  currentLanguage,
  tagsArray,
  isReopening,
  hostname,
}) => {
  const {
    listingPrice,
    currency,
    name,
    imageUploads,
    primaryCategory,
    primarySubCategory,
  } = tourGroupData;
  const pageMetaData = useRecoilValue(metaAtom);

  const { localSymbol } = currency;

  const productImage = imageUploads.length
    ? imageUploads[1] || imageUploads[0]
    : null;

  const { nakedDomain, biLink } = useContext(MBContext);

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
  });

  const [isVideo, setIsVideo] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [nextAvailable, setNextAvailable] = useState('');

  const videoCode = PRODUCT_VIDEOS[tgid] ? PRODUCT_VIDEOS[tgid] : null;
  const videoAvailable = PRODUCT_VIDEOS[tgid] ? true : false;
  const isTourAvailable = listingPrice ? true : false;
  const ref = useRef(null);

  const { REOPENING, NEXT_AVAILABLE } = strings || {};
  const REOPENING_STRING = `${REOPENING} · ${NEXT_AVAILABLE}`;
  const BannerTitle = `${name} - ${strings.TICKETS}`;

  const BannerChange = () => {
    setIsVideo(!isVideo);
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.CONTENT_PAGE,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      ...getCommonEventMetaData(pageMetaData),
    });
  };

  ANALYTICS_PROPERTIES;
  useEffect(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.CONTENT_PAGE,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGIDS]: [tgid],
      [ANALYTICS_PROPERTIES.MB_NAME]: BannerTitle,
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
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
      [ANALYTICS_PROPERTIES.CITY]: pageMetaData?.city?.cityCode,
      [ANALYTICS_PROPERTIES.COUNTRY]: pageMetaData?.country?.code,
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
            <div className="video-container is-active">
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
            <div className="banner-image-container is-active">
              <Conditional if={productImage}>
                <BannerImage>
                  <Image
                    url={productImage.url}
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
                  onClick={BannerChange}
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
                  currencySymbolOverride={localSymbol}
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
                    currencySymbolOverride={localSymbol}
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
                  {strings.BANNER_CTA}
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
