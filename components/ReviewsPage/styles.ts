import styled from 'styled-components';
import { SIZES } from 'const/ui-constants';

export const PageWrapper = styled.main`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;

  @media (max-width: 768px) {
    .title-row {
      padding: 0;
    }
  }
`;
