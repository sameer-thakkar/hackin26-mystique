import { useMemo } from 'react';
import styled from 'styled-components';
import { SliceZone } from '@prismicio/react';
import { sliceComponents } from 'components/slices/sliceManager';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';

const StyledLongform = styled.div<{
  noBorder: boolean;
  isEntertainmentMb?: boolean;
  isGlobalMb: boolean;
}>`
  color: ${COLORS.GRAY.G2};
  border-top: 1px solid ${COLORS.GRAY.G6};
  padding-top: 64px;
  margin-top: 48px;
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 72px;
  margin-bottom: 72px;
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
    color: ${COLORS.GRAY.G2};
    line-height: 1.4;
  }
  .slice-wrapper {
    ${({ isGlobalMb }) => isGlobalMb && `width: calc(100vw - (5.46vw * 2));`}
  }

  .rich_text h1 {
    ${expandFontToken('Display/Small')}
  }

  h2 {
    ${expandFontToken('Heading/Large')}
  }
  .rich_text h2 {
    ${({ isGlobalMb }) => isGlobalMb && `margin: 0 0 32px 0;`}
  }
  .card_section h2,
  .tab_wrapper h2 {
    ${({ isGlobalMb }) => isGlobalMb && `margin: 0 0 12px 0 !important;`}
  }
  p,
  li {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Paragraph/Large')}
    ${({ isGlobalMb }) => isGlobalMb && `margin: 0;`}
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
  .tab_wrapper ul,
  .tab_wrapper ol {
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

    .rich_text h1 {
      ${expandFontToken('Heading/Regular')}
    }
    h2 {
      ${expandFontToken('Heading/Regular')}
    }
    h3 {
      ${expandFontToken('Heading/Small')}
    }
    p,
    ul,
    ol {
      ${expandFontToken('Paragraph/Medium')}
    }
  }
`;

const LongForm = (props: any) => {
  const {
    slicesArray,
    props: sliceProps,
    hasToursSection,
    showSeatMapExperiment,
    addVenueSeatsPageSectionViewedDataEvents,
    isSeatMapExpControlAndEligible,
  } = props;

  const { isGlobalMb, isEntertainmentMb } = sliceProps || {};

  const components = useMemo(() => {
    return sliceComponents();
  }, []);

  return (
    <StyledLongform
      noBorder={!hasToursSection}
      isGlobalMb={isGlobalMb}
      isEntertainmentMb={isEntertainmentMb}
    >
      <SliceZone
        slices={slicesArray}
        components={components}
        context={{
          ...sliceProps,
          showSeatMapExperiment,
          addVenueSeatsPageSectionViewedDataEvents,
          isSeatMapExpControlAndEligible,
        }}
        defaultComponent={() => null}
      />
    </StyledLongform>
  );
};

export default LongForm;
