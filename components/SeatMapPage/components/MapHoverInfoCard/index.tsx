import React from 'react';
import { IconWrapper } from '../InteractiveMap/styles';
import { TMapHoverInfoCardParams } from './interface';
import {
  Body,
  Header,
  HeaderLeft,
  HeaderRight,
  HR,
  MapSectionInfoCard,
  MapSectionInfoCardContainer,
  P,
  QuickInfo,
} from './styles';

const MapHoverInfoCard = ({
  sectionInfo,
  left,
  top,
  isVisible,
}: TMapHoverInfoCardParams) => {
  return (
    <MapSectionInfoCardContainer left={left} top={top} isVisible={isVisible}>
      <MapSectionInfoCard>
        <Header>
          <HeaderLeft>
            {sectionInfo?.blockName} - {sectionInfo?.theatreSectionLabel}
          </HeaderLeft>
          <HeaderRight>{sectionInfo?.rows}</HeaderRight>
        </Header>

        <Body>
          {sectionInfo?.quickInfo.map((info, index) => (
            <QuickInfo key={index}>
              <IconWrapper>
                <info.icon />
              </IconWrapper>

              <P>{info.label}</P>
            </QuickInfo>
          ))}

          <HR />

          <P>{sectionInfo?.description}</P>
        </Body>
      </MapSectionInfoCard>
    </MapSectionInfoCardContainer>
  );
};

export default MapHoverInfoCard;
