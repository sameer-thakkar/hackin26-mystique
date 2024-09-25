import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import { ListicleSectionWrapper } from 'components/slices/ListicleSectionV2/styles';
import {
  CategoryTagsContainer,
  CategoryTagsWrapper,
  CategoryTagWrapper,
} from 'components/slices/ListicleV2/MediumListicle/ContentContainer/styles';
import {
  CTAButtonWrapper,
  MediumListicleBox,
} from 'components/slices/ListicleV2/MediumListicle/MediumListicleGrid/styles';
import { ReadMoreBox } from 'components/slices/ListicleV2/MediumListicle/ReadMore/styles';
import { RichTextContainer } from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import { MediumListicleWrapper } from 'components/slices/ListicleV2/MediumListicle/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const ListicleSectionStyleOverrides = styled.div`
  ${ListicleSectionWrapper} {
    .listicle-settings-container > div:not(:last-child) {
      margin-bottom: 0;
    }
    & > :first-child {
      color: ${COLORS.GRAY.G1};
      ${getFontDetailsByLabel(FONTS.DISPLAY_SMALL)}
    }

    #title {
      color: ${COLORS.GRAY.G2};
      margin: 0.75rem 0.75rem 0.5rem;
    }

    .listicle-settings-container {
      margin: 0 0.75rem 0.75rem !important;

      & > div {
        margin-bottom: 0;
      }
    }

    ${CategoryTagsContainer} {
      margin-left: 0.75rem;

      ${CategoryTagsWrapper} {
        background-color: ${COLORS.GRAY.G8};
        margin-bottom: 0.5rem;
      }

      ${CategoryTagWrapper} {
        ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL_HEAVY)};
      }
    }

    p {
      color: ${COLORS.GRAY.G3} !important;
    }

    ${CategoryTagWrapper} {
      font-weight: 500;
      padding: 0.375rem 0.625rem;
    }

    ${CTAButtonWrapper} {
      display: none;
    }
  }

  @media (max-width: 768px) {
    margin-top: 2.625rem;
    ${ListicleSectionWrapper} {
      & > :first-child {
        margin-left: 1rem;
        ${getFontDetailsByLabel(FONTS.HEADING_LARGE)}

        margin-bottom: 1.5rem;
      }
      ${MediumListicleWrapper} {
        padding: 0 1rem;
        height: 100%;
        display: flex;
        overflow-x: scroll;
        overflow-y: hidden;
        gap: 1.25rem;

        scroll-snap-type: x mandatory;
        scroll-padding: 0 1rem;

        ::-webkit-scrollbar {
          display: none;
        }
        .listicle-settings-container {
          max-height: initial;
          margin: 0 0.75rem;

          ${RichTextContainer} {
            margin-bottom: 0;
          }
        }
        .listicle-settings-container > div:last-child {
          display: none;
        }

        ${CategoryTagWrapper} {
          ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)};
        }

        ${MediumListicleBox} {
          scroll-snap-align: start;
          h2#title {
            margin: 0.75rem;
            margin-bottom: 0.5rem;
          }
          ${CategoryTagsContainer} {
            margin-left: 0.75rem;
          }
        }

        ${ReadMoreBox} {
          display: none;
        }
      }
    }
  }
`;
