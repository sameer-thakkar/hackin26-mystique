import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ImageWrapper = styled.div<{ isModalOpen: boolean }>`
  width: 100%;
  max-width: 19.625rem;
  margin-right: 1.5rem;
  height: 27rem;
  position: relative;

  .listicle-card-image {
    border-radius: 12px;
    overflow: hidden;
  }

  .listicle-card-image > img {
    object-fit: cover;
  }

  .ribbon::before {
    content: '';
    position: absolute;
    left: -7px;
    top: -0.5px;
    border-left: 4px solid transparent;
    border-right: 4px solid #e5006e;
    border-top: 4px solid transparent;
    border-bottom: 4px solid #e5006e;
  }

  @media (max-width: 768px) {
    height: ${({ isModalOpen }) => (isModalOpen ? '14.625rem' : '13.375rem')};
    margin-right: 0;
    max-width: unset;
    border-bottom-right-radius: 16px;
    border-top-left-radius: 16px;

    .listicle-card-image {
      border-radius: 0;
      border-top-right-radius: 16px;
      border-top-left-radius: 16px;
      overflow: hidden;
    }
  }
`;

export const IndexWrapper = styled.div`
  position: absolute;
  inset: 0;
  height: 2.604rem;
  width: 2.5rem;
  border-bottom-right-radius: 16px;
  border-top-left-radius: 16px;
  background: linear-gradient(180deg, #ff5baa 0%, #ff017b 100%);
  display: flex;
  justify-content: center;
`;

export const IndexBox = styled.div`
  ${expandFontToken(FONTS.HEADING_SMALL)};
  color: ${COLORS.BRAND.WHITE};
  padding: 0.563rem 0;
`;

export const IndexRibbonWrapper = styled.div<{
  $index: number;
}>`
  position: absolute;
  top: -6px;
  right: 0;
  ${({ $index }) =>
    $index > 9 &&
    `svg {
  text {
  transform: translateX(-10px)
  }}`}
`;

export const SvgWrapper = styled.div`
  position: absolute;
  top: -18px;
  right: 48.1px;
`;
