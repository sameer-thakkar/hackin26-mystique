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
    grid-template-columns: auto;
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

export const ExpandableSectionWrapper = styled.div<{
  $isCruiseVariant?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 0.75rem;

  .icon-text-wrapper {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.625rem;
  }
  .location-pin {
    border: 1.09px solid ${COLORS.GRAY.G6};
    border-radius: 13.04px;
    padding: 0.536rem 0.559rem 0.482rem 0.576rem;
  }
  .chevron {
    border-radius: 50%;
    flex: 0 0 auto;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    &&& {
      ${({ $isCruiseVariant }) =>
        $isCruiseVariant
          ? css`
              padding: 1.25rem 0 0.5rem;
            `
          : css`
              border-bottom: 1px dashed ${COLORS.GRAY.G6};
            `}
    }
    .icon-text-wrapper {
      gap: 0.5rem;
    }
    .location-pin {
      padding: 0.426rem 0.447rem 0.35rem 0.457rem;
    }
  }
`;

export const Title = styled.div<{ $isBoardingPoint?: boolean }>`
  margin-bottom: ${({ $isBoardingPoint }) =>
    $isBoardingPoint ? '0.375rem' : '0.25rem'};
  ${expandFontToken(FONTS.HEADING_SMALL)}
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
  }
`;
export const Subtext = styled.div<{ $isBoardingPoint?: boolean }>`
  ${expandFontToken(FONTS.UI_LABEL_LARGE)}
  margin-bottom: ${({ $isBoardingPoint }) =>
    $isBoardingPoint ? '1rem' : '0.75rem'};
  ${({ $isBoardingPoint }) =>
    $isBoardingPoint &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      padding-bottom: 0.063rem;
    `}

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
    top: -4.25rem;
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

export const DetailsWrapper = styled.div<{
  $isCruiseVariant?: boolean;
}>`
  display: grid;
  align-content: start;
  gap: 0;
  padding: 1.5rem 0 0;
  height: 100%;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  & > :not(:last-child) {
    border-bottom: ${({ $isCruiseVariant }) =>
      $isCruiseVariant ? `1px dashed ${COLORS.GRAY.G6}` : 'none'};
  }
  & > :not(:first-child) {
    padding: 1.25rem 0;
  }
  .timings-section {
    display: grid;
    gap: ${({ $isCruiseVariant }) =>
      $isCruiseVariant ? '1.25rem' : '0.75rem'};
    & > :not(:last-child) {
      border-bottom: 1px dashed ${COLORS.GRAY.G6};
    }
    ${Subtext} {
      margin-bottom: 1.25rem;
    }
  }
  .duration,
  .frequency {
    ${Title} {
      ${expandFontToken(FONTS.UI_LABEL_LARGE)}
    }
    ${Subtext} {
      ${expandFontToken(FONTS.HEADING_SMALL)}
    }
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
    overflow: hidden;
    & > :not(:first-child) {
      padding: ${({ $isCruiseVariant }) =>
        $isCruiseVariant ? '1rem 0' : '1rem 0 0'};
    }
    .duration,
    .frequency {
      ${Title} {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
      }
      ${Subtext} {
        ${expandFontToken(FONTS.SUBHEADING_LARGE)}
      }
    }
  }
`;
