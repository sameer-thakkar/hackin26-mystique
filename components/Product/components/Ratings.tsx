import { truncateNumber } from 'utils';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { STAR_FULL } from 'assets/SvgIcons';
import { TRatingsContainerProps } from '../interface';
import { StyledRatingsContainer } from '../styles';

const Ratings = ({ reviewsDetails }: TRatingsContainerProps) => {
  if (!reviewsDetails) return null;

  const { ratingCount, averageRating, showRatings } = reviewsDetails;

  if (showRatings === undefined) return null;

  return (
    <StyledRatingsContainer>
      {showRatings && <STAR_FULL fillColor={COLORS.BRAND.CANDY} />}
      <span className="avg-rating">
        {showRatings ? averageRating : strings.NEW}
      </span>
      {showRatings && (
        <span className="rating-count">
          ({truncateNumber(ratingCount).toUpperCase()})
        </span>
      )}
    </StyledRatingsContainer>
  );
};

export default Ratings;
