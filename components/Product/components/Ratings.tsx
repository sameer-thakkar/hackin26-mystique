import { useRecoilValue } from 'recoil';
import { StarRating } from '@headout/espeon/components/StarRating';
import useWindowWidth from 'hooks/useWindowWidth';
import { appAtom } from 'store/atoms/app';
import { CARD_SECTION_MARKERS } from 'const/productCard';
import { strings } from 'const/strings';
import { TRatingsContainerProps } from '../interface';

const Ratings = ({
  reviewsDetails,
  onRatingsCountClick,
}: TRatingsContainerProps) => {
  const { language } = useRecoilValue(appAtom);
  const windowWidth = useWindowWidth();

  if (!reviewsDetails) return null;

  const { ratingsCount, averageRating, showRatings } = reviewsDetails;

  if (showRatings === undefined) return null;

  const isMobile = windowWidth !== undefined && windowWidth < 768;

  return (
    <span data-card-section={CARD_SECTION_MARKERS.REVIEWS}>
      <StarRating
        multipleStars={false}
        rating={averageRating ?? 0}
        onRatingCountClick={onRatingsCountClick}
        ratingCount={ratingsCount}
        size={isMobile ? 'regular' : 'medium'}
        lang={language}
        ratingLabelText={strings.NEW}
        showNewLabel={!showRatings}
      />
    </span>
  );
};

export default Ratings;
