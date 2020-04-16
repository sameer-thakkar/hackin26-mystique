import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Popup from '../common/Popup';
import * as labels from '../../constants/localization/labels';
import { SHIELD } from '../../public/static/svg-icons';
import { AVENIR } from '../../constants/ui-constants';
import { Client } from '../../prismic-config';
import { CUSTOM_TYPES } from '../../constants';

const StyledAlert = styled.div`
  background: #d6f8ff;
  display: grid;
  padding: 16px;
  max-width: 1168px;
  margin: 0 auto;
  background: #d6f8ff;
  border-radius: 4px;
  font-family: Avenir;
  color: #1a4d57;
  grid-row-gap: 8px;
  grid-column-gap: 12px;
  grid-template-columns: max-content max-content;
  grid-template-areas: 'shield title' 'shield content' 'shield read-more';
  margin-bottom: 40px;
  @media (max-width: 768px) {
    grid-template-columns: max-content 1fr;
    margin: 0 16px;
    margin-bottom: 24px;
  }
`;

const StyledShield = styled.div`
  grid-area: shield;
`;

const StyledTitle = styled.div`
  grid-area: title;
  font-size: 16px;
  line-height: 16px;
  font-weight: ${AVENIR.BLACK};
`;

const StyledContent = styled.div`
  grid-area: content;
  font-size: 12px;
`;

const StyledReadMore = styled.div`
  grid-area: read-more;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

type AlertProps = {
  popupUID: string;
  currentLanguage: string;
};

const Alert: React.FC<AlertProps> = ({ popupUID, currentLanguage }) => {
  const [active, setActive] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    Client()
      .getByUID(CUSTOM_TYPES.POPUP, popupUID, {
        lang: 'en-us',
      })
      .then((res) => {
        if (res.data) {
          setData(res.data);
        }
      });
  }, [popupUID, setData]);

  return (
    <StyledAlert>
      {active ? <Popup togglePopup={setActive} data={data} alert /> : null}
      <StyledShield>{SHIELD}</StyledShield>
      <StyledTitle>
        {data?.body[0]?.primary.alert_title ||
          labels[currentLanguage].SANITARY_ALERT.KEY_TEXT}
      </StyledTitle>
      <StyledContent>
        {data?.body[0]?.primary.alert_message ||
          labels[currentLanguage].SANITARY_ALERT.TEXT}
      </StyledContent>
      <StyledReadMore
        onClick={() => {
          setActive(true);
        }}
      >
        {data ? labels[currentLanguage].READ_MORE : null}
      </StyledReadMore>
    </StyledAlert>
  );
};

export default Alert;
