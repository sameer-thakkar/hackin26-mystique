import styled, { css } from 'styled-components';
import {
  AllPhotosCta,
  GalleryPopup,
  ImageGalleryWrapper,
} from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/style';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const GalleryViewContainer = styled.div`
  width: 49.5rem;
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  position: fixed;
  z-index: 3;

  ${ImageGalleryWrapper} {
    ${GalleryPopup} {
      .overlay {
        background: #000000cc;
        border-radius: 12px;
      }

      .header {
        width: 45.5rem;
        margin: 1.5rem auto 0;

        .all-photos {
          margin-bottom: 2rem;
          display: flex;
          align-items: center;

          .close-button {
            background: none;
            backdrop-filter: none;
            margin-right: 0.5rem;
            margin-bottom: 0;
            padding: 0.5rem 0.5rem 0.5rem 0;
          }

          ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}
        }
      }

      .main-content {
        flex-direction: column;
        gap: 2rem;

        .primary-section {
          padding-right: 0;
          border-right: none;
          width: 45.5rem;
          height: 27.875rem;

          .chevron-right {
            right: -1.25rem;
          }

          .swiper {
            border-radius: 8px;

            .image-gallery-primary {
              width: 45.5rem;
              height: 27.875rem;

              img {
                border-radius: 8px;
              }
            }
          }
        }

        .image-list-section {
          width: 45.5rem;
          margin-left: 0;
          display: flex;
          height: 5.3125rem;
          gap: 0.75rem;
          overflow-y: hidden;

          .image-wrap {
            width: 8.5rem;
            height: 5.3125rem;
            aspect-ratio: 16/10;
          }
        }
      }
    }
  }
`;

export const ExpandedGalleryContainer = styled.div<{
  $numberOfImages: number;
  $imagesLoaded?: boolean;
}>`
  position: relative;
  display: grid;
  grid-template-areas: ${({ $numberOfImages }) =>
    $numberOfImages >= 3
      ? "'image-1 image-2' 'image-1 image-3'"
      : $numberOfImages === 2
      ? "'image-1 image-2'"
      : "'image-1'"};
  justify-items: center;
  gap: 2px;
  ${({ $numberOfImages }) =>
    $numberOfImages >= 3 &&
    css`
      grid-template-columns: 32rem 1fr;
    `};

  ${({ $numberOfImages }) =>
    $numberOfImages === 1 &&
    css`
      background-color: ${COLORS.GRAY.G2};
    `};

  ${AllPhotosCta} {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: none;

    &:hover {
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(3.5px);
    }
  }

  .gallery-children {
    cursor: pointer;
    transform: translateZ(1px);
    aspect-ratio: 16/10;
    width: 100%;
    transition: opacity 0.3s;

    img {
      aspect-ratio: 16/10;
    }

    .react-loading-skeleton {
      width: -webkit-fill-available;
      height: -webkit-fill-available;
      line-height: inherit;
      border-radius: 0;
    }
  }

  div.gallery-children {
    opacity: ${({ $imagesLoaded }) => ($imagesLoaded ? 1 : 0)};
    pointer-events: ${({ $imagesLoaded }) => ($imagesLoaded ? 'auto' : 'none')};
  }

  span.gallery-children {
    opacity: ${({ $imagesLoaded }) => ($imagesLoaded ? 0 : 1)};
  }

  .gallery-children:nth-of-type(3n + 1) {
    grid-area: image-1;
    max-height: 23.75rem;
    ${({ $numberOfImages }) =>
      $numberOfImages === 1 &&
      css`
        max-height: 20rem;
        max-width: 32rem;
      `};
  }

  .gallery-children:nth-of-type(3n + 2) {
    grid-area: image-2;
    max-height: ${({ $numberOfImages }) =>
      $numberOfImages > 2 ? 9.9375 : 15.5}rem;
  }

  .gallery-children:nth-of-type(3n) {
    grid-area: image-3;
    max-height: 9.9375rem;
  }
`;
