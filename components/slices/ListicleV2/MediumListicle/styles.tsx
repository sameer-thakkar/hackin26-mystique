import styled from 'styled-components';

export const MediumListicleWrapper = styled.div`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(4, 284.25px);
  border-radius: 8px;
  grid-template-rows: repeat(auto-fill, auto);

  @media (max-width: 680px) {
    grid-template-columns: repeat(1, 343px);
    grid-template-rows: repeat(auto-fill, auto);
    grid-row-gap: 1rem;
  }

  @media (min-width: 680px) and (max-width: 1150px) {
    grid-template-columns: repeat(2, 343px);
    grid-template-rows: repeat(auto-fill, auto);
    grid-row-gap: 1rem;
  }
`;
