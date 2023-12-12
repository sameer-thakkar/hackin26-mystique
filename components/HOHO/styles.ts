import styled from 'styled-components';

export const Container = styled.div`
  max-width: 75rem;
  margin: auto;
  margin-bottom: 3rem;

  .swiper {
    margin: -0.5rem;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;

    .swiper {
      margin: 0;
      padding: 0.5rem 1.75rem;
    }

    .swiper-slide {
      width: 16.875rem;
    }
  }
`;

export const VariantCardSkeletonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
`;
