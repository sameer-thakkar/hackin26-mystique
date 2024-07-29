import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ThumbnailContainerStyles = css`
  height: 3.75rem;
  aspect-ratio: 16/10;
  background-color: ${COLORS.GRAY.G2};
  border-radius: 0.5rem;
`;

export const ThumbnailContainer = styled.div`
  height: 3.75rem;
  aspect-ratio: 16/10;
  background-color: ${COLORS.GRAY.G2};
  border-radius: 0.5rem;
  img {
    border-radius: 0.5rem;
  }
`;

export const IconContainer = styled.div`
  ${ThumbnailContainerStyles}
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 1.5rem;
    width: 1.5rem;
    path {
      stroke: ${COLORS.BRAND.WHITE};
    }
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
  gap: 0.5rem 0;
`;

export const Title = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}// margin-bottom: 0.5rem;
`;
