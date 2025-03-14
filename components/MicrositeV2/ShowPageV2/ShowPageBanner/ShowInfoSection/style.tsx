import styled from 'styled-components';
import {
  BreadcrumbsContainer,
  StyledBreadcrumbLink,
  StyledBreadcrumbSpan,
} from 'components/Breadcrumbs/styles';
import { StyledTooltip } from 'UI/Tooltip';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Breadcrumbs = styled.p`
  margin: 0;
  padding: 0;

  a,
  span {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G4};
    margin: 0 0.25rem;
    &:hover {
      text-decoration-line: underline;
    }
  }
  a:first-child {
    margin-left: 0;
  }

  span {
    &:hover {
      text-decoration-line: none;
    }
  }
`;
export const ShowInfoSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: 1.5rem auto 3.56rem;
  z-index: 0;

  ${BreadcrumbsContainer} {
    margin: 0;
    padding: 0;

    ${StyledBreadcrumbLink},${StyledBreadcrumbSpan} {
      color: ${COLORS.BRAND.WHITE}80 !important;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      text-decoration-line: none;
    }

    ${StyledBreadcrumbLink} {
      &:hover {
        color: ${COLORS.BRAND.WHITE}CC !important;
        opacity: 1;
        text-decoration-line: underline;
      }
    }

    svg {
      margin: 0 0.25rem;
      path {
        stroke: ${COLORS.BRAND.WHITE}66;
      }
    }
  }

  @media (max-width: 768px) {
    margin: 0 0 1.75rem 1.5rem;
    margin-top: -2rem;
    z-index: 1;
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
  }
`;

export const Hero = styled.div<{ $isImageAvailable: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: start;
  margin-top: 1.5rem;
  .image-section {
    display: flex;
    margin-right: 1.5rem;
    transition: transform 0.2s ease;
    padding-bottom: 4px;
    border-radius: 12px;

    background: linear-gradient(
      180deg,
      rgba(226, 226, 226, 0) -1.28%,
      #666 102.98%
    );

    .banner-vertical-image {
      height: 16.6875rem !important;
    }
    .image-placeholder {
      position: ${({ $isImageAvailable }) =>
        $isImageAvailable ? 'absolute' : 'static'};
      z-index: -1;
    }
    svg {
      border-radius: 4px;
      border: 2px solid rgba(0, 0, 0, 0.14);
    }
    img {
      border-radius: 12px;
      border: 2px solid rgba(0, 0, 0, 0.14);
    }
    @media (max-width: 768px) {
      padding-bottom: 8px;
      height: 176px !important;
      margin-right: 0.75rem;
      .banner-vertical-image {
        height: 180px !important;
      }
    }
  }
  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

export const InfoSectionWrapper = styled.div`
  @media (max-width: 768px) {
    max-width: none;
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
    overflow-x: scroll;
  }
`;

export const InfoSection = styled.div<{ $isReviewSectionVisible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 28.6875rem;
  position: relative;
  z-index: 13;

  &::after {
    content: '';
    height: 1px;
    width: 28.6875rem;
    margin-top: 0.5rem;
    background: linear-gradient(
      270deg,
      rgba(226, 226, 226, 0) -1.28%,
      #666 102.98%
    );
  }

  ${StyledTooltip} {
    position: static;
    display: flex;
    top: calc(100% + 5rem);
    left: 30%;
    right: auto;

    input {
      visibility: hidden;
    }
  }
  .title {
    margin: -0.9rem 0 0.5rem 0;
    ${({ $isReviewSectionVisible }) =>
      !$isReviewSectionVisible &&
      `
      margin-top: 0rem;
    `};
    ${expandFontToken(FONTS.DISPLAY_LARGE)};
    font-size: 40px;
    line-height: 48px;
    color: ${COLORS.BRAND.WHITE};
    max-width: 30.375rem;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  .reopening {
    display: flex;
    align-items: center;

    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    color: ${COLORS.BRAND.WHITE};
    margin: 0 0 0.5rem 0;

    svg {
      margin-right: 0.5rem;
    }
  }

  .rating-section {
    padding-bottom: 0.9rem;
    z-index: 1;
    &:hover {
      #review-popover {
        display: flex;
      }
    }
  }

  .ratings-wrapper {
    padding-bottom: 0.25rem;
    display: flex;
    .rating {
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
      color: ${COLORS.BRAND.CANDY};
      margin-right: 0.2rem;
      svg {
        margin-right: 0.15rem;
        height: 0.875rem;
        width: 0.875rem;
      }
      margin-top: 1px;
    }
    .review-count {
      ${expandFontToken(FONTS.UI_LABEL_LARGE)};
      color: ${COLORS.GRAY.G4};
      display: flex;
      align-items: center;
      span {
        text-decoration: underline;
        color: ${COLORS.GRAY.G4};
      }
    }
  }

  @media (max-width: 768px) {
    max-width: 12.0625rem;
    &::after {
      width: 12.0625rem;
      margin-top: 8px;
    }

    .rating-section {
      padding-bottom: 0.125rem;
      .ratings-wrapper {
        padding: 0;
        .rating {
          ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
          margin-right: 0.25rem;
          svg {
            margin-left: 0.06rem;
            height: 0.75rem;
            width: 0.75rem;
          }
          margin-top: 0px;
        }
        .review-count {
          ${expandFontToken(FONTS.UI_LABEL_SMALL)};
          color: ${COLORS.GRAY.G4};
        }
      }
    }

    .title {
      margin: 0;
      margin-bottom: 6px;
      ${expandFontToken(FONTS.HEADING_REGULAR)};
      max-width: 12.0625rem;
    }

    .reopening {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      margin: 0 0 0.375rem 0;

      svg {
        margin-right: 0.25rem;
        height: 0.75rem;
        width: 0.75rem;
      }
    }
  }
`;

export const TagSection = styled.div`
  display: flex;
  z-index: 12;
  position: relative;
  margin-top: 1.25rem;
  gap: 8px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  .tag {
    display: flex;
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    background: rgba(68, 68, 68, 0.5);
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    white-space: nowrap;
  }

  .tag.with-link {
    cursor: pointer;
    &:hover {
      background: rgba(68, 68, 68, 0.8);
    }
  }

  @media (max-width: 768px) {
    margin-top: 10px;
    padding-right: 1rem;
    overflow-x: scroll;
    overflow-y: hidden;

    .tag {
      padding: 4px 8px;
      margin-right: 0;
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      height: 1rem;
      width: max-content;
    }

    .show-more {
      display: flex;
      justify-content: center;
      align-items: center;
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      color: ${COLORS.BRAND.WHITE};
      border-bottom: dotted 1px;
      padding-right: 2px;
      min-width: max-content;
    }
  }
`;

export const TheatreSection = styled.div<{ $isUnderlined?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 1rem;

  svg {
    color: white;
    height: 1rem;
    width: 1rem;
    margin-right: 0.25rem;
    path {
      stroke: white;
    }
  }

  a {
    color: ${COLORS.GRAY.G7};
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
    ${({ $isUnderlined }) =>
      $isUnderlined && 'border-bottom: dotted 1px rgba(255, 255, 255, 0.6);'}
  }

  @media (max-width: 768px) {
    margin-top: 12px;

    svg {
      color: white;
      height: 0.75rem;
      width: 0.75rem;
      margin-right: 2px;
    }

    a {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    }
  }
`;

export const ReviewPopover = styled.div`
  display: none;
  flex-direction: column;
  position: absolute;
  min-width: 19.1875rem;
  max-width: 22rem;

  background-color: ${COLORS.BRAND.WHITE};
  border-radius: 0.625rem;
  border: 0.0625rem solid #cecece;

  box-sizing: border-box;

  .header {
    color: ${COLORS.BRAND.CANDY};
    ${expandFontToken(FONTS.HEADING_LARGE)};
    font-size: 2rem;
    padding: 1rem 1rem 1.38rem;
    background: linear-gradient(
      0deg,
      #fff3f9 0%,
      rgba(255, 255, 255, 0) 86.18%
    );
    svg {
      width: 24px;
      height: 24px;
      margin-right: 0.15rem;
    }
  }

  .review {
    padding: 0.5625rem 1rem 1rem;
    .reviwer-details {
      display: flex;
      align-items: center;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;

      .reviewer-image {
        height: 2.3125rem;
        width: 2.3125rem;
        border-radius: 2.3125rem;
        margin-right: 0.625rem;
        img {
          border-radius: 2.3125rem;
        }
      }

      .user-details {
        display: flex;
        flex-direction: column;
        .country {
          ${expandFontToken(FONTS.UI_LABEL_SMALL)};
          color: ${COLORS.GRAY.G3};
        }

        .name {
          ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
          color: ${COLORS.GRAY.G2};
        }
      }

      .stars {
        width: fit-content;
        white-space: nowrap;
        svg {
          margin-right: 2px;
        }
      }
    }

    .review-content {
      ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
      color: ${COLORS.GRAY.G2};
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 7;
      -webkit-box-orient: vertical;
      display: -webkit-box;
    }

    .read-more {
      display: flex;
      padding: 0.5rem 0.75rem;
      margin-top: 0.8125rem;
      justify-content: center;
      align-items: center;
      border-radius: 0.25rem;
      border: none;
      background-color: ${COLORS.GRAY.G7};
      color: ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.BUTTON_SMALL)};
      width: 100%;
      cursor: pointer;

      &:hover {
        box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.3);
      }
    }
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const ViewTranslatedContentButton = styled.p`
  margin: 0;
  margin-top: 0.5rem;
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  color: rgb(15, 67, 189);
  cursor: pointer;
`;
