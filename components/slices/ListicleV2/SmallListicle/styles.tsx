import styled from 'styled-components';

export const SmallListicleWrapper = styled.div`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(3, 370px);
  align-items: start;

  @media (max-width: 680px) {
    grid-template-columns: repeat(auto-fill, 350px);
    grid-template-rows: repeat(auto-fill, auto);
    grid-row-gap: 1rem;
  }

  @media (min-width: 680px) and (max-width: 1150px) {
    grid-template-columns: repeat(2, 370px);
    grid-template-rows: repeat(auto-fill, auto);
    grid-row-gap: 1rem;
  }
`;
