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
  $isCatOrSubCatPage: boolean;
  $isNewsPage: boolean;
  $isDropdownOpen: boolean;
}>`
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};

  ${({
    $isV2MB,
    $isShowPage,
    $isVenuePage,
    $isCatOrSubCatPage,
    $isNewsPage,
  }) => {
    switch (true) {
      case $isV2MB:
        return `margin: 2.5rem auto 3.5rem; padding: 0 5.46vw`;
      case $isShowPage:
        return 'margin: 5rem 0 0';
      case $isVenuePage:
        return 'margin: 1.5rem 0 0';
      case $isCatOrSubCatPage:
        return 'margin: 0';
      case $isNewsPage:
        return 'margin:2.625rem 0 0.5rem 0';
      default:
        return 'margin: 0 auto 3.5rem; padding: 0 5.46vw';
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
    ${({ $isShowPage, $isVenuePage, $isCatOrSubCatPage, $isNewsPage }) =>
      !$isShowPage &&
      !$isVenuePage &&
      !$isCatOrSubCatPage &&
      !$isNewsPage &&
      `margin-bottom: 3.25rem; padding: 0 1rem`};

    ${({ $isContentPage }) => $isContentPage && `margin-left: 0;`};
    ${({ $isShowPage }) => $isShowPage && `margin: 4rem 0 0; width: 100%`};
    ${({ $isVenuePage }) => $isVenuePage && `margin: 0; width: 100%`};
    ${({ $isNewsPage }) => $isNewsPage && `padding: 0rem`};
  }
`;

const StyledBreadcrumbCommon = css<{ $isCatOrSubCatPage: boolean }>`
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  color: ${({ $isCatOrSubCatPage }) =>
    $isCatOrSubCatPage ? COLORS.TEXT.PURPS_3 : COLORS.GRAY.G3} !important;

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }
`;

export const StyledBreadcrumbLink = styled.a<{
  $isCrumbCollapsed?: boolean;
  $isCatOrSubCatPage: boolean;
}>`
  ${({ $isCrumbCollapsed }) => $isCrumbCollapsed && `display: none;`};

  ${StyledBreadcrumbCommon};
  text-decoration: underline;
  cursor: pointer;

  :hover {
    color: ${COLORS.BRAND.PURPS} !important;
  }
`;

export const StyledBreadcrumbSpan = styled.span<{
  $isCatOrSubCatPage: boolean;
}>`
  ${StyledBreadcrumbCommon};
`;
