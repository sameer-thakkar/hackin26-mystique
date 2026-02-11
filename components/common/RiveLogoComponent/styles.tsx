import styled, { CSSProperties } from 'styled-components';

export const StyledRizLogoWrapper = styled.div`
  height: 2.5rem;
  width: 9.5rem;
  padding-left: 0.375rem;
  @media (max-width: 768px) {
    height: 1.625rem;
    width: 5.313rem;
    padding-left: 0px !important;
  }
`;

export const fallbackStyles: CSSProperties = {
  width: '9.5rem',
};
