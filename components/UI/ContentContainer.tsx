import styled, { css } from 'styled-components';
import { HALYARD, SIZES } from 'const/ui-constants';

const ContentContainerCommon = css`
  max-width: ${SIZES.MAX_WIDTH};
  margin: 6.25rem auto 0.625rem;
  div {
    font-family: ${HALYARD.FONT_STACK};
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    margin: 6.25rem 1rem 0.625rem;
  }
`;

export const ContentContainer = styled.div`
  ${ContentContainerCommon}
`;

export const PrivacyContentContainer = styled.div`
  ${ContentContainerCommon}

  ol {
    margin-left: 0.5rem;
    padding-left: 0.75rem;
    list-style: none;
    counter-reset: item;
    & > li {
      display: table;
      margin-top: 0.25rem;
      counter-increment: item;
      &:before {
        display: table-cell;
        padding-right: 0.6rem;
        content: counters(item, '.') '. ';
      }
      h2 {
        display: inline;
      }
    }
  }

  ul {
    list-style: disc;
  }

  .italic-underline {
    font-style: italic;
    text-decoration: underline;
  }

  p.reduced-margin-top {
    margin: 0.25rem 0 0;

    &:last-child {
      margin-bottom: 0.5rem;
    }
  }
`;

export const CancellationPolicyContentContainer = styled.div`
  ${ContentContainerCommon}

  ol {
    margin-left: 0.5rem;
    padding-left: 0.75rem;
    list-style: none;
    counter-reset: item;
    & > li {
      display: table;
      margin-top: 0.5rem;
      counter-increment: item;
      &:before {
        display: table-cell;
        padding-right: 0.6rem;
        content: counters(item, '.') '. ';
      }
      h2 {
        display: inline;
      }
    }

    & > li > p > ol > li:before {
      content: counter(item, upper-alpha) '. ';
      display: table-cell;
      padding-right: 0.5625rem;
    }
  }

  ul {
    list-style: disc;
  }
`;
