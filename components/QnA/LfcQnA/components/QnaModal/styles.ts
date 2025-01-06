import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const StyledQnaModalContainer = styled.div`
  position: relative;

  .footer-overlay {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 50px;
    z-index: 1;

    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      #ffffff 100%
    );
  }
`;

export const StyledBottomSpacer = styled.div`
  height: 70px;
  width: 100%;
`;

export const StyledModalHeader = styled.div<{ $isTabsVisible?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 24px 24px 0 24px;
  gap: 12px;
  border-bottom: 1px solid #e2e2e2;
  padding-bottom: ${({ $isTabsVisible }) => ($isTabsVisible ? 0 : '20px')};
`;

export const StyledModalHeaderTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0;

  h4 {
    padding: 0;
    margin: 0;
    color: ${COLORS.GRAY.G2};
    ${getFontDetailsByLabel(FONTS.HEADING_LARGE)};
  }
`;

export const StyledCloseBtnWrapper = styled.div`
  z-index: 100;

  button {
    background-color: #f0f0f0;
    position: unset;
  }

  button svg {
    stroke: #000;
    fill: #000;
  }
`;

export const StyledQnaModalBody = styled.div<{
  $isActiveTab?: boolean;
  $isTabsVisible?: boolean;
}>`
  padding: 24px 24px 0 24px;
  overflow-y: auto;
  scroll-behavior: smooth;
  transition: scroll 200ms ease-out;
  display: ${({ $isActiveTab }) => ($isActiveTab ? 'flex' : 'none')};
  flex-direction: column;
  gap: 24px;
  height: calc(
    80dvh - ${({ $isTabsVisible }) => ($isTabsVisible ? '120px' : '80px')}
  );
  margin: 0em;
`;
