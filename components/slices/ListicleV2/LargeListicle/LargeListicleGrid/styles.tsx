import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const LargeListicleGridWrapper = styled.div`
  border-radius: 16px;
  border: 1px solid ${COLORS.GRAY.G6};
  background: ${COLORS.BRAND.WHITE};
`;

export const LargeListicleBox = styled.div<{ isModalOpen: boolean }>`
  margin: 1.188rem 1.5rem;
  display: grid;
  grid-template-columns: 340px 1fr;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    margin: unset;

    .cta-button {
      margin: 1rem;
      background: ${COLORS.BRAND.PURPS};
      color: ${COLORS.BRAND.WHITE};
      ${expandFontToken(FONTS.BUTTON_MEDIUM)};

      ${({ isModalOpen }) => {
        return (
          isModalOpen &&
          `
             width: calc( 100% - 2rem );
             margin: 1rem;
           `
        );
      }}
    }

    .cta-button > a {
      color: ${COLORS.BRAND.WHITE};
    }

    .more-details-button {
      margin: 0 1rem 1rem;
      background: ${COLORS.PURPS.LIGHT_TONE_4};
      color: ${COLORS.BRAND.PURPS};
      border: 2px solid ${COLORS.PURPS.LIGHT_TONE_4};
      ${expandFontToken(FONTS.BUTTON_MEDIUM)};
    }

    ${({ isModalOpen }) => {
      return (
        !isModalOpen &&
        `
       .large-listicle-content::after{
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0.84) 48.64%, #FFF 84.29%);
        position: absolute;
        content: "";
        bottom: 0;
        right: 0;
        left: 0;
        height: 10%;
       }
       `
      );
    }}
  }
`;

export const ImageWrapper = styled.div<{ isModalOpen: boolean }>`
  width: 314px;
  margin-right: 1.5rem;

  @media (max-width: 768px) {
    ${({ isModalOpen }) => {
      return (
        isModalOpen &&
        `
   max-width: 100%;
   width: 100%;
   margin: 0 0 1.5rem;
   `
      );
    }}
  }
`;

export const ModalCardContainer = styled.div`
  @media (max-width: 768px) {
    background: ${COLORS.BRAND.WHITE};
    border-radius: 0.75rem 0.75rem 0 0;
  }
`;

export const ButtonBackgroundWrapper = styled.div`
  border-top: 1px solid ${COLORS.GRAY.G7};
  position: sticky;
  background: ${COLORS.BRAND.WHITE};
  width: 100%;
  bottom: 0;
  boxshadow: 0 -2px 12px 0 rgba(84, 84, 84, 0.1);
`;
