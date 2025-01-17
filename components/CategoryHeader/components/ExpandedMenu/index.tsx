import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import DeepNestedMenu from 'components/CategoryHeader/components/DeepNestedMenu';
import { ExpandedMenuProps } from 'components/CategoryHeader/components/ExpandedMenu/interface';
import {
  StyledExpandedMenu,
  StyledExpandedMenuContainer,
  StyledNestedMenu,
  StyledParentMenu,
} from 'components/CategoryHeader/components/ExpandedMenu/styles';
import NestedMenu from 'components/CategoryHeader/components/NestedMenu';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { getCategoryHeaderMenuLabel } from 'utils/helper';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import ChevronRight from 'assets/chevronRight';

const ExpandedMenu: React.FC<React.PropsWithChildren<ExpandedMenuProps>> = (
  props
) => {
  const { categoryHeaderMenu, isExpanded, selectedMainMenu, mbCity, isMobile } =
    props;
  const [selectedMenu, setSelectedMenu] = useState(selectedMainMenu.label);
  const [selectedNestedMenu, setSelectedNestedMenu] = useState('');
  const pageMetaData = useRecoilValue(metaAtom);

  useEffect(() => {
    setSelectedMenu(selectedMainMenu.label);
    setSelectedNestedMenu('');
  }, [selectedMainMenu]);

  useEffect(() => {
    setSelectedNestedMenu('');
  }, [selectedMenu]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      className,
      dataset: { menuLabel },
    } = e.target as HTMLDivElement;
    if (menuLabel && className?.includes('menu-item')) {
      setSelectedMenu(menuLabel);
    }
  };

  const handleParentMenuMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
    const {
      dataset: { menuLabel },
      parentNode,
    } = e.target as HTMLLIElement;
    if (menuLabel) {
      setSelectedMenu(menuLabel);
      trackMenuDropdownShown({ label: menuLabel, parentNode });
    }
  };

  const handleSettingNestedMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      const {
        tagName,
        className,
        dataset: { menuLabel },
        parentNode,
      } = e.target as HTMLDivElement;
      if (
        tagName === 'DIV' &&
        menuLabel &&
        className?.includes('nested-menu-item')
      ) {
        setSelectedNestedMenu(menuLabel);
        trackMenuDropdownShown({ label: menuLabel, parentNode });
      }
    }
  };

  const handleUnsettingNestedMenu: React.MouseEventHandler<
    HTMLDivElement | HTMLLIElement
  > = () => {
    if (!isMobile) setSelectedNestedMenu('');
  };

  const trackMenuDropdownShown = ({
    label,
    parentNode,
  }: {
    label: string;
    parentNode: ParentNode | null;
  }) => {
    let ranking = 0;
    if (parentNode && parentNode.parentNode) {
      const grandParentNode = parentNode.parentNode;
      const parentElements = grandParentNode.children;
      const filteredParentListItems = Array.prototype.filter.call(
        parentElements,
        (e: HTMLElement) => e.tagName === 'LI'
      );
      ranking =
        Array.prototype.indexOf.call(filteredParentListItems, parentNode) + 1;
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPDOWN_SHOWN,
      [ANALYTICS_PROPERTIES.HEADER]: getCategoryHeaderMenuLabel({
        label,
        mbCity,
      }),
      [ANALYTICS_PROPERTIES.RANKING]: ranking,
      ...getCommonEventMetaData(pageMetaData),
    });
  };

  return (
    <StyledExpandedMenu $isExpanded={isExpanded}>
      <StyledExpandedMenuContainer>
        <StyledParentMenu onClick={handleClick}>
          <ul>
            {Object.values(categoryHeaderMenu).map((menuItem, index) => {
              const { label, menu: nestedMenu } = menuItem;

              if (label && Object.keys(nestedMenu).length > 0) {
                return (
                  <li key={index} onMouseEnter={handleParentMenuMouseEnter}>
                    <div
                      className={`menu-item ${
                        selectedMenu === label ? 'highlighted' : ''
                      }`}
                      data-menu-label={label}
                    >
                      {getCategoryHeaderMenuLabel({ label, mbCity })}
                      {ChevronRight({ fillColor: COLORS.GRAY.G3 })}
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </StyledParentMenu>
        <StyledNestedMenu>
          <NestedMenu
            categoryHeaderMenu={categoryHeaderMenu}
            selectedMenu={selectedMenu}
            handleSettingNestedMenu={handleSettingNestedMenu}
            handleUnsettingNestedMenu={handleUnsettingNestedMenu}
            mbCity={mbCity}
            isMobile={isMobile}
          />
        </StyledNestedMenu>
        <StyledNestedMenu onMouseLeave={handleUnsettingNestedMenu}>
          <DeepNestedMenu
            categoryHeaderMenu={categoryHeaderMenu}
            selectedNestedMenu={selectedNestedMenu}
            mbCity={mbCity}
            isMobile={isMobile}
          />
        </StyledNestedMenu>
      </StyledExpandedMenuContainer>
    </StyledExpandedMenu>
  );
};

export default ExpandedMenu;
