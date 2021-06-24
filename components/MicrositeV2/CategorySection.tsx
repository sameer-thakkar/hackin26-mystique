import dynamic from 'next/dynamic';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import useWindowSize from 'hooks/useWindowSize';
import ProductsContext from 'contexts/Products';
import InteractionContext from 'contexts/Interaction';
import Conditional from 'components/common/Conditional';
import { SOLEIL, COLORS } from 'const/ui-constants';
import { DONT_AUTO_SCROLL, DONT_HOIST } from 'const/index';

const PopulateProducts = dynamic(() => import('./PopulateProducts'));

const StyledCategorySection = styled.div`
  display: grid;
  grid-row-gap: 8px;

  color: ${COLORS.DAVY_GREY};

  .category-heading {
    margin: 0;
    font-size: 24px;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.MEDIUM};
    line-height: 33px;
    color: ${COLORS.TWO_BLACK};
  }
  .category-description {
    margin: 0;
    font-size: 16px;
    width: 60%;
    font-family: ${SOLEIL.FONT_STACK};
    line-height: 20px;
    font-weight: ${SOLEIL.MEDIUM};
    color: ${COLORS.FOUR_BLACK};
  }
  @media (max-width: 768px) {
    grid-row-gap: 8px;
    .category-heading {
      margin: 0;
      font-size: 24px;
      font-family: ${SOLEIL.FONT_STACK};
      font-weight: ${SOLEIL.SEMIBOLD};
      line-height: 26px;
    }
    .category-description {
      font-family: ${SOLEIL.FONT_STACK};
      line-height: 20px;
      width: 100%;
      font-weight: ${SOLEIL.REGULAR};
    }
  }
`;

/**
 * # Tours Section / Carousel
 * This Allows you to show V2 Tour Cards by refering to them via their tgid, this requires the tour details to be already added on the microsite under the "All Tours" tab ([learn more](https://headout.github.io/mystique/?path=/docs/general-v2-products--page)),
 *
 * ### Non-repeatable zone
 * - Heading
 *  Title for the Section, Mandatory Field.
 * - Description
 *  Description for the section in RichText.
 * - CSV TGIDs
 *  Comma Separated Values of TGIDs, (Ex: 2936, 10051,...)
 * - Keep First Tour Open
 *  Setting this to yes will make the first tour open by default.
 *
 * ### Repeatable zone
 * Nil.
 *
 * PS: Tours that are not added in "All Tours" will obviously not be shown, in addition to that tours that are currently unavailable will also be hidden form view automatically.
 *
 */

const CategorySection = (props) => {
  const {
    tgidsArray,
    host,
    uid,
    heading = '',
    description,
    changePage,
    isFirstTourOpen = false,
    isEntertainmentMb,
    category,
    excludedTgids,
    hasCategoryTourList = false,
    categoryTourListData = {},
  } = props;
  const toursContext = useContext(ProductsContext);
  const interactionContext = useContext(InteractionContext);
  const allTours = toursContext.allTours;

  let filteredTgids;
  const categoryDataObj = {};

  const categoryDataArray = Object.keys(categoryTourListData)?.length
    ? categoryTourListData[category]
    : [];

  if (categoryDataArray?.length) {
    categoryDataArray?.forEach((c) => {
      categoryDataObj[c?.tgid] = c;
    });
  }
  const categoryTours =
    hasCategoryTourList && categoryDataArray?.length
      ? categoryDataObj
      : allTours;

  if (hasCategoryTourList) {
    const re = /\s*(?:,)\s*/g;
    const excludedTours = excludedTgids
      ? excludedTgids?.split(re)?.map((tgid) => +tgid)
      : [];
    const allTgids = categoryDataArray?.map((c) => c?.tgid);
    filteredTgids = allTgids?.filter((tgid) => {
      return (
        categoryDataObj[tgid] &&
        categoryDataObj[tgid]?.available &&
        !excludedTours.includes(tgid)
      );
    });
  } else {
    filteredTgids = tgidsArray.filter(
      (tgid) => allTours[tgid] && allTours[tgid].available
    );
  }

  const elementId =
    heading?.trim().replace(/\s/g, '-').toLowerCase() || filteredTgids[0];
  const { width } = useWindowSize();
  const isMobile = width < 768;
  useEffect(() => {
    setTimeout(() => {
      if (isFirstTourOpen && filteredTgids[0] && !isMobile)
        interactionContext.clickTour(
          filteredTgids[0],
          DONT_HOIST,
          elementId,
          DONT_AUTO_SCROLL
        );
    });
  }, []);

  return (
    <StyledCategorySection id={elementId} isEntertainmentMb={isEntertainmentMb}>
      <Conditional if={heading}>
        <h2 className="category-heading">{heading}</h2>
      </Conditional>
      <Conditional if={description}>
        <p className="category-description">{description}</p>
      </Conditional>
      <Conditional if={filteredTgids?.length}>
        <PopulateProducts
          rowsToShow={2}
          propTgids={filteredTgids}
          isMobile={isMobile}
          changePage={changePage}
          allTours={categoryTours}
          host={host}
          uid={uid}
          sectionId={elementId}
          isEntertainmentMb={isEntertainmentMb}
        />
      </Conditional>
    </StyledCategorySection>
  );
};

export default CategorySection;
