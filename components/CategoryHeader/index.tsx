import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { CategoryHeaderProps } from 'components/CategoryHeader/interface';
import {
  StyledCategoryHeader,
  StyledCategoryHeaderContainer,
  StyledDeepNestedMenuWrapper,
  StyledMainMenuItems,
  StyledNestedMenuWrapper,
} from 'components/CategoryHeader/styles';
import Conditional from 'components/common/Conditional';
import LocaleSelector from 'components/common/LocaleSelector';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { throttle } from 'utils/gen';
import { getCategoryHeaderMenuLabel } from 'utils/helper';
import { titleCase } from 'utils/stringUtils';
import { appAtom } from 'store/atoms/app';
import { currencyListAtom } from 'store/atoms/currencyList';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { labels } from 'const/header';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import ChevronRight from 'assets/chevronRight';
import Hamburger from 'assets/hamburger';

const ExpandedMenu = dynamic(
  () =>
    import(
      /* webpackChunkName: "ExpandedMenu" */ 'components/CategoryHeader/components/ExpandedMenu'
    )
);
const NestedMenu = dynamic(
  () =>
    import(
      /* webpackChunkName: "NestedMenu" */ 'components/CategoryHeader/components/NestedMenu'
    )
);
const DeepNestedMenu = dynamic(
  () =>
    import(
      /* webpackChunkName: "DeepNestedMenu" */ 'components/CategoryHeader/components/DeepNestedMenu'
    )
);
const Copyright = dynamic(
  () =>
    import(/* webpackChunkName: "Copyright" */ 'components/common/Copyright')
);

const CategoryHeader: React.FC<CategoryHeaderProps> = (props) => {
  const {
    categoryHeaderMenu,
    primaryCity,
    taggedCity,
    languages = [],
    currentLanguage = '',
    isMobile,
  } = props;

  const [expandMenu, setExpandMenu] = useState(false);
  const [expandNestedMenu, setExpandNestedMenu] = useState(false);
  const [selectedMainMenu, setSelectedMainMenu] = useState({ label: '' }); // using object as state to force re-render
  const [selectedNestedMenu, setSelectedNestedMenu] = useState('');
  const [scrollPos, setScrollPos] = useState(0);
  const { isPillBarSticky } = useRecoilValue(appAtom);

  let mainMenu = Object.values(categoryHeaderMenu).filter((menuItem) => {
    if (isMobile) return menuItem;
    const { mainMenu, label } = menuItem;
    return mainMenu && label;
  });
  if (!isMobile) {
    const exploreMenu = { label: labels.EXPLORE, menu: {}, mainMenu: true };
    mainMenu = [exploreMenu, ...mainMenu];
  }

  const mbCity = titleCase(primaryCity?.displayName || taggedCity || '');
  const headerLanguages = languages?.length
    ? [...languages, { code: currentLanguage }]
    : [{ code: currentLanguage }];

  const headerCurrencies = useRecoilValue(currencyListAtom);
  const pageMetaData = useRecoilValue(metaAtom);
  const isSticky = scrollPos > 80;

  useEffect(() => {
    if (!window) return;

    const scrollHandler = () => {
      setScrollPos(window.scrollY);
    };
    const throttledScrollHandler = throttle(scrollHandler, 500);
    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [scrollPos]);

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLUListElement>
  ) => {
    const {
      className,
      dataset: { menuLabel },
      parentNode,
    } = e.target as HTMLDivElement;

    if (isMobile) {
      if (className.includes('main-menu-item') && menuLabel) {
        setSelectedMainMenu({ label: menuLabel });
        let ranking = 0;
        if (parentNode) {
          const childElements = parentNode.children;
          const filteredChildDivs = Array.prototype.filter.call(
            childElements,
            (e: HTMLElement) => e.className.includes('main-menu-item')
          );
          ranking =
            Array.prototype.indexOf.call(filteredChildDivs, e.target) + 1;
        }
        if (selectedMainMenu.label === menuLabel) {
          setExpandMenu(!expandMenu);
          if (!expandMenu) {
            trackDropdownShown({ label: menuLabel, ranking });
          }
        } else {
          setExpandMenu(true);
          trackDropdownShown({ label: menuLabel, ranking });
        }
      }
      if (className.includes('nested-menu-item') && menuLabel) {
        setSelectedNestedMenu(menuLabel);
        setExpandNestedMenu(true);

        let ranking = 0;
        if (parentNode && parentNode.parentNode) {
          const grandParentNode = parentNode.parentNode;
          const parentElements = grandParentNode.children;
          const filteredParentListItems = Array.prototype.filter.call(
            parentElements,
            (elem: HTMLElement) => elem.tagName === 'LI'
          );
          ranking =
            Array.prototype.indexOf.call(filteredParentListItems, parentNode) +
            1;
        }
        trackDropdownShown({ label: menuLabel, ranking });
      }
      if (className.includes('back-to-main-menu')) {
        setSelectedNestedMenu('');
        setExpandNestedMenu(false);
      }
    } else {
      if (className.includes('main-menu-item') && menuLabel) {
        setSelectedMainMenu({ label: menuLabel });
        setExpandMenu(!expandMenu);
      }
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      setExpandMenu(true);
      const {
        className,
        dataset: { menuLabel },
        parentNode,
      } = e.target as HTMLDivElement;

      let ranking = 0;
      if (parentNode) {
        const childDivs = parentNode.children;
        ranking = Array.prototype.indexOf.call(childDivs, e.target) + 1;
      }

      if (menuLabel && className.includes('main-menu-item')) {
        setSelectedMainMenu({ label: menuLabel });
        trackDropdownShown({ label: menuLabel, ranking });
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setExpandMenu(false);
    }
  };

  const trackDropdownShown = ({
    label,
    ranking,
  }: {
    label: string;
    ranking: number;
  }) => {
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
    <StyledCategoryHeader $showBoxShadow={isPillBarSticky ? false : isSticky}>
      <StyledCategoryHeaderContainer
        onClick={handleClick}
        $showLocaleSelector={isSticky}
      >
        <div className="menu-items-container">
          {mainMenu.map((menuItem, index, arr) => {
            const { label } = menuItem;

            if (expandNestedMenu) return null;
            return (
              <React.Fragment key={index}>
                <StyledMainMenuItems
                  key={index}
                  className={`main-menu-item ${
                    label === selectedMainMenu.label ? 'active' : ''
                  } ${index === arr.length - 1 ? 'last' : ''}`}
                  data-menu-label={label}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  $isExpanded={expandMenu}
                  $isMobile={isMobile}
                >
                  <Conditional if={index === 0 && !isMobile}>
                    {Hamburger({ fillColor: COLORS.GRAY.G3 })}
                  </Conditional>
                  {getCategoryHeaderMenuLabel({
                    label,
                    mbCity,
                  })}
                  <Conditional if={isMobile}>
                    {ChevronRight({ fillColor: COLORS.GRAY.G3 })}
                  </Conditional>
                </StyledMainMenuItems>
                <Conditional if={isMobile}>
                  <StyledNestedMenuWrapper
                    $isVisible={
                      expandMenu && selectedMainMenu.label === menuItem.label
                    }
                  >
                    <NestedMenu
                      categoryHeaderMenu={categoryHeaderMenu}
                      selectedMenu={selectedMainMenu.label}
                      currentMenu={label}
                      mbCity={mbCity}
                      isMobile={isMobile}
                    />
                  </StyledNestedMenuWrapper>
                </Conditional>
              </React.Fragment>
            );
          })}
        </div>
        <Conditional if={!isMobile && isSticky}>
          <div className="locale-selector-container">
            <LocaleSelector
              currencies={headerCurrencies}
              languages={headerLanguages}
              currentLanguage={currentLanguage}
              isMobile={isMobile}
            />
          </div>
        </Conditional>
        <Conditional if={isMobile && !expandNestedMenu}>
          <div className="copyright-container">
            <Copyright />
          </div>
        </Conditional>
        <Conditional if={isMobile}>
          <StyledDeepNestedMenuWrapper
            $isVisible={expandNestedMenu && !!selectedNestedMenu}
          >
            <DeepNestedMenu
              categoryHeaderMenu={categoryHeaderMenu}
              selectedMainMenu={selectedMainMenu}
              selectedNestedMenu={selectedNestedMenu}
              mbCity={mbCity}
              isMobile={isMobile}
            />
          </StyledDeepNestedMenuWrapper>
        </Conditional>
      </StyledCategoryHeaderContainer>
      <Conditional if={!isMobile}>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <ExpandedMenu
            categoryHeaderMenu={categoryHeaderMenu}
            isExpanded={expandMenu}
            selectedMainMenu={selectedMainMenu}
            mbCity={mbCity}
            isMobile={isMobile}
          />
        </div>
      </Conditional>
    </StyledCategoryHeader>
  );
};

export default CategoryHeader;
