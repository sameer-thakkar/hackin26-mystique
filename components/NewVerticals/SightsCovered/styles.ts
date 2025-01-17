import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import {
  CardWrapper,
  ImageWrapper,
} from '../AttractionsCarousel/AttractionCard/styles';
import { CarouselContainer } from '../AttractionsCarousel/styles';
import { Container as BoardingPointContainer } from '../RouteDetails/BoardingPoint/styles';
import { Subtext, Title } from '../RouteDetails/RouteInfo/styles';
import { MainContainer, MapContainer } from '../RouteDetails/RouteMap/styles';

export const Container = styled.div`
  display: grid;
  gap: 1.25rem;

  ${MapContainer} {
    height: 25.125rem;
    margin: 0;
  }
  ${MainContainer} {
    height: 27.85rem;
  }
  ${BoardingPointContainer} {
    margin: 0;
  }

  ${CardWrapper} {
    width: 6.938rem;
    ${ImageWrapper} {
      width: 6.938rem;
      height: 4.313rem;
    }
  }
  ${CarouselContainer} {
    padding: 0 0 0.25rem;
    .swiper-slide {
      width: 6.938rem;
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
  .bordered {
    border-bottom: 1px dashed ${COLORS.GRAY.G6};
  }

  @media (max-width: 768px) {
    ${MapContainer} {
      height: 16.5rem;
      margin-top: 0;
    }
    ${MainContainer} {
      height: 18.75rem;
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
    ${CarouselContainer} {
      margin-top: -0.25rem;
      border-top: none;
      padding: 0;
    }
  }
`;

export const Wrapper = styled.div<{ $noTabs?: boolean }>`
  margin-top: 2rem;
  border-top: 1px solid ${COLORS.GRAY.G6};
  padding-top: 2rem;

  .tabs {
    grid-auto-columns: max-content;
    overflow: scroll;
    grid-column-gap: 1.5rem;
    svg {
      height: 1.75rem;
    }
    .prev-slide {
      margin-left: 1rem;
    }
    .next-slide {
      margin-right: 1rem;
    }
    ${({ $noTabs }) => $noTabs && 'display: none;'}
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
    border: none;
    .tabs {
      grid-column-gap: 1rem;
      .prev-slide,
      .next-slide {
        margin-left: -0.75rem;
        margin-right: -0.75rem;
      }
      ${({ $noTabs }) => $noTabs && 'display: none;'}
    }
  }
`;
