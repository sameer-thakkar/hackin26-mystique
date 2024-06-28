import styled from 'styled-components';
import COLORS from 'const/colors';

export const StyledItineraryDescriptorCard = styled.div`
  display: flex;
  width: fit-content;
  margin-right: 1.5rem;

  @media only screen and (min-width: 768px), print {
    width: 10.875rem;
    margin-right: 1rem;
  }
`;

export const StyledItineraryDescriptorsCarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;

  .swiper-wrapper {
    max-width: calc(100vw - 2rem);
    padding-bottom: 1px;
  }

  .itinerary-descriptors-no-carousel-container {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));

    &.space-between {
      justify-content: space-between;
    }
  }

  .descriptors-carousel-controls {
    position: absolute;
    top: 40%;
    transform: translateY(-40%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${COLORS.BRAND.WHITE};
    border-radius: 50%;
    height: 1.5rem;
    width: 1.5rem;
    border: none;
    outline: none;
    cursor: pointer;
    filter: drop-shadow(0px 1.333px 5.333px rgba(0, 0, 0, 0.1))
      drop-shadow(0px 0px 0.667px rgba(0, 0, 0, 0.1));

    svg {
      height: 0.6875rem;
      width: 0.6875rem;
    }

    &.prev {
      left: -12px;
    }

    &.next {
      right: -12px;
    }
  }

  @media only screen and (min-width: 768px), print {
    .swiper-wrapper {
      max-width: calc(792px - 3rem);
    }

    .itinerary-descriptors-no-carousel-container {
      ${StyledItineraryDescriptorCard} {
        width: fit-content;
      }
    }
  }
`;
