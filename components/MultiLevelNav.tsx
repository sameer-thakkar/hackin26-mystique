import React from 'react';
import styled from 'styled-components';
import { strings } from 'const/strings';
import { useState, useRef, useEffect } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { ANALYTICS_PROPERTIES } from 'const/index';
import { ANALYTICS_EVENTS } from 'const/index';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';
import { withTrailingSlash } from 'utils/helper';
import Conditional from 'components/common/Conditional';

import LinkResolver from './LinkResolver';
import { CHEVRON_DOWN } from '../assets/SvgIcons';

const StyledMenuItem = styled.li`
  padding: 12px 16px;
  ${expandFontToken('UI/Label Medium')}
  color: ${({ theme: { primaryBGText }, isGlobalMb }) =>
    isGlobalMb
      ? COLORS.GRAY.G2
      : primaryBGText
      ? primaryBGText
      : COLORS.GRAY.G2};
  cursor: pointer;
  position: relative;
  span {
    color: ${({ theme: { primaryBGText }, isGlobalMb }) =>
      isGlobalMb
        ? COLORS.GRAY.G2
        : primaryBGText
        ? primaryBGText
        : COLORS.GRAY.G2};
  }
  &.group-booking-cta {
    padding: 12px 16px;
    border: 1px solid;
    border-radius: 4px;
    line-height: 16px;
  }
  .withIcon {
    display: grid;
    align-items: center;
    align-content: center;
    grid-template-columns: auto auto;
    grid-column-gap: 8px;
    .nest-icon {
      display: flex;
      justify-self: right;
      svg {
        height: 24px;
        path {
          stroke: ${({ theme: { primaryBGText }, isGlobalMb }) =>
            isGlobalMb
              ? COLORS.GRAY.G2
              : primaryBGText
              ? primaryBGText
              : COLORS.GRAY.G2};
          stroke-width: 1.5px;
        }
      }
    }
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      height: 100%;
      right: -10px;
      width: 10px;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    &.group-booking-cta {
      border: none;
    }
    .withIcon {
      .nest-icon {
        justify-self: end;
        svg {
          transition: transform 0.3s ease;
          path {
            stroke: ${COLORS.GRAY.G2};
          }
        }
      }
    }
    a {
      display: block;
    }
    & .nested-menu {
      li {
        padding-right: 0;
      }
    }
    ${({ nestOpen }) =>
      nestOpen &&
      `
      background: ${COLORS.BACKGROUND.FLOATING_PURPS};
      & > .link-element > .nested-menu  {
        display: grid;
        visibility: unset;
      }
      & > a > .withIcon > .nest-icon {
        svg{
          transform: rotate(180deg)
        }
        & > a > .withIcon > .nest-icon {
          svg{
            transform: rotate(180deg)
          }
        }
      `}
  }
`;

const NestedMenu = styled.ul`
  display: grid;
  visibility: hidden;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 24px;
  left: 0;
  z-index: 11;
  width: max-content;
  background-color: ${({ theme: { primaryBackground } }) =>
    primaryBackground ? primaryBackground : COLORS.BRAND.WHITE};
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .nest-icon svg {
    transform: rotate(-90deg);
  }
  & ul {
    left: 100%;
    top: 0;
  }
  & ul.off-screen {
    left: unset;
    right: 100%;
  }

  ${StyledMenuItem}:hover > .link-element > & {
    visibility: unset;
    li:hover {
      background-color: ${({ theme: { primaryBGHover } }) =>
        primaryBGHover ? primaryBGHover : COLORS.BACKGROUND.FLOATING_PURPS};
    }
  }
  @media (max-width: 768px) {
    position: unset;
    display: none;
    top: unset;
    left: unset;
    box-shadow: unset;
    width: 100%;
    background: transparent;
    .nest-icon svg {
      transform: unset;
    }
    ${StyledMenuItem}:hover > .link-element > & {
      li:hover {
        background: initial;
      }
    }
  }
`;

const Nav = styled.nav`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-column-gap: 30px;
  ${({ isMobile }) => !isMobile && `margin-left: 16px;`}
  & > li {
    padding: 0;
  }
  li {
    list-style: none;
  }
  & > li > a > ul.off-screen {
    left: unset;
    right: 0;
  }
  @media (max-width: 768px) {
    display: none;
    &.navigation-nav-open {
      display: grid;
      position: fixed;
      top: 56px;
      left: 0;
      height: 100%;
      align-content: flex-start;
      background: ${COLORS.BRAND.WHITE};
      width: 100%;
      grid-auto-flow: row;
      overflow: scroll;
      grid-gap: 0;
      z-index: 999999;
      & > li {
        padding: 16px;
      }
      & > li > a > .withIcon {
        padding-bottom: 16px;
        border-bottom: 1px solid ${COLORS.GRAY.G6};
      }
    }
    .expandMenuItems {
      display: grid;
      margin: 0 16px;
    }
  }
`;

const HeadingMenu = styled(StyledMenuItem)`
  font-weight: 500;
  border-bottom: 1px solid ${COLORS.GRAY.G7};
  display: grid;
  margin: 12px 14px 0;
  align-items: center;
  grid-template-columns: auto auto;
  .nest-icon {
    display: flex;
    justify-self: right;
    transition: transform 0.3s ease;
  }
  .chevronUp {
    transform: rotate(180deg);
  }
`;

const Navigation = (props) => {
  const { slices, isMobile, navOpen, id, isGlobalMb = false } = props;
  return (
    <Nav
      className={navOpen ? 'navigation-nav-open' : ''}
      id={id ? id : 'navigation-menu-mobile'}
      {...props}
    >
      {slices.map((slice, index) =>
        HeaderSliceHandler(slice, {
          index,
          isMobile,
          navOpen,
          isGlobalMb,
        })
      )}
    </Nav>
  );
};

const Menu = ({ label, url, slices, isMobile, isGlobalMb = false, index }) => {
  const [active, setActive] = useState(false);
  const nestedMobileInteraction = (event, clickedLabel) => {
    if (!isMobile) return;
    event.preventDefault();
    event.stopPropagation();
    if (clickedLabel === label) {
      setActive(!active);
      trackHeaderItem();
    }
  };
  const nestedMenuRef = useRef(null);
  const windowWidth = useWindowWidth();
  const [isOffScreen, setOffScreen] = useState(false);
  const pageMetaData = useRecoilValue(metaAtom);

  useEffect(() => {
    if (nestedMenuRef.current) {
      const nestedMenuDim = nestedMenuRef.current?.getBoundingClientRect();
      if (nestedMenuDim.width + nestedMenuDim.x > windowWidth)
        setOffScreen(true);
    }
  }, [nestedMenuRef, windowWidth]);

  const trackHeaderItem = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPDOWN_SHOWN,
      [ANALYTICS_PROPERTIES.HEADER]: label,
      ...getCommonEventMetaData(pageMetaData),
    });
  };

  return (
    <>
      <MenuItem
        label={label}
        isNested={true}
        url={url}
        onClick={(e) => nestedMobileInteraction(e, label)}
        nestOpen={active}
        className={active ? 'nest-open' : 'nest-close'}
        isGlobalMb={isGlobalMb}
        onMouseEnter={trackHeaderItem}
        index={index}
      >
        <NestedMenu
          ref={nestedMenuRef}
          className={`nested-menu ${isOffScreen ? 'off-screen' : ''}`}
        >
          {slices?.map((slice, index) =>
            HeaderSliceHandler(slice, {
              index,
              isMobile,
              isGlobalMb,
              headerLabel: label,
            })
          )}
        </NestedMenu>
      </MenuItem>
    </>
  );
};

const MenuItem = (props) => {
  const {
    isNested,
    url,
    label,
    children,
    onClick,
    nestOpen,
    className,
    index,
    isGlobalMb = false,
    onMouseEnter,
    headerLabel,
  } = props;
  const pageMetaData = useRecoilValue(metaAtom);

  const menuItemSelected = (e) => {
    if (onClick) onClick(e);
    e.stopPropagation();
    const menuItemText = e.target.closest('.menu-item-text')?.innerText;
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPDOWN_OPTION_SELECTED,
      [ANALYTICS_PROPERTIES.OPTION_TEXT]: menuItemText,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      ...getCommonEventMetaData(pageMetaData),
      ...(headerLabel && { [ANALYTICS_PROPERTIES.HEADER]: headerLabel }),
    });
  };

  return (
    <StyledMenuItem
      nestOpen={nestOpen}
      className={`${className}`}
      isGlobalMb={isGlobalMb}
      id={`menu-item-${index}`}
      onMouseEnter={onMouseEnter ? onMouseEnter : null}
    >
      <div className={'link-element'}>
        <React.Fragment>
          <LinkResolver target={url?.target} url={withTrailingSlash(url?.url)}>
            <div
              className={`${isNested ? 'withIcon ' : ''}menu-item-text`}
              onClick={menuItemSelected}
              role="button"
              tabIndex={0}
            >
              <span className="label">{label}</span>
              <Conditional if={isNested}>
                <span className="nest-icon">{CHEVRON_DOWN}</span>
              </Conditional>
            </div>
          </LinkResolver>
          {children}
        </React.Fragment>
      </div>
    </StyledMenuItem>
  );
};

const HeaderSliceHandler = (slice, props) => {
  const { index, navOpen, isGlobalMb = false } = props;
  switch (slice.slice_type) {
    case 'navigation':
      return (
        <Navigation
          key={index}
          slices={slice.slices}
          navOpen={navOpen}
          id={`navigation-menu-mobile_${index}`}
          isGlobalMb={isGlobalMb}
        />
      );
    case 'menu_item':
      return (
        <MenuItem
          key={index}
          label={slice.primary.label}
          url={slice.primary.url}
          isGlobalMb={isGlobalMb}
          index={index}
          headerLabel={props.headerLabel}
        />
      );
    case 'nested_menu':
      return (
        <Menu
          isMobile={props.isMobile}
          key={index}
          slices={slice.slices}
          url={slice.primary.url}
          label={slice.primary.label}
          isGlobalMb={isGlobalMb}
          index={props.index}
        />
      );
    case 'group_booking':
      return (
        <StyledMenuItem
          key={index}
          className={'group-booking-cta'}
          onClick={() => {
            props.isMobile && slice.toggleMenu();
            slice.action();
          }}
          isGlobalMb={isGlobalMb}
        >
          {strings.GROUP_TICKETS}
        </StyledMenuItem>
      );
    case 'heading_menu_item':
      return (
        <HeadingMenu
          key={index}
          className="withIcon"
          as="a"
          href={withTrailingSlash(slice?.url?.url)}
          target={slice?.url?.target}
          role="button"
          tabIndex={0}
        >
          {slice.label}
          <span className="nest-icon" id={`nest-icon-${index}`}>
            {CHEVRON_DOWN}
          </span>
        </HeadingMenu>
      );
  }
};

/**
 *
 * <div style="position: relative; padding-bottom: 54.21875000000001%; height: 0;">
 * <iframe src="https://www.loom.com/embed/641c7184ba45410497cd30e8093c557c" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
 * </iframe>
 * </div><br>
 *
 * #### Loom Video walkthrough of the entire process of creating a Simple Navigation and Multi-Level Navigation
 * <br>
 *
 *
 * ## Usage Docs for Multilevel Navigation
 * You can create a Multi-level navigation in Common Header using these three slices in Combination
 *
 * - Navigation Start / End
 * - Nested Menu Start / End
 * - Menu Item
 *
 * Start with Creating Navigation Start, This will specify that all subsequent slices are part of navigation <br>
 * Now you can add place any number of Menu Items as you like
 *
 * **Nested Menu** (Drop Down / Second Level)<br>
 * To Create a Dropdown Menu, Instead of adding a Regular Menu Item, add a Nested Menu Start Slice<br>
 * this will specify that all subsequent Menu Items / Nested Menu (you can have Nested Menu Inside Nested...) you are adding are part of this Nested Menu<br>
 * Once you are done with adding all the Menu items dont forget to close the Nested Menu by adding a Nested Menu End
 *
 * Nested Menu & Menu Item have Common Values, URL & Label
 *
 * - **Label** The Menu Item name (What is Shown on UI)
 * - **URL** The Page where you want the Label to Link to.
 *
 *
 * > Visual Structure
 *
 *```html
 *...
 *
 *<Navigation_Start>
 *  <Menu_Item>
 *  <Menu_Item>
 *  <Menu_Item>
 *  <Nested_Menu_Start>
 *    <Menu_Item>
 *    <Menu_Item>
 *  <Nested_Menu_End>
 *  <Menu_Item>
 *  <Menu_Item>
 *  <Nested_Menu_Start>
 *    <Menu_Item>
 *    <Menu_Item>
 *    <Nested_Menu_Start>
 *      <Menu_Item>
 *      <Menu_Item>
 *    <Nested_Menu_End>
 *    <Menu_Item>
 *  <Nested_Menu_End>
 *  <Menu_Item>
 *<Navigation_End>
 *
 * ...
 *```
 *
 */

const MultiLevelNav = ({
  slice,
  oldMenuItems = [],
  isMobile,
  isActive,
  isGlobalMb = false,
}) => {
  const [firstSlice, secondSlice, ..._ignored_only_two_nav_bar] = slice;

  let withOldMenu = firstSlice?.slices || [];

  if (withOldMenu.length == 1 && secondSlice && isGlobalMb) {
    withOldMenu = [...withOldMenu, secondSlice];
  }
  if (!isGlobalMb) {
    withOldMenu = [...withOldMenu, ...(oldMenuItems ?? [])];
  }

  return (
    <Navigation
      navOpen={isActive}
      isMobile={isMobile}
      slices={withOldMenu}
      isGlobalMb={isGlobalMb}
    />
  );
};

export default MultiLevelNav;
