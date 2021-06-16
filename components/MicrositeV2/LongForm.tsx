import { COLORS, SOLEIL } from 'const/ui-constants';
import styled from 'styled-components';

import sliceHandler from '../Slices';
import { FULL_WIDTH_SLICES } from '../../constants';

const StyledLongform = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  line-height: 1.6;
  color: #545454;
  border-top: 1px solid ${COLORS.DADDY};
  padding-top: 64px;
  margin-top: 48px;
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 72px;
  margin-bottom: 112px;
  ${({ noBorder }) =>
    noBorder &&
    `border-top: unset;
    padding-top: 0;
    margin-top: 24px;`}

  ${({ isEntertainmentMb }) =>
    isEntertainmentMb &&
    `
    border-top: unset;
    margin-top: 0;
    `}

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #333;
    line-height: 1.4;
  }
  .slice-wrapper {
    ${({ isGlobalMb }) => isGlobalMb && `width: calc(100vw - (5.46vw * 2));`}
  }

  h2 {
    font-weight: 500;
    ${({ isGlobalMb }) =>
      isGlobalMb &&
      `color:${COLORS.FOUR_BLACK};
      font-weight: ${SOLEIL.SEMIBOLD};
      line-height: 28px`}
  }
  .rich_text h2 {
    ${({ isGlobalMb }) => isGlobalMb && `margin: 0 0 32px 0;`}
  }
  .card_section h2,
  .tab_wrapper h2 {
    ${({ isGlobalMb }) => isGlobalMb && `margin: 0 0 12px 0 !important;`}
  }
  p, li {
    font-size: 16px;
    ${({ isGlobalMb }) => isGlobalMb && `margin: 0;`}
    line-height: ${({ isGlobalMb }) => (isGlobalMb ? '24px' : 1.6)};
    color: ${COLORS.FOUR_BLACK};
  }
  li:not(:last-child) {
    ${({ isGlobalMb }) => isGlobalMb && `margin-bottom: 16px;`}
  }
  ul {
    ${({ isGlobalMb }) =>
      isGlobalMb &&
      `margin: 24px 0 0 0;
      @media (max-width: 768px) {
        padding-inline-start: 25px;
      }
    `}
  }
  .tab_wrapper ul, .tab_wrapper ol {
    margin: 0;
  }
  .tab_wrapper p {
    margin-bottom: 12px;
  }
  @media (max-width: 768px) {
    border: none;
    padding: 0;
    grid-row-gap: 52px;
    margin-top: 52px;
    margin-bottom: 52px;

    ${({ noBorder }) => noBorder && `margin-top: 32px;`}
  }
`;

const LongForm = (props) => {
  const { slicesArray, props: sliceProps, hasToursSection } = props;

  const { isGlobalMb, isEntertainmentMb } = sliceProps || {};

  // const isGlobalMb = sliceProps?.isGlobalMb ? sliceProps?.isGlobalMb : false;

  return (
    <StyledLongform
      noBorder={!hasToursSection}
      isGlobalMb={isGlobalMb}
      isEntertainmentMb={isEntertainmentMb}
    >
      {slicesArray.map((slice, index) => (
        <div
          key={index}
          className={`${
            !FULL_WIDTH_SLICES.includes(slice.slice_type) ? 'slice-wrapper' : ''
          } slice-block ${slice.slice_type}`}
        >
          {sliceHandler(slice, sliceProps)}
        </div>
      ))}
    </StyledLongform>
  );
};

export default LongForm;
