import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const StyledTabWrapper = styled.div<{ $isTabSticky?: boolean }>`
  display: grid;
  grid-row-gap: 16px;

  .tabs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    ${expandFontToken('UI/Label Large')}
    grid-column-gap: ${({
      // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
      isGlobalMb,
    }) => (isGlobalMb ? '48px' : '32px')};
    border-bottom: 1px solid #ebebeb;
    justify-content: left;

    &::-webkit-scrollbar {
      display: none;
    }

    ${({
      // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
      isGlobalMb,
    }) =>
      isGlobalMb &&
      `
      line-height: 20px;
      `}

    ${({ $isTabSticky }) =>
      $isTabSticky &&
      `box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
       transition: box-shadow 0.2s ease-in;
    `}
  }

  .tab-content-wrap {
    display: grid;

    ${({
      // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
      isGlobalMb,
    }) => isGlobalMb && `margin-top: 8px;`}
    .tabbed-info-image {
      height: auto;
      display: flex;
      align-items: center;

      .image-wrap {
        width: auto;
      }

      .seatmap-image {
        margin-right: 1.5rem;
      }

      button {
        margin-top: 1.5rem;
      }
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    margin-bottom: 8px;
  }

  h2 {
    ${({
      // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
      isGlobalMb,
    }) => isGlobalMb && `margin-bottom: 0 !important;`}
  }

  @media (max-width: 768px) {
    .tabs {
      overflow-x: scroll;
      grid-auto-columns: max-content;
      ${({
        // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
        isGlobalMb,
      }) => isGlobalMb && `grid-column-gap: 32px;`}
    }
  }
`;

export const StyledTab = styled.div`
  cursor: pointer;
  padding-bottom: 8px;
  width: 100%;
  ${expandFontToken(FONTS.HEADING_SMALL)};
  ${({
    // @ts-expect-error TS(2339): Property 'isActive' does not exist on type 'Pick<D... Remove this comment to see the full error message
    isActive,
  }) => {
    return (
      isActive &&
      `
      color: ${COLORS.TEXT.PURPS_3};
      border-bottom: 2px solid;
      @media (max-width: 768px) {
        margin-bottom: unset;
      }
    `
    );
  }}
`;

export const TabCarousel = styled.div`
  position: relative;
  padding: 12px 0 24px 0;
`;

export const StyledSwiper = styled.div`
  overflow: hidden;
  display: flex;
  position: relative;
  max-width: ${SIZES.MAX_WIDTH};

  .swiper-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    border-bottom: 1px solid ${COLORS.GRAY.G6};
  }

  .swiper-initialized {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    width: auto;
  }
`;

export const Controls = styled.div`
  .prev-slide,
  .next-slide {
    position: absolute;
    top: 6px;
    left: -20px;
    cursor: pointer;
    z-index: 2;

    svg {
      fill: #fff;

      circle {
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
      }

      border-radius: 100%;
      box-shadow: path {
        stroke-width: 2px;
      }
    }
  }

  .next-slide {
    left: unset;
    right: -20px;

    svg {
      transform: rotate(180deg);
    }
  }
`;

export const SlideControls = styled.div`
  display: flex;
  align-items: center;

  .prev-slide,
  .next-slide {
    position: absolute;
    left: 0px;
    cursor: pointer;
    z-index: 2;

    svg {
      fill: ${COLORS.BRAND.WHITE};
      width: ${({
        // @ts-expect-error TS(2339): Property 'isMobile' does not exist on type 'Pick<D... Remove this comment to see the full error message
        isMobile,
      }) => (isMobile ? '32px' : 'auto')};

      circle {
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
      }

      border-radius: 100%;
    }
  }

  .next-slide {
    left: unset;
    right: 0px;
    margin-top: -5px;

    svg {
      transform: rotate(180deg);
    }
  }
`;
