import styled from 'styled-components';
import { SIZES } from 'const/ui-constants';

export const StlyedSplit = styled.div`
  display: grid;
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0.5rem auto;
  padding: 0;
  ${({
    // @ts-expect-error TS(2339): Property 'colGap' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    colGap,
    // @ts-expect-error TS(2339): Property 'rowGap' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    rowGap,
    // @ts-expect-error TS(2339): Property 'count' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    count,
    // @ts-expect-error TS(2339): Property 'autoWidth' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    autoWidth,
    // @ts-expect-error TS(2339): Property 'mobileLayout' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    mobileLayout,
  }) => `
    grid-template-columns: repeat(${count}, ${autoWidth ? 'auto' : '1fr'});
    grid-gap: ${rowGap} ${colGap};
    justify-content: left;

    @media(max-width: 768px) {
      ${
        mobileLayout === 'scroll'
          ? `
            overflow-x: scroll;
            grid-template-columns: repeat(${count}, calc(100% - ${
              count > 1 ? '8px' : '0px'
            })) ${count > 1 ? '8px' : ''};
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
}: any) => {
  return (
    <StlyedSplit {...{ count, rowGap, colGap, autoWidth, mobileLayout }}>
      {children}
    </StlyedSplit>
  );
};

export default Split;
