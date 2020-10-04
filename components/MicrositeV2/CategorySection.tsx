import PopulateProducts from './PopulateProducts';
import { SOLEIL, COLORS } from '../../constants/ui-constants';
import { useContext, useEffect } from 'react';
import ProductsContext from '../../contexts/Products';
import InteractionContext from '../../contexts/Interaction';
import { DONT_AUTO_SCROLL, DONT_HOIST } from '../../constants';
import styled from 'styled-components';
import useWindowSize from 'hooks/useWindowSize';

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
  } = props;
  const toursContext = useContext(ProductsContext);
  const interactionContext = useContext(InteractionContext);
  const allTours = toursContext.allTours;
  let filteredTgids = tgidsArray.filter(
    (tgid) => allTours[tgid] && allTours[tgid].available
  );
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
    <StyledCategorySection id={elementId}>
      {heading ? <h2 className="category-heading">{heading}</h2> : null}
      {description ? (
        <p className="category-description">{description}</p>
      ) : null}
      <PopulateProducts
        rowsToShow={2}
        propTgids={filteredTgids}
        isMobile={isMobile}
        changePage={changePage}
        allTours={allTours}
        host={host}
        uid={uid}
        sectionId={elementId}
      />
    </StyledCategorySection>
  );
};

export default CategorySection;
