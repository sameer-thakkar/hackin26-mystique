import styled from 'styled-components';
import { StyledTabsContainer } from 'UI/Tabs/styles';

export const StyledItinerarySectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${StyledTabsContainer} {
    margin-left: -1rem;
    padding-left: 1rem;

    .tab-list-container {
      margin-left: -1rem;
    }

    .swiper-slide:first-child {
      padding-left: 1rem;
    }
  }

  @media only screen and (min-width: 768px) {
    max-width: calc(792px - 3rem);

    ${StyledTabsContainer} {
      margin-left: unset;
      padding-left: unset;

      .tab-list-container {
        margin-left: unset;
      }

      .swiper-slide:first-child {
        padding-left: unset;
      }
    }
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
