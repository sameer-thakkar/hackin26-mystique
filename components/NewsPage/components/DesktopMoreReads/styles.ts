import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const Container = styled.div`
  margin-top: 3rem;
  padding-top: 1.5rem;
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .navigation {
      display: flex;
      gap: 1.25rem;
      align-items: center;
      a {
        ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
        text-decoration: underline;
        color: ${COLORS.GRAY.G2};
      }
      a:hover {
        color: ${COLORS.BRAND.BLACK};
      }
    }
    .icons {
      display: flex;
      gap: 0.5rem;
      > * {
        cursor: pointer;
      }
      svg.disabled:hover {
        cursor: not-allowed;
        fill: none;
      }
      svg:hover {
        fill: ${COLORS.GRAY.G8};
      }
    }
  }
  h2 {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
  }
  border-top: 1px solid ${COLORS.GRAY.G7};
`;

export const Wrapper = styled.div<{
  $noOfArticles: number;
}>`
  display: grid;
  margin-top: 2rem;
  .swiper {
    max-width: ${SIZES.MAX_WIDTH};
    width: calc(100vw - 5.46vw * 2);
    -webkit-transform: translate3d(0, 0, 0) !important;
    z-index: 1;
  }
  &:not(.swiper-initialized) .swiper-wrapper {
    .swiper-slide {
      width: 17.625rem;
      margin-right: 1.5rem;
    }
  }
  time {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  }
  h3 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: break-word;
    text-overflow: ellipsis;
    margin-top: 0.375rem;
    ${({ $noOfArticles }) => {
      return $noOfArticles >= 4
        ? expandFontToken(FONTS.HEADING_REGULAR)
        : expandFontToken(FONTS.HEADING_LARGE);
    }}
  }
  .article-content {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    margin: 0.375rem 0 0.75rem 0;
  }
  .author-name {
    display: flex;
    align-items: center;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    svg {
      height: 1.25rem;
      width: 1.25rem;
      margin-right: 0.5rem;
    }
  }
  .image-wrapper {
    background-color: ${COLORS.GRAY.G6};
    border-radius: 8px;
    img {
      object-fit: cover;
    }
  }

  ${({ $noOfArticles }) => {
    switch (true) {
      case $noOfArticles === 1:
        return `
            grid-template-columns: repeat(1, 1fr);
            .article-wrapper {
                display: flex;
                gap: 1.5rem;
            }
            .image-wrapper {
                flex: 1.4;
                padding-top: 16.5%;
                padding-bottom: 16.5%;
                position: relative;
               
            }
            .image-wrap {
                position: absolute;
                top: 0;
                bottom: 0;
                img {
                    border-radius: 8px;
                }
            }
            .content {
                flex: 1;
                padding-top: 1.5rem;
            }

        `;

      case $noOfArticles >= 2:
        return `
            gap: 1.5rem;
            grid-template-columns: repeat(${$noOfArticles}, 1fr);
            .article-wrapper {
                display: flex;
                flex-direction: column;
            }
            .image-wrapper {
                padding-top: 30.5%;
                padding-bottom: 30.5%;
                position: relative;
            }
            .image-wrap {
                position: absolute;
                top: 0;
                bottom: 0;
                img {
                    border-radius: 8px;
                }
            }  
            .content {
                padding-top: ${$noOfArticles >= 4 ? '0.75rem' : '1rem'}
            }
        `;
    }
  }}

  @media (max-width: 768px) {
    grid-auto-flow: row;
  }
`;
