import React, { useEffect, useContext } from 'react';
import * as labels from 'constants/localization/labels';
import Image from 'UI/Image';
import { RichText } from 'prismic-reactjs';
import { CHEVRON_LEFT, BorderedShield, BrownTicket } from 'assets/SvgIcons';
import { shortCodeSerializer } from 'utils/shortCodes';
import { PAGETYPE } from 'constants/index';
import parse from 'url-parse';
import Swiper from 'react-id-swiper';
import { SOLEIL, COLORS } from 'constants/ui-constants';
import { MBContext } from 'contexts/MBContext';
import DiscountedFutureSidebar from 'components/DiscountedFutureSidebar';
import SafeExperiencesPitch from 'UI/SafeExperiencesPitch';
import Split, { StlyedSplit } from 'UI/Split';
import IconCTA from 'UI/IconCTA';
import { greenScheme, brownScheme } from 'style/theme';
import styled from 'styled-components';
import { isSafetyIncluded, isDiscountedFuture } from 'utils';

const IconBoosters = styled.div`
  margin-left: 12px;
  grid-column: 1 / 3;
  @media (max-width: 768px) {
    margin-left: 0;
    margin-bottom: 8px;
    ${StlyedSplit} {
      overflow-y: visible;
      padding-left: 12px;
      grid-template-columns: auto auto 8px;
      grid-column-gap: 24px;
      margin: 0;
    }
  }
`;
export const MobileProductPage = (props) => {
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
  let allContent = [...tour.contentBlocks.left, ...tour.contentBlocks.right];
  allContent = allContent.sort((a, b) => {
    let aLen = a.len;
    let bLen = b.len;
    // TODO: (unHack) Push Cancellation Policy to the end
    if (/cancel/.exec(a.label.toLowerCase())) aLen += 500000;
    if (/cancel/.exec(b.label.toLowerCase())) bLen += 500000;
    return aLen - bLen;
  });
  let url = host || window.location.host;
  const isDev = url.includes('localhost');
  const currentHost = !isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage.', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');
  const descriptors = tour.descriptors.split(',').filter((desc) => desc.length);
  const { allTags = [], listingPrice, dfListingPrice } = tour;
  const hasSafetyFlag = isSafetyIncluded(allTags);
  const isDFProduct = isDiscountedFuture(allTags);
  const isDFOnlyProduct = listingPrice === null && dfListingPrice !== null;

  const {
    sidebarModal: { addToAside },
  } = useContext(MBContext);
  const openDFSidebar = () => {
    addToAside({
      width: '27.5vw',
      title: tour.title,
      children: <DiscountedFutureSidebar product={tour} />,
    });
  };
  const openSafeSidebar = () => {
    addToAside({
      width: '41.06vw',
      children: (
        <SafeExperiencesPitch images={tour.safetyImages} allTags={allTags} />
      ),
      sidePadding: 40,
    });
  };

  return (
    <div className="mobile-product-wrap">
      <div className="header">
        <div
          onClick={closeProductCard}
          className="back"
          onKeyDown={closeProductCard}
          role="button"
          tabIndex={0}
        >
          {CHEVRON_LEFT}
        </div>
      </div>
      <div className="prod-image">
        {/* <img src={tour.descriptionImage} alt="" /> */}
        {/* <Banner  isMobile={true} carouselOptions/> */}
        {tour.images.length > 1 ? (
          <Swiper {...carouselOptions} {...extendedSwiperOptions}>
            {tour.images.map((image, index) => {
              return (
                <div key={index} className="swiper-slide">
                  <Image url={image.url} dontLazyLoad={index == 0} />
                </div>
              );
            })}
          </Swiper>
        ) : (
          <div className="single-image">
            <Image url={tour.images[0]?.url} dontLazyLoad={true} />
          </div>
        )}
      </div>
      <div className="prod-content">
        <div className="head">
          {tour.vendor?.length ? (
            <div className="vendor-name">{tour.vendor}</div>
          ) : null}
          <div className="title">{tour.title}</div>
          <div className="price">
            <span className="from-text">from</span>
            <div className="current-price">
              {tour.currencySymbol}
              {tour.price}
            </div>
            {tour.price < tour.scratchPrice ? (
              <div className="scratched-price">
                {tour.currencySymbol}
                {tour.scratchPrice}
              </div>
            ) : null}
          </div>
          {tour.cardFooter.length ? (
            <div className="boosters">
              <RichText
                render={tour.cardFooter}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          ) : null}
          <IconBoosters>
            <Split count={2} autoWidth={true} mobileLayout={'scroll'}>
              {hasSafetyFlag ? (
                <IconCTA
                  text={labels[currentLanguage].SAFE_EXPERIENCE.FLAG_TEXT}
                  colorScheme={greenScheme}
                  ctaOnClick={openSafeSidebar}
                  icon={BorderedShield}
                />
              ) : null}
              {isDFProduct ? (
                <IconCTA
                  text={labels[currentLanguage].DISCOUNTED_FUTURES.FLAG_TEXT}
                  colorScheme={brownScheme}
                  ctaOnClick={openDFSidebar}
                  icon={BrownTicket}
                />
              ) : null}
            </Split>
          </IconBoosters>
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
            <div className="content-block full-block tour-description">
              <RichText
                render={tour.description}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          ) : null}
          <div className="hr-line full-block "></div>
          {tour.theater ? (
            <div className="content-block full-block ">
              <RichText
                render={tour.theater}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          ) : null}
          {allContent.map((block, index) => {
            const isShortBlock = block.len < 50;
            return (
              <div
                className={`content-block ${
                  !isShortBlock ? 'full-block' : ''
                } `}
                key={index}
              >
                <span className="label-title">{block.label} </span>
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
          rel="noopener noreferrer"
          href={`https://book.${bookingUrl}${
            currentLanguage === 'en' ? '' : `/${currentLanguage}`
          }/book/${tgid}${isDFOnlyProduct ? '?discountedFuture=true' : ''}`}
          onClick={(e) => {
            if (isDFProduct && !isDFOnlyProduct) {
              e.preventDefault();
              e.stopPropagation();
              openDFSidebar();
              return false;
            }
          }}
        >
          <div className="cta-text">
            {isDFOnlyProduct
              ? labels[currentLanguage].DISCOUNTED_FUTURES.FLAG_TEXT
              : labels[currentLanguage].BOOK_NOW_CTA}
          </div>
        </a>
      </div>
      <style jsx>
        {`
          .mobile-product-wrap {
            display: grid;
            grid-row-gap: 24px;
            grid-template-rows: 56px 214px auto;
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
            padding: 18px 16px;
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
            font-family: ${SOLEIL.FONT_STACK};
            font-weight: ${SOLEIL.SEMIBOLD};
            color: ${COLORS.TWO_BLACK};
            line-height: 24px;
            text-transform: unset;
          }

          .mobile-product-wrap .head {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-row-gap: 8px;
          }
          .price {
            font-family: ${SOLEIL.FONT_STACK};
            font-weight: ${SOLEIL.SEMIBOLD};
            margin-left: 16px;
          }
          .mobile-product-wrap .current-price,
          .from-text {
            font-size: 18px;
            line-height: 24px;
            font-weight: ${SOLEIL.SEMIBOLD};
            color: ${COLORS.TWO_BLACK};
          }
          .from-text {
            font-size: 14px;
            line-height: 1;
            font-weight: ${SOLEIL.MEDIUM};
            margin-bottom: 4px;
          }
          .price .scratched-price {
            font-weight: ${SOLEIL.MEDIUM};
            font-size: 12px;
            text-decoration: line-through;
            color: ${COLORS.FOUR_BLACK};
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
            font-family: ${SOLEIL.FONT_STACK};
            font-weight: ${SOLEIL.REGULAR};
            color: #545454;
            display: grid;
            grid-row-gap: 4px;
          }

          .boosters {
            grid-column: 1 / 3;
            min-height: 1em;
          }

          .auto-boosters-box {
            font-size: 12px;
            display: grid;
            grid-column: 1 / 3;
            align-items: center;
            color: ${COLORS.FOUR_BLACK};
            grid-auto-flow: column;
            justify-content: left;
            grid-gap: 8px;
            font-family: ${SOLEIL.FONT_STACK};
            font-weight: ${SOLEIL.REGULAR};
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
            font-weight: ${SOLEIL.SEMIBOLD};
            font-family: ${SOLEIL.FONT_STACK};
            color: ${COLORS.TWO_BLACK};
          }

          .cta-wrap {
            color: #fff;
            width: 100%;
            background: #fff;
            z-index: 10;
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
            font-family: ${SOLEIL.FONT_STACK};
            font-size: 16px;
            font-weight: ${SOLEIL.SEMIBOLD};
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
            font-family: ${SOLEIL.FONT_STACK};
            font-size: 12px;
            font-weight: ${SOLEIL.REGULAR};
            grid-gap: 8px;
            grid-column: 1 / 3;
            max-width: calc(100vw - 32px);
            overflow-x: scroll;
            overscroll-behavior-x: contain;
            overflow: -moz-scrollbars-none;
            -ms-overflow-style: none;
            grid: unset;
            display: flex;
            flex-wrap: wrap;
          }
          .descriptors::-webkit-scrollbar {
            width: 0 !important;
          }
          .descriptor {
            padding: 7px 12px;
            background: ${COLORS.GREY_FO};
            border-radius: 2px;
            color: ${COLORS.TWO_BLACK};
            margin-right: 8px;
            margin-bottom: 8px;
          }
          .vendor-name {
            grid-column: 1 / 3;
            font-family: ${SOLEIL.FONT_STACK};
            font-weight: ${SOLEIL.MEDIUM};
            text-transform: uppercase;
            font-size: 11px;
            line-height: 11px;
            letter-spacing: 0.5px;
            color: ${COLORS.GREY_G4};
            display: none;
          }
          @media (max-width: 768px) {
            .vendor-name {
              display: initial;
            }
          }
        `}
      </style>
      <style global jsx>
        {`
          .content-block .label-title {
            font-weight: ${SOLEIL.SEMIBOLD};
            font-family: ${SOLEIL.FONT_STACK};
            line-height: 1.12;
          }
          .content-block p {
            margin: 0;
            line-height: 1.57;
          }
          .content-blocks {
            display: grid;
            grid-template-column: 1fr 1fr;
            grid-row-gap: 32px;
          }
          .full-block {
            grid-column: 1 / 3;
          }
          .hr-line {
            margin-top: -8px;
            border-top: 1px solid #ebebeb;
          }
          .mobile-product-wrap {
            font-family: ${SOLEIL.FONT_STACK};
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
          .single-image {
            width: 100%;
            height: 100%;
          }
          .prod-image .swiper-container img,
          .single-image img {
            border-radius: 4px;
            object-fit: cover;
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
            padding-left: 1em;
            display: grid;
            grid-row-gap: 6px;
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
