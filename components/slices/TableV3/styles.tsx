import styled from 'styled-components';
import { getMaxWidth } from 'components/slices/TableV3/index';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { BACKGROUND_COLOR_MAPPING } from 'const/index';
import { expandFontToken } from 'const/typography';

export const StyledTableWrapper = styled.div`
  overflow-x: auto;
`;

export const StyledTable = styled.div<{ columns: number }>`
  display: grid;
  border-top: 1px solid ${COLORS.GRAY.G6};

  .table-heading {
    background: ${COLORS.GRAY.G8};
  }

  .table-heading-data {
    font-family: halyard-display;
    ${expandFontToken(FONTS.MISC_BOOSTER)};
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  min-width: max-content;
  grid-auto-flow: row;
  grid-auto-rows: auto;
  max-width: ${({ columns }) => `${getMaxWidth(columns).desktop}%`};

  @media (max-width: 768px) {
    max-width: ${({ columns }) => `${getMaxWidth(columns).mweb}%`};
  }
`;

export const TextOnlyWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const TextWrapper = styled.div`
  &,
  & > p {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.TABLE_REGULAR)};
  }
`;

export const NumericImageText = styled.div`
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.TABLE_REGULAR)};
  flex: 1 0 0;
  font-family: halyard-text;
`;

export const NumericText = styled.div`
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.TABLE_REGULAR)};
  flex: 1 0 0;
  font-family: halyard-text;
`;

export const TextBoldWrapper = styled.div`
  &,
  & > p {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.TABLE_REGULAR_HEAVY)};
    display: flex;
    align-items: center;
  }
`;

export const LinkSvgIconWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.125rem;

  a {
    color: ${COLORS.TEXT.LINK_BLUE_1};
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    text-decoration-line: underline;
    font-family: halyard-text;
  }
`;

export const ScratchPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ScratchPrice = styled.div`
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.UI_LABEL_XS)};
  text-decoration-line: line-through;
  font-family: halyard-text;
`;

export const FinalPrice = styled.div`
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.TABLE_SMALL_HEAVY)};
  font-family: halyard-text;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
`;

export const FinalPriceBoosterWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

export const DiscountTextWrapper = styled.div`
  color: ${COLORS.TEXT.OKAY_GREEN_3};
  border-radius: 4px;
  margin-top: 0.5px;
  ${expandFontToken(FONTS.MISC_BOOSTER)};
  font-weight: 400;
  padding: 0.063rem 0.25rem 0.125rem;
  font-family: halyard-text;
  font-size: 12px;
  background: ${COLORS.BACKGROUND.SOOTHING_GREEN};
`;

export const BulletPointTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const BoosterTextColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const BoosterBackgroundWrapper = styled.div<{ background: string }>`
  background: ${({ background }) => background};
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
  ${expandFontToken(FONTS.MISC_BOOSTER)};
  text-transform: uppercase;
  color: ${({ background }) =>
    // @ts-expect-error TS(2339)
    BACKGROUND_COLOR_MAPPING[background]};
`;

export const BoosterTextWrapper = styled.div`
  ${expandFontToken(FONTS.TABLE_REGULAR)};
  color: ${COLORS.GRAY.G3};
  font-family: halyard-text;
  height: 1.25rem;
`;

export const SubTextWrapper = styled.div`
  &,
  & > p {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.TABLE_SMALL)};
  }
`;

export const NumericWrapper = styled.div`
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.TABLE_REGULAR)};
  font-family: halyard-text;
`;

export const NumericSubNumericWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: halyard-text;
`;

export const SubNumericWrapper = styled.div`
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.TABLE_SMALL)};
`;

export const ImageWrapper = styled.div`
  height: 18px;
  width: 18px;
  img {
    border-radius: 50%;
  }
`;

export const NumericImageTextWrapper = styled.div`
  gap: 0.125rem 0.5rem;
  display: flex;
  align-items: flex-start;
`;

export const ImageTextWrapper = styled.div`
  word-break: break-word;
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.TABLE_REGULAR)};
  font-family: halyard-text;
  flex: 1 0 0;
`;

export const ImageTextColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ImageTextSubTextColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ImageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const NumericTextWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const NumericColumnWrapper = styled.div`
  ${expandFontToken(FONTS.TABLE_REGULAR)};
  color: ${COLORS.GRAY.G3};
`;

export const ImageSubTextContentWrapper = styled.div`
  ${expandFontToken(FONTS.TABLE_SMALL)};
  font-family: halyard-text;
  color: ${COLORS.GRAY.G3};
`;

export const ImageTextContentWrapper = styled.div`
  ${expandFontToken(FONTS.TABLE_REGULAR)};
  font-family: halyard-text;
  color: ${COLORS.GRAY.G3};
`;

export const StyledRow = styled.div<{
  cols: number;
  displaySerialNum: boolean;
}>`
  background: ${COLORS.BRAND.WHITE};
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  grid-auto-rows: 1fr;
  border-bottom: 1px solid ${COLORS.GRAY.G6};
  grid-template-columns: ${({ cols, displaySerialNum }) =>
    Array.from({ length: cols })
      .map((_, index) => {
        if (index === 0 && displaySerialNum) {
          return 'auto';
        } else return 'minmax(120px,240px)';
      })
      .join(' ')};
`;

export const StyledColumn = styled.div<{ isSerialNum: boolean; width: number }>`
  display: grid;
  word-break: break-word;
  padding: 0.875rem 0.5rem;
  ${({ width }) => width && `width: ${width}px`};
  color: ${({ isSerialNum }) => isSerialNum && COLORS.GRAY.G3};
  ${expandFontToken(FONTS.TABLE_REGULAR)};
  height: fit-content;
  align-items: center;
  min-width: 48px;
  max-width: 212px;
`;
