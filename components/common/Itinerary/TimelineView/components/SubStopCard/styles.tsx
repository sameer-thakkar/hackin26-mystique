import styled, { css } from 'styled-components';
import { DescriptorContainer } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/styles';
import { StyledNavigationArrowsContainer } from 'components/common/NavigationButtons/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledSubStopCardContainer = styled.div<{
  $hasMediaImages?: boolean;
}>`
  --text-color: ${({ $hasMediaImages }) =>
    $hasMediaImages ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};

  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${COLORS.GRAY.G6};
  background-color: ${COLORS.BRAND.WHITE};
  position: relative;
  height: ${({ $hasMediaImages }) => ($hasMediaImages ? '9.25rem' : '100%')};

  .content-container {
    display: flex;
    flex-direction: column;
    z-index: 2;
    padding: ${({ $hasMediaImages }) =>
      $hasMediaImages ? '0.5rem' : '0.75rem'};
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .card-heading {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    color: var(--text-color);
    margin: 0 0 0.25rem;
  }

  .image-carousel {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 9.25rem;
  }

  .swiper-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: auto;
    z-index: 3;

    ${StyledNavigationArrowsContainer} {
      margin-left: 0;
    }
  }

  ${({ $hasMediaImages }) =>
    $hasMediaImages &&
    css`
      ${DescriptorContainer} {
        svg {
          path {
            stroke: var(--text-color);
          }
        }

        .descriptor-text {
          color: var(--text-color);
        }
      }
    `}
`;

export const SpaceBlock = styled.div<{ $gap?: string }>`
  width: 100%;
  height: ${({ $gap }) => $gap};
`;

export const StyledSubStopMediaCardContainer = styled.div`
  height: 9.25rem;
  width: 100%;
  border-radius: 8px;
  position: relative;
  overflow: hidden;

  .image-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  img {
    height: 100%;
    width: 100%;
  }

  .gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #0d001a 0%, rgba(13, 0, 26, 0) 100%);
  }
`;

export const StyledSubStopNavigationArrowsContainer = styled.div`
  display: flex;
  gap: 0.375rem;
`;

export const StyledSubStopArrowButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border: none;
  outline: none;
  margin: 0;
  border-radius: 50%;

  svg {
    height: 1rem;
    width: 1rem;
  }

  &:disabled {
    opacity: 0.5;
  }
`;
