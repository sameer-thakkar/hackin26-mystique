import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div<{ $isTimelineModal?: boolean }>`
  display: grid;
  grid-template-columns: 24.375rem auto;
  height: 100%;
  gap: 1.5rem;
  overflow-y: hidden;
  ${({ $isTimelineModal }) =>
    $isTimelineModal
      ? css`
          grid-template-columns: 1fr 1.5fr;
          padding: 0 1.5rem;
          overflow-y: scroll;
        `
      : css`
          padding: 0 1.5rem;
        `}

  @media (max-width: 768px) {
    gap: 0;
    grid-template-columns: auto auto;
    padding: 0 0 1rem;
    overflow: hidden;
    ${({ $isTimelineModal }) =>
      $isTimelineModal &&
      css`
        grid-template-columns: auto;
        padding: 0 1rem;
      `}
  }
`;

export const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 0 0;
  height: 100%;
  overflow: scroll;
  & > :not(:last-child) {
    border-bottom: 1px dashed ${COLORS.GRAY.G6};
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
    overflow: hidden;
    & > :not(:last-child) {
      border-bottom: unset;
    }
    & > :nth-child(-n + 2) {
      border-bottom: 1px dashed ${COLORS.GRAY.G6};
    }
  }
`;

export const ExpandableSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 0.75rem;
  svg {
    background: ${COLORS.GRAY.G8};
    border: 1px solid ${COLORS.GRAY.G7};
    border-radius: 50%;
    padding: 0.438rem;
  }
`;

export const Title = styled.div`
  margin-bottom: 0.25rem;
  ${expandFontToken(FONTS.HEADING_SMALL)}
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
  }
`;
export const Subtext = styled.div`
  margin-bottom: 0.75rem;
  ${expandFontToken(FONTS.UI_LABEL_LARGE)}
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
  }
`;

export const SideModal = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: ${COLORS.BRAND.WHITE};
  right: -100%;

  @media (max-width: 768px) {
    border-radius: 1.25rem 1.25rem 0 0;
    top: -5.313rem;
  }
`;

export const TimelineWrapper = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 1.5rem;
  ::-webkit-scrollbar {
    width: 0.125rem;
    margin-top: 1.5rem;
  }
  ::-webkit-scrollbar-thumb {
    background: ${COLORS.GRAY.G6};
  }
  ::-webkit-scrollbar-track-piece:start {
    background: transparent;
    margin-top: 1.5rem;
  }
  ::-webkit-scrollbar-track-piece:end {
    background: transparent;
    margin-bottom: 4.375rem;
  }
  @media (max-width: 768px) {
    padding-bottom: 1rem;
  }
`;
