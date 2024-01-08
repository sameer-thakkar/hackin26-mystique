import { useState } from 'react';
import { Button } from '@headout/aer';
import { TCategoryFilterDrawerProps } from 'components/common/CategoryFilterDrawer/interface';
import {
  categoryDrawerStyles,
  CheckBoxContainer,
  DrawerBody,
  Footer,
  Icon,
  ListItem,
  ListItemInfoContainer,
} from 'components/common/CategoryFilterDrawer/style';
import Drawer from 'components/common/Drawer';
import { trackEvent } from 'utils/analytics';
import { getCategoryIconUrl } from 'utils/image';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { CheckMarkSvg } from 'assets/SvgIcons';

const CategoryFilterDrawer = ({
  categoriesAndSubCategories,
  categoryStates,
  onClear,
  onClose,
  onApply,
}: TCategoryFilterDrawerProps) => {
  const [currentCategoryStates, setCurrentCategoryStates] =
    useState<TCategoryFilterDrawerProps['categoryStates']>(categoryStates);

  const changeState = (id: number, isSelected = true) => {
    setCurrentCategoryStates({ ...currentCategoryStates, [id]: isSelected });
    if (isSelected)
      trackEvent({
        eventName: ANALYTICS_EVENTS.CATEGORY_SELECTED,
        [ANALYTICS_PROPERTIES.CATEGORY]:
          categoriesAndSubCategories[id].nonLocalizedName,
      });
  };

  const apply = () => {
    onApply(currentCategoryStates);
    onClose();
  };

  const clear = () => {
    onClear();
    onClose();
  };

  const isAnyCategoryStateChanged =
    Object.keys(currentCategoryStates).findIndex(
      (id) => currentCategoryStates[+id] !== categoryStates[+id]
    ) !== -1;

  const isAnyCategorySelected =
    Object.keys(currentCategoryStates).findIndex(
      (id) => currentCategoryStates[+id]
    ) !== -1;

  return (
    <Drawer
      $drawerStyles={categoryDrawerStyles}
      noMargin
      className="category-filter__drawer"
      closeHandler={onClose}
      heading={strings.PC_EXP.FILTER_BY_CATEGORIES}
      hideSeparator
      slideOutOnClose
      coverHeaderInShadow
    >
      <DrawerBody>
        {Object.keys(categoriesAndSubCategories).map((id) => {
          const { name, isCategory } = categoriesAndSubCategories[+id];
          const isSelected = currentCategoryStates[+id];
          const iconUrl = getCategoryIconUrl({ entityId: id, isCategory });
          return (
            <ListItem $isSelected={isSelected} key={`dd-${id}`}>
              <ListItemInfoContainer>
                <Icon $svgUrl={iconUrl!} />
                <span className="dropdown-content-title">{name}</span>
              </ListItemInfoContainer>
              <input
                type="checkbox"
                value={id}
                checked={isSelected}
                onChange={(e) => {
                  changeState(+id, e.target.checked);
                }}
              />
              <CheckBoxContainer>
                <CheckMarkSvg />
              </CheckBoxContainer>
            </ListItem>
          );
        })}
      </DrawerBody>
      <Footer>
        <Button
          onClick={clear}
          variant={isAnyCategorySelected ? 'tertiary' : 'secondary'}
          size="medium"
          color="purps"
          text={strings.PC_EXP.CLEAR}
          disabled={!isAnyCategorySelected}
        />

        <Button
          onClick={apply}
          variant="primary"
          size="medium"
          color="purps"
          text={strings.CAT_SUBCAT_PAGE.APPLY}
          disabled={!isAnyCategoryStateChanged}
        />
      </Footer>
    </Drawer>
  );
};

export default CategoryFilterDrawer;
