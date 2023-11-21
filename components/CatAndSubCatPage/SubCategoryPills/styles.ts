import styled from 'styled-components';
import COLORS from 'const/colors';
import { SIZES } from 'const/ui-constants';

export const PillsSection = styled.div<{
  $isSubCategoryPage: boolean;
  $isSticky: boolean;
}>`
  background: ${COLORS.BRAND.WHITE};
  padding: 2rem 0;

  ${({ $isSubCategoryPage }) =>
    !$isSubCategoryPage &&
    `
    position: sticky;
    top: 44px;
    z-index: 5;
  `}

  ${({ $isSticky }) =>
    $isSticky &&
    `  
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.10), 0px 0px 1px 0px rgba(0, 0, 0, 0.10);
    `}

  @media (max-width: 768px) {
    ${({ $isSubCategoryPage }) => !$isSubCategoryPage && `top: 56px;`}
  }
`;

export const PillsContainer = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
  position: relative;

  .swiper-slide {
    width: fit-content;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: unset;
    margin: unset;
  }
`;

export const SwiperControls = styled.div<{
  $isBeginning: boolean;
  $isEnd: boolean;
}>`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .next-pill,
  .prev-pill {
    width: 11rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 3;
    pointer-events: none;
  }
  .prev-pill {
    margin-right: auto;
    background: linear-gradient(
      90deg,
      ${COLORS.BRAND.WHITE} 25%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .next-pill {
    align-items: flex-end;
    margin-left: auto;
    background: linear-gradient(
      270deg,
      ${COLORS.BRAND.WHITE} 25%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  svg {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    pointer-events: auto;
  }
`;
