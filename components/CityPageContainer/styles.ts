import styled from 'styled-components';

export const Container = styled.div<{
  $addToken: boolean;
}>`
  margin-bottom: 1rem;
  ${({ $addToken }) =>
    $addToken
      ? `
        background: url('https://dakg4cmpuclai.cloudfront.net/zvthicnedswhkb9q4jux4k99t/aHR0cHM6Ly93d3cuZHViYWktdGlja2V0cy5jby8%3D/img.gif') !important;
  `
      : ``}
`;
