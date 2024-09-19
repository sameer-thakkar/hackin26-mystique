import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const MailerContainer = styled.div<{ $isCatOrSubCatPage: boolean }>`
  background: ${({ $isCatOrSubCatPage }) =>
    $isCatOrSubCatPage
      ? `linear-gradient(91deg, #241136 3.49%, #5E2B90 93.86%)`
      : `linear-gradient(
      180deg,
      ${COLORS.PURPS.LIGHT_TONE_4} 0%,
      rgba(248, 246, 255, 0) 100%
    )`};

  .mailer-wrapper {
    max-width: ${SIZES.MAX_WIDTH};
    margin: auto;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-areas: 'textBox imageBox';
    padding: 4rem 0;
    justify-content: space-between;
    ${({ $isCatOrSubCatPage }) => !$isCatOrSubCatPage && `margin-top: 3rem;`}
  }

  @media (max-width: 1024px) {
    .mailer-wrapper {
      grid-template-areas: 'imageBox' 'textBox';
      padding: 2rem 1.5rem 2.75rem 1.5rem;
    }
  }
`;

export const ImageContainer = styled.div`
  grid-area: imageBox;
  img {
    border-radius: 157px;
    object-fit: cover;
    width: 36.625rem;
    height: 19.563rem;
  }
  @media (max-width: 768px) {
    display: flex;
    .image-wrapper {
      display: flex;
      justify-content: center;
    }
    img {
      width: 20.438rem;
      height: 10.938rem;
    }
  }
`;

export const TextContainer = styled.div<{ $isCatOrSubCatPage: boolean }>`
  grid-area: textBox;
  width: 31.5rem;

  .mailer-heading {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
    ${({ $isCatOrSubCatPage }) =>
      $isCatOrSubCatPage && `color: ${COLORS.BRAND.WHITE}`}
  }
  .mailer-subheading {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
    ${({ $isCatOrSubCatPage }) =>
      $isCatOrSubCatPage && `color: ${COLORS.BRAND.WHITE}`}
  }
  @media (max-width: 768px) {
    ${($isCatOrSubCatPage) => !$isCatOrSubCatPage && `text-align: center;`}
    width: 100%;
    .mailer-heading {
      ${expandFontToken(FONTS.HEADING_LARGE)}
    }
    .mailer-subheading {
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
    }
  }
`;

export const SubscriptionCont = styled.div<{
  isErr: boolean;
  $isCatOrSubCatPage: boolean;
}>`
  .input-form {
    width: 100%;
    display: flex;
    .email-input {
      width: 20rem;
      height: calc(4rem - 2px);
      padding: 0 1.25rem;
      border: none;
      border-radius: 12px 0 0 12px;
      ${expandFontToken(FONTS.UI_LABEL_LARGE)};
      border: 1px solid ${COLORS.GRAY.G6};
      border-right: none;
      ${({ isErr }) =>
        isErr &&
        `border: 1px solid ${COLORS.TEXT.WARNING_RED_1}; border-right: none;`}
    }
    .err-msg {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      color: ${COLORS.TEXT.WARNING_RED_1};
      margin-top: 0.4rem;
    }
    .signup-btn {
      width: 11.75rem;
      color: ${({ $isCatOrSubCatPage }) =>
        $isCatOrSubCatPage ? COLORS.BRAND.PURPS : COLORS.BRAND.WHITE};
      background-color: ${({ $isCatOrSubCatPage }) =>
        $isCatOrSubCatPage ? COLORS.PURPS.LIGHT_TONE_4 : COLORS.BRAND.PURPS};
      border: none;
      border-radius: 0 12px 12px 0;
      cursor: pointer;
      height: 4rem;
      ${expandFontToken(FONTS.BUTTON_BIG)}
    }
  }
  .subcription-msg {
    display: flex;
    align-items: center;
    .subscription-text {
      ${expandFontToken(FONTS.HEADING_SMALL)};
      margin-left: 1rem;
      p {
        line-height: 10px;
        color: ${COLORS.TEXT.OKAY_GREEN_3} !important ;
      }
    }
  }
  @media (max-width: 768px) {
    margin-top: 2rem;
    .input-form {
      display: block;
      height: auto;
      .email-input {
        height: unset;
        margin-bottom: 1rem;
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
        border: 1px solid ${COLORS.GRAY.G6};
        ${({ isErr }) =>
          isErr &&
          `border: 1px solid ${COLORS.TEXT.WARNING_RED_1}; margin-bottom: 0;`}
        width: 78vw;
        border-radius: 8px;
        padding: 0.875rem 1rem;
      }
      .err-msg {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)}
        color: ${COLORS.TEXT.WARNING_RED_1};
        text-align: left;
        margin-left: 0.5rem;
        ${($isCatOrSubCatPage) =>
          $isCatOrSubCatPage && `margin: 0.5rem 0 0.5rem 0.5rem;`}
      }
      .signup-btn {
        width: 100%;
        height: 3rem;
        border-radius: 8px;
      }
    }
    .subcription-msg {
      display: block;
      ${($isCatOrSubCatPage) => !$isCatOrSubCatPage && `text-align: center;`}
      .subscription-text {
        margin: 0;
        ${expandFontToken(FONTS.SUBHEADING_SMALL)};
        line-height: 5px;
      }
    }
  }
`;
