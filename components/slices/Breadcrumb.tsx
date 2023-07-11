import React from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { CHEVRON_RIGHT } from 'assets/SvgIcons';

type BreadcrumbProps = {
  orderedLinks: any[];
  shouldLastNodeBeUnderlined?: boolean;
};

const BreadcrumbContainer = styled.div`
  a {
    color: ${COLORS.TEXT.BEACH};
  }

  svg {
    margin: 0 0.5rem;
    width: 8px;
    height: 8px;
  }

  @media (max-width: 768px) {
    padding: 0;

    svg {
      margin: 0 0.25rem;
    }
  }
`;

const StyledBreadcrumb = styled.a<{
  shouldLastNodeBeUnderlined: boolean;
}>`
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};

  &:last-child {
    text-decoration: ${({ shouldLastNodeBeUnderlined }) => {
      return shouldLastNodeBeUnderlined ? 'underline' : 'none';
    }};
  }

  &#breadcrumb {
    color: ${COLORS.GRAY.G4};
    cursor: pointer;
  }

  /* Using "shouldLastNodeBeUnderlined" prop since clickable node will always be underlined */
  &#breadcrumb :last-child {
    cursor: ${({ shouldLastNodeBeUnderlined }) => {
      return shouldLastNodeBeUnderlined ? 'pointer' : 'default';
    }};
  }
  &:not(:last-child):hover {
    color: ${COLORS.TEXT.CANDY_1} !important;
  }

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    text-decoration: none;
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

const Breadcrumb: React.FC<BreadcrumbProps> = ({
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
            {CHEVRON_RIGHT({ fillColor: COLORS.GRAY.G4 })}
          </Conditional>
        </React.Fragment>
      );
    })}
  </BreadcrumbContainer>
);

export default Breadcrumb;
