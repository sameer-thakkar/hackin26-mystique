import styled from 'styled-components';

export const PageContainer = styled.main`
  width: 88.56vw;
  margin: 0 auto;
  max-width: 1200px;

  .slice-wrapper {
    padding: 0.5rem 0;
    margin: 0;
  }

  @media (max-width: 768px) {
    width: calc(100vw - 32px);
  }
`;

export const LongFormProductCardWrapper = styled.div`
  margin-bottom: 56px;

  @media (max-width: 768px) {
    margin-bottom: 52px;
  }
`;
