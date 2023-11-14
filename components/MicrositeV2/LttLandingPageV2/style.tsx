import styled from 'styled-components';

export const LandingPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin: 0 auto;
  padding: 0;
  .hroizontally-aligned-child {
    width: calc(100% - (1.5rem * 2));
    max-width: 75rem;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 768px) {
    .hroizontally-aligned-child {
      width: 100%;
      max-width: 100vw;
      margin-left: auto;
      margin-right: auto;
    }
    width: 100vw;
    padding: 1.6875rem 0 0.75rem;
  }
`;
