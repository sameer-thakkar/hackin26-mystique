import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import {
  ImageGalleryWrapper,
  ReviewInfo,
} from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/style';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { ReviewWrapper } from './components/ReviewElement/styles';

export const StyledReviewsV2Wrapper = styled.div`
  .heading-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .heading {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    svg {
      height: 2.25rem;
      width: 2.25rem;
    }
  }

  .heading-text {
    ${getFontDetailsByLabel(FONTS.HEADING_SMALL)};
    color: ${COLORS.GRAY.G2};

    @media only screen and (min-width: 768px) {
      ${getFontDetailsByLabel(FONTS.HEADING_LARGE)};
    }
  }

  .swiper-slide {
    height: 100%;
  }

  .mobile-carousel-container {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    gap: 1.5rem;
    width: calc(100% + 2rem);
    margin-left: -1rem;

    &::-webkit-scrollbar {
      display: none;
    }

    ${ReviewWrapper} {
      &:first-child {
        margin-left: 1rem;
      }

      &:last-child {
        margin-right: 1rem;
      }
    }
  }

  @media only screen and (min-width: 768px) {
    .heading {
      gap: 1rem;
      justify-content: stretch;
      width: fit-content;

      svg {
        height: 2rem;
        width: 2rem;
      }
    }
  }
`;

export const LottieContainer = styled.div`
  display: inline-block;
  max-width: 2rem;
  margin-left: 0.625rem;
  transform: translateY(0.5rem);

  @media (max-width: 768px) {
    transform: none;
  }
`;

export const ImageGalleryContainer = styled.div`
  ${ImageGalleryWrapper} {
    z-index: 10001; // header is 10000

    .primary-section {
      padding-right: 0;

      .chevron-right {
        right: -1.25rem;
      }

      .image-wrap {
        border-radius: 8px;
      }
    }

    .image-list-section {
      img {
        object-fit: contain;
        background-color: ${COLORS.BLACK};
      }
    }

    @media (max-width: 768px) {
      ${ReviewInfo} {
        width: calc(100vw - 1.5rem);
        top: 100%;
        bottom: 0;
        background: none;
      }

      ${ImageGalleryWrapper} {
        .image-wrap {
          border-radius: none;
        }
      }
    }
  }
`;
