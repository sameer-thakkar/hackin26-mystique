import React, { useContext } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { checkIfBroadwayMB, checkIfLTTMB, isMobile } from 'utils/helper';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { MBContext } from '../../contexts/MBContext';

const StickyFooterContentWrapper = styled.div`
  z-index: 3;
  background: #ffffff;
  bottom: 0px;
  position: fixed;
  width: 100%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 1.5rem;
  box-sizing: border-box;
  .buy-button,
  .unavailable-button {
    display: block;
    margin: 0 auto;
    padding: 15px 24px;
    width: 100%;
    max-width: 24rem;
    border: none;
    border-radius: 8px;
    text-align: center;
    ${expandFontToken(FONTS.BUTTON_MEDIUM)}
  }
  .buy-button {
    color: ${COLORS.BRAND.WHITE};
    background: ${COLORS.BRAND.PURPS};
    cursor: pointer;
    box-shadow: 0px 8px 15px rgba(128, 0, 255, 0.3);
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
  bookingUrl,
}: {
  tgid: string | number;
  currentLanguage: string;
  isAvailable?: boolean;
  tourGroupData?: any;
  bookingUrl: string;
}) => {
  const { uid } = useContext(MBContext);

  const {
    listingPrice,
    name,
    primaryCategory,
    primarySubCategory,
    primaryCollection,
  } = tourGroupData ?? {};

  const pageMetaData = useRecoilValue(metaAtom);

  const isLTT = checkIfLTTMB(uid);
  const isBroadway = checkIfBroadwayMB(uid);
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
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.code,
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
        <button
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
          {isLTT || isBroadway ? strings.CHECK_AVAIL : strings.BANNER_CTA}
        </button>
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
