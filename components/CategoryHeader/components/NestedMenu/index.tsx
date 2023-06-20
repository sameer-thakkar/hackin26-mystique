import React from 'react';
import NestedMenuItem from 'components/CategoryHeader/components/NestedMenuItem';
import { StyledNestedMenuContainer } from 'components/CategoryHeader/components/NestedMenu/styles';
import { NestedMenuProps } from 'components/CategoryHeader/components/NestedMenu/interface';

const NestedMenu: React.FC<NestedMenuProps> = (props) => {
  const {
    categoryHeaderMenu,
    selectedMenu,
    handleSettingNestedMenu,
    handleUnsettingNestedMenu,
    mbCity,
    isMobile,
  } = props;

  return (
    <>
      {Object.keys(categoryHeaderMenu).map((menuItem) => {
        const menuData = categoryHeaderMenu[menuItem].menu || {};
        return (
          <StyledNestedMenuContainer
            key={menuItem}
            $isSelected={selectedMenu === menuItem}
          >
            <NestedMenuItem
              menuData={menuData}
              handleSettingNestedMenu={handleSettingNestedMenu}
              handleUnsettingNestedMenu={handleUnsettingNestedMenu}
              mbCity={mbCity}
              isMobile={isMobile}
            />
          </StyledNestedMenuContainer>
        );
      })}
    </>
  );
};

export default NestedMenu;
