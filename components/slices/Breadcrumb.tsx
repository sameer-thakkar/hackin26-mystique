import React from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import ChevronRight from 'assets/chevronRight';

type BreadcrumbProps = {
  orderedLinks: any[];
  shouldLastNodeBeUnderlined?: boolean;
};

const BreadcrumbContainer = styled.div`
  svg {
    margin: auto 0.5rem;
    width: 8px;
    height: 8px;
  }

  @media (max-width: 768px) {
    padding: 0;

    svg {
      margin: 0 0.5rem;
    }
  }
`;

const StyledBreadcrumb = styled.a<{
  shouldLastNodeBeUnderlined: boolean;
}>`
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};

  &#breadcrumb {
    color: ${COLORS.GRAY.G3};

    &:not(:last-child) {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  &:not(:last-child):hover {
    color: ${COLORS.BRAND.PURPS} !important;
  }

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }
`;

/**
 *
 * ### Non-repeatable zone
 * - Current Page Title
 *  - add current page title here.
 *
 * ### Repeatable zone
 * - Page URL
 *  - Add URL to respective level of page.
 * - Page Title
 *  - Title for Respective Level of page
 */

const Breadcrumb: React.FC<React.PropsWithChildren<BreadcrumbProps>> = ({
  orderedLinks: links,
  shouldLastNodeBeUnderlined = true,
}) => (
  <BreadcrumbContainer>
    {links.map((crumb, index) => {
      return (
        <React.Fragment key={index}>
          <StyledBreadcrumb
            key={index}
            href={crumb.link?.url}
            target={crumb.link?.target}
            id="breadcrumb"
            shouldLastNodeBeUnderlined={shouldLastNodeBeUnderlined}
          >
            {crumb.text}
          </StyledBreadcrumb>
          <Conditional if={links.length - 1 !== index}>
            {ChevronRight({ fillColor: COLORS.GRAY.G3 })}
          </Conditional>
        </React.Fragment>
      );
    })}
  </BreadcrumbContainer>
);

export default Breadcrumb;
