import React from 'react';
import { useRecoilValue } from 'recoil';
import { DeepNestedMenuItemProps } from 'components/CategoryHeader/components/DeepNestedMenuItem/interface';
import { StyledDeepNestedMenuItem } from 'components/CategoryHeader/components/DeepNestedMenuItem/styles';
import { TMenu } from 'components/CategoryHeader/components/ExpandedMenu/interface';
import { getObjectNestingCount } from 'utils/gen';
import { trackHeaderMenuItemClicked } from 'utils/headerUtils';
import { getCategoryHeaderMenuLabel } from 'utils/helper';
import { metaAtom } from 'store/atoms/meta';

const DeepNestedMenuItem: React.FC<DeepNestedMenuItemProps> = (props) => {
  const { categoryHeaderMenu, selectedNestedMenu, mbCity } = props;
  const pageMetaData = useRecoilValue(metaAtom);

  return (
    <React.Fragment>
      {Object.keys(categoryHeaderMenu).map((menuItem) => {
        const menuData = categoryHeaderMenu[menuItem].menu || {};
        return (
          <React.Fragment key={menuItem}>
            {Object.keys(menuData).map((nestedMenuItem, index) => {
              const nestedMenuData =
                menuData[nestedMenuItem as keyof typeof menuData] || {};
              const {
                collectionData: _collectionData,
                ...menuWithoutCollectionData
              } = nestedMenuData;

              if (getObjectNestingCount(menuWithoutCollectionData) < 2)
                return null;
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
                        <li key={index}>
                          <a
                            href={url}
                            target="_blank"
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
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default DeepNestedMenuItem;
