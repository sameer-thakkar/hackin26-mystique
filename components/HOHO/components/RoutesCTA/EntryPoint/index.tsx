import React from 'react';
import { strings } from 'const/strings';
import MapBackground from 'assets/mapBackground';
import Route from 'assets/route';
import { EntryPointProps } from './interface';
import { Container, TextIconContainer } from './style';

const ItineraryEntryPoint = ({
  onClick,
  isHOHOItinerary = true,
}: EntryPointProps) => {
  return (
    <Container onClick={onClick} data-qa-marker="qaid-itinerary-entry-point">
      <MapBackground />
      <TextIconContainer>
        <Route />
        <span className="routes-text">
          {isHOHOItinerary ? strings.HOHO.ROUTES : strings.ITINERARY.TAB}
        </span>
      </TextIconContainer>
    </Container>
  );
};

export default ItineraryEntryPoint;
