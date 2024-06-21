import styled from 'styled-components';

export const StyledItinerarySectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media only screen and (min-width: 768px) {
    max-width: calc(792px - 3rem);
  }
`;

export const SpaceBlock = styled.div<{
  $gap: string;
}>`
  height: ${({ $gap }) => $gap};
  width: 100%;
`;

export const Block = styled.div<{ $isVisible?: boolean; $hasTabs?: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  margin-top: ${({ $hasTabs }) => ($hasTabs ? 0.5 : 0)}rem;
`;
