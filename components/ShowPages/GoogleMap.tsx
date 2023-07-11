import React from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';

const GoogleMapWrapper = styled.div<{
  isVenuePage?: boolean;
}>`
  margin-bottom: 4rem;
  ${({ isVenuePage }) =>
    isVenuePage
      ? `
      margin: 0.5rem 0;
      `
      : `
       margin-top: 3rem;
   `}

  iframe {
    width: 100%;
    height: 400px;
    border-radius: 8px;
    border: 0;
  }
  @media (max-width: 768px) {
    ${({ isVenuePage }) =>
      isVenuePage
        ? `&& {
        margin:0;
      }
     `
        : `
     && {
       margin-top: 2rem;
     }
     `}
    margin: 2rem 0 3rem;

    iframe {
      height: 343px;
    }
  }
`;

const GoogleMap = ({ mapURL, isVenuePage }: any) => {
  return (
    <Conditional if={mapURL}>
      <GoogleMapWrapper isVenuePage={isVenuePage}>
        <iframe
          title="Google Map"
          src={mapURL}
          allowFullScreen
          loading="lazy"
        />
      </GoogleMapWrapper>
    </Conditional>
  );
};

export default GoogleMap;
