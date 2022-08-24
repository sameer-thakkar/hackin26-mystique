import Conditional from 'components/common/Conditional';
import { useAmp } from 'next/amp';
import React from 'react';
import styled from 'styled-components';
const GooglMapWrapper = styled.div`
  margin-bottom: 64px;
  margin-top: 48px;

  iframe {
    width: 100%;
    height: 400px;
    border-radius: 8px;
  }
  @media (max-width: 768px) {
    margin-bottom: 48px;
    margin-top: 32px;

    iframe {
      height: 343px;
    }
  }
`;

const GoogleMap = ({ mapURL }) => {
  const isAmp = useAmp();
  return (
    <Conditional if={mapURL}>
      <GooglMapWrapper>
        {isAmp ? (
          <amp-iframe
            src={mapURL}
            width="100"
            height="50"
            layout="responsive"
            sandbox="allow-scripts allow-same-origin"
          ></amp-iframe>
        ) : (
          <iframe
            title="Google Map"
            src={mapURL}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )}
      </GooglMapWrapper>
    </Conditional>
  );
};

export default GoogleMap;
