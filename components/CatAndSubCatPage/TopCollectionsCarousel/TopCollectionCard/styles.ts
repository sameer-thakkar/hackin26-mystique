import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const CardContainer = styled.article`
  position: relative;
  width: 14.16813rem;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 9.75rem;
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 20.79725rem;
  background: ${COLORS.PURPS.LIGHT_TONE_4};
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    width: 9.75rem;
    height: 14.625rem;
  }
`;

export const Counter = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem 0rem 0.75rem 0rem;
  background: ${COLORS.BRAND.PURPS};
  font-family: ${HALYARD.DISPLAY};
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.75rem;
  letter-spacing: 0.05rem;
  color: ${COLORS.BRAND.WHITE};

  @media (max-width: 768px) {
    width: 1.875rem;
    height: 1.875rem;
    font-size: 0.9375rem;
  }
`;

export const CardContent = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.16988rem 0.78rem 0.78rem;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.74) 77.1%
  );
  border-radius: 0 0 8px 8px;

  #card-title {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    color: ${COLORS.BRAND.WHITE};
  }

  .card-description,
  .card-description span {
    ${expandFontToken(FONTS.UI_LABEL_LARGE)};
    color: ${COLORS.GRAY.G7};
  }

  @media (max-width: 768px) {
    padding: 2rem 0.5rem 0.75rem 0.5rem;

    #card-title {
      ${expandFontToken(FONTS.HEADING_SMALL)};
    }
    .card-description,
    .card-description span {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    }
  }
`;
