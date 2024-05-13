import styled, { css } from 'styled-components';
import { HeadingContainer } from 'components/common/Drawer';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  margin-top: 0.5rem;
  .show-list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    :last-child {
      margin-bottom: 0;
    }
    img,
    .image-wrap {
      height: 3.5625rem !important;
      width: 2.375rem !important;
      border-radius: 4px;
    }
    span {
      display: block;
      margin-bottom: 0.25rem;
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
      color: ${COLORS.GRAY.G3};
    }
    a {
      ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
      display: flex;
      align-items: center;
      gap: 0.125rem;
      svg,
      path {
        transform: translateY(1px);
        stroke: ${COLORS.TEXT.CANDY_1};
      }
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(20.4375rem, 1fr));
  }
`;

export const Container = styled.div`
  @media (max-width: 768px) {
    && {
      .tabs {
        grid-column-gap: 0.5rem;
        width: auto;
        overflow-x: hidden;
      }
      .slide-controls {
        display: none;
      }
    }
    .tabs > * {
      svg {
        display: none;
      }
    }
    .tabs > div {
      ${expandFontToken(FONTS.HEADING_SMALL)}
    }
  }
`;

export const Heading = styled.h2`
  ${expandFontToken(FONTS.HEADING_LARGE)};
  && {
    margin-bottom: 1rem;
  }
  color: ${COLORS.GRAY.G2};
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
  }
`;

export const ImageWrapper = styled.div`
  width: auto;
  background-color: ${COLORS.GRAY.G6};
  height: 10.1875rem;
  border-radius: 16px 16px 0 0;

  @media (max-width: 768px) {
    height: 9.5625rem;
  }
`;

export const Cell = styled.div`
  min-height: 29.4375rem;
  box-sizing: border-box;
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 16px;
  img {
    border-radius: 16px 16px 0 0;
    width: 100%;
    object-fit: cover;
  }
  .image-wrap {
    height: auto;
  }
  @media (max-width: 768px) {
    min-height: 29rem;
    box-sizing: border-box;
  }
`;

export const TheatreInfo = styled.div`
  height: 17rem;
  padding: 1rem;
  position: relative;
  h3 {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin: 0;
  }
  button {
    position: absolute;
    background: ${COLORS.BRAND.PURPS};
    color: ${COLORS.BRAND.WHITE};
    border-radius: 8px;
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
  button:hover {
    background: #7300e5;
  }
  @media (max-width: 768px) {
    height: 18rem;
    h3 {
      ${expandFontToken(FONTS.HEADING_SMALL)}
    }
  }
`;

export const TheatreMetaInfo = styled.div``;

export const SeatingInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  svg {
    transform: translateY(2px);
  }
`;

export const TheatreAddress = styled.div`
  margin-top: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  svg {
    transform: translateY(3px);
    flex-basis: 1.25rem;
    width: 1.25rem;
  }
  a {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    color: ${COLORS.GRAY.G2};
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  a:hover {
    color: ${COLORS.GRAY.G1};
  }
`;

export const SeatsInfo = styled.div`
  p {
    margin: 0;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    color: ${COLORS.GRAY.G2};
  }
  a {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
  }
  a:hover {
    color: ${COLORS.CANDY.TERTIARY};
  }
`;

export const NowPlaying = styled.div`
  &&& {
    h3 {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      color: ${COLORS.GRAY.G3};
      display: flex;
      gap: 4px;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    @media (max-width: 768px) {
      h3 {
        ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
      }
    }
  }
`;

export const Separator = styled.div`
  margin: 1rem 0;
  width: 100%;
  border-top: 1px solid ${COLORS.GRAY.G7};
`;

export const Chip = styled.a<{
  $relativePositioning?: boolean;
}>`
  background-color: ${COLORS.GRAY.G8};
  padding: 0.375rem 0.5rem;
  border-radius: 4px;
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  color: ${COLORS.GRAY.G3};
  width: fit-content;
  margin-bottom: 0.625rem;
  display: inline-block;
  margin-right: 0.5rem;
  cursor: pointer;
  ${({ $relativePositioning }) => $relativePositioning && 'position: relative'}
  svg, path {
    transform: translateY(0.8px) translateX(1px);
    stroke: ${COLORS.GRAY.G3};
  }

  &:hover {
    background-color: ${COLORS.GRAY.G7};
  }
`;

export const ChipsWrapper = styled.div`
  margin-bottom: 0.625rem;
`;

export const HoverCard = styled.div`
  &&& {
    h3 {
      ${expandFontToken(FONTS.SUBHEADING_LARGE)};
      color: ${COLORS.GRAY.G2};
    }
  }
  background: ${COLORS.BRAND.WHITE};
  position: absolute;
  top: -35px;
  width: 18.1875rem;

  height: max-content;
  text-wrap: wrap;
  padding: 1rem;
  ul {
    padding: 0;
    margin-bottom: 0;
    li {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      margin-bottom: 0.75rem;
      list-style-position: inside;
    }
  }
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.75rem 0 #0000001a, 0 0 0.0625rem 0 #0000001a;
  z-index: 10;
`;

export const MoreDetailsCta = styled.a`
  text-align: center;
  position: absolute;
  background: ${COLORS.BRAND.PURPS};
  padding: 0.75rem;
  color: ${COLORS.BRAND.WHITE};
  border-radius: 8px;
  left: 16px;
  right: 16px;
  bottom: 16px;
  ${expandFontToken(FONTS.BUTTON_MEDIUM)};

  &:hover {
    background: #7300e5;
  }
  &:active {
    position: absolute;
    left: 18px;
    right: 18px;
  }

  @media (max-width: 768px) {
    &:active {
      position: absolute;
      left: 18px;
      right: 18px;
    }
  }
`;

export const DrawerStyles = css`
  height: auto;
  grid-row-gap: 0px !important;
  .show-list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    img,
    .image-wrap {
      height: 3.5625rem !important;
      width: 2.375rem !important;
      border-radius: 4px;
    }
    span {
      display: block;
      margin-bottom: 0.25rem;
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
      color: ${COLORS.GRAY.G3};
    }
    a {
      display: flex;
      align-items: center;
      gap: 0.125rem;
      ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
      svg,
      path {
        transform: translateY(1px);
        stroke: ${COLORS.TEXT.CANDY_1};
      }
    }
  }
  ul {
    padding: 0;
    margin: 0px;
  }
  && {
    ${HeadingContainer} {
      grid-template-columns: 1fr !important;
      grid-row-gap: 0.5rem !important;
      width: 100%;
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
    }

    .close-icon {
      display: none;
    }
  }
`;
