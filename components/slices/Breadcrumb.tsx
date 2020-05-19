import React from 'react';
import styled from 'styled-components';
import { COLORS, SOLEIL } from '../../constants/ui-constants';

type BreadcrumbProps = {
  orderedLinks: any[];
};

const BreadcrumbContainer = styled.div`
  a {
    color: ${COLORS.TEAL};
  }
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const StyledBreadcrumb = styled.a`
  text-decoration: none;
  &:last-child {
    color: ${COLORS.GREY_7C};
  }
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${SOLEIL.REGULAR};
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

const Breadcrumb: React.FC<BreadcrumbProps> = ({ orderedLinks: links }) => (
  <BreadcrumbContainer>
    {links.map((crumb, index) => {
      return (
        <>
          <StyledBreadcrumb href={crumb.link?.url} target={crumb.link?.target}>
            {crumb.text}
          </StyledBreadcrumb>
          {links.length - 1 !== index ? ' / ' : null}
        </>
      );
    })}
  </BreadcrumbContainer>
);

export default Breadcrumb;
