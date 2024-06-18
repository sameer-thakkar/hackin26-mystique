import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const NumberedImageContainer = styled.div`
  position: relative;
  height: 1.25rem;
  border-radius: 4px;
  overflow: hidden;
  min-width: 2rem;
  width: 2rem;

  .image-wrap {
    height: 1.25rem;
    min-width: 2rem;
    width: 2rem;

    img {
      min-width: 2rem;
      width: 2rem;
      border-radius: 2px;
    }
  }

  p {
    position: absolute;
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    color: ${COLORS.BRAND.WHITE};
    text-align: center;
    text-anchor: middle;

    height: 1.25rem;
    width: 0.9375rem;
    top: 0;
    right: 0;
    background: #03829db2;
  }

  &::after {
    content: '';
    background: #03829db2;
    position: absolute;
    height: 100%;
    width: 0.6875rem;
    right: 0.9375rem;
    top: 0;
    clip-path: polygon(100% 0, 45% 100%, 100% 100%);
  }
`;

export const SinglePointHeadingSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.375rem;
  height: 1.25rem;
  overflow: hidden;

  .single-point-heading {
    flex-shrink: 1;
    ${expandFontToken(FONTS.HEADING_XS)}
    color: ${COLORS.GRAY.G2};
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const SinglePointContainer = styled.button<{
  $showMoreSection?: boolean;
  $hasImage?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.375rem;
  background-color: ${COLORS.GRAY.G8};
  border: none;
  padding: ${({ $hasImage }) => ($hasImage ? 0.375 : 0.75)}rem;
  border-radius: 6px;
  cursor: pointer;

  ${({ $showMoreSection }) =>
    $showMoreSection &&
    css`
      justify-content: center;
      align-items: center;
    `}

  .show-more-count {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    color: ${COLORS.GRAY.G2};
  }
`;

export const Container = styled.div<{ $showMorePoints?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 0.25rem;

  ${({ $showMorePoints }) =>
    $showMorePoints &&
    css`
      grid-template-columns: repeat(3, 1fr) 4rem;
    `}
`;
