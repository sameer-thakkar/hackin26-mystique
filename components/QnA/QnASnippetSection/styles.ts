import styled, { css } from 'styled-components';
import { CoreDrawerText, Separator } from 'components/common/Drawer';
import { Panel } from 'components/common/SwipeableTabs';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SnippetContainer = styled.div`
  overflow: hidden;
  width: 100vw;
  background: linear-gradient(
    358.02deg,
    #fdf5fd 10.7%,
    #fff7f3 48.08%,
    rgba(255, 255, 255, 0) 86.22%
  );
  padding-bottom: 1rem;

  @media (min-width: 768px) {
    margin-top: 0.5rem;
    width: 100%;
    padding-bottom: 1.5rem;
    position: relative;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    width: calc(100% - (5.46vw * 2));
    max-width: 1200px;
    margin: 0 auto;
    gap: 1.5rem;
  }
`;

export const Character = styled.div`
  position: absolute;
  left: 0;
  bottom: -10px;
`;

export const SmileyContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: -10px;
`;

export const DummyCard = styled.div`
  width: 1.5rem;
  height: 1.25rem;
`;

export const HeadingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  h2 {
    ${expandFontToken(FONTS.SEMANTIC_HEADING_REGULAR)};
    border-right: 0.5px solid #e2e2e2;
    padding-right: 0.5rem;
    color: ${COLORS.GRAY.G1};
    margin: 0;
    @media (min-width: 768px) {
      ${expandFontToken(FONTS.DISPLAY_XS)};
    }
  }
  span {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${COLORS.GRAY.G2};
    margin-top: 0;
    svg {
      margin-right: 0.25rem;
      transform: translateY(2px);
      @media (min-width: 768px) {
        height: 1rem;
        width: 1rem;
      }
    }
    @media (min-width: 768px) {
      ${expandFontToken(FONTS.UI_LABEL_LARGE)}
    }
  }
  .count--container {
    display: flex;
    align-items: center;
    border-left: 0.5px solid #e2e2e2;
    padding-left: 0.5rem;
  }
  .count--container__green {
    color: ${COLORS.MISC.GREEN};
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    @media (min-width: 768px) {
      ${expandFontToken(FONTS.HEADING_REGULAR)}
    }
  }

  @media (min-width: 768px) {
    padding-left: 0;
    margin-bottom: 1.5rem;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 0.75rem;
  width: 100%;
  padding: 0 1rem;
  padding-left: 1.5rem;
  box-sizing: border-box;
  margin: 0 auto;

  -webkit-overflow-scrolling: touch;

  &::after {
    content: '';
    height: 1.25rem;
    width: 1.25rem;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    width: 100%;
    padding: 2px;
    gap: 1.25rem;
    margin: 0;
    overflow: visible;

    &::after {
      display: none;
    }
  }
`;

export const Card = styled.div`
  min-height: 7.25rem;
  min-width: 20.4375rem;
  border-radius: 12px;
  box-shadow: 0px 2px 5.5px 0px #00000008;
  border: 1px solid #f0f0f0;
  position: relative;
  padding: 0.625rem;
  box-sizing: border-box;
  background-color: ${COLORS.BRAND.WHITE};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  -webkit-tap-highlight-color: transparent;

  .answer-body {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    justify-content: space-between;
    height: 100%;
  }

  &:last-child {
    @media (min-width: 768px) {
      margin-right: 0;
    }
  }
  @media (min-width: 768px) {
    max-width: 24.1875rem;
    min-height: 10rem;
    padding: 1rem;
    cursor: pointer;

    .answer-body {
      gap: 0.25rem;
      justify-content: space-between;
      height: 100%;
    }

    :hover {
      box-shadow: 0px 0.25rem 12px 2px #1111111a;
      box-shadow: 0px 1px 8px 0px #1111110d;
    }

    &:hover {
      box-shadow: 0px 0.25rem 12px 2px #1111111a;
    }

    &:hover .see-more-responses-cta {
      gap: 0.375rem;
    }
  }

  &:active {
    transform: scale(0.98);
    transition: transform 0.25s cubic-bezier(0.7, 0, 0.3, 1);
  }
`;

export const Tag = styled.div<{
  $bgColor: string;
  $textColor: string;
}>`
  position: absolute;
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
  border-radius: 0px 8px 0px 12px;
  background-color: ${({ $bgColor }) => $bgColor};
  padding: 5px 10px 6px;
  right: 0;
  top: 0;
  color: ${({ $textColor }) => $textColor};
`;

export const UserMeta = styled.div`
  display: flex;
  align-items: self-start;
  gap: 8px;
`;

export const UserImage = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  img {
    border-radius: 50%;
  }
  @media (min-width: 768px) {
    img {
      height: 36px;
      width: 36px;
      border-radius: 50%;
    }
  }
`;

export const UserInfo = styled.div`
  transform: translateY(-0.25rem) translateX(3px);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  svg {
    height: 10px;
    width: 10px;
  }
`;

export const UserName = styled.span`
  display: inline-block;
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
  color: ${COLORS.GRAY.G2};

  @media (min-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  }
`;

export const Answer = styled.p`
  ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (min-width: 768px) {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
  }
`;

export const RatingsStarWrapper = styled.div`
  > div {
    margin: 0;
    gap: 0.125rem;
  }

  svg,
  path {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

export const CTA = styled.div`
  width: fit-content;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.125rem;
  transition: all 0.3s;

  span {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    margin: 0;
    text-decoration: underline;
  }
  svg {
    margin-top: 0.25rem;
    width: 0.625rem;
    height: 0.625rem;
  }

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};

    span {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    }

    svg {
      width: 0.75rem;
      height: 0.75rem;
    }
  }
`;

export const DrawerStyles = ({
  isTabsVisible,
}: {
  isTabsVisible?: boolean;
}) => css`
  height: 80dvh;

  &&&& {
    grid-row-gap: 1.5rem;
  }

  &&&& {
    ${HeadingContainer} {
      position: relative;
      grid-template-columns: 1fr;
      grid-row-gap: 0.5rem;
      width: 100%;
      margin-top: 1rem;
      ${expandFontToken(FONTS.HEADING_SMALL)};
    }

    h2 {
      box-sizing: border-box;
      margin: 0;
      ${expandFontToken(FONTS.HEADING_SMALL)};
      color: ${COLORS.GRAY.G2};
      margin-bottom: ${isTabsVisible ? '1.25rem' : `0`};
      border-bottom: ${isTabsVisible ? 'none' : `1px solid ${COLORS.GRAY.G6}`};
      padding-bottom: ${isTabsVisible ? '0' : `1rem`};
      padding-left: 1rem;
    }

    .tab-wrapper {
      display: block;
      overflow: auto;
    }

    ${Panel} {
      height: auto;
    }

    .tabs-container {
      background: ${COLORS.BRAND.WHITE};
      column-gap: 1.5rem;
      padding-left: 1rem;
      width: auto;
      display: ${isTabsVisible ? 'grid' : `none`};
    }

    .tab {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
      color: ${COLORS.GRAY.G3};
      padding-bottom: 0.5rem;
    }
    .active-tab {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      color: ${COLORS.GRAY.G2};
    }

    .close-icon {
      position: absolute;
      top: 1rem;
      right: 1.25rem;
      z-index: 99;
      padding: 0.25rem;
      height: 1rem !important;
      width: 1rem !important;
      background-color: #f0f0f0;
      border-radius: 6px;
    }
  }

  ${CoreDrawerText} {
    position: relative;
    max-height: calc(85vh);
  }

  ${Separator} {
    display: none;
  }
`;
