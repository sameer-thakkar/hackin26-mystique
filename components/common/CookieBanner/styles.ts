import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { CUSTOM_TYPES } from 'const/index';

export const StyledLink = styled.a`
  &#cookie-privacy-policy-link {
    text-decoration: underline;
    color: ${COLORS.GRAY.G2};
  }
`;

export const TextContainer = styled.div`
  ${getFontDetailsByLabel(FONTS.SUBHEADING_REGULAR)}
  color: ${COLORS.GRAY.G2};
  width: max-content;

  margin: 1rem 0;
  padding-right: 1rem;
  border-right: 1px solid ${COLORS.GRAY.G6};

  @media (max-width: 768px) {
    ${getFontDetailsByLabel(FONTS.SUBHEADING_XS)}

    margin: .5rem 0;
    padding-right: 0.75rem;
  }
`;

export const CloseButton = styled.button`
  padding: 1.125rem 1rem;
  background-color: ${COLORS.BRAND.WHITE};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;

  svg {
    fill: ${COLORS.GRAY.G2};
    width: 0.875rem;
    height: 0.875rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.625rem 0.5rem 0.75rem;
    svg {
      width: 0.7rem;
      height: 0.7rem;
    }
  }
`;

const hidden = css`
  touch-action: none;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
`;

const showPagePositioning = css`
  @media (max-width: 768px) {
    bottom: 6rem;
  }
`;

const contentPagePositioning = css`
  @media (max-width: 768px) {
    bottom: 4.5rem;
    left: 1rem;
    transform: none;
  }
`;

export const CookieContainer = styled.div<{
  $isHidden?: boolean;
  $pageType: string;
}>`
  position: fixed;
  background: ${COLORS.BRAND.WHITE};
  left: 1.875rem;
  bottom: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.GRAY.G6};
  z-index: 10;
  box-shadow: 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.12),
    0 -0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: row;
  align-items: center;

  transition: visibility 0.3s, opacity 0.3s;

  visibility: visible;
  opacity: 1;
  ${({ $isHidden }) => $isHidden && hidden}

  .cookie-icon {
    margin: 1rem 0.5rem 1rem 1rem;
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0.1),
      0 0 0.0625rem 0 rgba(0, 0, 0, 0.1);

    .cookie-icon {
      margin: 0.4rem;
    }
  }

  ${({ $pageType }) =>
    $pageType === CUSTOM_TYPES.CONTENT_PAGE && contentPagePositioning};

  ${({ $pageType }) =>
    $pageType === CUSTOM_TYPES.SHOW_PAGE && showPagePositioning};
`;
