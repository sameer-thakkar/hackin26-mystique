import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { MODAL_TABS_WRAPPER_GAP } from '../../constants';

const calculateTranslateX = (index: number) => {
  const percentage = index * 100;
  const gap = index * MODAL_TABS_WRAPPER_GAP;
  return `translateX(calc(${percentage}% + ${gap}px))`;
};

export const StyledQnaTabsWrapper = styled.div<{
  currentActiveTabIndex: number;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${MODAL_TABS_WRAPPER_GAP}px;
  padding: 0;
  width: max-content;

  .tab-underline {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 115px;
    height: 2px;
    background-color: ${COLORS.GRAY.G1};
    transition: 0.25s ease-out;

    transform: ${(props) => calculateTranslateX(props.currentActiveTabIndex)};
  }
`;

export const StyledTabBlock = styled.p<{
  isActive?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  cursor: pointer;
  position: relative;
  width: 115px;
  transition: color 0.15s ease-in;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
  margin: 0;
  color: ${(props) => (props.isActive ? COLORS.GRAY.G1 : COLORS.GRAY.G4)};

  &:hover {
    color: ${COLORS.GRAY.G2};
  }
`;
