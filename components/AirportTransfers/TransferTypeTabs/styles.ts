import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledContainer = styled.div`
  max-width: 75rem;
  margin: 2rem auto;
  border-bottom: 1px solid ${COLORS.GRAY.G6};

  @media (max-width: 768px) {
    padding: 0 1.5rem;

    margin: 1.25rem auto 1.5rem auto;
  }
`;

export const StyledTabsContainer = styled.div<{
  $activeTab: string;
}>`
  width: max-content;

  display: flex;

  position: relative;

  ::before {
    content: '';
    height: 0.125rem;
    background-color: ${COLORS.TEXT.PURPS_3};
    position: absolute;
    bottom: 0;
    left: ${({ $activeTab }) =>
      $activeTab === 'shared' ? 0 : 'calc(50% + 1.5rem)'};
    width: ${({ $activeTab }) => ($activeTab ? 'calc(50% - 1.5rem)' : '0')};

    transition: left 0.2s ease-in-out;
  }

  @media (max-width: 768px) {
    justify-content: center;

    ::before {
      left: ${({ $activeTab }) =>
        $activeTab === 'shared' ? 0 : 'calc(50% + .75rem)'};
      width: ${({ $activeTab }) => ($activeTab ? 'calc(50% - .75rem)' : '0')};
    }
  }
`;

export const Tab = styled.div<{
  $isActive: boolean;
}>`
  ${expandFontToken(FONTS.HEADING_LARGE)};

  padding-bottom: 0.75rem;

  cursor: pointer;

  :first-of-type {
    margin-right: 3rem;
  }

  color: ${({ $isActive }) => ($isActive ? COLORS.GRAY.G2 : COLORS.GRAY.G3)};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_SMALL)};

    padding-bottom: 0.62rem;

    :first-of-type {
      margin-right: 1.5rem;
    }
  }
`;
