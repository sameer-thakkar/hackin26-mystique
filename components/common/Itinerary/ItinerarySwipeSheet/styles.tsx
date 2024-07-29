import styled from 'styled-components';
import COLORS from 'const/colors';

export const StopsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 22rem;
`;

export const StopsContent = styled.div`
  display: flex;
  min-width: 100%;
  transition: transform 0.3s ease-in-out;
`;

export const PlaceholderCard = styled.div`
  min-width: 100%;
  background-color: ${COLORS.BRAND.WHITE};
`;

export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.25rem;
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px -2px 12px 0px #5454541a;
  transform: translate3d(0, 0, 0); // fix for Safari rendering bug

  button {
    &:hover {
      background-color: ${COLORS.PURPS.LEVEL_10};
    }
  }
`;

export const ItinerarySwipeSheetContainer = styled.div`
  z-index: 52;
  position: fixed;

  .sheet-container {
    border-radius: 1.25rem 1.25rem 0 0;
  }
  .grab-bar {
    background: transparent;
  }
`;

export const ItinerarySwipeSheetContentContainer = styled.div`
  max-height: 80vh;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 4.25rem;
  display: flex;
  flex-direction: column;

  @supports (max-height: 80dvh) {
    max-height: 80dvh;
  }
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StopTypeTagContainer = styled.div``;

export const SpaceBlock = styled.div<{
  $gap: string;
}>`
  height: ${({ $gap }) => $gap};
  width: 100%;
`;

export const CloseButtonContainer = styled.button`
  position: relative;
  top: 1rem;
  right: 1rem;
  margin: 0;
  border: none;
  outline: none;
  background: transparent;
  height: 1.25rem;
  width: 1.25rem;
  padding: unset;
  display: flex;
  align-items: center;
  justify-content: center;
`;
