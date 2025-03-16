import styled from 'styled-components';

export const VerticalProductCards = styled.div<{ $keepTitlePadding: boolean }>`
  .title-row {
    padding: ${(props) => (!props.$keepTitlePadding ? '0' : '0 1.5rem')};
  }
`;
