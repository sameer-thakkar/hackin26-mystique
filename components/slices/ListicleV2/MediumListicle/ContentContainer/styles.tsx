import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ContentWrapper = styled.div<{
  isReadLess: boolean;
  isSettingsOne: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;

  #title {
    color: ${COLORS.GRAY.G1};
    ${expandFontToken(FONTS.HEADING_SMALL)};
    margin: 1rem 1rem 0.5rem;
  }

  ${({ isSettingsOne }) =>
    isSettingsOne
      ? `
      .listicle-settings-container > div {
        margin-bottom: 1rem;
      }
      `
      : `
    .listicle-settings-container > div:not(:last-child) {
      margin-bottom: 1rem;
    }
    `};

  @media (max-width: 768px) {
    ${({ isReadLess }) =>
      isReadLess
        ? `.listicle-settings-container > div:last-child {
      margin-bottom: 1.375rem;
    }`
        : `
    .listicle-settings-container > div:not(:last-child) {
      margin-bottom: 1rem;
    }
    .listicle-settings-container > div:last-child {
      margin-bottom: 0;
    }
    `};
  }
`;

export const TitleWrapper = styled.h2``;

export const CategoryTagsContainer = styled.div`
  display: flex;
  margin-left: 1rem;
  flex-wrap: wrap;
`;

export const CategoryTagsWrapper = styled.div`
  background: ${COLORS.GRAY.G7};
  border-radius: 12px;
  width: fit-content;
  margin: 0 0.5rem 1rem 0;
`;

export const CategoryTagWrapper = styled.div`
  padding: 0.25rem 0.5rem;
  color: ${COLORS.GRAY.G2};
  font-family: Halyard Text;
  font-size: 11px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: 0.2px;
  text-align: left;
`;

export const RichTextWrapper = styled.div<{
  overflow: boolean;
}>`
  margin: 0.5rem auto 0.625rem;
  max-width: 200px;
  ${({ overflow }) =>
    overflow &&
    `overflow: hidden; 
    max-height: 130px;
    -webkit-box-orient: vertical;
  display: block;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
    `};

  h3,
  h2,
  h1,
  p {
    margin: 0 !important;
    ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
    font-family: halyard-text, sans-serif !important;
    font-weight: 300 !important;
    font-size: 12px !important;
    line-height: 20px !important;
    color: ${COLORS.GRAY.G2} !important;
  }

  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
    max-width: 180px;

    ${({ overflow }) =>
      overflow &&
      `overflow: hidden; 
    max-height: 130px;
    -webkit-box-orient: vertical;
    display: block;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    `};
  }
`;
