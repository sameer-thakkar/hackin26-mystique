import styled from 'styled-components';
import { NotesContainer } from 'components/shortcodes/Notes';
import { GoogleMapWrapper } from 'components/ShowPages/GoogleMap';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ContentSectionsWrapper = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: auto;

  @media (max-width: 768px) {
    width: auto;
    max-width: auto;
  }
`;

export const ContentWrapper = styled.div`
  width: 44.625rem;

  .show-description p,
  .storyline-content p {
    :not(:last-of-type) {
      margin-bottom: 0.75rem !important;
    }
  }
  .theatre-description p {
    :first-of-type {
      margin-bottom: 0.75rem !important;
    }
  }
  @media (max-width: 768px) {
    width: 100%;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    width: 25.5rem;
  }

  @media only screen and (min-width: 1024px) and (max-width: 1366px) {
    width: 30.5rem;
  }
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  > p,
  li,
  .show-description > p,
  .storyline-content > p,
  .theatre-description > p {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)};
    color: ${COLORS.GRAY.G2};
    margin: 0;
    width: 100%;

    :first-child {
      margin: 0;
    }

    a {
      margin-top: 1rem;
      display: inline-block;
    }
  }

  li {
    margin: 0;
  }

  ul {
    margin: 0;
  }

  h2 {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin: 3.5rem 0 1rem;
    display: flex;
    align-items: center;
    z-index: 1;
    :first-child {
      margin: 0 0 1rem;
    }

    svg {
      height: 1.25rem;
      width: 1.25rem;
      margin-right: 0.5rem;
    }
  }

  .show-description {
    margin-top: 3.5rem;
  }
  .theatre-name {
    justify-content: space-between;
    span {
      display: flex;
      align-items: center;
    }
    .read-more {
      ${expandFontToken(FONTS.UI_LABEL_LARGE)};
      color: ${COLORS.GRAY.G2};
      text-decoration: underline;
      cursor: pointer;
    }
  }

  ${GoogleMapWrapper} {
    margin: 2rem 0 0;
  }

  ${NotesContainer} {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    .show-description {
      margin-top: 3rem;
    }

    .show-description p,
    .storyline-content p,
    .theatre-description p,
    p,
    li {
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};

      a {
        margin-top: 0.75rem;
      }
    }

    h2 {
      ${expandFontToken(FONTS.SUBHEADING_LARGE)};
      margin: 3rem 0 0.75rem;
      svg {
        height: 1rem;
        width: 1rem;
        min-height: 1rem;
        min-width: 1rem;
      }
    }

    ${GoogleMapWrapper} {
      margin: 1.5 0 0;
    }

    .theatre-name {
      margin-bottom: 0.25rem !important;
      .read-more {
        ${expandFontToken(FONTS.BUTTON_SMALL)};
        line-height: 0.875rem;
        box-sizing: content-box;
        color: ${COLORS.GRAY.G3};
        text-decoration: none;
        cursor: pointer;
        padding: 0.5rem 0.75rem;
        height: 0.75rem;
        text-align: center;
        border-radius: 0.25rem;
        border: 1px solid ${COLORS.GRAY.G4};
        display: flex;
        align-items: center;
        min-width: fit-content;
      }
    }
  }
`;
