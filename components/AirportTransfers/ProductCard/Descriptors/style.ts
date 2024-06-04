import styled from 'styled-components';
import { CancellationPolicyHoverCard } from 'components/Product/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledContainer = styled.div``;

export const MoreDetailsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.125rem;

  cursor: pointer;

  background: none;
  border: none;
  padding: 0;
  color: ${COLORS.BRAND.PURPS};

  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};

  svg {
    transform: translateY(1px);
    path {
      stroke: ${COLORS.BRAND.PURPS};
    }
  }

  @media (min-width: 769px) {
    width: 100%;
  }
`;

export const DescriptorsContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  row-gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;

  svg {
    width: auto;
    height: auto;
  }

  .descriptor {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    svg {
      display: block;
      width: 0.875rem;
      height: 0.875rem;
    }

    @media (min-width: 769px) {
      &.free-cancellation {
        text-decoration: underline;
        position: relative;
        cursor: pointer;

        &:hover {
          ${CancellationPolicyHoverCard} {
            visibility: visible;
            opacity: 1;
          }
        }
      }
    }
  }

  .descriptor-text {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G2};
  }

  @media (min-width: 769px) {
    margin-top: 0.5rem;
    margin-bottom: 0;

    row-gap: 0.5rem;

    .descriptor {
      &:last-of-type:after {
        display: none;
      }

      svg {
        transform: translateY(0.25px);
      }
    }

    .circular-separator:last-of-type {
      display: none;
    }
  }
`;

export const CircularSepartor = styled.div`
  width: 0.25rem;
  height: 0.25rem;
  margin-top: 0.15rem;
  border-radius: 50%;
  background-color: ${COLORS.GRAY.G5};
`;
