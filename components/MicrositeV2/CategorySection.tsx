import { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import InteractionContext from 'contexts/Interaction';
import ProductsContext from 'contexts/Products';
import useWindowSize from 'hooks/useWindowSize';
import COLORS from 'const/colors';
import { DONT_AUTO_SCROLL, DONT_HOIST } from 'const/index';
import { HALYARD } from 'const/ui-constants';

const PopulateProducts = dynamic(() =>
  import(/* webpackChunkName: "PopulateProducts" */ './PopulateProducts')
);

const StyledCategorySection = styled.div`
  display: grid;
  grid-row-gap: 8px;
  color: ${COLORS.GRAY.G2};

  .category-heading {
    margin: 0;
    font-size: 24px;
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 500;
    line-height: 33px;
    color: ${COLORS.GRAY.G2};
  }
  .category-description {
    margin: 0;
    font-size: 16px;
    width: 60%;
    font-family: ${HALYARD.FONT_STACK};
    line-height: 20px;
    font-weight: 500;
    color: ${COLORS.GRAY.G2};
  }
  @media (max-width: 768px) {
    grid-row-gap: 8px;
    .category-heading {
      margin: 0;
      font-size: 24px;
      font-family: ${HALYARD.FONT_STACK};
      font-weight: 600;
      line-height: 26px;
    }
    .category-description {
      font-family: ${HALYARD.FONT_STACK};
      line-height: 20px;
      width: 100%;
      font-weight: 400;
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

const CategorySection = (props: any) => {
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
  // @ts-expect-error TS(2339): Property 'allTours' does not exist on type 'null'.
  const { allTours = [] } = toursContext || {};

  let filteredTgids: any;
  const categoryDataObj = {};

  const categoryDataArray = Object.keys(categoryTourListData)?.length
    ? categoryTourListData[category]
    : [];

  if (categoryDataArray?.length) {
    categoryDataArray?.forEach((c: any) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      categoryDataObj[c?.tgid] = c;
    });
  }
  const categoryTours = categoryDataArray?.length ? categoryDataObj : allTours;

  if (hasCategoryTourList) {
    const re = /\s*(?:,)\s*/g;
    const excludedTours = excludedTgids
      ? excludedTgids?.split(re)?.map((tgid: any) => +tgid)
      : [];
    const allTgids = categoryDataArray?.map((c: any) => c?.tgid);
    filteredTgids = allTgids?.filter((tgid: any) => {
      return (
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        categoryDataObj[tgid] &&
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        categoryDataObj[tgid]?.available &&
        !excludedTours.includes(tgid)
      );
    });
  } else {
    filteredTgids = tgidsArray.filter(
      (tgid: any) => allTours[tgid] && allTours[tgid].available
    );
  }

  const elementId =
    heading?.trim().replace(/\s/g, '-').toLowerCase() || filteredTgids[0];
  const { width } = useWindowSize();
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const isMobile = width < 768;
  useEffect(() => {
    setTimeout(() => {
      if (isFirstTourOpen && filteredTgids[0] && !isMobile)
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        interactionContext.clickTour(
          filteredTgids[0],
          DONT_HOIST,
          elementId,
          DONT_AUTO_SCROLL
        );
    });
  }, []);

  return (
    <StyledCategorySection id={elementId}>
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
