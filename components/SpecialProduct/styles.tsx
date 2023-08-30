import styled, { keyframes } from 'styled-components';

const openingAnimationDesktop = keyframes`
  from {
    margin: 0;
    padding: 0;
  }
  to {
    margin: 0 -0.75rem;
    padding-top: 3.625rem;
    padding-bottom: 0.75rem;
  }
`;

const openingAnimationMobile = keyframes`
  from {
    margin: 0 1.5rem;
  }
  to {
    margin: 0 0.75rem;
    padding: 6.875rem 0.75rem 0.75rem;
  }
`;

const shineDesktop = keyframes`
  100% {
    left: 110%;
  }
`;

const shineMobile = keyframes`
  100% {
    left: 130%;
  }
`;

export const SpecialProductWrapper = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #ecbf7e 0%,
    #e1b26e 26.56%,
    #e3bc83 61.98%,
    #f3dfc3 100%
  );
  animation: ${openingAnimationDesktop} 400ms cubic-bezier(0.7, 0, 0.3, 1) 1.4s
    forwards;
  &::after {
    animation: ${shineDesktop} 1200ms cubic-bezier(0.7, 0, 0.3, 1) 1805ms;
    animation-fill-mode: forwards;
    content: '';
    position: absolute;
    top: -30%;
    left: -25.5%;
    width: 15rem;
    background-blend-mode: soft-light;
    height: 150%;
    transform: rotate(18deg);
    background: #fff;
    z-index: 20;
    opacity: 0.5;
    filter: blur(30px);
    background: linear-gradient(
      139deg,
      rgba(255, 255, 255, 0) 0%,
      #fff 50%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  @media (max-width: 768px) {
    animation: ${openingAnimationMobile} 400ms cubic-bezier(0.7, 0, 0.3, 1) 2s
      forwards;
    margin: 0 1.5rem;
    &::after {
      left: -80%;
      width: 11.1875rem;
      animation: ${shineMobile} 1200ms cubic-bezier(0.7, 0, 0.3, 1) 2405ms;
    }
    .product-card {
      border: none;
      margin: 0 auto;
      .card-img {
        z-index: 10;
      }
    }
  }
`;
