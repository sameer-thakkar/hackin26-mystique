import styled from 'styled-components';
import { variantStyles } from 'components/GlobalMbs/Banners/Banner/index';
import { IStyledBanner } from 'components/GlobalMbs/Banners/Banner/interface';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';

export const SwiperWrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: max-content;
`;

export const StyledBanner = styled.div<IStyledBanner>(
  ({ isMobile, cardType, isTicketPage }: IStyledBanner) => {
    const styles = isMobile ? variantStyles.small : variantStyles[cardType];
    const checkIsTicketPage = isTicketPage;
    return `
    display: grid;
    align-content: start;
    background: ${COLORS.BRAND.WHITE};
    grid-template-columns: ${styles.gridTemplateColumns};
    column-gap: 80px;
    height: calc(100% - 2px);
    max-width: 1200px;
    margin: 0 auto 72px auto;
    text-decoration: none;
    font-family: ${HALYARD.FONT_STACK};
    font-size: 16px;
    line-height: 150%;
    font-weight: 400;
    margin-top: 16px;
    img {
      height: ${styles.img.height}px;
      object-fit: cover;
      width: 100%;
      border-radius: 8px;
    }
    .card-content-section {
      * {
        margin-top: 0;
      }
      .title {
        font-size: ${checkIsTicketPage ? '46px' : '48px'};
        line-height: 54px;
        font-weight: ${checkIsTicketPage ? '600' : '700'};
        letter-spacing: -0.2px;
        margin-bottom: ${checkIsTicketPage ? '8px' : '16px'};
      }
      .subheading {
        font-weight: 600;
        font-size: 24px;
        line-height: 28px;
        color: #666666;
      }
      .subtext {
        margin-top: ${checkIsTicketPage ? '24px' : '32px'};
        font-feature-settings: "ss04";
      }
      .rank-wrapper {
        display: grid;
        grid-template-rows: repeat(2, max-content);
        margin-bottom: 24px;
      }
      .rank {
        font-size: 17px;
        line-height: 29px;
        margin-bottom: 8px;
      }
      .tag-wrapper{
        display: flex;
      }
      .tag {
        padding: 4px 8px;
        width: max-content;
        background-color: ${COLORS.GRAY.G7};
        color: ${COLORS.GRAY.G3};
        font-size: 12px;
        line-height: 12px;
        border-radius: 2px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
      .info {
        margin-bottom: 34px;
        line-height:200%;
      }
      .info p {
        margin:6px 0;
      }
      .tickets {
        display: flex;
        justify-content: space-between;
        .cta {
          display: flex;
          align-items: center;
          padding: 8px 70px;
          border-radius: 2px;
          background-color: ${COLORS.BRAND.PURPS};
          color: ${COLORS.BRAND.WHITE};
          font-size: 16px;
          line-height: 24px;
        }
        .price-wrapper {
          display: grid;
          grid-template-rows: repeat(2, max-content);
          row-gap: 12px;
          .starting-from {
            font-size: 14px;
            line-height: 16px;
            color: ${COLORS.GRAY.G4}
          }
          .price {
            font-size: 24px;
            line-height: 16px;
            font-weight: 600;
          }
        }
      }
      .bold {
        font-weight: 600;
      }
      .toggle-timings {
        cursor: pointer;
        svg {
          width: 12px;
          height: 12px;
        }
      }
      a {
        color: ${COLORS.TEXT.CANDY_1};
        word-wrap: break-word;
      }
    }
    .swiper-pagination.swiper-pagination-bullets {
      top: unset;
      display: block;
    }
    @media (max-width: 1024px) {
      grid-template-columns: unset;
      column-gap: unset;
      grid-template-rows: repeat(2, max-content);
      row-gap: 24px;
      font-size: 14px;
      line-height: 143%;
      margin: 0 auto 48px auto;
      img {
        height: 382px;
        border-radius: 0;
        width: 100%;
        object-fit: cover;
      }
      .card-content-section {
        padding: 0;
        width: calc(100vw - (5.6vw * 2));
        box-sizing: border-box;
        grid-row: 2;
        margin: 0 auto;
        .title {
          font-size: 32px;
          margin-bottom: 8px;
        }
        .rank-wrapper {
          margin-bottom: 16px;
        }
        .rank {
          font-size: 16px;
        }
        .info {
          margin-bottom: 24px;
        }
        .tickets {
          flex-direction: column;
          .price-wrapper {
            margin-bottom: 24px;
          }
          .cta {
            padding: 8px 0;
            width: 100%;
            justify-content: center;
          }
        }
      }
    }
    @media(max-width: 500px) {
      img {
        height: 235px;
      }
    }
  `;
  }
);
