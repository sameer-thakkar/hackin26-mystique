import styled from 'styled-components';

export const StyledDeepNestedMenuItem = styled.div<{ $isSelected?: boolean }>`
  display: ${({ $isSelected }) => ($isSelected ? 'block' : 'none')};
`;
