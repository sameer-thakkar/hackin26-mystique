import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const drawerStyles = (height: string) => css`
  .field-drawer {
    height: ${height};

    border-radius: 1rem 1rem 0 0;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s cubic-bezier(0.3, 0, 0.7, 1);

    & > div:last-child {
      flex: 1;
      position: static;
      max-height: calc(100% - 4rem); // drawer header height
    }

    .location-search-wrapper {
      overflow: hidden;
      height: calc(100% - 7rem);
    }

    .slide-animate-drawer {
      height: 100%;
    }
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.25rem 1rem 1.25rem;
  border-bottom: 1px solid ${COLORS.GRAY.G6};

  h2 {
    ${getFontDetailsByLabel(FONTS.HEADING_SMALL)};
    margin: 0;
  }
`;
