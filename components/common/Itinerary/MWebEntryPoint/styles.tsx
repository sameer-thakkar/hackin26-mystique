import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledMWebEntryPointContainer = styled.button`
  background: ${COLORS.BRAND.WHITE};
  border: none;
  outline: none;
  filter: drop-shadow(
    0px 0px 0px 1px rgba(255, 255, 255, 0.4),
    0px 0px 12px 0px rgba(0, 0, 0, 0.2)
  );
  border-radius: 8px;
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  width: 3.6875rem;
  height: 4.125rem;
  padding: 0;
  margin: 0;
  overflow: hidden;
  clip-path: view-box;

  h6,
  p {
    margin: 0;
  }

  .entrypoint-content-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .entrypoint-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.125rem;
    z-index: 2;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .cta-label {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    color: ${COLORS.TEXT.PURPS_3};
  }

  .bg-image {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    svg {
      height: 4.125rem;
      width: 3.6875rem;
    }
  }

  svg {
    height: 1rem;
    width: 1rem;
  }
`;
