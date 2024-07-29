import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const IconWrapper = styled.div<{ $isSection?: boolean }>`
  position: relative;
  width: min-content;
  z-index: 1;

  img {
    height: 2rem;
  }
`;

export const MarkerText = styled.p`
  position: absolute;
  top: 44%;
  left: 49%;
  transform: translate(-45%, -75%);
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
  color: ${COLORS.BRAND.PURPS};
`;

export const MapContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  .marker-title {
    margin-top: 1.5625rem;
  }
  .leaflet-tooltip {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
    color: ${COLORS.BLACK};
  }
  .leaflet-control-attribution {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }
`;
