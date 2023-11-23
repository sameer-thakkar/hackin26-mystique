import styled from 'styled-components';
import COLORS from 'const/colors';

export const CoreModalContainer = styled.div<{
  animateOpening?: boolean;
  animateClosing?: boolean;
  close?: boolean;
}>`
  position: fixed;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  z-index: 999;
  transition: all 0.2s ease 0s;
  background: rgba(0, 0, 0, 0.5);
  align-items: flex-start;
`;

export const CoreModalContent = styled.div`
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: auto;
  min-height: auto;
  box-shadow: none;
  background: none;
  margin: 10vh auto auto;

  @media (max-width: 768px) {
    background: ${COLORS.BRAND.WHITE};
    border-radius: 20px 20px 0px 0px;
    padding: 0;
    box-shadow: 0px -2px 12px rgba(84, 84, 84, 0.1);
    display: grid;
    animation: enter 0.4s ease;
    transform: translateY(0);
    transition: transform 0.3s ease;
    height: 80%;
    width: 100%;
    bottom: 0;
    position: absolute;

    @keyframes enter {
      from {
        transform: translateY(72vh);
      }

      to {
        transform: translateY(0);
      }
    }
  }
`;
