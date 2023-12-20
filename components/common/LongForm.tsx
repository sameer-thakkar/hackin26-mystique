import React from 'react';
import styled from 'styled-components';
import { SliceZone } from '@prismicio/react';
import {
  catOrSubCatPageSliceComponents,
  sliceComponents,
} from 'components/slices/sliceManager';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { SLICE_TYPES } from 'constants/index';

export const StyledLongForm = styled.div<{
  $isRevampedDesign?: boolean;
  $faqSectionExists?: boolean;
  isVenuePage?: boolean;
  $isNewsPage?: boolean;
}>`
  transition: filter 2s ease-out;
  display: grid;
  grid-row-gap: ${({ isVenuePage, $isNewsPage }) => {
    if (isVenuePage) {
      return '4rem';
    } else if ($isNewsPage) {
      return '1.5rem';
    } else return '3.5rem';
  }};
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${COLORS.GRAY.G2};
    line-height: 1.2;
  }
  .slice-block .image-wrap {
    width: 100%;
  }
  .slice-block img {
    width: 100%;
  }
  .slice-block div[class^='CardSection__CardGrid'] .image-wrap {
    min-height: 100%;
  }
  h2 {
    color: ${COLORS.GRAY.G2};
    display: inline-block;
    ${({ $isNewsPage }) =>
      $isNewsPage ? 'margin: 0 0 0.5rem 0;' : 'margin: 0.2em 0;'}
    ${expandFontToken('Heading/Large')}
  }
  h3 {
    ${expandFontToken('Heading/Small')}
  }
  /* Ignore immediate em,b,strong... inside h-tags */
  h1 > *,
  h2 > *,
  h3 > *,
  h4 > *,
  h5 > *,
  h6 > * {
    font-weight: 500;
    color: ${COLORS.GRAY.G2};
  }
  p {
    ${expandFontToken('Paragraph/Large')}
    margin-top: 0;
    color: ${COLORS.GRAY.G2};
    ${({ $isNewsPage }) => ($isNewsPage ? 'margin:0' : '')};
  }
  .page_tabs + .rich_text .rich-text > p {
    margin-top: 1rem;
  }

  & > p > a {
    text-decoration: none;
    color: ${COLORS.BRAND.PURPS};
  }

  ul {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Paragraph/Large')}
    padding-left: 20px;
  }

  ${({ $isRevampedDesign, $faqSectionExists }) =>
    $isRevampedDesign &&
    $faqSectionExists &&
    `
      display: block;
      padding: 3rem 0;
      background: ${COLORS.BACKGROUND.FLOATING_PURPS};
    `}

  @media (max-width: 768px) {
    ${({ isVenuePage, $isNewsPage }) => {
      if (isVenuePage) {
        return `
            && {
              grid-row-gap: 2.5rem;
            }
            `;
      } else if ($isNewsPage) {
        return `
              grid-row-gap: 1rem;
            `;
      } else {
        return `
              grid-row-gap: 3.25rem;
            `;
      }
    }}

    h1 {
      ${expandFontToken('Heading/Large')}
      color: ${COLORS.GRAY.G2};
    }
    h2 {
      ${expandFontToken('Heading/Regular')}
      color: ${COLORS.GRAY.G2};
    }
    h3 {
      ${expandFontToken('Heading/Small')}
      color: ${COLORS.GRAY.G2};
    }
    h4 {
      font-size: 1rem;
      color: ${COLORS.GRAY.G2};
    }
    h5 {
      font-size: 0.8rem;
      color: ${COLORS.GRAY.G2};
    }
    h6 {
      font-size: 0.6rem;
      color: ${COLORS.GRAY.G2};
    }
    p,
    ul,
    ol {
      ${expandFontToken('Paragraph/Medium')}
    }

    ${({ $isRevampedDesign, $faqSectionExists }) =>
      $isRevampedDesign &&
      $faqSectionExists &&
      `
      padding: 2rem 0;
    `}
  }
`;

type TLongFormProps = {
  content: Array<any>;
  isVenuePage?: boolean;
  isContentPage?: boolean;
  isCatAndSubCatPage?: boolean;
  isRevampedDesign?: boolean;
  [k: string]: any;
};

const LongForm = (longFormProps: TLongFormProps) => {
  const { content, isContentPage, isCatAndSubCatPage, ...props } =
    longFormProps;
  const { isRevampedDesign, isVenuePage, isNewsPage } = props;
  const faqSectionExists = content?.some(
    (slice: Record<string, any>) => slice?.slice_type === SLICE_TYPES.ACCORDION
  );

  return (
    <StyledLongForm
      id="longform"
      $isRevampedDesign={isRevampedDesign}
      $faqSectionExists={faqSectionExists}
      isVenuePage={isVenuePage}
      $isNewsPage={isNewsPage}
    >
      <SliceZone
        slices={content}
        components={
          isCatAndSubCatPage
            ? catOrSubCatPageSliceComponents()
            : sliceComponents()
        }
        context={{ ...props, isContentPage }}
        defaultComponent={() => null}
      />
    </StyledLongForm>
  );
};

export default LongForm;
