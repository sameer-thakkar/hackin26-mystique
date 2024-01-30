import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { PopupDocument } from 'types.prismic';
import getPopup from 'utils/prismicUtils/getPopup';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import Shield from 'assets/shield';

const Popup = dynamic(() => import('../common/Popup'), { ssr: false });

const StyledAlert = styled.div`
  background: #d6f8ff;
  display: grid;
  padding: 16px;
  max-width: 1168px;
  margin: 0 auto;
  background: #d6f8ff;
  border-radius: 4px;
  font-family: ${HALYARD.FONT_STACK};
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
  font-weight: 600;
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
  currentLanguage?: string;
};

const Alert: React.FC<AlertProps> = ({ popupUID }) => {
  const [active, setActive] = useState(false);
  const [data, setData] = useState<PopupDocument | null>(null);

  useEffect(() => {
    async function fetchPopup() {
      const popup = await getPopup({
        uid: popupUID,
      });
      if (popup) {
        setData(data);
      }
    }

    if (popupUID) {
      fetchPopup();
    }
  }, [popupUID, setData]);

  return (
    <StyledAlert>
      {active ? <Popup togglePopup={setActive} data={data} alert /> : null}
      <StyledShield>{Shield}</StyledShield>
      <StyledTitle>
        {(data as any)?.body[0]?.primary.alert_title ||
          strings.SANITARY_ALERT.KEY_TEXT}
      </StyledTitle>
      <StyledContent>
        {(data as any)?.body[0]?.primary.alert_message ||
          strings.SANITARY_ALERT.TEXT}
      </StyledContent>
      <StyledReadMore
        onClick={() => {
          setActive(true);
        }}
      >
        {data ? strings.READ_MORE : null}
      </StyledReadMore>
    </StyledAlert>
  );
};

export default Alert;
