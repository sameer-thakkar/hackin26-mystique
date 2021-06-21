import { strings } from 'const/strings';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { createBookingURL } from 'utils';

import { MBContext } from '../../contexts/MBContext';

const StickyFooterContentWrapper = styled.div`
  z-index: 3;
  background: #ffffff;
  bottom: 0px;
  position: fixed;
  width: 100%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);

  .buy-button {
    padding: 12px 24px;
    background: #ec1943;
    border-radius: 4px;
    margin: 16px auto;
    color: #ffffff;
    border: none;
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    letter-spacing: 0.8px;
    display: block;
    text-align: center;
    max-width: 280px;
  }
`;

const StickyFooter = ({ tgid, currentLanguage }) => {
  const { nakedDomain, biLink } = useContext(MBContext);

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
  });

  return (
    <StickyFooterContentWrapper>
      <a className="buy-button" href={bookingUrl} target="blank">
        {strings.BANNER_CTA}
      </a>
    </StickyFooterContentWrapper>
  );
};

export default StickyFooter;
