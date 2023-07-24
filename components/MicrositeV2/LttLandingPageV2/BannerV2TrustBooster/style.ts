import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div<{ pinnedCardPresent: boolean }>`
  width: 100%;
  height: 3.25rem;
  ${({ pinnedCardPresent }) =>
    !pinnedCardPresent &&
    ` background: linear-gradient(
    180deg,
    rgba(80, 64, 111, 0) 0%,
    rgba(70, 56, 96, 0.6) 100%
  );`}

  padding-top: 1.4rem;
  padding-bottom: 0.5rem;
  @media (min-width: 768px) {
    height: 5.1rem;
    ${({ pinnedCardPresent }) =>
      !pinnedCardPresent &&
      ` 
    background: linear-gradient(
      180deg,
      rgba(45, 35, 64, 0) 0%,
      rgba(45, 35, 64, 0.6) 100%
    );
  `}
  }
`;

export const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
  width: calc(100% - 3rem);
  margin: 0 auto;

  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  .trust-booster {
    margin-bottom: 1.25rem;
    animation: scroll 9.2s linear infinite;

    .icon {
      margin-right: 0.5rem;
    }
    display: flex;
    h3,
    p {
      margin: 0;
    }
    h3 {
      ${expandFontToken(FONTS.HEADING_XS)};
      color: ${COLORS.BRAND.WHITE};
    }
    p {
      ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
      color: ${COLORS.GRAY.G6};
    }
    @keyframes scroll {
      0% {
        transform: translateY(0);
      }
      22% {
        transform: translateY(0);
      }
      25% {
        transform: translateY(-60px);
      }
      47% {
        transform: translateY(-60px);
      }
      50% {
        transform: translateY(-120px);
      }
      72% {
        transform: translateY(-120px);
      }
      75% {
        transform: translateY(-180px);
      }
      97% {
        transform: translateY(-180px);
      }
      100% {
        transform: translateY(0);
      }
    }
  }
  .trust-booster::first-child {
    margin-top: 0;
  }

  @media (min-width: 768px) {
    width: calc(100% - (5.46vw * 2));
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .trust-booster {
      animation: none;
      margin: 0;
    }
  }
`;
