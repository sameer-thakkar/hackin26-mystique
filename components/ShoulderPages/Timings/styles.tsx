import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const PageContainer = styled.main`
  width: 88.56vw;
  margin: 0 auto;
  max-width: 1200px;
  padding-bottom: 3rem;

  .slice-wrapper {
    padding: 0.5rem 0;
    margin: 0;
  }

  @media (max-width: 768px) {
    width: calc(100vw - 2rem);
  }
`;

export const TimingsTableTabsViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: no-wrap;
  flex-shrink: 0;
  position: relative;
  margin-bottom: 1rem;
  box-sizing: border-box;
  overflow-x: scroll;

  .tab {
    width: max-content;
    min-width: max-content;
    ${expandFontToken(FONTS.HEADING_SMALL)}
    padding: 0 1rem;
    padding-bottom: 1.2rem;
    border-bottom: 1.5px solid ${COLORS.GRAY.G6};
    cursor: pointer;
    color: #545454;
    font-weight: 500;
    padding-bottom: 1rem;
    margin: 0;
    transition: all 0.25s ease-in-out;
  }

  .tab:hover {
    border-color: ${COLORS.BRAND.PURPS};
    color: ${COLORS.BRAND.PURPS};
  }

  .active {
    border-color: ${COLORS.BRAND.PURPS};
    color: ${COLORS.BRAND.PURPS};
  }

  @media (max-width: 768px) {
    .tab {
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
      padding: 0.5rem 0.8rem;
      border-width: 1.2px;
    }
  }
`;

export const TimingNotes = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
  color: ${COLORS.GRAY.G3};

  * {
    line-height: 1.5rem;
  }

  ul {
    padding: 0 1.5rem;

    li {
      color: ${COLORS.GRAY.G3};
    }
  }
`;

export const BestTimeHeader = styled.h2`
  color: ${COLORS.GRAY.G2};
  margin-bottom: 1rem;
  margin-top: 3rem;
  ${expandFontToken('Heading/Large')}

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const BestTimeSubHeader = styled.h3`
  color: ${COLORS.GRAY.G2};
  margin: 1.5rem 0 1rem;
  ${expandFontToken('Heading/Regular')}

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const TimingTablesContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;

    .tables {
      width: 100%;
    }
  }

  .tables {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 50%;
  }

  .image-wrap {
    width: unset !important;
  }

  img {
    border-radius: 0.5rem;
    width: 100%;
    max-width: 24rem;
    height: unset;
    object-fit: contain;
  }
`;

export const SectionDescription = styled.div`
  ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
  color: ${COLORS.GRAY.G2};
  margin-bottom: 1rem;
  * {
    line-height: 1.75rem;
  }

  ul {
    padding: 0 1.5rem;

    li {
      color: ${COLORS.GRAY.G2};
    }
  }
`;
