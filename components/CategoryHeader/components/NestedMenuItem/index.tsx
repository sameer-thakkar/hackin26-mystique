import React from 'react';
import { useRecoilValue } from 'recoil';
import { NestedMenuItemProps } from 'components/CategoryHeader/components/NestedMenuItem/interface';
import Conditional from 'components/common/Conditional';
import { trackHeaderMenuItemClicked } from 'utils/headerUtils';
import { getCategoryHeaderMenuLabel } from 'utils/helper';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import ChevronRight from 'assets/chevronRight';

const NestedMenuItem: React.FC<React.PropsWithChildren<NestedMenuItemProps>> = (
  props
) => {
  const {
    menuData,
    handleSettingNestedMenu,
    handleUnsettingNestedMenu,
    mbCity,
    isMobile,
  } = props;
  const pageMetaData = useRecoilValue(metaAtom);

  return (
    <>
      {Object.keys(menuData).map((menuName, index, array) => {
        const menuItemData = menuData[menuName] || {};
        const { label, url } = menuItemData;
        if (typeof label === 'string' && typeof url === 'string') {
          const formattedLabel = getCategoryHeaderMenuLabel({
            label,
            mbCity,
          });
          return (
            <li key={menuName} onMouseEnter={handleUnsettingNestedMenu}>
              <a
                href={url}
                target="_blank"
                onClick={(e: any) =>
                  trackHeaderMenuItemClicked({
                    eventTarget: e.target,
                    label: formattedLabel,
                    level: 1,
                    pageMetaData,
                  })
                }
              >
                {formattedLabel}
              </a>
            </li>
          );
        } else if (
          typeof menuItemData === 'object' &&
          Object.keys(menuItemData).length > 0
        ) {
          return (
            <>
              <li key={index}>
                <div
                  className="menu-item nested-menu-item"
                  data-menu-label={menuName}
                  onMouseEnter={handleSettingNestedMenu}
                >
                  {getCategoryHeaderMenuLabel({
                    label: menuName,
                    mbCity,
                  })}
                  {ChevronRight({ fillColor: COLORS.GRAY.G3 })}
                </div>
              </li>
              {/* 
              empty li at the end to unset the nested menu state 
              when the mouse hovers below the last nested menu item
              */}
              <Conditional if={index === array.length - 1 && !isMobile}>
                <li
                  className="empty"
                  onMouseEnter={handleUnsettingNestedMenu}
                />
              </Conditional>
            </>
          );
        }
      })}
    </>
  );
};

export default NestedMenuItem;
