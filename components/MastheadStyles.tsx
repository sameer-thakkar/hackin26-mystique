import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledMasthead = styled.div<{
  isEntMb: boolean;
  withoutImage: boolean;
  imageUrl: string | undefined;
}>`
  width: 100vw;
  display: flex;
  position: relative;
  margin-bottom: 2rem;
  ${({ isEntMb, imageUrl }) =>
    isEntMb
      ? `
    justify-content: center;
    overflow-x: hidden;
  
    .image-wrap > span {
      min-height: 400px;
      position: relative !important;
      filter: brightness(0.7);
    }
    `
      : `
    height: 13.125rem;
    background: ${COLORS.BRAND.BLACK};
    background-image: linear-gradient(
        90.01deg,
        #111111 16.05%,
        rgba(17, 17, 17, 0.8) 40.39%,
        rgba(17, 17, 17, 0) 77.55%
      ), url("${imageUrl}");
    background-size: 50vw 44.25rem;
    background-position: right, right;
    background-repeat: no-repeat;
    img {
      object-fit: cover;
    }`}

  @media (max-width: 768px) {
    ${({ isEntMb, withoutImage, imageUrl }) =>
      isEntMb
        ? `
        .image-wrap > span {
          min-height: 300px;
          position: relative !important;
        }
        `
        : `
        background-image: url("${imageUrl}");
        background-size: 100vw 18.75rem;
        min-width: 18.75rem;
        ${
          withoutImage
            ? `
            display:none;
        `
            : `
          margin-bottom: 0;
          flex-direction: column-reverse;
        `
        }
     `}
  }
`;
export const Wrapper = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
`;

export const MobileTitle = styled.h1<{
  withoutImage: boolean;
}>`
  ${({ withoutImage }) => `
    color: ${withoutImage ? COLORS.BRAND.BLACK : COLORS.BRAND.WHITE};
    background-color: ${withoutImage ? COLORS.BRAND.WHITE : COLORS.BRAND.BLACK};
  `}
  ${expandFontToken(FONTS.HEADING_REGULAR)}
  padding: ${({ withoutImage }) =>
    withoutImage ? '1.5rem 1rem 1rem' : '1.5rem'};
  ${({ withoutImage }) => !withoutImage && 'margin: 0 0 1rem 0'}
`;

export const TitleWrapper = styled.div`
  max-width: 38.125rem;
  margin: auto 0;
`;

export const Title = styled.h1<{ isEntMb: boolean }>`
  margin: 0;

  ${({ isEntMb }) =>
    isEntMb
      ? `
    position: absolute;
    top: 50%;
    color: white;
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
    transform: translateY(-50%);
    max-width: 792px;
    text-align: center;
        `
      : `
    color: ${COLORS.GRAY.G8};
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
    `}
`;
