import styled from 'styled-components';
import COLORS from 'const/colors';

export const SeatMapWrapper = styled.div`
  width: 100%;
  margin-bottom: 4.5rem;

  @media (max-width: 768px) {
    margin-bottom: 3.25rem;
  }
`;

export const SeatMapContainer = styled.div`
  max-width: 1200px;
  padding: 0 5.46vw;
  margin: auto;
  width: calc(100% -(5.46vw * 2));
  position: relative;

  @media (max-width: 768px) {
    & {
      padding: 0;
      margin: 0;
    }
  }
`;

export const SeatMapBody = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: flex-start;
  margin: 1rem 0;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  width: 100%;

  .react-transform-wrapper {
    width: 100% !important;
  }

  .react-transform-component {
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .seatmap-body-left {
    flex: 0.7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
    background: #f0f0f0;
    border-radius: 0.5rem 0 0 0.5rem;
    box-sizing: border-box;
    position: relative;

    svg {
      max-width: 44rem;
    }
  }

  .seatmap-body-right {
    flex: 0.3;
    width: 33%;
    height: 100%;
    background: ${COLORS.BRAND.WHITE};
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 1.5rem;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    & {
      flex-direction: column;
      border: 0;
      margin: 0;
    }

    .seatmap-body-left {
      width: 100%;
      flex: 1;
      padding: 1rem 0;
      border-radius: 0;
    }

    .seatmap-body-right {
      width: 100%;
      flex: 1;
      padding: 0 1.5rem;
      border-radius: 0;
    }
  }
`;
