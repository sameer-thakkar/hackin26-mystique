import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ShowPageDescriptorSectionWrapper = styled.div<{
  $isShowPageExperiment: boolean;
}>`
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: auto;
  padding: 2.5rem 0 1rem 0;
  ${({ $isShowPageExperiment }) =>
    $isShowPageExperiment &&
    `
      padding-top: 2rem;
      padding-bottom: 0;
    `}

  @media (max-width: 768px) {
    padding: 1.5rem 0 1rem 0;
  }
`;

export const Divider = styled.div`
  max-width: 49.5rem;
  margin-bottom: 2rem;
  margin-top: 2rem;
  height: 1px;
  background-color: ${COLORS.GRAY.G7};
  @media (max-width: 768px) {
    width: 100%;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    width: 25.5rem;
  }
  @media only screen and (min-width: 1024px) and (max-width: 1366px) {
    width: 30.5rem;
  }
`;

export const DescriptorsWrapper = styled.div<{ numberOfDescriptors: number }>`
  display: flex;

  gap: 1.5rem;

  .descriptor {
    display: flex;
    margin-right: 1.5rem;
    width: auto;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 2.5rem;
      height: 2.5rem;
      padding: 0.5rem;
      margin-right: 0.5rem;

      border-radius: 6.25rem;
      background-color: ${COLORS.GRAY.G7};
      box-sizing: border-box;
      svg {
        width: 1rem;
        height: 1rem;
      }
    }

    .content {
      display: flex;
      flex-direction: column;

      .title {
        color: ${COLORS.GRAY.G2};
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      }

      .value {
        width: ${({ numberOfDescriptors }) =>
          numberOfDescriptors > 2 ? '10.875rem' : '18.875rem'};
        color: ${COLORS.GRAY.G2};
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
        font-weight: 500;

        &.age:not(.no-highlight) span {
          cursor: pointer;
          border-bottom: 1px dotted ${COLORS.GRAY.G2};
        }
      }
    }
  }

  @media (max-width: 1024px) {
    width: 100%;
    flex-direction: column;
    gap: initial;
    justify-content: space-between;

    .descriptor {
      margin: 0;

      &:not(:last-child) {
        margin-bottom: 1.25rem;
      }
      .icon {
        min-width: 2rem;
        min-height: 2rem;
        width: 2rem;
        height: 2rem;
        padding: 0.4rem;
        margin-right: 0.5rem;
        border-radius: 5rem;
        svg {
          width: 0.8rem;
          height: 0.8rem;
        }
      }

      .content {
        width: 100%;
        .title {
          ${expandFontToken(FONTS.UI_LABEL_XS)};
        }

        .value {
          min-width: 100%;
          ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
        }
      }
    }
  }
`;

export const SpecialOfferBanner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 2.25rem;
  padding: 1rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(164, 240, 255, 0.5);
  background: ${COLORS.OCEAN_BLUE.LIGHT_TONE_3};
  width: 44.625rem;

  .title {
    ${expandFontToken(FONTS.SUBHEADING_LARGE)};
    color: ${COLORS.TEXT.BEACH};
  }

  .offer-text {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
    margin-top: 0.12rem;
  }

  @media (max-width: 768px) {
    margin-top: 2rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    width: auto;

    .offer-text {
      margin-top: 0.38rem;
    }
  }
`;
