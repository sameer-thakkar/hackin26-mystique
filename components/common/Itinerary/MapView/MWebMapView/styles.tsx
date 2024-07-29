import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledMWebMapViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100vh;
  background: ${COLORS.BRAND.WHITE};

  @supports (height: 100dvh) {
    height: 100dvh;
  }

  p,
  h6 {
    margin: 0;
  }

  .navigation-tab {
    display: flex;
    align-items: center;
    background: ${COLORS.BRAND.WHITE};
    padding: 1rem 1.5rem;
    margin-top: 1rem;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    width: 100vw;
    box-sizing: border-box;
  }

  .map-container {
    height: calc(100vh - 4.25rem);
    width: 100%;
    margin-top: 4.25rem;
    border: 1px solid ${COLORS.GRAY.G6};
    position: relative;

    @supports (height: 100dvh) {
      height: calc(100dvh - 4.25rem);
    }
  }

  .navigation-heading-container {
    flex: 1;
    margin-right: 1.25rem;
    display: flex;
    justify-content: center;
  }

  .navigation-heading {
    ${expandFontToken(FONTS.HEADING_XS)};
    color: ${COLORS.GRAY.G2};
    text-align: center;
    max-width: 14.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .map-cards-carousel {
    position: absolute;
    bottom: 0.75rem;
    left: 0;
    overflow-x: scroll;
    display: flex;
    align-items: flex-end;
    z-index: 1000;
    gap: 0.75rem;
    scroll-snap-type: x mandatory;
    width: 100vw;
    scroll-padding-left: 1.5rem;
  }
`;

export const StyledMWebMapViewStylesheetContainer = styled.div`
  position: relative;
`;
