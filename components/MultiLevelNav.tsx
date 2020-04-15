import LinkResolver from './LinkResolver';
import styled from 'styled-components';
import { COLORS, GRAPHIK } from '../constants/ui-constants';
import { CHEVRON_DOWN } from '../public/static/svg-icons';
import { useState } from 'react';

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
      }
    }
    a {
      display: block;
    }
    ${({ nestOpen }) =>
      nestOpen &&
      `
      background: ${COLORS.FLOAT_PURPS};
      & .nested-menu {
        background: ${COLORS.FLOAT_PURPS};
        li {
          padding-right: 0;
        }
      }
    `}
  }
`;

const NestedMenu = styled.ul`
  display: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 24px;
  left: 0;
  width: max-content;
  background: #ffffff;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  ${StyledMenuItem}:hover > a > & {
    display: grid;
    li:hover {
      background: ${COLORS.FLOAT_PURPS};
    }
  }
  .nest-icon svg {
    transform: rotate(-90deg);
  }
  & ul {
    left: 100%;
    top: 0;
  }
  @media (max-width: 768px) {
    position: unset;
    top: unset;
    left: unset;
    box-shadow: unset;
    width: 100%;
    .nest-icon svg {
      transform: unset;
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
        grid-gap: 0;
        & > li {
          padding: 16px;
        }
        & > li > a .withIcon {
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
  const nestedMobileInteraction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(!active);
  };

  return (
    <>
      <MenuItem
        label={label}
        isNested={true}
        url={url}
        onClick={nestedMobileInteraction}
        nestOpen={active}
      >
        <NestedMenu className={'nested-menu'}>
          {slices.map((slice, index) =>
            HeaderSliceHandler(slice, { index, isMobile })
          )}
        </NestedMenu>
      </MenuItem>
    </>
  );
};

const MenuItem = (props) => {
  const { isNested, url, label, children, onClick, nestOpen } = props;

  return (
    <StyledMenuItem nestOpen={nestOpen}>
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

const MultiLevelNav = ({ slice, oldMenuItems, isMobile, isActive }) => {
  const [firstSlice, ..._ignored_only_one_nav_bar] = slice;
  const withOldMenu = [...(firstSlice?.slices || []), ...(oldMenuItems || [])];

  return (
    <Navigation navOpen={isActive} isMobile={isMobile} slices={withOldMenu} />
  );
};

export default MultiLevelNav;
