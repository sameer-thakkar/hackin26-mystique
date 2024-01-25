import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledSidebar = styled.div`
  padding: 1rem;
  position: sticky;
  top: 5rem;
  height: 300px;
  border-left: 1px solid ${COLORS.GRAY.G7};
  min-width: 180px;

  p {
    margin: 0;
  }

  .title {
    ${expandFontToken(FONTS.HEADING_SMALL)}
    color: ${COLORS.GRAY.G2};
  }

  
`;

export const SidebarLink = styled.a<{ isActive?: boolean }>`
  display: block;
  margin-bottom: 8px;
  color: ${({ isActive }) => (isActive ? 'blue' : 'black')};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: blue;
  }

  &.active {
    background: linear-gradient(
      90deg,
      rgba(128, 0, 255, 0.05) 0%,
      rgba(128, 0, 255, 0) 95.52%
    );
  }
`;
