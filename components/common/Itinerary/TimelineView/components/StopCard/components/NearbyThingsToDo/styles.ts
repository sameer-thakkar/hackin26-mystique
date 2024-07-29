import styled from 'styled-components';
import { PassByContainer } from 'components/common/Itinerary/TimelineView/components/PassByItemCard/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;

  .swiper,
  .swiper-initialized {
    height: 100%;
  }

  max-width: calc(100vw - 2rem);

  @media only screen and (min-width: 768px), print {
    max-width: calc(753px - 3.125rem);
  }
`;

export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;

  p.passby-heading {
    margin: 0 !important;
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    color: ${COLORS.GRAY.G3};
  }
`;

export const Container = styled.div``;

export const NearbyCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MobileNearbyCards = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 0.25rem;

  ${PassByContainer} {
    flex-shrink: 1;
  }

  .more-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background-color: ${COLORS.GRAY.G8};
    height: 3.25rem;
    padding: 0 0.4375rem;

    .count {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      color: ${COLORS.GRAY.G2};
      text-align: center;
      margin: 0;
    }

    .label {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      color: ${COLORS.GRAY.G2};
      text-align: center;
      margin: 0;
      white-space: nowrap;
    }
  }
`;
