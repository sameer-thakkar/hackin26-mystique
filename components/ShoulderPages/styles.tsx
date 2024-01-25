import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledContentPage = styled.div`
  display: grid;
  grid-row-gap: 4rem;
  margin-top: 0;
  margin-bottom: 72px;

  .page_tabs + div {
    margin-top: -64px;
  }

  .slice-block h2 {
    margin: 0.2em 0;
    position: relative;
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.HEADING_LARGE)}
  }
  .slice-block h3 {
    position: relative;
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.HEADING_SMALL)}
  }

  .slice-block > h2 {
    margin-bottom: 20px;
  }

  .slice-block p {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
    color: ${COLORS.GRAY.G2};
    margin-bottom: 1rem;
  }

  .slice-block.breadcrumbs + .slice-block {
    margin-top: -2rem;

    p {
      margin: 0;
    }
  }

  .slice-block ul {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
    padding-left: 20px;
  }

  .product .product-left p {
    margin: 0;
  }
  .product .product-left {
    width: 75%;
    display: grid;
    grid-row-gap: 10px;
  }

  .product {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid ${COLORS.GRAY.G6};
    /*box-shadow: 0 1px 2px rgba(0,0,0,.18);*/
    margin-bottom: 40px;
    border-radius: 5px;
    padding: 20px 40px;
  }

  .products:last-child {
    margin-bottom: 70px;
  }

  .products .product .product-left .product-heading {
    color: ${COLORS.GRAY.G2};
    margin: 0;
  }

  .slice-wrapper.slice-block {
    width: 100%;
  }

  .slice-wrapper .block-img img {
    max-width: 100%;
  }

  .ticket_card_shoulder_page {
    margin: 0 auto;
    padding: 0;
  }

  .slice-block.rich_text p + h2 {
    margin: 1.5rem 0 0.25rem;
  }

  @media (max-width: 768px) {
    grid-row-gap: 3rem;
    .page_tabs + div {
      margin-top: -48px;
    }
    .slice-block h2 {
      ${expandFontToken(FONTS.HEADING_REGULAR)}
    }
    .product .product-left {
      width: 100%;
    }
    .slice-block p,
    .slice-block .more-reads-text-text {
      ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
    }

    .slice-block ul {
      ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
    }
    .slice-block h3,
    .slice-block .more-reads-text-heading,
    .products .product .product-left .product-heading {
      ${expandFontToken(FONTS.HEADING_XS)}
    }
    .product {
      display: block;
      padding: 0 20px;
    }
    .slice-wrapper.slice-block {
      padding: 0 16px;
      width: calc(100% - 32px);
    }
    .slice-block.rich_text p + h2 {
      margin: 1.25rem 0 0.25rem;
    }
  }
`;
