import sliceHandler from '../Slices';
import { COLORS, SOLEIL } from '../../constants/ui-constants';
import { FULL_WIDTH_SLICES } from '../../constants';
import styled from 'styled-components';

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
    `
  border-top: unset;
  padding-top: 0;
  margin-top: 24px;
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
    width: calc(100% - (5.46vw * 2));
  }

  h2 {
    font-weight: 500;
  }
  p {
    font-size: 16px;
    line-height: 1.6;
    color: ${COLORS.FOUR_BLACK};
  }
  @media (max-width: 768px) {
    border: none;
    padding: 0;
    grid-row-gap: 52px;
    margin-top: 52px;
    margin-bottom: 52px;

    ${({ noBorder }) =>
      noBorder &&
      `
    margin-top: 32px;
  `}
  }
`;
const LongForm = (props) => {
  const { slicesArray, props: sliceProps, hasToursSection } = props;

  return (
    <StyledLongform noBorder={!hasToursSection}>
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
