import React from 'react';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import { TMenu } from 'components/CategoryHeader/components/ExpandedMenu/interface';
import { StyledDeepNestedMenuItem } from 'components/CategoryHeader/components/DeepNestedMenuItem/styles';
import { DeepNestedMenuItemProps } from 'components/CategoryHeader/components/DeepNestedMenuItem/interface';
import { trackHeaderMenuItemClicked } from 'utils/headerUtils';
import { getCategoryHeaderMenuLabel } from 'utils/helper';
import { getObjectNestingCount } from 'utils/gen';

const DeepNestedMenuItem: React.FC<DeepNestedMenuItemProps> = (props) => {
  const { categoryHeaderMenu, selectedNestedMenu, mbCity } = props;
  const pageMetaData = useRecoilValue(metaAtom);

  return (
    <>
      {Object.keys(categoryHeaderMenu).map((menuItem) => {
        const menuData = categoryHeaderMenu[menuItem].menu || {};
        return (
          <>
            {Object.keys(menuData).map((nestedMenuItem, index) => {
              const nestedMenuData =
                menuData[nestedMenuItem as keyof typeof menuData] || {};

              if (getObjectNestingCount(nestedMenuData) < 2) return null;
              return (
                <StyledDeepNestedMenuItem
                  key={index}
                  $isSelected={selectedNestedMenu === nestedMenuItem}
                >
                  {Object.keys(nestedMenuData).map((menuItem, index) => {
                    const { label, url } =
                      (nestedMenuData?.[
                        menuItem as keyof typeof nestedMenuData
                      ] as TMenu) || {};
                    if (label && url) {
                      const formattedLabel = getCategoryHeaderMenuLabel({
                        label,
                        mbCity,
                      });
                      return (
                        <li>
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) =>
                              trackHeaderMenuItemClicked({
                                eventTarget: e.target,
                                label: formattedLabel,
                                level: 2,
                                pageMetaData,
                              })
                            }
                          >
                            {formattedLabel}
                          </a>
                        </li>
                      );
                    }
                  })}
                </StyledDeepNestedMenuItem>
              );
            })}
          </>
        );
      })}
    </>
  );
};

export default DeepNestedMenuItem;
