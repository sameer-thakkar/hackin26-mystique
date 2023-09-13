import styled, { css } from 'styled-components';

export const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
  isolation: isolate;

  img,
  video {
    display: flex;
  }

  .swiper,
  .swiper-initialized {
    height: 100%;
  }

  /* pagination styles */
  .swiper-pagination {
    bottom: 0.5rem;
    display: flex;
    justify-content: center;
    grid-gap: 0.25rem;
    width: 100%;

    .swiper-pagination-bullet {
      margin: 0;
      opacity: 0.6;
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      cursor: pointer;
      z-index: 2;

      &.swiper-pagination-bullet-active {
        opacity: 1;
      }
    }
  }

  &:hover {
    .navigation-button {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    border-radius: 0.75rem 0.75rem 0 0;
  }
`;

const NavigationContainerStyles = css`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  height: 100%;
  width: 18%;
  display: flex;
  align-items: center;
  cursor: pointer;

  .navigation-button {
    border: 0;
    padding: 0.7rem 0 0 0.3rem;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    background: none;
    cursor: pointer;
    width: 1.25rem;
    height: fit-content;
    filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.1))
      drop-shadow(0px 4px 22px rgba(0, 0, 0, 0.2));

    svg {
      height: 2.25rem;
      width: 2.25rem;
    }
  }
`;

export const PrevButtonContainer = styled.div`
  left: 0;
  ${NavigationContainerStyles}
`;

export const NextButtonContainer = styled.div`
  right: 0;
  transform: rotateY(180deg);
  ${NavigationContainerStyles}
`;
