import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import parse from 'url-parse';
import { greyScheme } from 'style/theme';
import { RichText } from 'prismic-reactjs';
import { MBContext } from 'contexts/MBContext';
import InteractionContext from 'contexts/Interaction';
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
import {
  NEW_ARRIVALS_CATEGORIES,
  PAGETYPE,
  REOPENING_CATEGORIES,
  ANALYTICS_PROPERTIES,
  ANALYTICS_EVENTS,
} from 'const/index';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { isSafetyIncluded, createBookingURL } from 'utils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { dateToString, isDateInThePast } from 'utils/dateUtils';
import { parseV2ProductDescriptors } from 'utils/dataParsers';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { metaAtom } from 'store/atoms/meta';

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
  font-family: ${HALYARD.FONT_STACK};
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
    border-top: 1px solid ${COLORS.GRAY.G7};
  }
  .header {
    display: grid;
    align-items: center;
    padding: 18px 16px;
    box-sizing: border-box;
    border-bottom: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'none' : `1px solid ${COLORS.GRAY.G6}`};
    position: fixed;
    width: 100%;
    z-index: 99;
    background: ${COLORS.BRAND.WHITE};
    .title {
      font-size: 14px;
      line-height: 20px;
      display: none;
    }
    &.flex {
      display: flex;
      justify-content: space-between;
      .title {
        display: block;
      }
    }
    .back {
      display: flex;
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `justify-content: flex-end;`}
      path {
        ${({ isEntertainmentMb }) =>
          isEntertainmentMb && `stroke: ${COLORS.GRAY.G2};stroke-width: 1px;`}
      }
    }
  }
  .content {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
    grid-gap: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'unset' : '24px'};
  }
  .prod-image {
    max-width: calc(100% - 32px);
    width: calc(100% - 32px);
    margin: auto auto 16px auto;
    max-height: 100%;
    height: 100%;
    .swiper-container {
      overflow: unset;
      width: 100%;
      height: 100%;
    }
    .swiper-slide {
      -webkit-transform-style: preserve-3d;
      -webkit-backface-visibility: hidden;
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
      background: ${COLORS.BRAND.BLACK};
      padding: 15px;
      display: flex;
      position: fixed;
      top: 0;
      right: 0;
      z-index: 999;
    }
  }
  .prod-content {
    background: ${COLORS.BRAND.WHITE};
    padding: 0 16px;
    margin-bottom: 80px;
    z-index: 9;
    display: grid;
    grid-row-gap: 24px;
  }
  .title {
    font-size: 18px;
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 600;
    color: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GRAY.G2 : COLORS.GRAY.G1};
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
        display:flex;
        font-size: 12px;
        line-height: 16px;
        justify-content: space-between;
        .rating {
          justify-self: end;
          justify-content: center;
          align-items: center;
          .avg-rating {
            font-weight: 600;
            color: ${COLORS.JOY_MUSTARD};
            svg {
              width: 8px;
              height: 8px;
            }
          }
          .total-rating {
            font-size: 10px;
            line-height: 12px;
            color: ${COLORS.GRAY.G4}
          }
        }
        .l1-booster {
          color: ${COLORS.TEXT.BEACH};
        }
      }
    `}
    .price {
      font-family: ${HALYARD.FONT_STACK};
      font-weight: 600;
      margin-left: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '0' : '16px'};
      margin-bottom: 0px;
      ${({ isEntertainmentMb }) => isEntertainmentMb && `padding-top: 8px;`};
      .scratched-price {
        font-weight: 500;
        font-size: 12px;
        text-decoration: line-through;
        color: ${COLORS.GRAY.G2};
      }
      .current-price,
      .from-text {
        color: ${COLORS.GRAY.G1};
      }
      .current-price {
        font-size: 18px;
        line-height: 24px;
        font-weight: 600;
      }
      .from-text {
        font-size: 14px;
        line-height: 1;
        font-weight: 500;
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
              font-weight: 600;
            }
            .discount {
              background-color: ${COLORS.BACKGROUND.SOOTHING_GREEN};
              color: ${COLORS.TEXT.OKAY_GREEN_3};
              padding: 4px 6px;
              border-radius: 2px;
              font-size: 10px;
              font-style: normal;
              font-weight: 400;
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
              color: ${COLORS.GRAY.G4};
              font-size: 12px;
              line-height: 16px;
            }
          }
      `}
    }
  }

  .tags {
    color: ${COLORS.BRAND.PURPS};
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
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 400;
    color: ${COLORS.GRAY.G2};
    display: grid;
    grid-row-gap: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '8px' : '4px'};
    .label-title {
      font-size: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '14px' : '16px'};
      font-weight: 600;
      font-family: ${HALYARD.FONT_STACK};
      line-height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '20px' : '1.12'};
      color: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? COLORS.GRAY.G2 : COLORS.GRAY.G1};
    }
    p {
      margin: 0;
      line-height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '20px' : '1.57'};
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
      color: ${COLORS.TEXT.BEACH};
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
    color: ${COLORS.GRAY.G2};
    grid-auto-flow: column;
    justify-content: left;
    grid-gap: 8px;
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 400;
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
    background: ${COLORS.GRAY.G6};
  }

  .vendor-name {
    grid-column: 1 / 3;
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 500;
    text-transform: uppercase;
    font-size: 11px;
    line-height: 11px;
    letter-spacing: 0.5px;
    color: ${COLORS.GRAY.G4};
    display: none;
  }
  @media (max-width: 768px) {
    .vendor-name {
      display: initial;
    }
    .prod-image {
      .swiper-wrapper {
        height: 214px;
        grid-template-columns: unset;
      }
      img {
        ${({ isEntertainmentMb }) =>
          isEntertainmentMb && `height: 214px; border-radius: 8px;`}
      }
    }
  }
`;

const Descriptors = styled.div`
  grid-column: 1 / 3;
  font-size: 12px;
  font-weight: 400;
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
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '6px 8px' : '7px 12px'};
    background: ${COLORS.GRAY.G8};
    border-radius: 2px;
    color: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GRAY.G3 : COLORS.GRAY.G1};
    margin: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '0 4px 4px 0' : '0 8px 8px 0'};
    &.mr-0 {
      margin-right: 0;
    }
  }
`;

const CTABlock = styled.div`
  color: ${COLORS.BRAND.WHITE};
  width: 100%;
  background: ${COLORS.BRAND.WHITE};
  z-index: 10;
  position: fixed;
  left: 0;
  bottom: 0;
  justify-items: center;
  display: flex;
  ${({ isEntertainmentMb }) =>
    isEntertainmentMb &&
    `
    grid-template-columns: repeat(2, 1fr);
    column-gap: 16px;
    padding: 16px;
    box-sizing: border-box;
    border-top: 1px solid ${COLORS.GRAY.G6};
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
      font-family: ${HALYARD.FONT_STACK};
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '20px' : '1'};
      letter-spacing: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '0.6px' : 'normal'};
      text-align: center;
    }
    &.primary {
      background: ${COLORS.BRAND.PURPS};
      cursor: pointer;
      .cta-text {
        color: ${COLORS.BRAND.WHITE};
      }
    }
    &.secondary {
      color: ${COLORS.GRAY.G2};
      background: ${COLORS.BRAND.WHITE};
      border: 1px solid;
      .cta-text {
        color: ${COLORS.GRAY.G2};
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
    reviewCount,
    category,
    averageRating,
    reopeningDate,
    listingPrice,
  } = tour || {};
  const { currencyCode } = listingPrice ?? {};
  const pageMetaData = useRecoilValue(metaAtom);
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
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);
  const closeProductCard = () => {
    props.changePage({ name: PAGETYPE.HOMEPAGE });
  };

  const { activeCategoryId } = useContext(InteractionContext) || {};

  let url = host || window.location.host;
  const isDev = url.includes('localhost');
  const currentHost = !isDev ? url : parse(uid, true).pathname;
  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');
  const descriptors = parseV2ProductDescriptors({
    hasCategoryTourList,
    descriptors: tourDescriptors,
    category,
  });
  const { allTags = [] } = tour;
  const hasSafetyFlag = isSafetyIncluded(allTags);
  const openingDate = dateToString(reopeningDate, lang, 'DD MMM, YYYY');
  const isOpeningDateInThePast = isDateInThePast(reopeningDate);

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
      init: true,
      loop: true,
      lazy: true,
      centeredSlides: true,
    }),
    ...(images?.length <= 1 && {
      autoplay: false,
      loop: false,
      noSwiping: true,
    }),
  };

  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () =>
      window.pageYOffset > 295 ? setShowTitle(true) : setShowTitle(false);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let OPENING_ON = '';
  if (openingDate === strings.TODAY || openingDate === strings.TOMORROW) {
    OPENING_ON = REOPENING_CATEGORIES.includes(activeCategoryId)
      ? strings.REOPENS
      : strings.OPENS;
  } else {
    OPENING_ON = REOPENING_CATEGORIES.includes(activeCategoryId)
      ? strings.REOPENING_ON
      : strings.OPENING_ON;
  }

  const isNew = NEW_ARRIVALS_CATEGORIES.includes(activeCategoryId);
  const onCheckAvailabilityClick = () => {
    window.open(
      createBookingURL({
        nakedDomain: bookingUrl,
        lang: currentLanguage,
        tgid,
        biLink,
        redirectToHeadoutBookingFlow,
      }),
      '_blank',
      'noopener, noreferrer'
    );
    const { primaryCategory, primarySubCategory } = tour || {};
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_BOOK_NOW_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
      [ANALYTICS_PROPERTIES.CITY]: pageMetaData?.city?.cityCode,
      [ANALYTICS_PROPERTIES.COUNTRY]: pageMetaData?.country?.code,
    });
  };

  const CTAMarkup = (
    <CTABlock isEntertainmentMb={isEntertainmentMb}>
      <div
        role="button"
        tabIndex={0}
        className="cta primary"
        onClick={onCheckAvailabilityClick}
      >
        <div className="cta-text">{strings.CHECK_AVAIL}</div>
      </div>
    </CTABlock>
  );

  return (
    <StyledMobileProductPage isEntertainmentMb={isEntertainmentMb}>
      <header
        className={`${
          isEntertainmentMb && showTitle ? 'header flex' : 'header'
        }`}
      >
        <Conditional if={isEntertainmentMb}>
          <div className="title">{title}</div>
        </Conditional>
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
              <Image
                url={images[0]?.url}
                priority
                fill
                alt={images[0]?.alt || ''}
              />
            </div>
          </Conditional>
          <Conditional if={images?.length > 1}>
            <Swiper {...carouselProps}>
              {images?.map((image, index) => {
                return (
                  <div
                    key={index}
                    className="swiper-slide"
                    role="button"
                    tabIndex={0}
                  >
                    <Image
                      url={image.url}
                      height={214}
                      width={686}
                      alt={image?.alt || ''}
                    />
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
                <Conditional if={!isOpeningDateInThePast}>
                  <div className="l1-booster">
                    {OPENING_ON} {openingDate}
                  </div>
                </Conditional>
                <div className="rating">
                  <Conditional if={isNew}>
                    <span className="avg-rating">{strings.NEW}</span>
                  </Conditional>
                  <Conditional if={!isNew && averageRating}>
                    <span className="avg-rating">
                      {averageRating} {STAR(COLORS.PRIMARY.JOY_MUSTARD)}
                    </span>
                  </Conditional>
                  <Conditional if={!isNew && reviewCount}>
                    <span className="total-rating">
                      (
                      {reviewCount > 999
                        ? `${(reviewCount / 1000).toFixed(1)}k`
                        : reviewCount}
                      )
                    </span>
                  </Conditional>
                </div>
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
                  currencyCode={currencyCode}
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
                    currencyCode={currencyCode}
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
                      colorScheme={greyScheme}
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
            <Descriptors isEntertainmentMb={isEntertainmentMb}>
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
