import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { BreadcrumbsProps } from 'components/Breadcrumbs/interface';
import {
  BreadcrumbsContainer,
  StyledBreadcrumbLink,
  StyledBreadcrumbSpan,
} from 'components/Breadcrumbs/styles';
import Conditional from 'components/common/Conditional';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { trackEvent } from 'utils/analytics';
import { getBreadcrumbLabel } from 'utils/helper';
import { titleCase } from 'utils/stringUtils';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS } from 'const/index';
import { CHEVRON_RIGHT } from 'assets/SvgIcons';

const BreadcrumbsDropdown = dynamic(
  () =>
    import(
      /* webpackChunkName: "BreadcrumbsPopup" */ 'components/Breadcrumbs/components/BreadcrumbsDropdown'
    )
);

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  breadcrumbs,
  taggedCity,
  primaryCity,
  showName = '',
  isV2MB = false,
  isContentPage = false,
  isShowPage = false,
  isVenuePage = false,
  isNewsPage = false,
  isMobile,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLSpanElement>(null);
  const ellipsisRef = useRef<HTMLSpanElement>(null);

  const mbCity = titleCase(taggedCity || primaryCity?.displayName || '');
  const COLLAPSE_LIMIT = isMobile ? 3 : 5;
  const isBreadcrumbsCollapsed =
    Object.values(breadcrumbs).length > COLLAPSE_LIMIT;

  useCaptureClickOutside(
    dropdownRef,
    () => {
      setIsDropdownOpen(false);
    },
    [ellipsisRef]
  );

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const { tagName, className } = e.target as HTMLElement;

    if (tagName !== 'A' && tagName !== 'SPAN') return;

    switch (true) {
      case className.includes('breadcrumb'):
        trackEvent({
          eventName: ANALYTICS_EVENTS.BREADCRUMBS_CLICKED,
        });
        break;
      case className.includes('ellipsis'):
        setIsDropdownOpen((prevState) => !prevState);
        break;
    }
  };

  return (
    <BreadcrumbsContainer
      $isV2MB={isV2MB}
      $isContentPage={isContentPage}
      $isShowPage={isShowPage}
      $isVenuePage={isVenuePage}
      $isNewsPage={isNewsPage}
      $isDropdownOpen={isDropdownOpen}
      onClick={handleClick}
    >
      {Object.values(breadcrumbs).map((crumb, index, array) => {
        const { label, url } = crumb;
        const isCrumbCollapsed =
          isBreadcrumbsCollapsed && index > 0 && index < array.length - 2;

        if (!label || !url) return null;

        return (
          <React.Fragment key={index}>
            <Conditional if={array.length - 1 !== index}>
              <StyledBreadcrumbLink
                href={url}
                target="_blank"
                className="breadcrumb"
                $isCrumbCollapsed={isCrumbCollapsed}
              >
                {getBreadcrumbLabel({
                  label,
                  mbCity,
                  showName,
                })}
              </StyledBreadcrumbLink>
              <Conditional if={isCrumbCollapsed && index === 1}>
                <span
                  className="ellipsis"
                  role="button"
                  tabIndex={0}
                  ref={ellipsisRef}
                >
                  ...
                </span>
                <Conditional if={isDropdownOpen}>
                  <span ref={dropdownRef}>
                    <BreadcrumbsDropdown
                      breadcrumbs={breadcrumbs}
                      mbCity={mbCity}
                      showName={showName}
                      leftOffset={ellipsisRef.current?.offsetLeft || 0}
                    />
                  </span>
                </Conditional>
              </Conditional>
              <Conditional if={!isCrumbCollapsed || index !== 2}>
                {CHEVRON_RIGHT({ fillColor: COLORS.GRAY.G3 })}
              </Conditional>
            </Conditional>
            <Conditional if={array.length - 1 === index}>
              <StyledBreadcrumbSpan>
                {getBreadcrumbLabel({
                  label,
                  mbCity,
                  showName,
                })}
              </StyledBreadcrumbSpan>
            </Conditional>
          </React.Fragment>
        );
      })}
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs;
