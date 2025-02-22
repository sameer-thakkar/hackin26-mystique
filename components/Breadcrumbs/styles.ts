import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const BreadcrumbsContainer = styled.div<{
  $isV2MB: boolean;
  $isContentPage: boolean;
  $isShowPage: boolean;
  $isVenuePage: boolean;
  $isCategoryPage: boolean;
  $isCatOrSubCatPage: boolean;
  $isNewsPage: boolean;
  $isDropdownOpen: boolean;
  $isRevampedShoulderPage: boolean;
}>`
  ${({ $isRevampedShoulderPage }) =>
    !$isRevampedShoulderPage &&
    `width: calc(100% - (5.46vw * 2));
    max-width: ${SIZES.MAX_WIDTH};`}

  ${({
    $isV2MB,
    $isShowPage,
    $isVenuePage,
    $isCatOrSubCatPage,
    $isCategoryPage,
    $isNewsPage,
    $isRevampedShoulderPage,
    $isContentPage,
  }) => {
    const uniformStyleForKirby = 'display: flex; padding: 6.5px 0 3px';
    const uniformStyleForKirbyWithBottomMargin = `${uniformStyleForKirby}; margin:0 auto 3.5rem;`;

    switch (true) {
      case $isRevampedShoulderPage:
        return uniformStyleForKirby;
      case $isContentPage:
        return uniformStyleForKirbyWithBottomMargin;
      case $isV2MB:
        return `margin: 2.5rem auto 3.5rem; padding: 0 5.46vw`;
      case $isShowPage:
        return 'margin: 5rem 0 0';
      case $isCategoryPage:
        return 'margin: 0 0 0 0';
      case $isVenuePage:
        return 'margin: 1.5rem 0 0';
      case $isCatOrSubCatPage:
        return 'margin: 0';
      case $isNewsPage:
        return 'margin: 2.625rem 0 0.5rem 0';
      default:
        return uniformStyleForKirbyWithBottomMargin;
    }
  }};

  .ellipsis {
    color: ${({ $isDropdownOpen }) =>
      $isDropdownOpen ? COLORS.BRAND.PURPS : COLORS.GRAY.G3};
    cursor: pointer;
  }

  svg {
    margin: auto 0.5rem;
    width: 8px;
    height: 8px;
  }

  @media (max-width: 768px) {
    ${({
      $isShowPage,
      $isVenuePage,
      $isCatOrSubCatPage,
      $isCategoryPage,
      $isNewsPage,
      $isRevampedShoulderPage,
    }) =>
      !$isShowPage &&
      !$isCategoryPage &&
      !$isVenuePage &&
      !$isCatOrSubCatPage &&
      !$isNewsPage &&
      !$isRevampedShoulderPage &&
      `margin-bottom: 52px; padding: 6.5px 16px 0px`};

    ${({ $isContentPage }) => $isContentPage && `margin-left: 0;`};
    ${({ $isContentPage, $isRevampedShoulderPage }) => {
      if (!$isContentPage) {
        return '';
      }

      return !$isRevampedShoulderPage
        ? `margin-bottom: 52px; padding-top: 6.5px;`
        : `padding-bottom: 0;`;
    }};
    ${({ $isCategoryPage }) => $isCategoryPage && `padding: 0; margin:0;`};
    ${({ $isShowPage }) => $isShowPage && `margin: 4rem 0 0; width: 100%`};
    ${({ $isVenuePage }) => $isVenuePage && `margin: 0; width: 100%`};
    ${({ $isNewsPage }) => $isNewsPage && `padding: 0rem`};
  }
`;

const StyledBreadcrumbCommon = css<{
  $isCatOrSubCatPage: boolean;
  $isCategoryPage: boolean;
}>`
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  opacity: ${({ $isCategoryPage }) => ($isCategoryPage ? 0.5 : '')};
  color: ${({ $isCatOrSubCatPage, $isCategoryPage }) =>
    $isCatOrSubCatPage
      ? COLORS.TEXT.PURPS_3
      : $isCategoryPage
      ? `${COLORS.BRAND.WHITE}`
      : COLORS.GRAY.G3} !important;

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }
`;

export const StyledBreadcrumbLink = styled.a<{
  $isCrumbCollapsed?: boolean;
  $isCategoryPage: boolean;
  $isCatOrSubCatPage: boolean;
  $alignStyleWithKirby: boolean;
}>`
  ${({ $alignStyleWithKirby, $isCrumbCollapsed }) => {
    switch (true) {
      case $isCrumbCollapsed:
        return `display: none;`;
      case $alignStyleWithKirby:
        return `display: block`;
      default:
        return '';
    }
  }};

  ${StyledBreadcrumbCommon};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    opacity: 1;
    color: ${({ $isCategoryPage }) =>
      $isCategoryPage
        ? `${COLORS.BRAND.WHITE} !important`
        : `${COLORS.BRAND.PURPS} !important;`};
  }
`;

export const StyledBreadcrumbSpan = styled.span<{
  $isCatOrSubCatPage: boolean;
  $isCategoryPage: boolean;
}>`
  ${StyledBreadcrumbCommon};
`;
