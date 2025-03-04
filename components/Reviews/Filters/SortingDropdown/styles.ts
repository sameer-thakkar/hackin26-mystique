import styled from 'styled-components';
import { css, cva } from '@headout/pixie/css';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledOverlayHeading = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  position: relative;
  cursor: pointer;
  align-items: center;

  .title {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    color: ${COLORS.GRAY.G3}
  }

  .info-icon {
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      height: 1rem;
      width: 1rem;
    }
  }
`;

export const StyledOverlayContainer = styled.div<{ $isOpen?: boolean }>`
  cursor: default;
  position: absolute;
  left: 0;
  top: calc(100% + 0.5rem);
  z-index: 3;

  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  box-shadow: 0px 1px 6px 1px #1111111a, 0px 1px 4px 0px #1111110d;

  background-color: white;
  width: 400px;
  overflow: hidden;

  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s;

  .overlay-heading {
    ${expandFontToken(FONTS.HEADING_SMALL)}
    color: ${COLORS.GRAY.G1};
    border-bottom: 2px solid ${COLORS.GRAY.G8};
    padding: 1rem;
    padding-top: 1.25rem;
    display: flex;
    justify-content: space-between;
  }

  .overlay-contents {
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
    padding: 0 1rem 2rem;
    background-color: white;
    display: flex;
    flex-direction: column;

    & > div:not(:last-child) {
      border-bottom: 1px solid ${COLORS.GRAY.G8};
    }
  }

  .overlay-cross {
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    border: none;
    outline: none;
    padding: 0.25rem;

    svg {
      height: 0.75rem;
      path {
        stroke: black;
      }
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 100%;
    transform: translateY(-100%);
    width: 100vw;
    transition: bottom 0.3s;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 101;
  }
`;

export const StyledBackdrop = styled.div<{ $isOpen?: boolean }>`
  position: fixed;
  content: '';
  background: black;
  top: 60px;
  height: 100vh;
  width: 100vw;
  left: 0;
  z-index: 100;
  opacity: ${({ $isOpen }) => ($isOpen ? 0.25 : 0)};
  transition: opacity 0.3s;
  touch-action: none;
`;

export const filterContainerStyles = css({
  '& button': {
    w: 'max-content',
  },
});

export const filterIconStyles = cva({
  base: {
    height: 16,
    width: 16,
    transition: 'transform 0.3s',
  },
  variants: {
    open: {
      true: {
        transform: 'rotate(180deg)',
      },
      false: {
        transform: 'rotate(0)',
      },
    },
  },
});

export const desktopOverlayStyles = css({
  display: 'flex',
  flexDir: 'column',
  gap: 'space.24',
  padding: '0 token(spacing.space.4)',
});
