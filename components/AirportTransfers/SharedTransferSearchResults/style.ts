import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SearchResultsSectionContainer = styled.div<{
  $hasResults: boolean;
}>`
  padding: 2rem 1rem 1.5rem;

  ${({ $hasResults }) =>
    $hasResults &&
    `background: linear-gradient(359.12deg, #BACBFE 0%, #F0E0FF 99.24%);
`};

  .title {
    ${expandFontToken(FONTS.HEADING_LARGE)};
    color: ${COLORS.GRAY.G1};
  }

  .subtext {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G3};
    margin-top: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .swiper {
    margin-inline: -1rem;
    padding-inline: 1rem;
  }

  .carousel-skeleton {
    position: relative;
    .dots {
      display: flex;
      justify-content: center;
      gap: 0.25rem;

      z-index: 1;

      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 1rem;

      .dot {
        width: 6px;
        height: 6px;
        background-color: white;
        border-radius: 50%;

        &:last-child {
          opacity: 0.5;
        }
      }
    }
  }

  .pagination {
    margin-top: 0.25rem;
    display: flex;
    justify-content: center;
    width: 100%;
    li[data-active='true'] {
      padding-bottom: 1px;
      padding-left: 5px;
      padding-right: 4px;
    }

    li[data-active='false'] {
      background-color: ${COLORS.BRAND.WHITE};
      opacity: 0.7;
    }
  }

  @media (min-width: 769px) {
    padding: 0;
    max-width: 75rem;
    margin: 3rem auto 3.875rem;
    background: none;

    .product-cards-container-desktop {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 1.25rem;
    }

    .title {
      ${expandFontToken(FONTS.DISPLAY_SMALL)};
      color: ${COLORS.GRAY.G1};
    }

    .subtext {
      margin-top: 0.5rem;
      margin-bottom: 2rem;
    }

    .flex {
      display: flex;
      gap: 1.5rem;
    }
  }
`;

export const DesktopSkeletonContainer = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    gap: 1.5rem;

    & > div {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
  }
`;
