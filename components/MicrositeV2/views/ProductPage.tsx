import React, { useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import parse from 'url-parse';
import { greenScheme } from 'style/theme';
import { RichText } from 'prismic-reactjs';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import IconCTA from 'UI/IconCTA';
import LocalisedPrice from 'UI/LPrice';
import Split, { StlyedSplit } from 'UI/Split';
import {
  CHEVRON_LEFT,
  BorderedShield,
  CLOSE_WHITE,
  STAR,
} from 'assets/SvgIcons';
import { PAGETYPE } from 'const/index';
import { strings } from 'const/strings';
import { SOLEIL, COLORS } from 'const/ui-constants';
import { isSafetyIncluded, createBookingURL } from 'utils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { convertUidToUrl } from 'utils/urlUtils';
import { dateToString } from 'utils/dateToString';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });
const SafeExperiencesPitch = dynamic(() => import('UI/SafeExperiencesPitch'), {
  ssr: false,
});

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

const StyledMobileProductPage = styled.div`
  display: grid;
  grid-row-gap: ${({ isEntertainmentMb }) =>
    isEntertainmentMb ? '0' : '24px'};
  grid-template-rows: 56px 1fr;
  overflow: hidden;
  font-family: ${SOLEIL.FONT_STACK};
  position: relative;
  &::before {
    content: '';
    display: block;
  }
  .full-block {
    grid-column: 1 / 3;
  }
  .hr-line {
    margin-top: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '0' : '-8px'};
    border-top: 1px solid ${COLORS.CHALK};
  }
  .header {
    display: grid;
    align-items: center;
    padding: 18px 16px;
    box-sizing: border-box;
    border-bottom: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'none' : `1px solid ${COLORS.DADDY}`};
    position: fixed;
    width: 100%;
    z-index: 99;
    background: ${COLORS.WHITE};
    .back {
      display: flex;
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `justify-content: flex-end;`}
      path {
        ${({ isEntertainmentMb }) =>
          isEntertainmentMb && `stroke: ${COLORS.GREY.G2};stroke-width: 1px;`}
      }
    }
  }
  .content {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
  }
  .prod-image {
    max-width: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '100vh' : 'calc(100% - 32px)'};
    margin: auto auto 16px auto;
    max-height: 100%;
    height: 100%;
    .swiper-container {
      overflow: unset;
      width: auto;
      height: 100%;
    }
    .single-image {
      width: 100%;
      height: 100%;
    }
    img {
      height: 100%;
      width: 100%;
      border-radius: 4px;
      object-fit: cover;
    }

    .close {
      background: ${COLORS.BLACK};
      padding: 15px;
      display: flex;
      position: fixed;
      top: 0;
      right: 0;
      z-index: 999;
    }
  }
  .prod-content {
    background: ${COLORS.WHITE};
    padding: 0 16px;
    margin-bottom: 80px;
    z-index: 9;
    display: grid;
    grid-row-gap: 24px;
  }
  .title {
    font-size: 18px;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.SEMIBOLD};
    color: ${COLORS.TWO_BLACK};
    line-height: 24px;
    text-transform: unset;
    margin-bottom: 0;
  }

  .head {
    display: grid;
    grid-template-columns: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'unset' : '1fr auto'};
    grid-row-gap: 8px;
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb &&
      `
    grid-auto-flow: row;
    grid-auto-rows: max-content;
      .l1-booster-wrapper {
        display:grid;
        grid-template-columns: repeat(2, 1fr);
        font-size: 12px;
        line-height: 16px;
        .rating {
          justify-self: end;
          display:grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: 4px;
          justify-content: center;
          align-items: center;
          .avg-rating {
            font-weight: ${SOLEIL.SEMIBOLD};
            color: ${COLORS.JOY_MUSTARD};
            svg {
              width: 8px;
              height: 8px;
            }
          }
          .total-rating {
            font-size: 10px;
            line-height: 12px;
            color: ${COLORS.GREY.G4}
          }
        }
        .l1-booster {
          color: ${COLORS.BEACH};
        }
      }
    `}
    .price {
      font-family: ${SOLEIL.FONT_STACK};
      font-weight: ${SOLEIL.SEMIBOLD};
      margin-left: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '0' : '16px'};
      margin-bottom: 0px;
      .scratched-price {
        font-weight: ${SOLEIL.MEDIUM};
        font-size: 12px;
        text-decoration: line-through;
        color: ${COLORS.FOUR_BLACK};
      }
      .current-price,
      .from-text {
        color: ${COLORS.TWO_BLACK};
      }
      .current-price {
        font-size: 18px;
        line-height: 24px;
        font-weight: ${SOLEIL.SEMIBOLD};
      }
      .from-text {
        font-size: 14px;
        line-height: 1;
        font-weight: ${SOLEIL.MEDIUM};
        margin-bottom: 4px;
      }
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb &&
        `
          display: grid;
          grid-template-rows: repeat(2, max-content);
          row-gap: 4px;
          .current-price {
            grid-row: 2;
            display: flex;
            align-items: center;
            span {
              font-size: 17px;
              line-height: 20px;
              font-weight: ${SOLEIL.SEMIBOLD};
            }
            .discount {
              background-color: ${COLORS.SOOTHING_GREEN};
              color: ${COLORS.OKAY_GREEN};
              padding: 4px 6px;
              border-radius: 2px;
              font-size: 10px;
              font-style: normal;
              font-weight: ${SOLEIL.REGULAR};
              line-height: 12px;
              margin-left: 6px;
            }
          }
          .scratched-price {
            
            grid-row: 1;
            text-decoration: none;
            .from-text {
              margin-right: 2px;
            }
            span {
              color: ${COLORS.GREY.G4};
              font-size: 12px;
              line-height: 16px;
            }
          }
      `}
    }
  }

  .tags {
    color: ${COLORS.RHAPSODY};
    border: 1px solid;
    border-radius: 2px;
    padding: 5px 4px;
    font-size: 12px;
    font-weight: 400;
    text-transform: capitalize;
    display: inline-block;
    margin-top: 8px;
    p {
      margin: 0;
    }
  }
  .content-blocks {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '24px' : '32px'};
    ${({ isEntertainmentMb }) => isEntertainmentMb && `padding-bottom: 48px;`}
  }
  .content-block {
    font-size: 14px;
    line-height: 1.57;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.REGULAR};
    color: ${COLORS.DAVY_GREY};
    display: grid;
    grid-row-gap: 4px;
    .label-title {
      font-size: 16px;
      font-weight: ${SOLEIL.SEMIBOLD};
      font-family: ${SOLEIL.FONT_STACK};
      line-height: 1.12;
      color: ${COLORS.TWO_BLACK};
    }
    p {
      margin: 0;
      line-height: 1.57;
    }
    ul {
      margin: 0;
      padding-left: 1em;
      display: grid;
      grid-row-gap: 6px;
    }
  }

  .boosters {
    grid-column: 1 / 3;
    min-height: 1em;
    .inline-availability {
      color: ${COLORS.TEAL};
    }
    p {
      margin: 0;
      font-size: 12px;
    }
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
    .rating {
      display: grid;
      align-items: center;
      grid-auto-flow: column;
      justify-content: left;
      grid-gap: 4px;
    }
  }
  .divider-line {
    width: 1px;
    height: 85%;
    background: ${COLORS.DADDY};
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
    .prod-image {
      .swiper-wrapper {
        grid-template-columns: unset;
      }
      img {
        ${({ isEntertainmentMb }) =>
          isEntertainmentMb && `height: 214px;border-radius: 8px;`}
      }
    }
  }
`;

const Descriptors = styled.div`
  grid-column: 1 / 3;
  font-size: 12px;
  font-weight: ${SOLEIL.REGULAR};
  max-width: calc(100vw - 32px);
  display: flex;
  flex-wrap: wrap;
  &::after {
    content: '';
    margin-right: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '0' : '32px'};
    display: block;
  }
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  .descriptor {
    padding: 7px 12px;
    background: ${COLORS.GREY_FO};
    border-radius: 2px;
    color: ${COLORS.TWO_BLACK};
    margin-right: 8px;
    margin-bottom: 8px;
    &.mr-0 {
      margin-right: 0;
    }
  }
`;

const CTABlock = styled.div`
  color: ${COLORS.WHITE};
  width: 100%;
  background: ${COLORS.WHITE};
  z-index: 10;
  position: fixed;
  left: 0;
  bottom: 0;
  display: grid;
  justify-items: center;
  ${({ isEntertainmentMb }) =>
    isEntertainmentMb &&
    `
    grid-template-columns: repeat(2, 1fr);
    column-gap: 16px;
    padding: 16px;
    box-sizing: border-box;
    border-top: 1px solid ${COLORS.GREY_G6};
  `}
  .cta {
    text-decoration: none;
    display: block;
    width: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '100%' : 'calc(100% - 32px)'};
    margin-bottom: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '0' : '16px'};
    border-radius: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '4px' : '2px'};
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
    }
    &.primary {
      background: ${COLORS.RHAPSODY};
      .cta-text {
        color: ${COLORS.WHITE};
      }
    }
    &.secondary {
      color: ${COLORS.GREY.G2};
      background: ${COLORS.WHITE};
      border: 1px solid;
      .cta-text {
        color: ${COLORS.GREY.G2};
      }
    }
  }
`;

export const MobileProductPage = (props) => {
  const {
    tour,
    host,
    uid,
    currentLanguage,
    tgid,
    carouselOptions,
    isEntertainmentMb,
    hasCategoryTourList,
  } = props;
  const {
    title,
    description,
    theater,
    images,
    safetyImages,
    contentBlocks,
    descriptors: tourDescriptors,
    cardFooter,
    vendor,
    price,
    scratchPrice,
    currencySymbol,
    showPageUid = null,
    reviewCount,
    category,
    averageRating,
    reopeningDate,
    listingPrice,
  } = tour || {};
  let allContent = [...contentBlocks.left, ...contentBlocks.right];
  if (!hasCategoryTourList) {
    allContent = allContent.sort((a, b) => {
      let aLen = a.len;
      let bLen = b.len;
      // TODO: (unHack) Push Cancellation Policy to the end
      if (/cancel/.exec(a.label.toLowerCase())) aLen += 500000;
      if (/cancel/.exec(b.label.toLowerCase())) bLen += 500000;
      return aLen - bLen;
    });
  }
  const {
    sidebarModal: { addToAside },
    biLink,
    lang,
  } = useContext(MBContext);
  const closeProductCard = () => {
    props.changePage({ name: PAGETYPE.HOMEPAGE });
  };

  let url = host || window.location.host;
  const isDev = url.includes('localhost');
  const currentHost = !isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');
  const descriptors = hasCategoryTourList
    ? [category, ...tourDescriptors]
    : tourDescriptors?.split(',')?.filter((desc) => desc?.length);
  const { allTags = [] } = tour;
  const hasSafetyFlag = isSafetyIncluded(allTags);
  const showPageUrl = showPageUid ? convertUidToUrl(showPageUid) : null;
  const openingDate = dateToString(reopeningDate, lang, 'DD MMM, YYYY');

  const openSafeSidebar = () => {
    addToAside({
      width: '41.06vw',
      children: (
        <SafeExperiencesPitch images={safetyImages} allTags={allTags} />
      ),
      sidePadding: 40,
    });
  };

  const carouselProps = {
    ...carouselOptions,
    ...(isEntertainmentMb && {
      // slidesPerView: 1.2,
      spaceBetween: 16,
      loop: true,
      centeredSlides: true,
      lazy: true,
    }),
    ...(images?.length <= 1 && {
      autoplay: false,
      loop: false,
      noSwiping: true,
    }),
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  console.log(tour);
  const CTAMarkup = (
    <CTABlock isEntertainmentMb={isEntertainmentMb}>
      <Conditional if={isEntertainmentMb && showPageUrl}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={showPageUrl}
          className="cta secondary"
        >
          <div className="cta-text">{strings.MORE_DETAILS}</div>
        </a>
      </Conditional>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={createBookingURL({
          nakedDomain: bookingUrl,
          lang: currentLanguage,
          tgid,
          biLink,
        })}
        className="cta primary"
      >
        <div className="cta-text">{strings.BOOK_NOW_CTA}</div>
      </a>
    </CTABlock>
  );

  return (
    <StyledMobileProductPage isEntertainmentMb={isEntertainmentMb}>
      <header className="header">
        <div
          onClick={closeProductCard}
          className="back"
          onKeyDown={closeProductCard}
          role="button"
          tabIndex={0}
        >
          {isEntertainmentMb ? CLOSE_WHITE : CHEVRON_LEFT}
        </div>
      </header>
      <main className="content">
        <div className="prod-image">
          {/* <img src={descriptionImage} alt="" /> */}
          {/* <Banner  isMobile={true} carouselOptions/> */}
          <Conditional if={images?.length === 1}>
            <div className="single-image">
              <Image url={images[0]?.url} dontLazyLoad={true} />
            </div>
          </Conditional>
          <Conditional if={images?.length > 1}>
            <Swiper {...carouselProps}>
              {images?.map((image, index) => {
                return (
                  <div key={index} className="swiper-slide">
                    <Image url={image.url} dontLazyLoad={index == 0} />
                  </div>
                );
              })}
            </Swiper>
          </Conditional>
        </div>
        <div className="prod-content">
          <div className="head">
            <Conditional if={vendor?.length}>
              <div className="vendor-name">{vendor}</div>
            </Conditional>
            <Conditional if={isEntertainmentMb}>
              <div className="l1-booster-wrapper">
                <div className="l1-booster">
                  {strings.REOPENING_ON} {openingDate}
                </div>
                <Conditional if={reviewCount}>
                  <div className="rating">
                    <span className="avg-rating">
                      {averageRating} {STAR(COLORS.JOY_MUSTARD)}
                    </span>
                    <span className="total-rating">
                      (
                      {reviewCount > 999
                        ? `${(reviewCount / 1000).toFixed(1)}k`
                        : reviewCount}
                      )
                    </span>
                  </div>
                </Conditional>
              </div>
            </Conditional>
            <div className="title">{title}</div>

            <div className="price">
              <Conditional if={!isEntertainmentMb}>
                <span className="from-text">{strings.FROM?.toLowerCase()}</span>
              </Conditional>

              <div className="current-price">
                <LocalisedPrice
                  price={price}
                  currencySymbol={currencySymbol}
                  lang={lang}
                />
                <Conditional
                  if={isEntertainmentMb && listingPrice?.bestDiscount > 0}
                >
                  <span className="discount">
                    {listingPrice?.bestDiscount}% {strings.OFF}
                  </span>
                </Conditional>
              </div>
              <Conditional if={price < scratchPrice}>
                <div className="scratched-price">
                  <Conditional if={isEntertainmentMb}>
                    <span className="from-text">
                      {strings.FROM?.toLowerCase()}
                    </span>
                  </Conditional>
                  <LocalisedPrice
                    price={scratchPrice}
                    currencySymbol={currencySymbol}
                    lang={lang}
                  />
                </div>
              </Conditional>
            </div>
            <Conditional if={cardFooter?.length}>
              <div className="boosters">
                <RichText
                  render={cardFooter}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
            </Conditional>
            <Conditional if={hasSafetyFlag}>
              <IconBoosters>
                <Split count={2} autoWidth={true} mobileLayout={'scroll'}>
                  <Conditional if={hasSafetyFlag}>
                    <IconCTA
                      text={strings.SAFE_EXPERIENCE.FLAG_TEXT}
                      colorScheme={greenScheme}
                      ctaOnClick={openSafeSidebar}
                      icon={BorderedShield}
                    />
                  </Conditional>
                </Split>
              </IconBoosters>
            </Conditional>
          </div>
          <Conditional if={descriptors?.length}>
            <Conditional if={isEntertainmentMb}>
              <div className="hr-line full-block"></div>
            </Conditional>
            <Descriptors>
              {descriptors?.map((descriptor, index) => {
                const lastItem = index === descriptors?.length - 1;
                return (
                  <div
                    className={`${lastItem ? 'descriptor mr-0' : 'descriptor'}`}
                    key={index}
                  >
                    {descriptor?.trim()}
                  </div>
                );
              })}
            </Descriptors>
          </Conditional>
          <div className="content-blocks">
            <Conditional if={description && description?.length}>
              <div className="content-block full-block tour-description">
                <RichText
                  render={description}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
            </Conditional>
            <div className="hr-line full-block"></div>
            <Conditional if={theater}>
              <div className="content-block full-block ">
                <RichText
                  render={theater}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
            </Conditional>
            {allContent.map((block, index) => {
              const isShortBlock = block.len < 50;
              const { label, content } = block || {};
              if (label && content) {
                return (
                  <div
                    className={`${
                      isEntertainmentMb
                        ? 'content-block full-block'
                        : !isShortBlock
                        ? 'content-block full-block'
                        : 'content-block'
                    }`}
                    key={index}
                  >
                    <span className="label-title">{label} </span>
                    <Conditional if={isEntertainmentMb || hasCategoryTourList}>
                      <p>{content}</p>
                    </Conditional>
                    <Conditional if={!isEntertainmentMb}>
                      <RichText
                        render={content}
                        htmlSerializer={shortCodeSerializer}
                      />
                    </Conditional>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </main>

      {CTAMarkup}
    </StyledMobileProductPage>
  );
};

export default MobileProductPage;

MobileProductPage.defaultProps = {
  carouselOptions: {
    direction: 'horizontal',
    speed: 650,
    slidesPerView: 'auto',
    loop: false,
    centeredSlides: false,
    spaceBetween: 8,
    autoplay: false,
    rebuildOnUpdate: true,
  },
};
