import styled, { css } from 'styled-components';
import COLORS from 'const/colors';

export const FilterButton = styled.div<{ isSelected: boolean }>`
  background: ${({ isSelected }) =>
    isSelected ? COLORS.GRAY.G7 : COLORS.BRAND.WHITE};
  border: 1px solid
    ${({ isSelected }) => (isSelected ? COLORS.GRAY.G2 : COLORS.GRAY.G6)};
  border-radius: 1.5rem;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.7rem;
  height: 1.5rem;
  flex: 0 0 auto;
`;

export const FiltersContainer = styled.div`
  display: flex;
  margin: 0 1.5rem;
  font-size: 14px;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const FiltersWrapper = styled.div`
  padding-top: 0.7rem;
  background: white;
  position: sticky;
  top: 0px;
  z-index: 10;
  &.sticky {
    box-shadow: 0px 4px 8px 0px #0000001f;
  }
`;

export const Footer = styled.div`
  padding: 1rem 1.5rem;
  box-shadow: 0px -2px 12px rgba(84, 84, 84, 0.1);
`;

export const drawerStyles = css`
  .no-availability__drawer {
    height: auto;
    & > div:first-child {
      margin-left: 1.25rem;
      margin-right: 1.25rem;
    }
  }
  .close-icon {
    display: none;
  }
`;

export const DrawerBody = styled.div`
  margin: 1.25rem;
  margin-top: 0;
  margin-bottom: 2.5rem;
  font-size: 15px;
  font-weight: 300;
`;

export const SkeletonWrapper = styled.div`
  margin: 1rem 1.5rem;
  display: flex;
`;
