import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import colors from 'const/colors';
import { FONTS } from 'const/fonts';

const getContentLimit = (limitLines?: boolean, hasTranslation?: boolean) => {
  if (!limitLines) {
    return hasTranslation ? 10 : 11;
  }

  return hasTranslation ? 4 : 5;
};

export const ReviewWrapper = styled.div`
  position: relative;
  margin: 2rem 1.5rem 0 0;
  padding-top: 0.75rem;
  border: 1px solid ${colors.GRAY.G6};
  border-radius: 8px;
  background-color: ${colors.BRAND.WHITE};
  display: flex;
  flex-direction: column;
  height: 23.5rem;
  overflow: hidden;

  @media (max-width: 768px) {
    min-width: 17.625rem;
    margin: 1.5rem 0 0;
    word-break: break-word;
  }
`;

export const ReviewDateTime = styled.span`
  ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)};
  color: ${colors.GRAY.G3};

  @media screen and (min-width: 768px) {
    align-self: center;
  }
`;

export const ReviewerImage = styled.div`
  grid-area: image;
  margin-right: 0.375rem;
  width: 2.25rem;
  height: 2.25rem;
  position: relative;

  img {
    width: 2.25rem;
    height: 2.25rem;
  }

  .reviewer-image {
    border-radius: 50%;
    margin: 0 auto;
  }
`;

export const ReviewContentWrapper = styled.div<{
  $hasMedia?: boolean;
}>`
  display: inline-block;
  flex: 1;
  word-break: break-word;
  hyphens: auto;
  margin-top: ${({ $hasMedia }) => ($hasMedia ? '0.75rem' : '0')};
  padding: 0 0.75rem;
`;

export const ReviewContent = styled.div<{
  $shouldLimitLines?: boolean;
  $hasTranslation?: boolean;
}>`
  ${getFontDetailsByLabel(FONTS.PARAGRAPH_REGULAR)};
  display: -webkit-box;
  -webkit-line-clamp: ${({ $shouldLimitLines, $hasTranslation }) =>
    getContentLimit($shouldLimitLines, $hasTranslation)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    line-height: 1.25rem;
    font-size: 0.875rem;
  }
`;

export const ReviewImageCarouselContainer = styled.div`
  display: flex;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0 0.75rem;
`;

export const ReviewCarouselItemWrapper = styled.div`
  width: 5rem;
  height: 6.625rem;
  margin-right: 0.5rem;
  overflow: hidden;
  border-radius: 0.25rem;

  img {
    cursor: pointer;
  }

  :last-child {
    margin-right: 0;
    position: relative;
  }
`;

export const CarouselLastSlide = styled.div`
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
  cursor: pointer;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  color: ${colors.BRAND.WHITE};
  position: absolute;
  top: 0;
  padding: 0.375rem;

  .flexContainer {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .balanceImages {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)};
    color: ${colors.BRAND.WHITE};
    margin-right: 0.5rem;
  }
`;

export const LocalizeText = styled.div`
  ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)};
  color: ${colors.GRAY.G3};
  margin-top: 0.375rem;
  min-height: 1rem;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)}
  }
`;

export const StyledBottomCTAContainer = styled.div<{
  $isClickable?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.GRAY.G8};
  padding: 0 0.75rem;
  border-top: 1px solid ${colors.GRAY.G6};
  height: 3.5rem;
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};

  .arrow-right {
    transform: rotate(0deg);
    transition: transform 0.3s cubic-bezier(0.3, 0, 0.7, 1);
    height: 10px;
    width: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    .arrow-right {
      transform: rotate(-45deg);
    }
  }
`;

export const StyledCTAText = styled.div<{
  $isClickable?: boolean;
}>`
  &.block {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL_HEAVY)};
    color: ${colors.GRAY.G2};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 70%;
    cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
  }
`;

export const ReviewHeader = styled.div<{ $hasCountryDetails?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 0.75rem;

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .review-time {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_MEDIUM)};
    color: ${colors.GRAY.G3};
  }

  .reviewer-name {
    overflow: hidden;
    width: 100%;
    ${getFontDetailsByLabel(FONTS.HEADING_XS)};
    color: ${colors.GRAY.G2};
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: nowrap;
    grid-area: name;
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    .reviewer-name {
      margin-bottom: 0.125rem;
    }
  }
`;

export const RatingContainer = styled.div`
  margin: 0.5rem 0 1rem;
  height: 16px;
`;

export const ReviewerCountryName = styled.span`
  ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)};
  color: ${colors.GRAY.G3};
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ReviewerCountryFlag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  border: 0.0313rem solid ${colors.GRAY.G6};
  right: -0.125rem;
  bottom: -0.0313rem;
  height: 15px;
  width: 15px;
  overflow: hidden;

  .country-flag {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    height: 100%;
    width: 100%;
  }
`;

export const CountryAndDateContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CountryDateSeparator = styled.div`
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: ${colors.GRAY.G5};
  margin: 0 0.25rem;
`;
