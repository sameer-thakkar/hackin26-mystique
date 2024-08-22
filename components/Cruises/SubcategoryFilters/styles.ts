import styled from 'styled-components';
import COLORS from 'const/colors';
import { SIZES } from 'const/ui-constants';

export const PillsSection = styled.div<{}>`
  background: ${COLORS.BRAND.WHITE};
  padding: 1.5rem 0 0;

  @media (max-width: 768px) {
    padding: 1.25rem 0 1rem 0;
  }
`;

export const PillsContainer = styled.div`
  width: 100%;
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
  position: relative;

  button {
    padding: 0;
    background: none;
    border: none;
  }
  .swiper-slide {
    width: fit-content;
  }

  @media (max-width: 768px) {
    max-width: unset;
    margin: unset;
  }
`;
