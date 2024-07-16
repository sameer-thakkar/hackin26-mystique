import { css } from 'styled-components';
import {
  CoreDrawerText,
  HeadingContainer,
  HeadingText,
  PanelAnchor,
} from 'components/common/Drawer';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const routesDrawerStyles = css`
  height: 90%;
  .route-details-drawer {
    padding: 0;
    grid-row-gap: 0.75rem;
    overflow: hidden;
  }
  .side-drawer {
    ${HeadingContainer} {
      transform: translateX(-100%);
    }
    ${CoreDrawerText} {
      overflow: visible;
    }
  }
  ${CoreDrawerText} {
    overflow: hidden;
  }
  ${PanelAnchor} {
    display: none;
  }
  ${HeadingContainer} {
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    padding: 1rem 1rem 0;
    position: sticky;
    top: 0;
    z-index: 0;
    background: ${COLORS.BRAND.WHITE};
    border-radius: 20px 20px 0 0;
    transition: transform 0.1s ease-out;
  }
  ${HeadingText} {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    ${expandFontToken(FONTS.HEADING_REGULAR)}
  }
  .shadow {
    height: 100%;
  }
  .close-icon {
    align-self: start;
    padding: 0.625rem;
    margin-top: 0.25rem;
    border-radius: 4px;
    background: ${COLORS.GRAY.G8};
  }
`;
