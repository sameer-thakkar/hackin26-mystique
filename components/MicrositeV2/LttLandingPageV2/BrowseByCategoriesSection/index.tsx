import { forwardRef, useEffect, useRef, useState } from 'react';
import { scroller } from 'react-scroll';
import { useRecoilValue } from 'recoil';
import { TBrowseByCategoriesSection } from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection/interface';
import {
  CategoriesSection,
  CategoryWrapper,
} from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection/style';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { metaAtom } from 'store/atoms/meta';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { LTT_CATEGORIES } from 'const/lttCategories';
import { strings } from 'const/strings';

const BrowseByCategoriesSection = forwardRef<
  HTMLDivElement,
  TBrowseByCategoriesSection
>(({ categoriesToRender, isMobile }, ref) => {
  const pageMetaData = useRecoilValue(metaAtom);

  const [activeCategoryName, setActiveCategoryName] = useState(
    LTT_CATEGORIES.top.name
  );
  const allCategoryNames = [
    LTT_CATEGORIES.top.name,
    ...categoriesToRender.map(({ name }) => name),
  ];
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observerResetTimeoutId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.55,
    };

    const observer = new IntersectionObserver((entries) => {
      for (let i = entries.length - 1; i >= 0; i--) {
        const entry = entries[i];
        const element = entry.target as HTMLElement;
        const elementHeight = element.offsetHeight;
        const viewportHeight = window.innerHeight;
        const elementTop = entry.boundingClientRect.top;
        const elementBottom = entry.boundingClientRect.bottom;
        const percentageVisible =
          ((Math.min(elementBottom, viewportHeight) - Math.max(elementTop, 0)) /
            elementHeight) *
          100;
        if (percentageVisible >= 20 && entry.isIntersecting) {
          setActiveCategoryName(entry.target.id);
          break;
        }
      }
    }, observerOptions);
    observerRef.current = observer;

    allCategoryNames.forEach((name) => {
      const element = document.getElementById(name);
      if (element) {
        observer.observe(element);
      }
    });
    return () => {
      observer.disconnect();
      if (observerResetTimeoutId.current) {
        clearTimeout(observerResetTimeoutId.current);
      }
    };
  }, [allCategoryNames.length]);

  const onCategoryClicked = (name: string, ranking: number) => {
    if (observerResetTimeoutId.current) {
      clearTimeout(observerResetTimeoutId.current);
    }

    const selectedCategoryChild = document.getElementById(name);
    if (!selectedCategoryChild) return;
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    setActiveCategoryName(name);
    trackEvent({
      eventName: ANALYTICS_EVENTS.CATEGORY_TAB_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.RANKING]: ranking + 1,
      [ANALYTICS_PROPERTIES.HEADING]: name,
    });

    scroller.scrollTo(name, {
      duration: 800,
      smooth: 'easeInOutQuart',
      offset: isMobile ? -90 : -188,
    });
    observerResetTimeoutId.current = setTimeout(() => {
      allCategoryNames.forEach((name) => {
        const element = document.getElementById(name);
        if (element) {
          observerRef.current?.observe?.(element);
        }
      });
    }, 1500);
  };

  return (
    <CategoriesSection ref={ref} id="browse-by-category-section">
      <div className="categories">
        <CategoryWrapper
          $isActive={activeCategoryName === LTT_CATEGORIES.top.name}
          onClick={() => onCategoryClicked(LTT_CATEGORIES.top.name, 0)}
        >
          <span className="icon">
            {
              LTT_CATEGORIES.top.icon[
                activeCategoryName === LTT_CATEGORIES.top.name
                  ? 'active'
                  : 'default'
              ]
            }
          </span>
          <span className="name">{strings.LTT_LANDING_PAGE.TOP_SHOWS}</span>
        </CategoryWrapper>
        {categoriesToRender.map(({ name, id }, index) => {
          const { icon } = LTT_CATEGORIES[id] ?? LTT_CATEGORIES.fallback;
          const currentIcon =
            icon[activeCategoryName === name ? 'active' : 'default'];
          return (
            <CategoryWrapper
              $isActive={activeCategoryName === name}
              key={index}
              onClick={() => onCategoryClicked(name, index + 1)}
            >
              <span className="icon">{currentIcon}</span>
              <span className="name">{name}</span>
            </CategoryWrapper>
          );
        })}
      </div>
    </CategoriesSection>
  );
});

export default BrowseByCategoriesSection;
