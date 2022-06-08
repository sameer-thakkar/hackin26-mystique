import React from 'react';
import styled from 'styled-components';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';

type BreadcrumbProps = {
  orderedLinks: any[];
};

const BreadcrumbContainer = styled.div`
  a {
    color: ${COLORS.TEXT.BEACH};
  }
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const StyledBreadcrumb = styled.a`
  color: ${COLORS.TEXT.PURPS_3} !important;
  text-decoration: none;
  &:last-child {
    color: ${COLORS.GRAY.G3} !important;
  }
  font-family: ${HALYARD.FONT_STACK};
  font-weight: 400;
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
        <React.Fragment key={index}>
          <StyledBreadcrumb
            key={index}
            href={crumb.link?.url}
            target={crumb.link?.target}
          >
            {crumb.text}
          </StyledBreadcrumb>
          {links.length - 1 !== index ? ' / ' : null}
        </React.Fragment>
      );
    })}
  </BreadcrumbContainer>
);

export default Breadcrumb;
