import styled from 'styled-components';

export const Container = styled.div`
  max-width: 75rem;
  margin: auto;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const VariantCardSkeletonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
`;
