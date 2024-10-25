import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledItineraryMapViewBanner = styled.div`
  display: flex;
  align-items: center;
  border-radius: 12px;
  background-color: ${COLORS.BACKGROUND.FADED_PALE};
  gap: 1rem;
  height: 4.75rem;
  padding: 0 1rem;
  position: relative;
  overflow: hidden;

  .image-container {
    overflow: hidden;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 4px;
    box-shadow: 0 2px 15px 0 rgba(255, 159, 36, 0.3);
    z-index: 1;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    flex: 1;
    z-index: 1;
  }

  .cta {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    background: transparent;
    border: none;
    padding: 0;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.0625rem;
  }

  .label {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G1};

    &.bold {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    }
  }

  .bg-image-container {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 0;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
`;
