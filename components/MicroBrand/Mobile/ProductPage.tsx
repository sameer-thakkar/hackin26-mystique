import React, { Component, useEffect } from 'react';
import Image from '../../Image';
import { RichText } from 'prismic-reactjs';
import {
  CLOSE_WHITE,
  CHEVRON_LEFT,
  STAR,
} from '../../../public/static/svg-icons';
import { shortCodeSerializer } from '../../../utils/shortCodes';
import { PAGETYPE } from '../../../constants';
import parse from 'url-parse';
import { Banner } from '../Banner';
import Swiper from 'react-id-swiper';
import { AVENIR, GRAPHIK, COLORS } from '../../../constants/ui-constants';

export const MobileProductPage = props => {
  const closeProductCard = () => {
    props.changePage({ name: PAGETYPE.HOMEPAGE });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const { tour, host, uid, currentLanguage, tgid, carouselOptions } = props;
  let extendedSwiperOptions;
  if (tour.images.length <= 1) {
    extendedSwiperOptions = {
      autoplay: false,
      loop: false,
      noSwiping: true,
    };
  }
  const allContent = [...tour.contentBlocks.left, ...tour.contentBlocks.right];
  let url = host || window.location.host;
  const isDev = url.includes('localhost');
  const currentHost = !isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage.', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');
  const descriptors = tour.descriptors.split(',').filter(desc => desc.length);
  return (
    <div className="mobile-product-wrap">
      <div className="header">
        <div onClick={closeProductCard} className="back">
          {CHEVRON_LEFT}
        </div>
      </div>
      <div className="prod-image">
        {/* <img src={tour.descriptionImage} alt="" /> */}
        {/* <Banner  isMobile={true} carouselOptions/> */}
        <Swiper {...carouselOptions} {...extendedSwiperOptions}>
          {tour.images.map((image, index) => {
            return (
              <div key={index} className="swiper-slide">
                <Image url={image.url} dontLazyLoad={index == 0} />
              </div>
            );
          })}
        </Swiper>
      </div>
      <div className="prod-content">
        <div className="head">
          <div className="title">{tour.title}</div>
          <div className="price">
            <div className="current-price">
              {tour.currencySymbol}
              {tour.price}
            </div>
            <div className="scratched">{tour.scratchedPrice}</div>
          </div>
          {tour.cardFooter.length ? (
            <div className="boosters">
              <RichText
                render={tour.cardFooter}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          ) : null}
          {tour.averageRating > 0 ? (
            <div className="auto-boosters-box">
              <div className="rating">
                {STAR('#FFBB58')} <span>{tour.averageRating}</span>
              </div>
              <div className="divider-line"></div>
              <div className="cta-boost">{tour.ctaBooster}</div>
            </div>
          ) : null}
          {descriptors.length > 0 ? (
            <div className="descriptors">
              {descriptors.map((descriptor, index) => {
                return (
                  <div className="descriptor" key={index}>
                    {descriptor.trim()}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="content-blocks">
          {tour.description && tour.description.length ? (
            <div className="content-block tour-description">
              <RichText
                render={tour.description}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          ) : null}
          <div className="hr-line"></div>
          {tour.theater ? (
            <div className="content-block">
              <RichText
                render={tour.theater}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          ) : null}
          {allContent.map((block, index) => {
            return (
              <div className="content-block" key={index}>
                <span className="label-title">{block.label}: </span>
                <RichText
                  render={block.content}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="cta-wrap">
        <a
          target="_blank"
          href={`https://book.${bookingUrl}${
            currentLanguage === 'en' ? '' : `/${currentLanguage}`
          }/book/${tgid}`}
        >
          <div className="cta-text">Book Now</div>
        </a>
      </div>
      <style jsx>
        {`
          .mobile-product-wrap {
            display: grid;
            grid-row-gap: 24px;
            grid-template-rows: 56px 220px auto;
            overflow: hidden;
          }
          .mobile-product-wrap::before {
            content: '';
            display: block;
          }
          .mobile-product-wrap .prod-image {
            position: relative;
          }
          .header {
            display: grid;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #dadada;
          }
          .mobile-product-wrap .prod-image .close {
            background: #000;
            padding: 15px;
            display: flex;
            position: fixed;
            top: 0;
            right: 0;
            z-index: 999;
          }

          .mobile-product-wrap .prod-image {
            max-width: calc(100% - 32px);
            margin: auto;
            max-height: 100%;
            height: 100%;
          }
          .mobile-product-wrap .prod-content {
            background: #fff;
            padding: 0 16px;
            margin-bottom: 80px;
            background: #fff;
            z-index: 9;
            display: grid;
            grid-row-gap: 24px;
          }
          .mobile-product-wrap .title {
            font-size: 18px;
            font-family: ${AVENIR.FONT_STACK};
            font-weight: ${AVENIR.HEAVY};
            color: #545454;
            line-height: 1.33;
            text-transform: unset;
          }

          .mobile-product-wrap .head {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-row-gap: 8px;
          }
          .price {
            font-family: ${GRAPHIK.FONT_STACK};
          }
          .mobile-product-wrap .current-price {
            font-size: 18px;
            font-weight: ${GRAPHIK.MEDIUM};
            color: #545454;
          }
          .price .scratched {
            font-weight: ${GRAPHIK.REGULAR};
            font-size: 12px;
            color: ${COLORS.GREY_75};
          }
          .mobile-product-wrap .tags {
            color: #ec1943;
            border: 1px solid #ec1943;
            border-radius: 2px;
            padding: 5px 4px;
            font-size: 12px;
            font-weight: 400;
            text-transform: capitalize;
            display: inline-block;
            margin-top: 8px;
          }
          .mobile-product-wrap .content-block {
            font-size: 14px;
            line-height: 1.57;
            font-family: ${GRAPHIK.FONT_STACK};
            font-weight: ${GRAPHIK.REGULAR};
            color: #545454;
            display: grid;
            grid-row-gap: 4px;
          }

          .boosters {
            grid-column: 1 / 3;
          }

          .auto-boosters-box {
            font-size: 12px;
            display: grid;
            grid-column: 1 / 3;
            align-items: center;
            color: ${COLORS.GREY_75};
            grid-auto-flow: column;
            justify-content: left;
            grid-gap: 8px;
            font-family: ${GRAPHIK.FONT_STACK};
            font-weight: ${GRAPHIK.REGULAR};
          }
          .divider-line {
            width: 1px;
            height: 85%;
            background: #dadada;
          }
          .auto-boosters-box .rating {
            display: grid;
            align-items: center;
            grid-auto-flow: column;
            justify-content: left;
            grid-gap: 4px;
          }

          .mobile-product-wrap .content-block .label-title {
            font-size: 16px;
            font-weight: ${AVENIR.HEAVY};
            font-family: ${AVENIR.FONT_STACK};
          }

          .cta-wrap {
            color: #fff;
            width: 100%;
            background: #fff;
            z-index: 999;
            position: fixed;
            left: 0;
            bottom: 0;
            display: grid;
            justify-items: center;
          }

          .cta-wrap a {
            text-decoration: none;
            display: block;
            width: calc(100% - 32px);
            margin-bottom: 16px;
            border-radius: 2px;
            background: #ec1943;
          }

          .cta-text {
            padding: 16px;
            font-family: ${AVENIR.FONT_STACK};
            font-size: 16px;
            font-weight: ${AVENIR.HEAVY};
            font-style: normal;
            font-stretch: normal;
            line-height: 1;
            letter-spacing: normal;
            text-align: center;
            color: #fff;
          }

          .descriptors {
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: max-content;
            font-family: 'Graphik';
            font-size: 11px;
            font-weight: 300;
            grid-gap: 8px;
            grid-column: 1 / 3;
            max-width: calc(100vw - 32px);
            overflow-x: scroll;
            margin-top: 8px;
          }
          .descriptor {
            padding: 7px 12px;
            background: #ebebeb;
            border-radius: 2px;
            color: #545454;
          }
        `}
      </style>
      <style global jsx>
        {`
          .content-block .label-title {
            font-weight: ${AVENIR.HEAVY};
            font-family: ${AVENIR.FONT_STACK};
            line-height: 1.12;
          }
          .content-block p {
            margin: 0;
            line-height: 1.57;
          }
          .content-blocks {
            display: grid;
            grid-row-gap: 32px;
          }
          .hr-line {
            margin-top: -8px;
            border-top: 1px solid #ebebeb;
          }
          .mobile-product-wrap {
            font-family: 'Graphik', 'Proxima Nova', 'Helvetica Neue', Helvetica,
              Arial, sans-serif;
          }
          .mobile-product-wrap .tags p {
            margin: 0px;
          }
          .price {
            margin-bottom: 0px;
          }
          .title {
            margin-bottom: 0px;
          }
          .prod-image .swiper-container {
            overflow: unset;
            width: auto;
            height: 100%;
          }
          .mobile-product-wrap .prod-image img {
            height: 100%;
            width: 100%;
          }
          .prod-image .swiper-container img {
            border-radius: 4px;
          }
          .boosters .inline-availability {
            color: #24a1b2;
          }
          .boosters p {
            margin: 0;
            font-size: 12px;
          }
          .content-block ul {
            margin: 0;
            padding-left: 0;
            list-style: none;
          }
          .boosters p * {
            display: none;
          }
          .boosters p *:first-child {
            display: unset;
          }
          .header {
            position: fixed;
            width: 100%;
            z-index: 99;
            background: #fff;
          }

          .header .back {
            display: flex;
          }
          .descriptors::after {
            content: '';
            margin-right: 32px;
            display: block;
          }
        `}
      </style>
    </div>
  );
};

MobileProductPage.defaultProps = {
  carouselOptions: {
    direction: 'horizontal',
    speed: 650,
    slidesPerView: 'auto',
    loop: false,
    centered: true,
    spaceBetween: 8,
    autoplay: false,
    rebuildOnUpdate: true,
  },
};
