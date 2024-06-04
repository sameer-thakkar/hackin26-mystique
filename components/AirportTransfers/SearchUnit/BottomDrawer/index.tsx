import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import CloseIcon from 'assets/closeIcon';
import Radioicon from 'assets/radioicon';
import { DrawerHeader, drawerStyles } from './style';

export const BottomDrawer = ({
  handleClose,
  title,
  children,
  height = '69vh',
}: {
  handleClose: (reason: string) => void;
  title: string;
  children: React.ReactNode;
  height?: string;
}) => {
  return (
    <Drawer
      noMargin
      slideOutOnClose
      closeHandler={handleClose}
      coverHeaderInShadow
      className="field-drawer"
      $drawerStyles={() => drawerStyles(height)}
      customHeader={(closeHandler) => (
        <DrawerHeader className="drawer-header">
          <h2>{title}</h2>
          <CloseIcon onClick={closeHandler} />
        </DrawerHeader>
      )}
    >
      {children}
    </Drawer>
  );
};

export function DrawerListItem({
  icon,
  title,
  subtext,
  isSelected,
  onClick,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  subtext?: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}) {
  const listItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isSelected && listItemRef.current) {
      scrollParentToChildBlock(
        listItemRef.current.parentElement?.parentElement as HTMLElement,
        listItemRef.current
      );
    }
  });

  return (
    <StyledListItem
      $isSelected={isSelected}
      onClick={onClick}
      $hasSubText={!!subtext}
      className={className}
      ref={listItemRef}
    >
      {icon && icon}

      <span className="title">{title}</span>

      <Conditional if={subtext}>
        <span className="subtext">{subtext}</span>
      </Conditional>

      <Radioicon isActive={isSelected} className="radio-icon" />
    </StyledListItem>
  );
}

export const DrawerList = styled.ul`
  list-style: none;
  padding-inline: 1.25rem;
  padding-block: 0.25rem;
  margin: 0;
  height: calc(100% - 7rem);
  overflow-y: auto;
  box-sizing: border-box;
  padding-bottom: 1rem;

  & > li:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 769px) {
    padding-inline: 0;
    padding-block: 0;
    height: 100%;
  }
`;

const StyledListItem = styled.li<{
  $isSelected?: boolean;
  $hasSubText: boolean;
}>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: ${({ $hasSubText }) =>
    $hasSubText ? 'auto auto' : '1fr'};
  grid-auto-flow: column;
  /* align-items: center; */
  box-sizing: border-box;

  padding-block: 1rem;

  column-gap: 0.5rem;
  row-gap: 0.125rem;

  border-bottom: 1px solid ${COLORS.GRAY.G6};

  svg {
    ${({ $hasSubText }) => $hasSubText && 'grid-row: span 2'};
  }

  svg:first-child {
    align-self: flex-start;
    margin-top: ${({ $hasSubText }) => ($hasSubText ? '0.15rem' : '0')};

    width: 1.5rem;
    height: 1.5rem;
    path {
      fill: ${({ $isSelected }) =>
        $isSelected ? COLORS.BRAND.PURPS : COLORS.GRAY.G3};
    }
  }

  svg:last-child {
    align-self: center;
  }

  .title {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    color: ${({ $isSelected }) =>
      $isSelected ? COLORS.BRAND.PURPS : COLORS.GRAY.G2};
  }

  .subtext {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G3};
  }

  .radio-icon {
    margin-left: 0.5rem;
  }

  @media (min-width: 769px) {
    border-bottom: none;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    column-gap: 0.75rem;
    cursor: pointer;

    &:hover {
      background-color: ${COLORS.GRAY.G8};
    }

    .radio-icon {
      display: none;
    }

    svg:first-child {
      margin-top: ${({ $hasSubText }) => ($hasSubText ? '0.215rem' : '0')};
      width: 1.375rem;
      height: 1.375rem;
    }
  }
`;

function scrollParentToChildBlock(parent: HTMLElement, child: HTMLElement) {
  const parentRect = parent.getBoundingClientRect();
  const parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  };

  const childRect = child.getBoundingClientRect();

  const isViewable =
    childRect.top >= parentRect.top &&
    childRect.bottom <= parentRect.top + parentViewableArea.height;

  const offset = 20;

  if (!isViewable) {
    const scrollTop = childRect.top - parentRect.top;
    const scrollBottom = childRect.bottom - parentRect.bottom;
    if (Math.abs(scrollTop) < Math.abs(scrollBottom)) {
      // Near the top of the list
      parent.scrollTo({
        top: parent.scrollTop + scrollTop - offset,
        behavior: 'smooth',
      });
    } else {
      // Near the bottom of the list
      parent.scrollTo({
        top: parent.scrollTop + scrollBottom + offset,
        behavior: 'smooth',
      });
    }
  }
}
