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
  return (
    mapURL ? <GooglMapWrapper>
      <iframe
        title="Google Map"
        src={mapURL}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </GooglMapWrapper>
      : null
  );
};

export default GoogleMap;
