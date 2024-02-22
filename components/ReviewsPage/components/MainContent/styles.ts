import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-top: 3rem;
  display: flex;
  gap: 1.5rem;
  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 2rem;
    gap: 2rem;
  }
`;

export const Section = styled.section`
  flex: 2;
`;

export const Aside = styled.aside`
  flex: 1;
`;
