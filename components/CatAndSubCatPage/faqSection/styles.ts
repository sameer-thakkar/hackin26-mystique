import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const FaqContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: unset;
    gap: 1rem;
  }
`;

export const SectionHeading = styled.div`
  width: 14.75rem;
  height: max-content;
  border-left: 0.25rem solid ${COLORS.GRAY.G2};

  h2 {
    margin-left: 1rem;
    ${expandFontToken(FONTS.DISPLAY_SMALL)}
    color: ${COLORS.GRAY.G2};
  }

  @media (max-width: 768px) {
    width: 50%;
    border-left: 0.125rem solid ${COLORS.GRAY.G2};

    h2 {
      margin-left: 0.5rem;
      ${expandFontToken(FONTS.HEADING_SMALL)}
    }
    
  }
`;

export const AccordianContainer = styled.div`
  width: 43.125rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: auto;
  }
`;
