import { forwardRef, useEffect, useRef, useState } from 'react';
import { scroller } from 'react-scroll';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Conditional from 'components/common/Conditional';
import { TBrowseByCategoriesSection } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/BrowseByCategoriesSection/interface';
import {
  CategoriesSection,
  CategoryWrapper,
} from 'components/MicrositeV2/EntertainmentMBLandingPageV2/BrowseByCategoriesSection/style';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { lazyLoadOverrideAtom } from 'store/atoms/lazy';
import { metaAtom } from 'store/atoms/meta';
import { ENTERTAINMENT_CATEGORIES } from 'const/entertainmentCategories';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';

const calculateAutoScrollOffset = (
  categoryName: string,
  isMobile: boolean,
  isGridUI: boolean
) => {
  let offset = isMobile ? 125 : 164;
  if (isGridUI) offset = 90;
  if (
    ![
      ENTERTAINMENT_CATEGORIES.lastMinuteTickets.name,
      ENTERTAINMENT_CATEGORIES.top.name,
    ].includes(categoryName)
  ) {
    if (isGridUI) return offset;
    offset += isMobile ? 20 : 32;
  }

  return offset;
};

const BrowseByCategoriesSection = forwardRef<
  HTMLDivElement,
  TBrowseByCategoriesSection
>(
  (
    { categoriesToRender, isMobile, showGridUI = true, isLandingPage = false },
    ref
  ) => {
    const pageMetaData = useRecoilValue(metaAtom);
    const setLazyLoadOverride = useSetRecoilState(lazyLoadOverrideAtom);

    const [activeCategoryName, setActiveCategoryName] = useState(
      ENTERTAINMENT_CATEGORIES.top.name
    );

    const observerRef = useRef<IntersectionObserver | null>(null);
    const topShowsObserverRef = useRef<IntersectionObserver | null>(null);
    const observerResetTimeoutId = useRef<NodeJS.Timeout>();
    const categoryPillRowRef = useRef<HTMLDivElement>(null);

    const allCategoryNames = [
      ...categoriesToRender.map(({ name }) => name),
      ENTERTAINMENT_CATEGORIES.top.name,
    ];
    const categoryChipsToAddAtTheStart = [ENTERTAINMENT_CATEGORIES.top];

    if (isLandingPage) {
      allCategoryNames.unshift(ENTERTAINMENT_CATEGORIES.lastMinuteTickets.name);
      categoryChipsToAddAtTheStart.push(
        ENTERTAINMENT_CATEGORIES.lastMinuteTickets
      );
    }

    useEffect(() => {
      const observerCallbackGenerator =
        (percentage: number) => (entries: IntersectionObserverEntry[]) => {
          for (let i = entries.length - 1; i >= 0; i--) {
            const entry = entries[isMobile ? entries.length - i - 1 : i];
            const element = entry.target as HTMLElement;
            const elementHeight = element.offsetHeight;
            const viewportHeight = window.innerHeight;
            const elementTop = entry.boundingClientRect.top;
            const elementBottom = entry.boundingClientRect.bottom;
            const percentageVisible =
              ((Math.min(elementBottom, viewportHeight) -
                Math.max(elementTop, 0)) /
                elementHeight) *
              100;
            if (percentageVisible >= percentage && entry.isIntersecting) {
              setActiveCategoryName(entry.target.id);
              break;
            }
          }
        };
      const observer = new IntersectionObserver(observerCallbackGenerator(20), {
        root: null,
        threshold: isMobile ? 1 : 0.55,
      });
      /* 
        Separate observer for top shows section because we need different thresholds
        because of its height
    */
      const topShowsObserver = new IntersectionObserver(
        observerCallbackGenerator(3),
        {
          root: null,
          threshold: [0.03, 0.25, 0.55],
        }
      );

      observerRef.current = observer;
      topShowsObserverRef.current = topShowsObserver;

      allCategoryNames.forEach((name, index) => {
        const element = document.getElementById(name);
        if (element) {
          if (index === allCategoryNames.length - 1)
            topShowsObserver.observe(element);
          else observer.observe(element);
        }
      });
      return () => {
        observer.disconnect();
        topShowsObserver.disconnect();
        if (observerResetTimeoutId.current) {
          clearTimeout(observerResetTimeoutId.current);
        }
      };
    }, [allCategoryNames.length]);

    useEffect(() => {
      const pill = document.getElementById(`pill-${activeCategoryName}`);
      if (!(pill && categoryPillRowRef.current)) return;

      categoryPillRowRef.current.scrollBy({
        left:
          pill?.getBoundingClientRect().x -
          categoryPillRowRef.current.clientWidth / 2,
      });
    }, [activeCategoryName]);

    const onCategoryClicked = (name: string, ranking: number) => {
      if (observerResetTimeoutId.current) {
        clearTimeout(observerResetTimeoutId.current);
      }

      const selectedCategoryChild = document.getElementById(name);
      if (!selectedCategoryChild) return;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (topShowsObserverRef.current) {
        topShowsObserverRef.current.disconnect();
      }

      setActiveCategoryName(name);

      trackEvent({
        eventName: ANALYTICS_EVENTS.CATEGORY_TAB_CLICKED,
        ...getCommonEventMetaData(pageMetaData),
        [ANALYTICS_PROPERTIES.RANKING]: ranking + 1,
        [ANALYTICS_PROPERTIES.HEADING]: name,
      });

      const offset = calculateAutoScrollOffset(name, isMobile, showGridUI);
      scroller.scrollTo(name, {
        duration: 800,
        smooth: 'easeInOutQuart',
        offset: -offset,
      });
      observerResetTimeoutId.current = setTimeout(() => {
        allCategoryNames.forEach((name, index) => {
          const element = document.getElementById(name);
          if (element) {
            if (index === allCategoryNames.length - 1)
              topShowsObserverRef.current?.observe?.(element);
            else observerRef.current?.observe?.(element);
          }
        });
      }, 1500);
    };

    const categoryChips = categoriesToRender.map(({ name, id }, index) => {
      const { icon } =
        ENTERTAINMENT_CATEGORIES[id] ?? ENTERTAINMENT_CATEGORIES.fallback;
      const currentIcon =
        icon[activeCategoryName === name && !showGridUI ? 'active' : 'default'];
      return (
        <CategoryWrapper
          $isActive={activeCategoryName === name && !showGridUI}
          $showGridUI={showGridUI}
          key={index}
          onClick={() => {
            setLazyLoadOverride(true);
            onCategoryClicked(
              name,
              categoryChipsToAddAtTheStart.length + index
            );
          }}
          id={`pill-${name}`}
        >
          <span className="icon">{currentIcon}</span>
          <span className="name">{name}</span>
        </CategoryWrapper>
      );
    });

    categoryChips.unshift(
      ...categoryChipsToAddAtTheStart.map((category, index) => (
        <CategoryWrapper
          key={category.name}
          $isActive={activeCategoryName === category.name && !showGridUI}
          $showGridUI={showGridUI}
          onClick={() => onCategoryClicked(category.name, index)}
          id={`pill-${category.name}`}
        >
          <span className="icon">
            {
              category.icon[
                activeCategoryName === category.name && !showGridUI
                  ? 'active'
                  : 'default'
              ]
            }
          </span>
          <span className="name">
            {index === 0
              ? strings.ENTERTAINMENT_MB_LANDING_PAGE.TOP_SHOWS
              : strings.ENTERTAINMENT_MB_LANDING_PAGE.LAST_MINUTE_TICKETS}
          </span>
        </CategoryWrapper>
      ))
    );

    return (
      <CategoriesSection
        ref={ref}
        id="browse-by-category-section"
        $showGridUI={showGridUI}
      >
        <Conditional if={showGridUI}>
          <div className="browse-by-category-title">
            {strings.ENTERTAINMENT_MB_LANDING_PAGE.BROWSE_BY_CATEGORIES}
          </div>
        </Conditional>
        <Conditional if={!showGridUI}>
          <div ref={categoryPillRowRef} className="categories">
            {categoryChips.map((category) => category)}
          </div>
        </Conditional>

        <Conditional if={showGridUI}>
          <div className="row-wrapper">
            <div className="row-one">
              {categoryChips
                .slice(0, Math.floor(categoriesToRender.length / 2 + 1))
                .map((category) => category)}
            </div>
            <div className="row-two">
              {categoryChips
                .slice(Math.floor(categoriesToRender.length / 2 + 1))
                .map((category) => category)}
            </div>
          </div>
        </Conditional>
      </CategoriesSection>
    );
  }
);

BrowseByCategoriesSection.displayName = 'BrowseByCategoriesSection';

export default BrowseByCategoriesSection;
