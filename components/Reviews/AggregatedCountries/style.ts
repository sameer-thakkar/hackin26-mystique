import styled, { css } from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

const LangHeights = css`
  height: 3.125rem;

  &.lang-nl {
    height: 4.75rem;
  }
`;

export const TopBorder = styled.hr`
  width: calc(100% + 3rem);
  border-top: 0.0625rem solid #e2e2e2;
  margin: 1.5rem 0 0 -1.5rem;
`;

export const WrapperContainer = styled.div<{ $hasSlideAnimation?: boolean }>`
  background: linear-gradient(
    269.83deg,
    rgba(255, 230, 248, 0.4) 14.94%,
    rgba(243, 230, 255, 0.4) 92.53%
  );
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-left: -1.5rem;
  position: relative;
  padding: 0 1.5rem;
  overflow: hidden;

  .guest-text {
    ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
    padding: 0.375rem 0;
    margin: auto 0;
    z-index: 1;

    strong {
      font-weight: 500;
      color: #222222;
    }
  }

  .hearts-lottie {
    position: absolute;
    width: 8.75rem;
    height: 10rem;
    transform: rotate(16.11deg);
    right: -1.4375rem;
    margin-top: -2.875rem;
    opacity: 10%;
  }

  @media only screen and (min-width: 768px) {
    border-top: none;
    margin-left: 0;
    width: 46.5rem;
    border-radius: 0.5rem;
    align-items: center;
    padding: 0;
    margin-top: 1.5rem;

    .guest-text {
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
      max-width: 37.5rem;
    }

    .hearts-lottie {
      margin-top: 0.75rem;
      right: -1.125rem;
    }
  }

  ${({ $hasSlideAnimation }) =>
    $hasSlideAnimation &&
    css`
      height: 0;
      opacity: 0;
      transition: all 0.5s;

      .hearts-lottie {
        opacity: 0;
      }

      &.loaded {
        height: 3.625rem;
        opacity: 100%;

        .hearts-lottie {
          opacity: 10%;
        }

        ${LangHeights}
      }
    `}
`;

export const CountryFlagsContainer = styled.div`
  display: flex;
  height: 3.625rem;
  flex-direction: column;
  overflow-y: hidden;
  min-width: 2.03125rem;

  .marquee_countries_wrapper li::before {
    display: none;
  }

  @media (max-width: 768px) {
    .marquee_countries_wrapper {
      padding-left: 0;
    }
  }

  ${LangHeights}
`;

export const CountryFlagItem = styled.div`
  margin-bottom: 0.75rem;
  width: 2.0313rem;
  align-items: center;

  .country-flag {
    width: 1.875rem;
    height: 1.4rem;
    margin: 0 auto;
    box-shadow: 0px 0.125px 2.5px 0px #1018280f, 0px 1.25px 3.75px 0px #1018281a;

    img {
      border-radius: 2px;
      overflow: hidden;
    }
  }
`;
