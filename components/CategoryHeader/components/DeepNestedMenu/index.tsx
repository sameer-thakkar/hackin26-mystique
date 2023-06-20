import React from 'react';
import Conditional from 'components/common/Conditional';
import DeepNestedMenuItem from 'components/CategoryHeader/components/DeepNestedMenuItem';
import { StyledDeepNestedMenuContainer } from 'components/CategoryHeader/components/DeepNestedMenu/styles';
import { DeepNestedMenuProps } from 'components/CategoryHeader/components/DeepNestedMenu/interface';
import { getCategoryHeaderMenuLabel } from 'utils/helper';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import { strings } from 'const/strings';

const DeepNestedMenu: React.FC<DeepNestedMenuProps> = (props) => {
  const {
    categoryHeaderMenu,
    selectedMainMenu = { label: '' },
    selectedNestedMenu = '',
    mbCity,
    isMobile,
  } = props;

  return (
    <StyledDeepNestedMenuContainer>
      <Conditional if={isMobile}>
        <li className="main-menu-wrapper">
          <span className="main-menu-label">
            {getCategoryHeaderMenuLabel({
              label: selectedMainMenu.label,
              mbCity,
            })}
          </span>
          <span className="main-menu back-to-main-menu">
            {strings.CATEGORY_HEADER.MAIN_MENU}
          </span>
        </li>
        <li className="back-to-main-menu">
          {CHEVRON_LEFT}{' '}
          {getCategoryHeaderMenuLabel({ label: selectedNestedMenu, mbCity })}
        </li>
      </Conditional>
      <DeepNestedMenuItem
        categoryHeaderMenu={categoryHeaderMenu}
        selectedNestedMenu={selectedNestedMenu}
        mbCity={mbCity}
      />
    </StyledDeepNestedMenuContainer>
  );
};

export default DeepNestedMenu;
