import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div`
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 2rem 0 1rem;
  background: linear-gradient(180deg, #f1edff 0%, #f8f6ff 100%);
  margin: 1.5rem 0;
`;

export const Heading = styled.h2`
  ${expandFontToken(FONTS.HEADING_SMALL)}
    color: ${COLORS.PURPS.DARK_TONE};
  margin: 0 1.5rem;
`;

export const DecoratorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  margin: 0 1.5rem 0.75rem;
`;

export const Decorator = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  align-items: center;

  span {
    color: ${COLORS.PURPS.DARK_TONE};
    ${expandFontToken(FONTS.SUBHEADING_SMALL)}
    opacity: 0.9;
  }
`;

export const HorizontalCardsContainer = styled.div`
  padding: 0 1.5rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-x: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;
