import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { IRatingProps } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/Ratings/interface';
import { RatingsWrapper } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/Ratings/style';
import { truncateNumber } from 'utils';
import { getLocalizedCount } from 'utils/localizationUtils';
import { appAtom } from 'store/atoms/app';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import Star from 'assets/star';

const Ratings = ({
  ratingCount,
  averageRating,
  showReviewsText,
  showCount = true,
}: IRatingProps) => {
  const { language, isMobile } = useRecoilValue(appAtom);

  const finalRatingCount = isMobile
    ? getLocalizedCount(ratingCount, language)
    : truncateNumber(ratingCount);

  return (
    <RatingsWrapper>
      <Star color={COLORS.TEXT.CANDY_1} />
      <div className="average-rating">{averageRating?.toPrecision(2)}</div>
      <Conditional if={ratingCount > 0 && showCount}>
        <div className="count">
          (
          {showReviewsText
            ? (
                strings.formatString(
                  strings.RATINGS,
                  finalRatingCount
                ) as string
              ).toLowerCase()
            : finalRatingCount}
          )
        </div>
      </Conditional>
    </RatingsWrapper>
  );
};

export default Ratings;
