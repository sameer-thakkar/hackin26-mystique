import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { GREEN_TICK, RED_CROSS } from 'const/index';
import { expandFontToken } from 'const/typography';

export const InclusionExclusionWrapper = styled.div`
  && {
    ul > li {
      padding-left: 0.75rem;
    }
    ul > li::before {
      position: absolute;
      left: -1.125rem;
    }

    .inclusion {
      ul > li::before {
        content: url('${GREEN_TICK}');
      }
    }
    .exclusion {
      ul > li::before {
        content: url('${RED_CROSS}');
      }
    }
    @media (max-width: 768px) {
      border: none;
      ul > li {
        margin-top: 0.375rem;
      }
      ul > li::before {
        transform: unset;
        background: none;
        left: -1.25rem;
      }
      .exclusion > ul {
        margin-top: 0.375rem;
      }
    }
  }
`;

export const MenuList = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: flex-start;
  gap: 1rem;
  .description {
    width: 10.875rem;
    overflow-wrap: break-word;
  }
  p.title {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    margin: 0.375rem 0 0.125rem;
  }
  p.subtext {
    margin: 0;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }
  @media (max-width: 768px) {
    .description {
      width: 7.5rem;
    }
  }
`;

export const Card = styled.div`
  border: 1px solid ${COLORS.GRAY.G6};
  background: ${COLORS.BRAND.WHITE};
  border-radius: 8px;
  height: 13.063rem;
  width: 10.875rem;
  box-sizing: border-box;
  display: grid;
  align-items: center;
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;

  ::before {
    content: '';
    position: absolute;
    border: 1px solid ${COLORS.GRAY.G6};
    border-radius: 8px;
    height: 50%;
    width: 100%;
    top: -0.75rem;
    transform: scale(0.9) translateZ(-1px);
  }
  .react-pdf__Document {
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    align-items: center;
    display: grid;
  }
  @media (max-width: 768px) {
    height: 9.125rem;
    width: 7.5rem;
  }
`;
