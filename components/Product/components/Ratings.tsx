import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import { checkIfHarryPotterPage, truncateNumber } from 'utils';
import { isSafari as checkForSafari } from 'utils/helper';
import { appAtom } from 'store/atoms/app';
import COLORS from 'const/colors';
import { CARD_SECTION_MARKERS } from 'const/productCard';
import { strings } from 'const/strings';
import StarFull from 'assets/starFull';
import { TRatingsContainerProps } from '../interface';
import { StyledRatingsContainer } from '../styles';

const Ratings = ({
  reviewsDetails,
  onRatingsCountClick,
}: TRatingsContainerProps) => {
  const [isSafari, setIsSafari] = useState(false);
  const { uid } = useRecoilValue(appAtom);

  useEffect(() => {
    setIsSafari(checkForSafari());
  }, []);

  if (!reviewsDetails) return null;

  const { ratingsCount, averageRating, showRatings } = reviewsDetails;

  if (showRatings === undefined) return null;

  const isHarryPotterPage = checkIfHarryPotterPage(uid);

  return (
    <StyledRatingsContainer
      $isHarryPotterPage={isHarryPotterPage}
      $isSafari={isSafari}
    >
      {showRatings && <StarFull fillColor={COLORS.BRAND.CANDY} />}
      <span
        data-card-section={CARD_SECTION_MARKERS.REVIEWS}
        className="avg-rating"
      >
        {showRatings ? averageRating?.toFixed(1) : strings.NEW}
      </span>
      {showRatings && (
        <span
          className="rating-count"
          onClick={onRatingsCountClick}
          role="button"
          {...(!onRatingsCountClick && {
            'data-card-section': CARD_SECTION_MARKERS.REVIEWS,
          })}
          tabIndex={0}
        >
          (
          <span className={classNames({ 'underline': onRatingsCountClick })}>
            {truncateNumber(ratingsCount).toUpperCase()}
          </span>
          )
        </span>
      )}
    </StyledRatingsContainer>
  );
};

export default Ratings;
