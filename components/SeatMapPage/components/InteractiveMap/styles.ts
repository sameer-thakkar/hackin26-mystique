import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const InteractiveMapWrapper = styled.div`
  width: 100% !important;

  .magic-label-container {
    overflow-y: hidden;
    box-sizing: border-box;
    width: 100%;
    padding: 0 1.5rem;
    margin-bottom: 2rem;
    position: relative;
  }
`;

export const MSectionInfoWrapper = styled.div`
  height: 70dvh;
  overflow: hidden auto;
  scrollbar-width: none;
`;

export const MSectionInfoContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
  height: 80dvh;
  overflow: hidden;
`;

export const SvgMapContainer = styled.div`
  all: inherit;

  svg {
    height: 100%;
    width: 100%;
  }

  @media (max-width: 768px) {
    height: 100%;
    width: 100%;
  }
`;

export const SVGContainer = styled.div`
  background: ${COLORS.GRAY.G7};
  overflow: hidden;
  height: 186px;
  width: 100%;
  border-radius: 0.75rem;f
  flex: 1;
  border: 1px solid ${COLORS.GRAY.G7}
`;

export const MSectionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MQuickInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: rgba(255, 255, 255, 0.95);
  position: relative;
  overflow: hidden;
  color: ${COLORS.GRAY.G2};
`;

export const MHeaderLeft = styled.div`
  flex: 0.7;
  display: flex;
  align-items: flex-start;
  padding: 0;
  font-size: 1rem;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
`;

export const MHeaderRight = styled.div`
  flex: 0.3;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0;
  font-size: 1rem;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
`;

export const MQuickInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MQuickInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const MLabel = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin: 0;
  padding: 0;
  color: ${COLORS.GRAY.G3} !important;
  ${expandFontToken(FONTS.PARAGRAPH_REGULAR)} !important;
`;

export const MHR = styled.hr`
  border: 0;
  margin: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #e2e2e2 0%, rgba(226, 226, 226, 0) 100%);
`;

export const MagicLabelWrapper = styled.div`
  overflow-y: hidden;
  box-sizing: border-box;
  width: calc(100% - 24px);
  padding: 0 1.5rem;
  margin: 24px auto;
  margin-top: 8px;
  position: relative;

  @media (max-width: 768px) {
    & {
      padding: 0 1rem;
    }
  }

  @media (max-width: 400px) {
    width: calc(100% - 12px);
    margin: 12px auto;
    padding: 0 0.75rem;
  }
`;

export const MagicLabel = styled.div<{ isFirstScroll: boolean }>`
  background: white;
  padding: 0.6rem 0;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  color: rgba(0, 0, 0, 0.7);
  background: white;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  ${({ isFirstScroll }) =>
    isFirstScroll &&
    `animation: magic-label-bg-animation 1.4s 1; background: transparent;`}}

  &:after {
    position: absolute;
    content: "";
    width: 30px;
    height: 180px;
    background: #DFBFFF;
    z-index: 0;
    transform: rotate(65deg);
    filter: blur(2rem);
    left: -50%;
    ${({ isFirstScroll }) =>
      isFirstScroll && `animation: magic-label-animation 1.5s 1;`}}
  }

  @keyframes magic-label-animation {
    from {left: 0;}
    to {left: 150%;}
  }

  @keyframes magic-label-bg-animation {
    from {
      color: #6600CC; 
      background: #F8F6FF; 
    }
    to {
      color: #6600CC; 
      background: #F8F6FF; 
    }
  }

  p {
    position: relative;
    margin: 0;
    padding: 0;
    z-index: 1;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    color: ${COLORS.GRAY.G2}
    white-space: nowrap;
  }

  svg {
    margin-right: 0.4rem;
    margin-top: 0.2rem;
  }

  @media (max-width: 768px) {
    & {
      border-radius: 0.25rem;
      padding: 0.4rem 0.75rem;
    }

    p {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      white-space: nowrap;
    }
  }

  @media (max-width: 400px) {
    p {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      font-size: 12px;
      white-space: nowrap;
    }
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  svg {
    width: 20px;
    height: 20px;
    color: ${COLORS.GRAY.G3} !important;
  }
`;
