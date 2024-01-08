import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ChildWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const ScrollableTabsWrapper = styled.div`
  ${ChildWrapper}:not(:last-child) {
    margin-bottom: 3.5rem;
  }
`;
export const TabNames = styled.div`
  border-bottom: solid 1px ${COLORS.GRAY.G6};
  display: flex;
  width: 100%;
  justify-content: flex-start;
  .tab-name {
    margin-right: 2rem;
  }

  @media (max-width: 768px) {
    .tab-name {
      margin-right: 1.5rem;
    }
    padding: 0 1.5rem;
  }
`;
export const TabNamesWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  grid-column-gap: 2rem;

  position: sticky;
  top: 5rem;
  z-index: 2;
  padding-top: 1.5rem;
  background-color: ${COLORS.BRAND.WHITE};
  margin-bottom: 2rem;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 768px) {
    top: 3.5rem;
    padding-top: 1rem;
    margin-bottom: 1.5rem;
    overflow: scroll;
    max-width: 100vw;
  }
`;

export const TabName = styled.span<{ $isActive: boolean }>`
  padding-bottom: 0.5rem;
  ${expandFontToken(FONTS.HEADING_REGULAR)};
  color: ${COLORS.GRAY.G4A};
  cursor: pointer;

  ${({ $isActive }) =>
    $isActive &&
    `
        color: ${COLORS.TEXT.PURPS_3};
        border-bottom: solid 1px ${COLORS.BRAND.PURPS};
    `}

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_SMALL)};
    min-width: max-content;
  }
`;

export const ScrollableTabsContentWrapper = styled.div`
  @media (max-width: 768px) {
    width: calc(100% - (5.46vw * 2));
    max-width: 1200px;
    margin: auto;
  }
`;
