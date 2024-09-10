import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const VideoContainer = styled.div`
  --plyr-color-main: ${COLORS.BRAND.WHITE};
  --plyr-video-controls-background: rgba(255, 255, 255, 0.15);
  --plyr-video-control-background-hover: none;
  width: 100%;
  height: auto;
  /* overflow: hidden; */
  .plyr {
    .plyr__controls {
      padding: 1rem 1.5rem;
      box-sizing: content-box;
      bottom: 1.25rem;
      left: 1.25rem;
      right: 1.25rem;
      border-radius: 16px;
      backdrop-filter: blur(44px);
      gap: 1rem;
      height: 1.5rem;
    }
    .plyr__volume,
    .plyr__time {
      color: ${COLORS.BRAND.WHITE};
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    }
    .plyr__control {
      padding: 0;
      svg {
        height: 1.5rem;
        width: 1.5rem;
      }
    }
    .plyr__video-wrapper {
      border-radius: 8px;
      overflow: hidden;

      video {
        transform: scale(1.01);
      }
    }
  }
`;

export const TitleBar = styled.div`
  position: absolute;
  z-index: 9999;
  display: flex;
  width: 100%;
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;

  button {
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    border: 0;
    margin: 0 1.5rem 0 auto;
    padding: 0.375rem 0.625rem;
  }
  h3 {
    margin: 0;
    padding-left: 2rem;
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
  }
`;
