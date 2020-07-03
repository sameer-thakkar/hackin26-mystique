import styled from 'styled-components';
import { SIZES } from 'constants/ui-constants';
export const StlyedSplit = styled.div`
  display: grid;
  max-width: ${SIZES.MAX_WIDTH};
  margin: 32px auto;
  padding: 0;
  ${({ colGap, rowGap, count, autoWidth, mobileLayout }) => `
    grid-template-columns: repeat(${count}, ${autoWidth ? 'auto' : '1fr'});
    grid-gap: ${rowGap} ${colGap};
    justify-content: left;

    @media(max-width: 768px) {
      ${
        mobileLayout === 'scroll'
          ? `
            overflow-x: scroll;
            grid-template-columns: repeat(${count}, calc(100% - 8px)) 8px;
            grid-gap: 8px;
            &:after{
              content: '';
              width: 8px;
            }
          `
          : 'grid-template-columns: auto;'
      }
    }
  `}
  @media(max-width: 768px) {
    padding: 0 16px;
  }
`;
const Split = ({
  count,
  rowGap = '24px',
  colGap = '24px',
  autoWidth = false,
  children,
  mobileLayout = '',
}) => {
  return (
    <StlyedSplit {...{ count, rowGap, colGap, autoWidth, mobileLayout }}>
      {children}
    </StlyedSplit>
  );
};

export default Split;
