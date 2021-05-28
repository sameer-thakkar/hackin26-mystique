import React from 'react';
import styled from 'styled-components';
const GooglMapWrapper = styled.div` 
    iframe{
        width: 100%;
        height: 400px;
        border-radius: 8px;
    }
`;

const GoogleMap = ({ latitude, longitude }) => {

  const mapURL = `https://maps.google.com/maps?q=${latitude},${longitude}&z=14&amp&output=embed`;

  return (
    <GooglMapWrapper>
      <iframe title="Google Map" src={mapURL} frameBorder="0" allowFullScreen></iframe>
    </GooglMapWrapper>
  );
};

export default GoogleMap;
