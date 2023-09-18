import { scroller } from 'react-scroll';
import { useRecoilValue } from 'recoil';
import { TBrowseByCategoriesSection } from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection/interface';
import { CategoriesSection } from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection/style';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { metaAtom } from 'store/atoms/meta';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { LTT_CATEGORIES } from 'const/lttCategories';
import { strings } from 'const/strings';

const BrowseByCategoriesSection = ({
  categoriesToRender,
  isMobile,
}: TBrowseByCategoriesSection) => {
  const pageMetaData = useRecoilValue(metaAtom);

  const onCategoryClicked = (name: string, ranking: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CATEGORY_TAB_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.RANKING]: ranking + 1,
      [ANALYTICS_PROPERTIES.HEADING]: name,
    });

    scroller.scrollTo(name, {
      duration: 800,
      smooth: 'easeInOutQuart',
      offset: isMobile ? -90 : -120,
    });
  };

  return (
    <CategoriesSection className="hroizontally-aligned-child">
      <p>{strings.LTT_LANDING_PAGE.BROWSE_BY_CATEGORIES}</p>
      <div className="categories">
        {categoriesToRender.map(({ name, id }, index) => {
          const { icon } = LTT_CATEGORIES[id] ?? LTT_CATEGORIES.fallback;
          return (
            <div
              className="category-wrapper"
              key={index}
              onClick={() => onCategoryClicked(name, index)}
              role="button"
              tabIndex={index}
            >
              <span className="icon">{icon}</span>
              <span className="name">{name}</span>
            </div>
          );
        })}
      </div>
    </CategoriesSection>
  );
};

export default BrowseByCategoriesSection;
