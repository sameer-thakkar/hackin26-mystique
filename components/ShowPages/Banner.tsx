import { PRODUCT_VIDEOS } from 'constants/ShowPageProductVideos';
import {
  REOPENING_STRING,
  REOPENING_DATE,
  OPENING_DATE,
} from 'constants/index';

import dayjs from 'dayjs';
import { strings } from 'const/strings';
import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createBookingURL } from 'utils';
import PriceBlock from 'UI/PriceBlock';

import { dateToString } from '../../utils/dateToString';
import Image from '../UI/Image';
import { MBContext } from '../../contexts/MBContext';
import { PLAY_CIRCLE } from '../../assets/SvgIcons';
import { fetchInventoryAPI } from '../../utils/apiUtils';
import StickyHeader from './stickyHeader';
import StickyFooter from './stickyFooter';

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

const BannerContent = styled.div`
  margin: -2em auto 0;
  position: relative;
  max-width: 1200px;
  z-index: 2;
  background: #ffffff;
  padding: 32px 16px 0;
  border-radius: 8px 8px 0px 0px;

  .heading-wrapper {
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 32px;
    display: grid;
    grid-template-columns: 70% 30%;
  }

  .top-text-wrapper {
    font-size: 14px;
  }

  h1 {
    font-size: 24px;
    margin: 6px 0 12px;
  }

  .tags-wrapper {
    display: inline-block;
    color: #666666;
    background: #f0f0f0;
    padding: 6px 8px;
    margin: 6px 8px 0 0;
    border-radius: 2px;
    font-size: 12px;
  }

  .right-pricing {
    text-align: right;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
  }

  .priceBlockWrapper {
    justify-content: flex-end;
    display: flex;
    border-right: 1px solid #e2e2e2;
  }

  .tour-price {
    color: #444444;
    font-weight: 600;
    font-size: 21px;
  }

  .tour-scratch-price {
    color: #888888;
    font-size: 14px;
    line-height: 16px;
    text-align: left;
  }

  .buy-button {
    padding: 12px 20px;
    background: #ec1943;
    border-radius: 8px;
    margin: 0px 16px;
    color: #ffffff;
    border: none;
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    letter-spacing: 0.8px;
    width: 160px;
    display: block;
    text-align: center;
  }

  .details-container {
    display: grid;
    grid-template-columns: auto auto auto auto;
    margin-top: 32px;
  }

  .details-container .key {
    color: #666666;
    font-size: 12px;
  }

  .details-container .value {
    color: #444444;
    font-size: 15px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px 0;

    .heading-wrapper {
      grid-template-columns: auto;
      padding-bottom: 24px;
    }

    .individual-container {
      padding: 10px;
    }

    .right-pricing {
      margin-top: 20px;
      text-align: left;
      grid-template-columns: auto auto;
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
    }

    .tour-scratch-price {
      font-size: 12px;
    }

    .details-container .value {
      font-size: 14px;
    }

    .priceBlockWrapper {
      justify-content: flex-start;
      border: 0;
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid #e2e2e2;
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
}) => {
  const { listingPrice, currency, name, imageUploads } = tourGroupData;

  const { localSymbol } = currency;

  const [productImages] = imageUploads;

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
  const ref = useRef(null);

  const BannerChange = () => {
    setIsVideo(!isVideo);
  };

  useEffect(() => {
    const fetchReopeningDate = async () => {
      const { inventoryList } = await fetchInventoryAPI(tgid);
      const today = dayjs().format('YYYY-MM-DD');

      inventoryList.every(({ startDate }) => {
        if (today <= startDate) {
          setNextAvailable(dateToString(startDate));

          return false;
        }
      });
    };

    fetchReopeningDate();
  }, [tgid]);

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
      />

      {isMobile ? (
        <StickyFooter
          tgid={tgid}
          currentLanguage={currentLanguage}
        ></StickyFooter>
      ) : null}

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
              <Image
                url={productImages.url}
                alt={productImages.alt || 'banner'}
              />
              {videoAvailable ? (
                <>
                  <div
                    className="play-button"
                    onClick={BannerChange}
                    role="button"
                    tabIndex={0}
                  >
                    {PLAY_CIRCLE}
                  </div>
                </>
              ) : null}
            </div>
          </BannerImageWrapper>
        )}
      </Banner>
      <BannerContent ref={ref}>
        <div className="top-text-wrapper">
          {REOPENING_STRING}
          {nextAvailable}
        </div>
        <div className="heading-wrapper">
          <div>
            <h1>
              {name} - {strings.TICKETS}
            </h1>
            {isMobile ? (
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
            ) : null}
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
          {!isMobile ? (
            <div className="right-pricing">
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
              <div>
                <a className="buy-button" href={bookingUrl} target="blank">
                  {strings.BANNER_CTA}
                </a>
              </div>
            </div>
          ) : null}
        </div>
        <div className="details-container">
          {Object.entries(detailsObjects).map((element, index) => {
            return (
              <div className="individual-container" key={index}>
                <div className="key">
                  {isReopening && element[0] === OPENING_DATE
                    ? REOPENING_DATE
                    : element[0]}
                </div>
                <div className="value">
                  {element[0] === OPENING_DATE
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
