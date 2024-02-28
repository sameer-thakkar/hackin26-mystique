import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ImageGalleryWrapper = styled.div`
  position: absolute;
  bottom: 6.75rem;
  right: calc((100vw - 75rem) / 2);

  @media (max-width: 768px) {
    right: 1.5rem;
    top: 8.5rem;
    height: fit-content;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    right: calc((50vw - 25.5rem));
  }
  @media only screen and (min-width: 1024px) and (max-width: 1366px) {
    right: calc((50vw - 30.5rem));
  }
`;

export const AllPhotosCta = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.25rem;
  padding: 0.5rem;

  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(3.5px);
  box-sizing: content-box;

  ${expandFontToken(FONTS.BUTTON_SMALL)};
  letter-spacing: 0;
  color: ${COLORS.BRAND.WHITE};
  position: relative;
  cursor: pointer;
  svg {
    margin-right: 0.25rem;
    height: 1rem;
    width: 1rem;
  }

  :hover {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(3.5px);
  }
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    height: 1rem;
  }
`;

export const GalleryPopup = styled.div<{ isPopupActive: boolean }>`
  display: ${({ isPopupActive }) => (isPopupActive ? 'flex' : 'none')};
  flex-direction: column;

  position: fixed;
  left: 0;
  top: 0;
  z-index: 16;

  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(17, 17, 17, 0.8);
  }

  .header {
    display: flex;
    justify-content: space-between;
    width: 75.875rem;
    margin: 4.31rem auto 0;
    z-index: 15;

    .all-photos {
      color: ${COLORS.BRAND.WHITE};
      ${expandFontToken(FONTS.HEADING_LARGE)};
    }
    .close-button {
      display: inline-flex;
      padding: 0.5rem;
      margin-right: 1rem;
      align-items: flex-start;
      border-radius: 0.25rem;
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(0.625rem);
      cursor: pointer;
      margin-bottom: 1.5rem;
      path {
        stroke: ${COLORS.BRAND.WHITE};
      }
    }
  }

  .main-content {
    display: flex;
    max-width: 75.875rem;
    margin: 0 auto;

    -webkit-user-select: none;
    user-select: none;
  }

  .primary-section,
  .image-gallery-primary {
    width: 50rem;
    height: 31.25rem;
    position: relative;
    img {
      border-radius: 0.75rem;
    }

    .chevron {
      position: absolute;
      z-index: 10;
      top: 45%;
      left: -1.25rem;
      cursor: pointer;

      &.inactive {
        display: none;
      }
    }
    .chevron-right {
      right: 0.75rem;
      transform: rotate(180deg);
      left: inherit;
    }
  }
  .primary-section {
    padding-right: 2rem;
    border-right: solid 0.0625rem ${COLORS.GRAY.G2};
  }

  .image-list-section {
    width: 23rem;
    height: 31.25rem;

    margin-left: 2rem;
    display: grid;
    grid-template-columns: repeat(2, 10rem);
    grid-auto-rows: 6.25rem;

    row-gap: 1rem;
    column-gap: 1rem;

    overflow-y: scroll;
    z-index: 100;
    overflow-x: scroll;

    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
    .active img {
      border: 0.125rem solid ${COLORS.BRAND.WHITE};
    }
    .gallery-list-image {
      width: 10rem;
      height: 6.25rem;
      img {
        border-radius: 0.5rem;
        cursor: pointer;
        box-sizing: border-box;
      }
    }
  }

  @media (max-width: 768px) {
    .header {
      justify-content: space-between;
      width: 100vw;
      padding: 1.75rem 1.5rem 0;
      margin: 0;
      box-sizing: border-box;

      .all-photos {
        ${expandFontToken(FONTS.HEADING_SMALL)};
      }
      .close-button {
        margin: 0;
      }
    }

    .main-content {
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
      padding-bottom: 2.25rem;
    }

    .primary-section {
      width: 100vw;
      height: 14.64844rem;
      position: relative;
      margin: auto;
      .chevron {
        display: none;
      }
    }

    .image-gallery-primary {
      width: 100vw;
      height: 14.64844rem;
    }

    .image-list-section {
      width: 100vw;
      height: 3.5rem;
      padding: 0 1.5rem;
      margin: 0;
      box-sizing: border-box;
      overflow-x: auto;
      white-space: nowrap;
      grid-auto-flow: column;
      grid-template-columns: repeat(auto-fill, 5rem);
      column-gap: 0.5rem;
      overflow-x: auto;
      white-space: nowrap;

      .gallery-list-image {
        width: 5rem;
        height: 3.125rem;
        img {
          border-radius: 0.25rem;
        }
      }
    }
  }
`;
