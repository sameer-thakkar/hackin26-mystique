import styled from 'styled-components';
import { Wrapper as ReviewCardWrapper } from 'components/common/Reviews/components/ReviewCard/styles';
import {
  TitleHeader,
  Wrapper as ReviewSection,
} from 'components/common/Reviews/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const LandingPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin: 0 auto;
  padding: 0;
  .horizontally-aligned-child {
    width: calc(100% - (1.5rem * 2));
    max-width: 75rem;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 768px) {
    .horizontally-aligned-child {
      width: 100%;
      max-width: 100vw;
      margin-left: auto;
      margin-right: auto;
    }
    width: 100vw;
    padding: 0.45rem 0 0.75rem;
  }
`;

export const ReviewSectionWrapper = styled.div`
  padding: 0rem;

  & h5,
  & h4 {
    margin: 0;
  }

  & h2 {
    margin: 0;
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.GRAY.G2};
  }

  svg {
    :hover {
      fill: none;
    }
    circle {
      stroke: #79797980;
    }
    :not(.disabled) {
      :hover {
        circle {
          stroke: #797979a6;
        }
      }

      :active {
        circle {
          stroke: #797979d9;
        }
      }
    }
  }

  ${ReviewSection} {
    @media (min-width: 768px) {
      max-width: 1200px;
      width: calc(100vw - (5.6vw * 2));
      margin: 4rem auto;
    }

    .chevron-left,
    .chevron-right {
      :active {
        transform: scale(0.98);
      }
    }

    ${TitleHeader} {
      margin-bottom: 2.5rem;
    }
  }

  & ${ReviewCardWrapper} {
    min-height: 14.3125rem;
    border: none;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05),
      0px 0px 1px 0px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    & h2 {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    ${ReviewSection} {
      ${TitleHeader} {
        margin-bottom: 1rem;
        padding: 0 5.6vw;
      }
    }

    & :not(.swiper-initialized) .swiper-wrapper {
      .swiper-slide {
        width: fit-content;
        margin-right: 0;

        ${ReviewCardWrapper} {
          min-height: 15.875rem;
          width: calc(100vw - 5.6vw * 2);
          box-sizing: border-box;
          margin: 0;
        }
      }

      .swiper-slide-prev {
        transform: translateX(-0.75rem);
      }
      .swiper-slide-next {
        transform: translateX(0.75rem);
      }
    }
  }
`;

export const SpecialSectionsLazyWrapper = styled.div`
  min-height: 757px;

  @media (max-width: 768px) {
    min-height: 464.5px;
  }
`;

export const ReviewSectionLazyWrapper = styled.div`
  min-height: 473px;
  margin-bottom: 4rem;
  background: linear-gradient(116deg, #f2eeff 0%, #ffeaf4 97.94%);

  @media (max-width: 768px) {
    min-height: 394px;
    margin: 2rem 0 4rem;
  }
`;
