import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const CardContainer = styled.article<{ $isSubCategoryPage: boolean }>`
  position: relative;
  display: grid;
  grid-template-rows: ${({ $isSubCategoryPage }) =>
    $isSubCategoryPage ? '13.375rem auto 1fr' : '13.375rem 12rem 1fr'};
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${COLORS.GRAY.G7};

  @media (max-width: 768px) {
    ${({ $isSubCategoryPage }) => !$isSubCategoryPage && `width: 16.875rem;`}
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${COLORS.PURPS.LIGHT_TONE_4};
  border-radius: 8px 8px 0 0;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    border-radius: 8px 8px 0 0;
    object-fit: cover;
  }
`;

export const Counter = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px 0 12px;
  background: ${COLORS.BRAND.PURPS};
  font-family: ${HALYARD.DISPLAY};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.75rem;
  letter-spacing: 0.05rem;
  color: ${COLORS.BRAND.WHITE};
`;

export const TitleWrapper = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem 1rem;
  gap: 0.625rem;
  background: linear-gradient(180deg, rgba(17, 17, 17, 0) 0%, #111 100%);
  color: ${COLORS.BRAND.WHITE};
  ${expandFontToken(FONTS.HEADING_SMALL)};
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-self: stretch;
  padding: 1rem;
`;

export const RatingsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  .average-rating {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    color: ${COLORS.BRAND.CANDY};
  }

  .ratings-count {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${COLORS.GRAY.G4};
  }

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

export const SubtextWrapper = styled.p`
  margin: unset;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
`;

export const CardCTA = styled.div`
  margin-top: auto;
  padding: 0.5rem 1rem 1rem;

  @media (max-width: 768px) {
    padding-top: unset;
  }
`;

export const CTAContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  span > * {
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.BUTTON_MEDIUM)};
  }
`;
