import styled from 'styled-components';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledImageGallery = styled.div`
  display: grid;
  grid-row-gap: 22px;
  overflow: hidden;
  padding: 0 16px;
  margin: 0 -16px;

  .heading {
    ${expandFontToken(FONTS.HEADING_LARGE)}
    max-width: 1200px;
    width: 100%;
  }

  .button-right,
  .button-left {
    z-index: 9;
    position: absolute;
    top: 50%;
    z-index: 2;
    display: flex;
    cursor: pointer;
    left: 16px;
    transform: translateY(-50%);
  }

  .swiper-button-disabled {
    display: none;
  }

  .btn-right,
  .button-right {
    left: unset;
    right: 16px;
    transform: translateY(-50%) rotate(180deg);
  }
`;

export const Heading = styled.div`
  /* Higher Specificity Styles - https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity */
  &&& {
    position: relative;
    font-family: ${HALYARD.FONT_STACK};
    margin-bottom: 0;

    p {
      display: inline;
      ${expandFontToken(FONTS.HEADING_SMALL)};
      color: ${COLORS.BRAND.WHITE};
    }
  }
`;

export const Description = styled.div<{
  width?: string;
  height?: string;
  maxWidth?: string;
}>`
  &&& {
    width : ${({ width }) => width && width};
    height : ${({ height }) => height && height};
    max-width : ${({ maxWidth }) => maxWidth && maxWidth};
    position: relative;
    font-family: ${HALYARD.FONT_STACK};
    p {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
      color: ${COLORS.BRAND.WHITE};
      display: inline;
    }
}
`;

export const StyledImage = styled.div`
  height: 100%;
  width: auto;
  cursor: pointer;
  &&& {
    .non-active-slide {
      transform: scale(0.9);
      -webkit-transform: scale(0.9);
    }

    .active-slide {
      transform: scale(1);
      -webkit-transform: scale(1);
      border: 1px solid ${COLORS.BRAND.WHITE};
      border-radius: 0.25rem;
      box-sizing: border-box;
    }
  }
`;

export const Lightbox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100%;

  .lightbox-mask {
    position: absolute;
    background: rgba(0, 0, 0);
    width: 100%;
    height: 100%;
  }
  .close {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2rem;
    width: 2rem;
    background-color: ${COLORS.BRAND.WHITE};
    position: absolute;
    top: 10px;
    right: 4%;
    z-index: 99;
    border-radius: 50%;
    svg {
      path {
        stroke: ${COLORS.GRAY.G2};
      }
    }
  }
  .swiper-initialized {
    height: 100%;
    width: 100%;
    img {
      object-fit: cover;
    }
  }
`;

export const FullImage = styled.div`
  position: relative;
  height: 70vh;
  .image-wrap {
    picture {
      img {
        width: 100%;
        object-position: center;
        object-fit: cover;
      }
    }
  }
  .swiper-container,
  .swiper-wrapper {
    height: 100%;
  }
`;

export const ContentContainer = styled.div`
  margin-left: auto;
  height: 30vh;
  display: flex;
  flex-direction: column;
  width: calc(100% - 32px);
  margin: 0.5rem auto;
  box-sizing: border-box;
`;

export const ThumbnailSwiper = styled.div`
  .swiper,
  .swiper-initialized {
    height: 100%;
    width: 100%;
  }
  .swiper-wrapper {
    max-height: 100%;
    max-width: 100%;
    height: 4.5rem;
    z-index: 1;
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
    img {
      height: 100%;
      width: 100%;
      border-radius: 0.25rem;
    }
  }
`;

export const GridLayoutContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
`;

export const Tag = styled.div<{ isMobile: boolean }>`
  position: absolute;
  top: ${({ isMobile }) => (isMobile ? '10px' : '')};
  bottom: ${({ isMobile }) => (isMobile ? '' : '10px')};
  display: flex;
  right: 10px;
  width: 6.25rem;
  height: 1.5rem;
  font-size: 10px;
  justify-content: space-evenly;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  cursor: pointer;
`;

export const DesktopLightBox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  .close {
    position: absolute;
    /* The top and right are calculates based 
    on swiper-container's height and width */
    top: 4.5%;
    right: 10.5%;
    z-index: 9;
    width: 50px;
    height: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #ffffff;
    font-weight: 400;
    cursor: pointer;
    svg {
      transform: translateX(5px) translateY(2px);
    }
  }
  .swiper-initialized {
    border-radius: 16px;
    width: 80%;
    height: 84%;
  }

  .swiper-wrapper {
    height: 100%;
    width: 100%;
    z-index: 1;
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
  }
  .swiper-slide {
    height: 100%;
    width: 100%;
    border-radius: 16px;
  }
  .button-right,
  .button-left {
    circle {
      r: 18;
    }
  }
`;

export const SwiperControls = styled.div`
  display: flex;
  align-items: center;

  .prev-slide,
  .next-slide {
    position: absolute;
    pointer-events: none;
    cursor: pointer;
    z-index: 2;
    svg {
      circle {
        pointer-events: auto;
      }
    }
  }
  .prev-slide {
    top: 50%;
    left: 6%;
    transform: scale(1.5);
  }
  .next-slide {
    top: 50%;
    right: 6%;
    transform: scaleX(-1) scale(1.5);
  }
  @media (max-width: 1300px) {
    .prev-slide {
      left: 4%;
      transform: scale(1);
    }
    .next-slide {
      right: 4%;
      transform: scaleX(-1) scale(1);
    }
  }
`;

export const DesktopStyledImage = styled.div`
  height: 100%;
  position: relative;
  margin: 0 auto;
  img {
    height: 100%;
    object-fit: cover;
  }
`;

export const Content = styled.div`
  padding-left: 16px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  content: '';
  background: linear-gradient(
    180deg,
    rgba(61, 56, 56, 0) 0%,
    rgba(0, 0, 0, 0.64) 57.29%
  );
  z-index: 0;
  height: 8.5rem;
  width: 100%;
  .content-wrapper {
    position: absolute;
    left: 1rem;
    right: 0;
    bottom: 10px;
  }
`;

export const DesktopLightboxHeading = styled.div`
  /* Added higher specificity styles - https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity*/
  &&& {
    p {
      ${expandFontToken(FONTS.HEADING_SMALL)};
      margin-bottom: 5px;
      color: ${COLORS.BRAND.WHITE};
    }
  }
`;

export const Wrapper = styled.div<{ noOfImages: number }>`
  /* Desktop and Tablet first style starts */
  position: relative;
  display: grid;
  column-gap: 12px;
  row-gap: 12px;
  img {
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
  }
  div {
    border-radius: 8px;
    background: linear-gradient(93.12deg, #F0F0F0 0%, #F0F0F0 100%);
  }

   /* Logic for the Grid Layout for dekstop view */
   @media (min-width: 768px) {
    
    ${({ noOfImages }) => {
      if (noOfImages <= 2) {
        return `
            grid-template-columns: repeat(${noOfImages}, minmax(6.5rem, 1fr));
            grid-template-rows: minmax(23rem, 1fr)
        `;
      } else if (noOfImages > 2 && noOfImages <= 4) {
        return `
            grid-template-columns: 2fr 1fr;
            grid-template-rows: repeat(2, minmax(15rem, 1fr));
            div:first-child {
                grid-row: 1 / span 2;
                grid-column: 1 / span 1;
            }
        `;
      } else if (noOfImages >= 5) {
        return `
            grid-template-columns: 3fr 1fr 1fr;
            grid-template-rows: repeat(2, minmax(6.5rem, 15.0625rem));

            div:first-child {
                grid-row: 1 / span 2;
                grid-column: 1 / span 1;
            }
        `;
      }
    }}
    /* Desktop and Tablet first style ends */

    /* Hide last row having uneven cells for desktop view, according to designs */
    ${({ noOfImages }) => {
      if (noOfImages === 4) {
        return `
            div:nth-last-child(-n + 1){
                display: none;   
            }
        `;
      } else if (noOfImages > 4) {
        return `
            div:nth-last-child(-n + ${noOfImages - 5}){
                display: none;   
            }
        `;
      }
    }}   
   }

   /* Mobile first style starts */
    @media (max-width: 767px) {   
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(1, minmax(7rem, 1fr));
      grid-auto-rows: minmax(7rem, 1fr);
      gap: 7px;

      div:first-child {
        grid-row: ${({ noOfImages }) => noOfImages > 2 && '1 / span 2'};
        grid-column: ${({ noOfImages }) => noOfImages > 2 && '1 / span 2'};
      }
 
    /* Hide last row having uneven cells for mobile view, according to designs */
      ${({ noOfImages }) => {
        if (noOfImages > 5) {
          return `
              div:nth-last-child(-n + ${noOfImages - 5}){
                  display: none;        
              }
          `;
        } else if (noOfImages > 2 && noOfImages % 2 == 0) {
          return `
              div:nth-last-child(-n + 1){
                  display: none;        
              }`;
        }
      }}
  }

  /* Mobile first style ends */
`;
