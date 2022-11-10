import React, { useState, useEffect, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
// Components
import Conditional from 'components/common/Conditional';
import LocalisedPrice from 'UI/LPrice';
import Image from 'components/UI/Image';
// Constants
import COLORS from 'const/colors';
import { MBContext } from 'contexts/MBContext';
import { STAR } from 'assets/SvgIcons';
import {
  CASHBACK_TYPES,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
} from 'const/index';
import { metaAtom } from 'store/atoms/meta';
// Utils
import { expandFontToken } from 'const/typography';
import { descriptorIcons } from 'const/descriptorIcons';
import { strings } from 'const/strings';
import { fetchCalendarInventory } from 'utils/apiUtils';
import { createBookingURL } from 'utils';
import { dateToString } from 'utils/dateUtils';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { convertUidToUrl } from 'utils/urlUtils';

const PinnedTourWrapper = styled.div`
  padding: 0 5.46vw;
  margin: 3rem 5vw 1.5rem 5vw;
  max-width: calc(100vw - (16px * 2));
  .because-search-for {
    margin-bottom: 1.5rem;
    ${expandFontToken('Heading/Large')};
  }
  @media (max-width: 768px) {
    margin: 2rem 1rem;
    padding: 0;
    .because-search-for {
      margin-bottom: 1rem;
      ${expandFontToken('Heading/Small')};
    }
  }
`;

const PinnedTourContentWrapper = styled.div`
  width: 100%;
  background: #f8f8f8;
  display: flex;
  border-radius: 1rem;
  .tour-image {
    min-width: 384px;
    height: 240px;
    img {
      border-radius: 1rem 0 0 1rem;
    }
  }

  .tour-details {
    padding: 1.5rem 0;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    .tour-content {
      width: 62%;
      box-sizing: border-box;
      padding-left: 1.5rem;

      .title {
        ${expandFontToken('Heading/Regular')};
      }

      .next-available {
        ${expandFontToken('UI/Label Regular (Heavy)')};
        color: ${COLORS.OCEAN_BLUE.TERTIARY};
        margin-top: 0.5rem;
      }

      .rating {
        margin-top: 0.5rem;
        display: flex;
        .avg-rating {
          color: ${COLORS.BRAND.CANDY};
          ${expandFontToken('UI/Label Medium (Heavy)')};
        }
        .total-rating {
          ${expandFontToken('UI/Label Small')};
          line-height: 20px;
          margin-left: 4px;
        }
      }

      .descriptors-wrapper {
        margin-top: 1rem;
        .descriptor {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          .descriptor-name {
            ${expandFontToken('UI/Label Regular')};
            margin-left: 10px;
          }
        }
      }
    }
    .check-availability {
      box-sizing: border-box;
      padding-left: 1.5rem;
      border-left: 1px dashed ${COLORS.GRAY.G6};
      max-width: 38%;

      .from {
        ${expandFontToken('UI/Label Regular')};
        text-transform: lowercase;
        .scratch-price {
          text-decoration: line-through;
        }
      }
      .actual-price {
        margin-top: 4px;
        display: flex;
        align-items: center;
        .price {
          ${expandFontToken('Heading/Regular')};
          margin-right: 0.75rem;
        }
        .cashback {
          padding: 4px;
          ${expandFontToken('Misc/Tag Regular')};
          color: ${COLORS.TEXT.OKAY_GREEN_3};
          background: ${COLORS.BACKGROUND.SOOTHING_GREEN};
        }
      }
      .buy-button {
        ${expandFontToken('Button/Medium')}
        box-sizing: border-box;
        padding: 12px 20px;
        border-radius: 8px;
        margin: 1.25rem 0;
        border: none;
        width: 252px;
        display: block;
        text-align: center;
        grid-area: cta;
        background: ${COLORS.BRAND.PURPS};
        color: ${COLORS.BRAND.WHITE};
        display: block;
        cursor: pointer;
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 6px;
    background: ${COLORS.BRAND.WHITE};
    border: 1px solid ${COLORS.GRAY.G6};
    .tour-image {
      min-width: 100%;
      height: 13.375rem;
      img {
        border-radius: 6px 6px 0 0;
      }
    }

    .tour-details {
      flex-direction: column;
      padding: 0.5rem 12px;
      width: 100%;

      .tour-content {
        width: 100%;
        padding: 0;
        .title {
          ${expandFontToken('Heading/Product Card')};
          margin-top: 4px;
        }
        .next-available {
          display: none;
        }
        .tag-rating-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .tags {
            ${expandFontToken('Subheading/XS')};
            color: ${COLORS.GRAY.G4};
          }
        }
        .descriptors-wrapper {
          margin-top: 0.75rem;
          color: ${COLORS.GRAY.G3};
          .descriptor {
            margin-top: 0.5rem;
            .descriptor-name {
              ${expandFontToken('UI/Label Regular')};
              margin-left: 6px;
            }
          }
        }
      }

      .check-availability {
        margin: 1rem 0;
        padding: 0;
        max-width: 100%;
        .buy-button {
          display: none;
        }

        .actual-price {
          .price {
            ${expandFontToken('UI/Label Large (Heavy)')};
          }
        }
      }
    }
  }
`;
const PinnedTour = (props) => {
  let { tour, isMobile, allTours, host } = props;
  const {
    id: tgid,
    name,
    media,
    averageRating,
    reviewCount,
    descriptors,
    listingPrice,
    displayTags,
    primaryCategory,
    primaryCollection,
    primarySubCategory,
  } = tour ?? {};
  const tourData = allTours[tgid] ?? {};
  const { showPageUid = null } = tourData ?? {};
  const { url: imageUrl, alt } = media?.productImages?.[0];
  const {
    originalPrice,
    finalPrice,
    cashbackValue,
    cashbackType,
    currencyCode,
  } = listingPrice ?? {};
  const isScratchPrice = finalPrice < originalPrice;
  const [nextAvailable, setNextAvailable] = useState('');
  const { nakedDomain, lang, biLink, redirectToHeadoutBookingFlow } =
    useContext(MBContext);
  const pageMetaData = useRecoilValue(metaAtom);

  const isTourAvailable = listingPrice ? true : false;

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: lang,
    tgid: tgid,
    biLink: biLink,
    redirectToHeadoutBookingFlow,
  });

  const finalUrl = showPageUid
    ? convertUidToUrl({ uid: showPageUid, isDev: false, hostname: host })
    : bookingUrl;

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
  }, [tgid, isTourAvailable]);

  const redirectToBookingFlow = (source) => {
    if (!isMobile && source === 'CARD') return;
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.AVERAGE_RATING]: averageRating,
      [ANALYTICS_PROPERTIES.NUMBER_OF_RATINGS]: reviewCount,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      IS_OPENING_DATE_SHOWN: nextAvailable ? true : false,
      [ANALYTICS_PROPERTIES.RANKING]: 1,
      'Is Pinned Card': true,
    });
    if (!isMobile) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
        [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
        [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
        [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
        [ANALYTICS_PROPERTIES.RANKING]: 1,
        [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
        [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: name,
        [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
        [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
        [ANALYTICS_PROPERTIES.TGID]: tgid,
        [ANALYTICS_PROPERTIES.CITY]: pageMetaData?.city?.cityCode,
        [ANALYTICS_PROPERTIES.IS_PINNED_CARD]: true,
        ...getProductCommonProperties({
          primaryCategory,
          primaryCollection,
          primarySubCategory,
        }),
      });
    }

    let target = '_blank';
    if (isMobile) {
      target = '_self';
    }
    window.open(finalUrl, target, 'noopener, noreferrer');
  };

  if (!tour) return null;

  return (
    <PinnedTourWrapper>
      <div className="because-search-for">Because you searched for</div>
      <PinnedTourContentWrapper onClick={() => redirectToBookingFlow('CARD')}>
        <div className="tour-image">
          <Image
            aspectRatio="16:9"
            width="384"
            height="240"
            url={imageUrl}
            alt={alt || 'banner'}
            layout={'fill'}
            className="banner-image"
          />
        </div>
        <div className="tour-details">
          <div className="tour-content">
            <Conditional if={!isMobile}>
              <div className="title">{name}</div>
            </Conditional>
            <div className="tag-rating-wrapper">
              <Conditional if={isMobile && displayTags.length > 0}>
                <div className="tags">{displayTags[0]}</div>
              </Conditional>
              <div className="rating">
                <Conditional if={averageRating}>
                  <span className="avg-rating">
                    {averageRating} {STAR(COLORS.BRAND.CANDY)}{' '}
                  </span>
                </Conditional>
                <Conditional if={reviewCount}>
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
            <Conditional if={isMobile}>
              <div className="title">{name}</div>
            </Conditional>

            <Conditional if={nextAvailable}>
              <div className="next-available">
                {strings.NEXT_AVAILABLE}: {nextAvailable}
              </div>
            </Conditional>
            <div className="descriptors-wrapper">
              {descriptors.map((descriptor) => {
                const Icon = descriptorIcons[descriptor.code];

                return (
                  <div className="descriptor" key={descriptor.code}>
                    <Icon />
                    <span className="descriptor-name">
                      {strings.DESCRIPTORS[descriptor.code]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="check-availability">
            <div className="from">
              {strings.FROM}
              <Conditional if={isScratchPrice}>
                <span className="scratch-price"> {originalPrice}</span>
              </Conditional>
            </div>
            <div className="actual-price">
              <span className="price">
                <LocalisedPrice
                  price={finalPrice}
                  currencyCode={currencyCode}
                  lang={lang}
                />
              </span>
              <Conditional if={cashbackValue > 0}>
                <div className="cashback">
                  {strings.formatString(
                    strings.CASHBACK,
                    `${cashbackValue}${
                      cashbackType === CASHBACK_TYPES.PERCENTAGE ? '%' : ''
                    }`
                  )}
                </div>
              </Conditional>
            </div>
            <div
              role="button"
              tabIndex={0}
              className="buy-button"
              onClick={() => redirectToBookingFlow('BUTTON')}
            >
              {strings.CHECK_AVAIL}
            </div>
          </div>
        </div>
      </PinnedTourContentWrapper>
    </PinnedTourWrapper>
  );
};

export default PinnedTour;
