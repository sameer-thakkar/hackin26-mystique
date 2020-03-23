import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Popup from '../common/Popup';
import { Client } from '../../prismic-config';
import { CUSTOM_TYPES } from '../../constants';
import { COLORS } from '../../constants/ui-constants';

const StyledTrigger = styled.span`
  color: ${COLORS.TEAL};
  cursor: pointer;
  line-height: 20px;
`;
const PopupTrigger = props => {
  const { id, text, lang = 'en', children, popupContents } = props;
  const [active, setActive] = useState(null);
  const [data, setData] = useState(false);

  useEffect(() => {
    Client()
      .getByUID(CUSTOM_TYPES.POPUP, id, {
        lang: 'en-us',
      })
      .then(res => {
        const { data } = res;
        if (data) setData(data);
      });
  }, []);

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
