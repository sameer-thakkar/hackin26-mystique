import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import { COLORS } from 'const/ui-constants';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { createBookingURL } from 'utils';
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
    color: ${COLORS.WHITE};
    background: ${COLORS.PURPS};
    cursor: pointer;
  }
  .unavailable-button {
    background: ${COLORS.GREY.G5};
    color: ${COLORS.WHITE};
  }
`;

const StickyFooter = ({
  tgid,
  currentLanguage,
  isAvailable = true,
}: {
  tgid: string | number;
  currentLanguage: string;
  isAvailable?: boolean;
}) => {
  const { nakedDomain, biLink, uid } = useContext(MBContext);

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
  });

  const isLTT = checkLTT(uid);
  return (
    <StickyFooterContentWrapper>
      <Conditional if={isAvailable}>
        <div
          role="button"
          tabIndex={0}
          className="buy-button"
          onClick={() => {
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
