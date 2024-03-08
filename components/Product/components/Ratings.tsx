import { truncateNumber } from 'utils';
import { isSafari } from 'utils/helper';
import COLORS from 'const/colors';
import { CARD_SECTION_MARKERS } from 'const/productCard';
import { strings } from 'const/strings';
import StarFull from 'assets/starFull';
import { TRatingsContainerProps } from '../interface';
import { StyledRatingsContainer } from '../styles';

const Ratings = ({ reviewsDetails }: TRatingsContainerProps) => {
  if (!reviewsDetails) return null;

  const { ratingCount, averageRating, showRatings } = reviewsDetails;

  if (showRatings === undefined) return null;

  return (
    <StyledRatingsContainer $isSafari={isSafari()}>
      {showRatings && <StarFull fillColor={COLORS.BRAND.CANDY} />}
      <span
        data-card-section={CARD_SECTION_MARKERS.REVIEWS}
        className="avg-rating"
      >
        {showRatings ? averageRating : strings.NEW}
      </span>
      {showRatings && (
        <span
          data-card-section={CARD_SECTION_MARKERS.REVIEWS}
          className="rating-count"
        >
          ({truncateNumber(ratingCount).toUpperCase()})
        </span>
      )}
    </StyledRatingsContainer>
  );
};

export default Ratings;
