import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { Button } from '@headout/aer';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { checkIfBroadwayMB, checkIfLTTMB } from 'utils/helper';
import { metaAtom } from 'store/atoms/meta';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUTTON_LOADING_DURATION,
} from 'const/index';
import { strings } from 'const/strings';
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
  .buy-button-wrapper {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 3.125rem;
    max-width: 24rem;
    button {
      cursor: pointer;
      border: none;
    }
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
  const [isButtonLoading, setButtonLoading] = useState(false);
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

  const getCTAText = () => {
    switch (true) {
      case !isAvailable:
        return strings.UNAVAILABLE;
      case isLTT || isBroadway:
        return strings.CHECK_AVAIL;
      default:
        return strings.BANNER_CTA;
    }
  };

  useHistoryTraversal({
    action: () => {
      setButtonLoading(false);
    },
  });

  return (
    <StickyFooterContentWrapper>
      <div className="buy-button-wrapper">
        <Button
          tabIndex={0}
          size="medium"
          color="purps"
          variant="primary"
          isLoading={isButtonLoading}
          disabled={!isAvailable}
          onClick={() => {
            if (isButtonLoading) return;
            setButtonLoading(true);
            setTimeout(() => setButtonLoading(false), BUTTON_LOADING_DURATION);
            trackBookNowClick();
            window.open(bookingUrl, '_self', 'noopener, noreferrer');
          }}
          text={getCTAText()}
        />
      </div>
    </StickyFooterContentWrapper>
  );
};

export default StickyFooter;
