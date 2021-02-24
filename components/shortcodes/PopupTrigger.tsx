import { CUSTOM_TYPES } from 'const/index';
import { COLORS } from 'const/ui-constants';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import { Client } from '../../config/prismic-config';

const Popup = dynamic(() => import('components/common/Popup'), { ssr: false });

const StyledTrigger = styled.span`
  color: ${COLORS.TEAL};
  cursor: pointer;
  line-height: 20px;
`;

const PopupTrigger = (props) => {
  const { id, text, children, popupContents } = props;
  const [active, setActive] = useState(null);
  const [data, setData] = useState(false);

  useEffect(() => {
    Client()
      .getByUID(CUSTOM_TYPES.POPUP, id, {
        lang: 'en-us',
      })
      .then((res) => {
        const { data } = res;
        if (data) setData(data);
      });
  }, [id]);

  return (
    <>
      <StyledTrigger {...(data && { onClick: () => setActive(!active) })}>
        {text || children}
      </StyledTrigger>
      {active ? (
        <Popup togglePopup={setActive} data={data}>
          {popupContents}
        </Popup>
      ) : null}
    </>
  );
};

export default PopupTrigger;
