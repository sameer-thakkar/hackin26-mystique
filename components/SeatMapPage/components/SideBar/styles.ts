import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SideBarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SideBarTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TourDescriptor = styled.div<{ isMobile?: boolean }>`
  display: flex;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  ${({ isMobile }) =>
    isMobile
      ? `gap: 8px;`
      : `width: 100%;
        border-radius: 0.5rem;
        padding: 0.75rem;
        border: 1px solid #e2e2e2;
        gap: 10px;`}

  .image-container {
    width: max-content;
    min-width: 54px !important;
    border-radius: 0.25rem;
    height: 77px;

    img {
      width: 54px !important;
      border-radius: 0.25rem;
      object-fit: cover;
    }
  }
`;

export const TourDescriptorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .rating-container {
    display: flex;
    align-items: center;
    gap: 2px;
    .product-rating {
      display: flex;
      justify-content: center;
      align-items: center;

      .star-svg {
        margin-right: 0.2rem;
      }
    }
  }
  .experience-location {
    width: 17rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: flex;
    gap: 0.25rem;
    margin-top: 6px;
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }
`;

export const TourDescriptorContentSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ExperienceName = styled.div<{ isMobile?: boolean }>`
  width: max-content;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  color: ${COLORS.GRAY.G2};
  text-decoration: underline;
  max-width: 13.75rem;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};

  &:hover {
    color: ${COLORS.GRAY.G1};
  }

  @media (max-width: 768px) {
    text-decoration: none;
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
  }
`;

export const Reviews = styled.span`
  text-transform: uppercase;
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  color: ${COLORS.TEXT.CANDY_1};
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
`;
export const RatingCount = styled.div`
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  color: ${COLORS.TEXT.CANDY_1};
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
`;

export const ReviewCount = styled.div`
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  color: ${COLORS.TEXT.CANDY_1};
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
`;

export const DateSelection = styled.section<{
  isSingleDate?: boolean;
  isSingleTime?: boolean;
}>``;

export const DateSelectionSkeleton = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SelectDateTitleBlock = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  h2 {
    padding: 0;
    margin: 0;
    ${expandFontToken(FONTS.HEADING_XS)}
  }

  p {
    padding: 0;
    margin: 0;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }
`;

export const HorizontalDateList = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 6px;
`;

export const TourDateButton = styled.button<{
  isSelected: boolean;
  isDisabled: boolean;
  isMinPrice: boolean;
}>`
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 56px;
  min-height: 72px;
  padding: 0.5rem 0.25rem;
  gap: 6px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: none;
  transition: 0.4s;
  color: ${COLORS.GRAY.G3};
  cursor: pointer;

  ${({ isSelected, isDisabled }) =>
    !isDisabled &&
    isSelected &&
    `border-color: #8000ff;
  background: #f3e9ff;
  color: ${COLORS.TEXT.PURPS_3};`}

  ${({ isDisabled }) =>
    isDisabled ? `cursor: unset; color: ${COLORS.GRAY.G4};` : ``}

  &:hover {
    ${({ isSelected }) => !isSelected && 'background: #f8f6ff;'}
    ${({ isDisabled }) => isDisabled && 'background: none;'}
  }

  .tourMonth {
    color: ${COLORS.GRAY.G2};
    ${({ isSelected }) => isSelected && `color: ${COLORS.TEXT.PURPS_3};`}

    ${({ isDisabled }) => isDisabled && ` color: ${COLORS.GRAY.G4}`}
  }

  p {
    margin: 0;
    color: inherit;
    ${expandFontToken(FONTS.SUBHEADING_SMALL)}
    font-weight: 500;
    text-align: center;
  }

  .tourPrice {
    ${expandFontToken(FONTS.MISC_BADGE_SMALL)}
    ${({ isMinPrice }) =>
      isMinPrice &&
      `color: ${COLORS.OKAY_GREEN.DARK_TONE};
      background: #dbfddb;
      border-radius: 2px;
      padding: 1px;`}
  }
`;

export const MoreTourDates = styled.button`
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 56px;
  min-height: 72px;
  padding: 0.5rem 0.25rem;
  gap: 4px;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: 0.4s;
  background: none;
  color: #666666;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  p {
    text-decoration: underline;
    margin: 0;
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const StyledTimeSelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  p {
    margin: 0;
    padding: 0;
  }

  .sectionTitle {
    padding: 0;
    margin: 0;
    ${expandFontToken(FONTS.HEADING_XS)};
    color: ${COLORS.GRAY.G2};
  }
`;

export const TourTimeSlotContainer = styled.div`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: scroll;
`;

export const StyledTourTimeSlot = styled.button<{ isSelected: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  gap: 10px;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;

  ${({ isSelected }) =>
    isSelected
      ? `background: ${COLORS.PURPS.LEVEL_10}; border: 1px solid ${COLORS.PURPS.LEVEL_10};`
      : `border: 1px solid ${COLORS.GRAY.G6};`}

  &:hover {
    ${({ isSelected }) =>
      !isSelected && 'background: #f8f6ff; border-color: #f8f6ff;'}
  }

  .left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  p {
    margin: 0;
    padding: 0;
    text-align: left;
    ${({ isSelected }) => isSelected && `color: ${COLORS.PURPS.LEVEL_3};`}
  }

  .tourStartTime {
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
    ${({ isSelected }) => !isSelected && `color: ${COLORS.GRAY.G2};`}
  }

  .originalPrice {
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
    ${({ isSelected }) => !isSelected && `color: ${COLORS.GRAY.G3};`}
  }

  .sellingOutFast {
    ${expandFontToken(FONTS.MISC_TAG_REGULAR)};
    ${({ isSelected }) => !isSelected && `color: ${COLORS.GRAY.G3};`}
    margin-left: -2px;
  }
`;

export const HR = styled.hr<{ bgColor?: string }>`
  border: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 1px;
  background: ${COLORS.GRAY.G6};
  ${({ bgColor }) => bgColor && `background: ${bgColor}`}
`;

export const CheckAvailability = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 0;
  padding: 11px 20px 13px 20px;
  border-radius: 8px;
  background: ${COLORS.BRAND.PURPS};
  transition: background 250ms;
  cursor: pointer;
  margin: 0 auto;
  transition: all 300ms ease-in-out;

  &:hover {
    background: ${COLORS.PURPS.SECONDARY};
  }

  &:active {
    background: ${COLORS.PURPS.SECONDARY};
    width: calc(100% - 16px);
  }

  span {
    ${expandFontToken(FONTS.BUTTON_BIG)};
    color: ${COLORS.BRAND.WHITE};
  }

  @media (max-width: 768px) {
    width: 52%;
    margin: 0;
    background: #8000ff;
    border: 1px solid ${COLORS.BRAND.PURPS};
    padding: 10px 12px;
    font-family: Halyard Display;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.4px;

    &:active {
      background: ${COLORS.PURPS.SECONDARY};
      width: calc(52% - 8px);
    }

    span {
      font-family: 'halyard-display';
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: 0.4px;
      text-align: left;
      color: white;
    }
  }
`;

/* Styles for FixedTourInfoBannerWrapper */

export const TextContainer = styled.div`
  ${getFontDetailsByLabel(FONTS.PARAGRAPH_MEDIUM)}
  color: ${COLORS.GRAY.G2};
  width: max-content;

  .link-container {
    margin-top: 1rem;
  }

  width: auto;

  @media (max-width: 768px) {
    ${getFontDetailsByLabel(FONTS.PARAGRAPH_REGULAR)}
    padding-right: 0.75rem;
  }
`;

export const PopupButtonsContainer = styled.div`
  display: grid;
  row-gap: 0.75rem;
  padding: 0.75rem 1.5625rem 1rem;
`;

export const BaseButton = styled.button`
  padding: 0.5rem 0;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: block;
  min-width: 9.84375rem;
  ${getFontDetailsByLabel(FONTS.BUTTON_SMALL)}

  @media (max-width: 768px) {
    padding: 0.5rem 0;
    svg {
      width: 0.7rem;
      height: 0.7rem;
    }
  }
`;

export const ActionButton = styled(BaseButton)`
  background-color: ${COLORS.BRAND.PURPS};
  color: ${COLORS.BRAND.WHITE};
`;

export const AllowButton = styled(BaseButton)`
  color: ${COLORS.PURPS.LEVEL_10};
  background-color: ${COLORS.BRAND.PURPS};
`;

const hidden = css`
  touch-action: none;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
`;

export const CancelButton = styled(BaseButton)`
  cursor: pointer;
  text-align: center;
  ${getFontDetailsByLabel(FONTS.BUTTON_SMALL)}
  background-color: ${COLORS.BRAND.WHITE};
  border: 1px solid;
  padding: calc(0.5rem - 1px) 0;

  color: ${COLORS.PURPS.LEVEL_3};

  @media (max-width: 768px) {
    padding: calc(0.5rem - 1px) 0;
  }
`;

export const FixedTourInfoBannerWrapper = styled.div<{
  $isHidden?: boolean;
}>`
  position: fixed;
  padding: 12px 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 20;
  background: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12),
    0px -1px 2px 0px rgba(0, 0, 0, 0.08);
  ${({ $isHidden }) => $isHidden && hidden}
  border-top: 1px solid ${COLORS.GRAY.G6};

  @media (max-width: 768px) {
    transform: unset;
    padding-bottom: 20px;
  }
`;

export const TourInfoBanner = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

export const TourImageWrapper = styled.div`
  width: 100%;
  max-width: 25px;

  .image-container {
    width: max-content;
    min-width: 25px;
    border-radius: 2px;
    height: 38px;

    img {
      width: 25px !important;
      border-radius: 2px;
      object-fit: cover;
    }
  }
`;

export const ActionContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 11;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
`;

export const LinksContainer = styled.div`
  display: grid;
  ${getFontDetailsByLabel(FONTS.PARAGRAPH_REGULAR)}
  text-decoration: underline;
  margin: 0.5rem 0;
  a svg path {
    fill: ${COLORS.GRAY.G2};
  }
`;

export const DetailedPopupContainer = styled.div`
  display: grid;
  max-width: 520px;
  max-height: 480px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 24px;
  .consent-heading {
    ${getFontDetailsByLabel(FONTS.HEADING_REGULAR)}
    margin-bottom: .75rem;
  }
  .sub-heading {
    ${getFontDetailsByLabel(FONTS.HEADING_SMALL)}
    margin-bottom: .75rem;
  }
  ul {
    padding-left: 1.2rem;
    margin-top: 0;
    margin-bottom: 0;
  }
  li,
  p {
    ${getFontDetailsByLabel(FONTS.PARAGRAPH_REGULAR)}
  }
  li:not(:first-child) {
    margin-top: 1rem;
  }
  ul ul li:first-child {
    margin-top: 1rem;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${COLORS.GRAY.G4};
  }
  && a {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    max-height: calc(100dvh - 12.5rem);
    padding: 1rem;
  }
`;

export const HeadingContainer = styled.div`
  display: grid;
  .image-wrap {
    grid-row: 1 / 3;
    grid-column: 2 / 3;
    display: flex;
    justify-content: end;
  }

  @media (max-width: 768px) {
    .image-wrap {
      grid-row: 1;
      grid-column: 1;
      justify-content: unset;
      margin-bottom: 0.75rem;
    }
  }
`;

export const consentDrawerStyles = css`
  && .shadow {
    height: 100%;
  }
  @media (max-width: 768px) {
    height: calc(100vh - (100vh - 100%) - 4rem);
    bottom: 1.6rem;
    .consent-drawer {
      margin: 0 1rem;
      border-radius: 0.75rem;
      height: auto;
    }
  }
`;

export const TourPriceInfo = styled.div`
  width: 37%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  p,
  .discount,
  .cashback-container {
    margin: 0;
    padding: 0;
  }

  .cashback-container {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .discount {
      ${expandFontToken(FONTS.MISC_TAG_REGULAR)};
      color: ${COLORS.OKAY_GREEN[3]};
      background: ${COLORS.BACKGROUND.SOOTHING_GREEN};
      border-radius: 2px;
      padding: 1px 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: center;
    }
  }

  .starting-price {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${COLORS.GRAY.G4};
  }

  .actual-price {
    ${expandFontToken(FONTS.HEADING_SMALL)};
    color: ${COLORS.GRAY.G3};
  }
`;

export const GenreName = styled.p`
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  padding: 0;
  margin: 0;
`;
