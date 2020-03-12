import sliceHandler from '../Slices';
import { COLORS } from '../../constants/ui-constants';

const LongForm = props => {
  const { slicesArray, props: sliceProps, hasToursSection } = props;
  return (
    <div className={`long-form-wrap ${!hasToursSection ? 'no-border' : ''}`}>
      {slicesArray.map((slice, index) => (
        <div
          key={index}
          className={`${
            slice.slice_type !== 'background' ? 'main-wrapper' : ''
          } slice-block ${slice.slice_type}`}
        >
          {sliceHandler(slice, sliceProps)}
        </div>
      ))}
      <style global jsx>{`
        .long-form-wrap {
          font-family: 'Graphik', 'Proxima Nova', 'Helvetica Neue', Helvetica,
            Arial, sans-serif;
          line-height: 1.6;
          color: #545454;
          border-top: 1px solid ${COLORS.DADDY};
          padding-top: 64px;
          margin-top: 48px;
          display: grid;
          grid-auto-flow: row;
          grid-row-gap: 64px;
          margin-bottom: 112px;
        }
        .long-form-wrap.no-border {
          border-top: unset;
          padding-top: 0;
          margin-top: 24px;
        }
        .long-form-wrap h1,
        .long-form-wrap h2,
        .long-form-wrap h3,
        .long-form-wrap h4,
        .long-form-wrap h5,
        .long-form-wrap h6 {
          color: #333;
          line-height: 1.2;
          margin: 0 0 0.75em;
        }

        .long-form-wrap h2 {
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .long-form-wrap.no-border {
            margin-top: 32px;
          }
          .long-form-wrap {
            border: none;
            padding: 0;
            grid-row-gap: 48px;
            margin-top: 56px;
            margin-bottom: 56px;
          }
        }
      `}</style>
    </div>
  );
};

export default LongForm;
