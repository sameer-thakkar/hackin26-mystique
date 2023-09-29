import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const MailerContainer = styled.div`
  background: linear-gradient(180deg, ${COLORS.PURPS.LIGHT_TONE_4} 0%, rgba(248, 246, 255, 0) 100%);
  .mailer-wrapper {
    max-width: ${SIZES.MAX_WIDTH};
    margin: auto;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-areas: 'textBox imageBox';
    padding: 4rem 0;
    justify-content: space-between;
    margin-top: 3rem;
  }
  

  @media(max-width: 1024px) {
   .mailer-wrapper {
      grid-template-areas: 'imageBox' 'textBox' ;
      padding: 2rem 1.5rem 2.75rem 1.5rem;
   }
  }
}
`;

export const ImageContainer = styled.div`
  grid-area: imageBox;
  img {
    border-radius: 157px;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    display: flex;
    .image-wrapper {
      display: flex;
      justify-content: center;
    }
  }
`;

export const TextContainer = styled.div`
  grid-area: textBox;
  width: 31.5rem;
  .mailer-heading {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
  }
  .mailer-subheading {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
  }
  @media (max-width: 768px) {
    text-align: center;
    width: 100%;
    .mailer-heading {
      ${expandFontToken(FONTS.HEADING_LARGE)}
    }
    .mailer-subheading {
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
    }
  }
`;

export const SubscriptionCont = styled.div<{ isErr: boolean }>`
.input-form {
  width: 100%;
  height: 4rem;
  display: flex;
  .email-input {
    width: 20rem;
    padding: 1.25rem;
    border: none;
    border-radius: 12px 0 0 12px;
    ${expandFontToken(FONTS.UI_LABEL_LARGE)};
    padding: 1.2rem;
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
    color: ${COLORS.BRAND.WHITE};
    background-color: ${COLORS.BRAND.PURPS};
    border: none;
    border-radius: 0 12px 12px 0;
    cursor: pointer;
    height: 3.8rem;
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
        margin-bottom: 1.4rem;
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
        border: 1px solid ${COLORS.GRAY.G6};
        ${({ isErr }) =>
          isErr &&
          `border: 1px solid ${COLORS.TEXT.WARNING_RED_1}; margin-bottom: 0;`}
        width: 78vw;
        border-radius: 8px;
      }
      .err-msg {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)}
        color: ${COLORS.TEXT.WARNING_RED_1};
        text-align: left;
        margin-left: 0.5rem;
      }
      .signup-btn {
        width: 100%;
        height: 3rem;
        margin-top: 1rem;
        border-radius: 8px;
      }
    }
    .subcription-msg {
      display: block;
      text-align: center;
      .subscription-text {
        margin: 0;
        ${expandFontToken(FONTS.SUBHEADING_SMALL)};
        line-height: 5px;
      }
    }
  }
`;
