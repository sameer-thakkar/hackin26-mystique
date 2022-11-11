import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import Conditional from 'components/common/Conditional';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import COLORS from 'const/colors';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { createBookingURL } from 'utils';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { checkLTT, isMobile } from 'utils/helper';

import { MBContext } from '../../contexts/MBContext';

const StickyFooterContentWrapper = styled.div`
  z-index: 3;
  background: #ffffff;
  bottom: 0px;
  position: fixed;
  width: 100%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);

  .buy-button,
  .unavailable-button {
    padding: 12px 24px;
    border-radius: 4px;
    margin: 16px auto;
    border: none;
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    letter-spacing: 0.8px;
    display: block;
    text-align: center;
    max-width: 280px;
  }
  .buy-button {
    color: ${COLORS.BRAND.WHITE};
    background: ${COLORS.BRAND.PURPS};
    cursor: pointer;
  }
  .unavailable-button {
    background: ${COLORS.GRAY.G5};
    color: ${COLORS.BRAND.WHITE};
  }
`;

const StickyFooter = ({
  tgid,
  currentLanguage,
  isAvailable = true,
  tourGroupData,
}: {
  tgid: string | number;
  currentLanguage: string;
  isAvailable?: boolean;
  tourGroupData?: any;
}) => {
  const { nakedDomain, biLink, uid, redirectToHeadoutBookingFlow } =
    useContext(MBContext);

  const {
    listingPrice,
    name,
    primaryCategory,
    primarySubCategory,
    primaryCollection,
  } = tourGroupData ?? {};

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
    redirectToHeadoutBookingFlow,
  });

  const pageMetaData = useRecoilValue(metaAtom);

  const isLTT = checkLTT(uid);
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

  return (
    <StickyFooterContentWrapper>
      <Conditional if={isAvailable}>
        <div
          role="button"
          tabIndex={0}
          className="buy-button"
          onClick={() => {
            trackBookNowClick();
            let target = '_blank';
            if (isMobile()) {
              target = '_self';
            }
            window.open(bookingUrl, target, 'noopener, noreferrer');
          }}
        >
          {isLTT ? strings.CHECK_AVAIL : strings.BANNER_CTA}
        </div>
      </Conditional>
      <Conditional if={!isAvailable}>
        <button disabled className="unavailable-button">
          {strings.UNAVAILABLE}
        </button>
      </Conditional>
    </StickyFooterContentWrapper>
  );
};

export default StickyFooter;
