import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import { truncateNumber } from 'utils/index';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import { STAR } from 'assets/SvgIcons';

const RatingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .average-rating {
    font-family: ${HALYARD.FONT_STACK};
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: ${COLORS.BRAND.CANDY};
    margin-right: 3px;
  }

  .count {
    font-family: ${HALYARD.FONT_STACK};
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    line-height: 16px;
    color: ${COLORS.GRAY.G6};
    margin-left: 4px;
  }
`;

interface IRatingProps {
  reviewCount: number;
  averageRating: number;
  showReviewsText: boolean;
  showCount?: boolean;
}

const Ratings = ({
  reviewCount,
  averageRating,
  showReviewsText,
  showCount = true,
}: IRatingProps) => {
  return (
    <RatingsWrapper>
      <div className="average-rating">{averageRating?.toPrecision(2)}</div>
      {STAR(COLORS.BRAND.CANDY)}
      <Conditional if={reviewCount > 0 && showCount}>
        <div className="count">
          ({truncateNumber(reviewCount).toUpperCase()}
          <Conditional if={showReviewsText}> {strings.REVIEWS}</Conditional>)
        </div>
      </Conditional>
    </RatingsWrapper>
  );
};

export default Ratings;
