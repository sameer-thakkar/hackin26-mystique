import { useEffect, useRef } from 'react';
import CatSubCatSection from 'components/CityPageContainer/ExploreCity/CatSubCatSection';
import { ExploreContainer } from 'components/CityPageContainer/ExploreCity/styles';
import {
  ICarouselChild,
  IExploreCarouselEntity,
  IExploreCity,
  IExploreSectionData,
} from 'components/CityPageContainer/interface';
import { trackPageSection } from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import useOnScreen from 'hooks/useOnScreen';
import { SECTION_NAMES } from 'const/cityPage';
import { strings } from 'const/strings';

const getUniqueItems = (arr: ICarouselChild[]) => {
  const resultMap = new Map();
  arr.map((item) => {
    resultMap.set(item.id, item);
  });

  return Array.from(resultMap.values());
};

const getFinalCarouselData = (exploreSectionData: IExploreSectionData) => {
  const { categoriesData, subCategoriesData } = exploreSectionData;
  const entitiesArr = [
    ...Object.values(categoriesData),
    ...Object.values(subCategoriesData),
  ];

  let sortedEntitiesArr = entitiesArr.sort(
    (entityA, entityB) =>
      entityA.parentData.cityPageRank - entityB.parentData.cityPageRank
  );

  let carouselsCount = 0;
  const carouselSections = sortedEntitiesArr.map((entity) => {
    const { children } = entity;
    const uniqueChildren = getUniqueItems(children);
    if (uniqueChildren.length >= 3) carouselsCount++;
    return { ...entity, children: uniqueChildren };
  });

  return { carouselsCount, carouselSections };
};

const ExploreCity = ({
  lang,
  host,
  isDev,
  isMobile,
  exploreSectionData,
  mbCityDisplayName,
}: IExploreCity) => {
  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });
  const { ctaData } = exploreSectionData;

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: SECTION_NAMES.EXPLORE });
    }
  }, [isIntersecting]);

  const { carouselSections, carouselsCount } = getFinalCarouselData(
    exploreSectionData
  );

  return (
    <ExploreContainer ref={containerRef}>
      <Conditional if={carouselsCount}>
        <h2 className="explore-title">
          {strings.formatString(strings.CITY_PAGE.EXPLORE, mbCityDisplayName)}
        </h2>
      </Conditional>

      {carouselSections.map((catSubCatEntity: IExploreCarouselEntity) => (
        <CatSubCatSection
          key={catSubCatEntity.parentData.cityPageRank}
          lang={lang}
          host={host}
          isDev={isDev}
          isMobile={isMobile}
          ctaData={ctaData}
          {...catSubCatEntity}
        />
      ))}
    </ExploreContainer>
  );
};

export default ExploreCity;
