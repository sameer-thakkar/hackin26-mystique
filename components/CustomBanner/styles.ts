import { Styles } from 'react-modal';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const IFrameWrapper = styled.div`
  width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 0.75rem;
`;

export const YoutubeBannerWrapper = styled.div`
  margin: 0 auto;
  max-width: 75rem;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 0.4rem 0 0;
  border-radius: 1.5rem 1.5rem 1rem 1rem;
  transition: box-shadow 0.4s;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  @media (max-width: 768px) {
    &:hover {
      box-shadow: none;
    }
  }
  a:hover {
    text-decoration: underline;
  }
`;

export const YoutubeBanner = styled.div<{ insideCards?: boolean }>`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 0 auto;
  width: 100%;
  background: linear-gradient(
    to right,
    ${COLORS.BACKGROUND.FLOATING_PURPS},
    ${COLORS.PURPS.LEVEL_10}
  );
  padding: 1rem 2.25rem;
  border-radius: 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    width: auto;
    padding: 1rem;
    ${({ insideCards }) => insideCards && 'margin: 0 1.5rem'};
  }
`;

export const Subtitle = styled.p`
  ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
  margin: 0;
  margin-top: 0.1rem;
  display: block;
`;

export const YoutubeBannerLeft = styled.div<{ fullWidth?: boolean }>`
  ${(fullWidth) => !fullWidth && 'width: 60%;'}
  display: flex;
  flex-direction: column;
  justify-content: center;
  span {
    margin: 0;
    color: black;
    ${expandFontToken(FONTS.HEADING_SMALL)}
  }

  ${Subtitle} {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
  }

  @media (max-width: 768px) {
    width: 100%;

    p {
      margin: 0;
    }
  }
`;

export const YoutubeBannerRight = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
  gap: 2rem;

  h3,
  p {
    line-height: 0.4rem;
    color: ${COLORS.BRAND.PURPS};
  }

  .label-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      /* margin-right: 1rem;
      margin-top: 0.2rem;
      position: relative;
      animation-name: play-icon-animation;
      animation-duration: 1.4s;
      animation-iteration-count: infinite;
      animation-delay: 250ms;
      animation-timing-function: ease-in-out; */
      margin-left: 0.5rem;
      transform: translateY(1px);
    }
    @media (max-width: 768px) {
      justify-content: flex-start;
    }
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    width: 100%;
    margin-top: 3rem;
  }

  @keyframes play-icon-animation {
    0% {
      left: 0px;
    }
    15% {
      left: 1rem;
      opacity: 0;
    }
    25% {
      left: 0px;
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    100% {
      left: 0px;
      opacity: 1;
    }
  }
`;

export const H3Heading = styled.h3<{
  $isImage?: boolean;
}>`
  width: max-content;
  a {
    color: ${COLORS.BRAND.PURPS} !important;
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
    padding-left: 0.3rem;
  }
  ${({ $isImage }) =>
    $isImage &&
    `
    ${expandFontToken(FONTS.BUTTON_SMALL)};
    margin:0 0 0 3rem;
    @media (max-width: 768px){
      display:flex;
      margin: 0;
    }
  `}
`;

const animateMediaPreview = `
  transition-delay: 250ms;
  transition: transform 1s;
  transform: translateY(0);
  transition-timing-function: ease-in-out;
`;

const notIntersectingMediaPreview = `
  opacity: 0;
  bottom: -8rem;
`;

export const MediaPreviewWrapper = styled.div<{
  isIntersecting?: boolean;
}>`
  position: relative;
  width: 13rem;
  height: 100%;
  transform: translateY(8rem);

  ${({ isIntersecting }) =>
    isIntersecting
      ? `${animateMediaPreview}`
      : `${notIntersectingMediaPreview}`}

  @media (max-width: 768px) {
    margin-right: 0.25rem;
    width: 10rem;
  }
`;

export const MediaPreview = styled.div`
  width: 100%;
  height: 10rem;
  position: absolute;
  background: white;
  transform: rotate(-3deg);
  border-radius: 1rem;
  padding: 0.28rem;
  border: 0.4px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  margin-top: -1.3rem;

  .media-player-wrapper {
    width: 100%;
    height: 100%;

    .media-image,
    img,
    video {
      object-fit: cover;
      border-radius: 1rem 1rem 0 0;
    }
  }

  @media (max-width: 768px) {
    margin-top: -2.3rem;
  }
`;

export const modalStyles: Styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 99,
  },
  content: {
    height: 'max-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    width: 'calc(100% - 5.46vw * 2)',
    backgroundColor: 'transparent',
    maxWidth: `${SIZES.MAX_WIDTH}`,
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    zIndex: 999,
    padding: 0,
    inset: 0,
    border: 0,
  },
};
