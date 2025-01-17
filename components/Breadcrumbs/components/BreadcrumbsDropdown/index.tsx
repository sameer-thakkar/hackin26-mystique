import React from 'react';
import type { BreadcrumbsDropdownProps } from 'components/Breadcrumbs/components/BreadcrumbsDropdown/interface';
import {
  StyledBreadcrumbsDropdownContainer,
  StyledBreadcrumbsDropdownItem,
} from 'components/Breadcrumbs/components/BreadcrumbsDropdown/styles';
import { getBreadcrumbLabel } from 'utils/helper';

const BreadcrumbsDropdown: React.FC<
  React.PropsWithChildren<BreadcrumbsDropdownProps>
> = ({ breadcrumbs, mbCity, showName, leftOffset }) => {
  return (
    <StyledBreadcrumbsDropdownContainer $leftOffset={leftOffset}>
      {Object.values(breadcrumbs).map((crumb, index, array) => {
        const { label, url } = crumb;
        const showCrumb = index > 0 && index < array.length - 2;

        if (!showCrumb) return null;

        return (
          <StyledBreadcrumbsDropdownItem
            key={index}
            href={url}
            target="_blank"
            className="breadcrumb"
          >
            {getBreadcrumbLabel({
              label,
              mbCity,
              showName,
            })}
          </StyledBreadcrumbsDropdownItem>
        );
      })}
    </StyledBreadcrumbsDropdownContainer>
  );
};

export default BreadcrumbsDropdown;
