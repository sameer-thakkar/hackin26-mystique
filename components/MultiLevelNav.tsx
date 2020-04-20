import LinkResolver from './LinkResolver';
import styled from 'styled-components';
import { COLORS, GRAPHIK } from '../constants/ui-constants';
import { CHEVRON_DOWN } from '../public/static/svg-icons';
import { useState, useRef, useEffect } from 'react';
import { useWindowWidth } from '@react-hook/window-size';

const StyledMenuItem = styled.li`
  font-size: 16px;
  line-height: 24px;
  padding: 12px 16px;
  font-family: ${GRAPHIK.FONT_STACK};
  color: ${COLORS.FOUR_BLACK};
  cursor: pointer;
  position: relative;
  .withIcon {
    display: grid;
    align-items: center;
    align-content: center;
    grid-template-columns: auto auto;
    grid-column-gap: 10px;
    .nest-icon {
      display: flex;
      justify-self: right;
      svg {
        height: 24px;
        path {
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
    .withIcon {
      .nest-icon {
        justify-self: end;
        svg {
          transition: transform 0.3s ease;
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
      background: ${COLORS.FLOAT_PURPS};
      & > a > .nested-menu {
        display: grid;
        visibility: unset;
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
  width: max-content;
  background: #ffffff;
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

  ${StyledMenuItem}:hover > a > & {
    visibility: unset;
    li:hover {
      background: ${COLORS.FLOAT_PURPS};
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
    ${StyledMenuItem}:hover > a > & {
      li:hover {
        background: initial;
      }
    }
  }
`;

const Nav = styled.nav`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 33px;
  & > li {
    padding: 0;
  }
  li {
    list-style: none;
  }
  @media (max-width: 768px) {
    display: none;
    ${({ navOpen }) =>
      navOpen
        ? `
        display: grid;
        position: fixed;
        top: 56px;
        left: 0;
        height: 100%;
        align-content: flex-start;
        background: ${COLORS.WHITE};
        width: 100%;
        grid-auto-flow: row;
        overflow: scroll;
        grid-gap: 0;
        & > li {
          padding: 16px;
        }
        & > li > a > .withIcon {
          padding-bottom: 16px;
          border-bottom: 1px solid ${COLORS.GREY_G6};
        }
      `
        : ''}
  }
`;

const Navigation = (props) => {
  const { slices, isMobile } = props;
  return (
    <Nav {...props}>
      {slices.map((slice, index) =>
        HeaderSliceHandler(slice, { index, isMobile })
      )}
    </Nav>
  );
};

const Menu = ({ label, url, slices, isMobile }) => {
  const [active, setActive] = useState(false);
  const nestedMobileInteraction = (event, clickedLabel) => {
    if (!isMobile) return;
    event.preventDefault();
    event.stopPropagation();
    if (clickedLabel === label) {
      setActive(!active);
    }
  };
  const nestedMenuRef = useRef(null);
  const windowWidth = useWindowWidth();
  const [isOffScreen, setOffScreen] = useState(false);

  useEffect(() => {
    if (nestedMenuRef.current) {
      const nestedMenuDim = nestedMenuRef.current?.getBoundingClientRect();
      if (nestedMenuDim.width + nestedMenuDim.x > windowWidth)
        setOffScreen(true);
    }
  }, [nestedMenuRef, windowWidth]);

  return (
    <>
      <MenuItem
        label={label}
        isNested={true}
        url={url}
        onClick={(e) => nestedMobileInteraction(e, label)}
        nestOpen={active}
        className={`${active ? 'nest-open' : 'nest-close'}`}
      >
        <NestedMenu
          ref={nestedMenuRef}
          className={`nested-menu ${isOffScreen ? 'off-screen' : ''}`}
        >
          {slices.map((slice, index) =>
            HeaderSliceHandler(slice, { index, isMobile })
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
  } = props;

  return (
    <StyledMenuItem nestOpen={nestOpen} className={`${className}`}>
      <LinkResolver target={url?.target} url={url?.url}>
        <div
          className={isNested ? 'withIcon' : ''}
          onClick={onClick}
          role="button"
          tabIndex={0}
        >
          <span className="label">{label}</span>
          {isNested ? <span className="nest-icon">{CHEVRON_DOWN}</span> : null}
        </div>
        {children}
      </LinkResolver>
    </StyledMenuItem>
  );
};

const HeaderSliceHandler = (slice, props) => {
  const { index } = props;
  switch (slice.slice_type) {
    case 'navigation':
      return <Navigation key={index} slices={slice.slices} />;
    case 'menu_item':
      return (
        <MenuItem
          key={index}
          label={slice.primary.label}
          url={slice.primary.url}
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
        />
      );
    case 'group_booking':
      return (
        <StyledMenuItem
          onClick={() => {
            props.isMobile && slice.toggleMenu();
            slice.action();
          }}
        >
          Group Tickets
        </StyledMenuItem>
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

const MultiLevelNav = ({ slice, oldMenuItems = [], isMobile, isActive }) => {
  const [firstSlice, ..._ignored_only_one_nav_bar] = slice;
  const withOldMenu = [...(firstSlice?.slices || []), ...(oldMenuItems || [])];

  return (
    <Navigation navOpen={isActive} isMobile={isMobile} slices={withOldMenu} />
  );
};

export default MultiLevelNav;
