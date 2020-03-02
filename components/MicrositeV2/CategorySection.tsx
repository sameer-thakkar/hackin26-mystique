import PopulateProducts from './PopulateProducts';
import { AVENIR, GRAPHIK, COLORS } from '../../constants/ui-constants';
const CategorySection = props => {
  const {
    tgidsArray,
    host,
    uid,
    heading,
    description,
    changePage,
    allTours,
    isMobile,
  } = props;
  let filteredTgids = tgidsArray.filter(
    tgid => allTours[tgid] && allTours[tgid].available
  );
  const elementId = heading
    .trim()
    .replace(/\s/g, '-')
    .toLowerCase();
  return (
    <div className="category-slider" id={elementId}>
      <h2 className="category-heading">{heading}</h2>
      <p className="category-description">{description}</p>
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
      <style jsx>{`
        .category-slider {
          display: grid;
          grid-row-gap: 4px;
          color: ${COLORS.DAVY_GREY};
        }
        .category-heading {
          margin: 0;
          font-size: 22px;
          font-family: ${AVENIR.FONT_STACK};
          font-weight: ${AVENIR.HEAVY};
          line-height: 33px;
          color: ${COLORS.TWO_BLACK};
        }
        .category-description {
          margin: 0;
          font-size: 14px;
          font-family: ${AVENIR.FONT_STACK};
          line-height: 20px;
          font-weight: ${AVENIR.MEDIUM};
          color: ${COLORS.FOUR_BLACK};
        }
        @media (max-width: 768px) {
          .category-slider {
            grid-row-gap: 8px;
          }
          .category-heading {
            margin: 0;
            font-size: 24px;
            font-family: ${GRAPHIK.FONT_STACK};
            font-weight: ${GRAPHIK.SEMIBOLD};
            line-height: 26px;
          }
          .category-description {
            font-family: ${GRAPHIK.FONT_STACK};
            line-height: 20px;
            font-weight: ${GRAPHIK.REGULAR};
          }
        }
      `}</style>
    </div>
  );
};

export default CategorySection;
