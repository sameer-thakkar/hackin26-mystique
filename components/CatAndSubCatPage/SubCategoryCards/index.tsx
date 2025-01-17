import React, { useEffect, useRef, useState } from 'react';
import CollectionCard from 'components/CatAndSubCatPage/CollectionCard';
import { TSubCategoryCards } from 'components/CatAndSubCatPage/interface';
import { SubCategoryCardsProps } from 'components/CatAndSubCatPage/SubCategoryCards/interface';
import SortSelector from 'components/CatAndSubCatPage/SubCategoryCards/SortSelector';
import {
  CardsContainer,
  CardsSection,
  GridContainer,
  HeadingContainer,
  SectionHeading,
} from 'components/CatAndSubCatPage/SubCategoryCards/styles';
import { trackPageSection } from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { getCatAndSubcatPageLabel } from 'utils/helper';
import { PRICING, SECTIONS, SORTING_ORDER } from 'const/catAndSubcatPage';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

const SubCategoryCards: React.FC<
  React.PropsWithChildren<SubCategoryCardsProps>
> = (props) => {
  const {
    subCategoryCards,
    subCategoryCardsRanking,
    subCategoryData,
    isMobile,
  } = props;
  const sectionHeading = getCatAndSubcatPageLabel({
    label: 'ALL_SUBCATEGORY',
    replacementString: subCategoryData?.displayName,
  });
  const sectionRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useOnScreen({ ref: sectionRef, unobserve: true });
  const [sortingOrder, setSortingOrder] = useState<
    'popularity' | 'ascending' | 'descending'
  >('popularity');

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({
        section: SECTIONS.ALL_SUB_CATEGORY,
      });
    }
  }, [isIntersecting]);

  useEffect(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CAT_SUBCAT_PAGE.COLLECTIONS_SORTED,
      [ANALYTICS_PROPERTIES.SORT_BY]: PRICING,
      [ANALYTICS_PROPERTIES.SORTING_ORDER]:
        sortingOrder === 'popularity'
          ? SORTING_ORDER.POPULARITY
          : sortingOrder === 'ascending'
          ? SORTING_ORDER.LOW_TO_HIGH
          : SORTING_ORDER.HIGH_TO_LOW,
    });
  }, [sortingOrder]);

  let sortedSubCategoryCards: TSubCategoryCards = [];
  const ascSortedCards = subCategoryCards.sort(
    (cardA, cardB) =>
      cardA?.startingPrice?.listingPrice - cardB?.startingPrice?.listingPrice
  );
  if (sortingOrder === 'popularity') {
    sortedSubCategoryCards = subCategoryCards.sort(
      (cardA, cardB) =>
        subCategoryCardsRanking.indexOf(cardA?.id) -
        subCategoryCardsRanking.indexOf(cardB?.id)
    );
  } else if (sortingOrder === 'ascending') {
    sortedSubCategoryCards = ascSortedCards;
  } else {
    sortedSubCategoryCards = ascSortedCards.reverse();
  }

  return (
    <CardsSection ref={sectionRef}>
      <CardsContainer>
        <HeadingContainer>
          <SectionHeading>{sectionHeading}</SectionHeading>
          <Conditional if={sortedSubCategoryCards.length > 1}>
            <span className="sort-selector">
              <SortSelector
                sortingOrder={sortingOrder}
                setSortingOrder={setSortingOrder}
                isMobile={isMobile}
              />
            </span>
          </Conditional>
        </HeadingContainer>
        <GridContainer>
          {sortedSubCategoryCards.map((subCategoryCard, index) => {
            const { id } = subCategoryCard;

            return (
              <CollectionCard
                key={id}
                ranking={index}
                {...subCategoryCard}
                isSubCategoryPage={true}
                isMobile={isMobile}
              />
            );
          })}
        </GridContainer>
      </CardsContainer>
    </CardsSection>
  );
};

export default SubCategoryCards;
