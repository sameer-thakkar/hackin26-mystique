import styled from 'styled-components';
import { TourTags } from 'components/Product/styles';
import { CarouselContainer } from 'UI/MediaCarousel/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { HO_LOGO } from 'const/index';
import { expandFontToken } from 'const/typography';

export const TourInfoContainer = styled.div<{ lessMargin?: boolean }>`
  max-width: 75rem;
  margin: 2.5rem auto 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;

  @media (max-width: 768px) {
    margin: ${({ lessMargin }) =>
      lessMargin ? '2rem auto 0.5rem 1.5rem' : '2.5rem auto 0.5rem 1.5rem'};
    max-width: 90vw;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    .pagination {
      display: flex;
      justify-content: space-between;
      align-self: stretch;
      align-items: center;
      ${expandFontToken(FONTS.HEADING_XS)}
    }
  }
`;

export const SidePanelImageContainer = styled.div`
  height: 13.625rem;
  margin: 1.5rem 0 0.5rem;

  ${CarouselContainer} {
    border-radius: 8px;
  }

  img {
    object-fit: cover;
  }
`;

export const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 1rem 1.5rem;
  background: ${COLORS.BRAND.WHITE};
  box-shadow: 0px -2px 12px 0px rgba(84, 84, 84, 0.1);
  width: 100%;
  box-sizing: border-box;
`;

export const TourInfo = styled.div`
  display: grid;
  grid-template-columns: 7.25rem 1fr;
  gap: 0.75rem;
  align-items: flex-start;


  img {
    border-radius: 8px;
    object-fit: cover;
    height: 7.25rem;
    width: 7.25rem;
  }

  .image-wrap {
    height: unset;
  }

  .textinfo-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    ${TourTags} {
      margin-top: 0;
      .tour-tag{
        margin-right: 0.25rem;
      }
      .tour-tag:not(:last-child):after{
        content:'';
        height:3px;
        width:3px;
        margin-left: 0.25rem;
        border-radius: 50%;
        background: ${COLORS.GRAY.G5};
      }
    }
  }

  .timings {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    ${expandFontToken(FONTS.UI_LABEL_LARGE)}
    color: ${COLORS.GRAY.G3}
    margin: 0;
  }

  .vertical-divider {
    width: 0.063rem;
    height: 1rem;
    align-self: end;
    background: ${COLORS.GRAY.G5};
  }

  .details-container {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;    
  }

  .pills-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  h2 {
    margin: 0;
    ${expandFontToken(FONTS.HEADING_LARGE)}
  }

  @media (max-width: 768px) {
    grid-template-columns: 5rem 1fr;
    align-items: center;

    img {
      height: 5rem;
      width: 5rem;
    }

    .textinfo-container {
      gap: 0.25rem;
    }
    .details-container {
      flex-direction: column;
      gap: 0.5rem;
      align-items: start;
    }
    .pills-container {
      flex-direction: row;
    }
    .timings {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }
    h2 {
      ${expandFontToken(FONTS.HEADING_REGULAR)}
    }
  }
 
`;
export const DetailsPill = styled.div<{ isClickable?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-radius: 0.25rem;
  background: ${COLORS.GRAY.G8};
  padding: 0.5rem;
  margin-top: 0.25rem;
  ${({ isClickable }) => isClickable && 'cursor: pointer'};

  .title {
    ${expandFontToken(FONTS.UI_LABEL_XS)}
    color: ${COLORS.GRAY.G4};
  }

  .info {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.SUBHEADING_SMALL)}
    ${({ isClickable }) =>
      isClickable &&
      `text-decoration-line: underline;
    display: flex;
    align-items: baseline;
    gap: 0.125rem;`}
  }

  @media (max-width: 768px) {
    flex-direction: row;
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    border-radius: 2rem;
    border: 1px solid ${COLORS.GRAY.G7};
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    margin-top: 0;
    padding: 0.125rem 0.5rem 0.1875rem 0.5rem;
  }
`;

export const SwiperControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
  align-items: center;

  svg:not(.disabled):hover {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }

  .prev-pill,
  .next-pill {
    width: 2rem;
    height: 2rem;
  }

  svg {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;

export const RouteInfoContainer = styled.div`
  padding: 1.5rem 0;
  ${expandFontToken(FONTS.PARAGRAPH_LARGE)}

  @media (max-width: 768px) {
    padding: 0;
    ${expandFontToken(FONTS.LIST_REGULAR)}

    .tab {
      ${expandFontToken(FONTS.SUBHEADING_LARGE)}
    }
  }
`;

export const TourRouteInfo = styled.div`
  img {
    margin: 1rem auto 1.5rem;
    border-radius: 8px;
    width: 100%;
    object-fit: cover;
    cursor: pointer;
    height: 22.063rem;
  }
  ul:not(.attraction-list) {
    margin: 0;
    padding-left: 1rem;
  }

  .attraction-list {
    position: relative;
    list-style-type: none;
  }

  .attraction-list::before {
    content: '';
    position: absolute;
    width: 4px;
    background-color: ${COLORS.GRAY.G7};
    top: 0;
    bottom: 0;
    left: 20px;
    margin: 5px 0 15px -2.5px;
  }

  .container {
    position: relative;
    padding-bottom: 1rem;
  }

  .starting-text {
    color: ${COLORS.GRAY.G4};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }
  .attraction-name {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
  }

  .container:first-child::before {
    content: url(${HO_LOGO});
    position: absolute;
    top: 5px;
    left: -34px;
  }

  .container:not(:first-child)::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: ${COLORS.PURPS.SECONDARY};
    border-radius: 50%;
    left: -25.5px;
    margin: 5px 0px;
  }

  @media (max-width: 768px) {
    img {
      height: 12.5rem;
    }
  }
`;
