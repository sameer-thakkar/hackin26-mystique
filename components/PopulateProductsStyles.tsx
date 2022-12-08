import styled from 'styled-components';
import HorizontalLine from 'components/slices/HorizontalLine';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';

export const ProductWrapper = styled.div``;

export const StyledProductsWrapper = styled.div`
  margin: 0 auto;
  #tour-list-heading {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    @media (max-width: 768px) {
      margin: 0 1rem;
      width: auto;
    }
  }
`;

export const ProductContainer = styled.div`
  display: grid;
  grid-row-gap: ${({ theme }) => theme.productCards.gap.desktop};
  margin-top: 1.5rem;
  margin-bottom: 2.25rem;
  & > ${HorizontalLine} {
    border-bottom-style: dashed;
  }
  & > ${HorizontalLine}:last-child {
    display: none;
  }

  @media (max-width: 768px) {
    margin-bottom: 60px;
    grid-row-gap: ${({ theme }) => theme.productCards.gap.mobile};
  }
`;

export const StyledTourListHeading = styled.div`
${expandFontToken('Display/Small')}
color: ${COLORS.GRAY.G2};
@media (max-width: 768px) {
  ${expandFontToken('Heading/Regular')}
}
`;

export const StyledTourListSubHeading = styled.div`
  margin-top: 0.5rem;
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
  color: ${COLORS.GRAY.G2};

  @media (max-width: 768px) {
    margin-top: 0.25rem;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
  }
`;
