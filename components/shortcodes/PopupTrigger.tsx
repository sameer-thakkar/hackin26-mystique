import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { CUSTOM_TYPES } from 'const/index';
import { Client } from '../../config/prismic-config';

const Popup = dynamic(() => import('components/common/Popup'), { ssr: false });

const StyledTrigger = styled.span`
  color: ${COLORS.TEXT.BEACH};
  cursor: pointer;
  line-height: 20px;
`;

const PopupTrigger = (props: any) => {
  const { id, text, children, popupContents } = props;
  const [active, setActive] = useState(null);
  const [data, setData] = useState(false);

  useEffect(() => {
    Client()
      .getByUID(CUSTOM_TYPES.POPUP, id, {
        lang: 'en-us',
      })
      .then((res: any) => {
        const { data } = res;
        if (data) setData(data);
      });
  }, [id]);

  return (
    <>
      {/* @ts-expect-error TS(2345): Argument of type 'true' is not assignable to param... Remove this comment to see the full error message */}
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
