import { useRecoilValue } from 'recoil';
import { CategoriesSection } from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection/style';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { metaAtom } from 'store/atoms/meta';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { LTT_CATEGORIES } from 'const/lttCategories';

const BrowseByCategoriesSection = () => {
  const pageMetaData = useRecoilValue(metaAtom);

  const onCategoryClicked = (link: string, name: string, ranking: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CATEGORY_TAB_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.RANKING]: ranking + 1,
      [ANALYTICS_PROPERTIES.HEADING]: name,
    });
    window.open(link);
  };

  return (
    <CategoriesSection className="hroizontally-aligned-child">
      <p>Browse by categories</p>
      <div className="categories">
        {Object.values(LTT_CATEGORIES).map(({ icon, name, link }, index) => {
          return (
            <div
              className="category-wrapper"
              key={index}
              onClick={() => onCategoryClicked(link, name, index)}
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
