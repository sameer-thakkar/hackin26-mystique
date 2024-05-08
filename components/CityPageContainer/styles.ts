import styled from 'styled-components';

export const Container = styled.div<{
  $addToken: boolean;
}>`
  margin-bottom: 1rem;
  ${({ $addToken }) =>
    $addToken
      ? `
      background: url('https://dakg4cmpuclai.cloudfront.net/3uih6znmagclpd8e9j5xnlh2t/ZHViYWktdGlja2V0cy5jbw%3D%3D/img.gif') !important;
      `
      : ``}
`;
