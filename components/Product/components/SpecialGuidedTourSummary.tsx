import { GuidesBanner } from 'components/Product/components/GuidesBanner';
import {
  SpecialGuidedTourSummaryDetail,
  SpecialGuidedTourSummaryWrapper,
} from 'components/Product/styles';
import { strings } from 'const/strings';

const SpecialGuidedTourSummary = ({
  moreDetailsCTA,
}: {
  moreDetailsCTA?: JSX.Element;
}) => {
  return (
    <SpecialGuidedTourSummaryWrapper>
      <GuidesBanner />
      <SpecialGuidedTourSummaryDetail>
        <div className="special-guided-tour-summary-content">
          <span>{strings.SPECIAL_GUIDED_TOUR_PRODUCT_SUMMARY[0]}</span>
          <span className="ending-line">
            {strings.SPECIAL_GUIDED_TOUR_PRODUCT_SUMMARY[1]}
          </span>
        </div>
        <div>{moreDetailsCTA}</div>
      </SpecialGuidedTourSummaryDetail>
    </SpecialGuidedTourSummaryWrapper>
  );
};

export default SpecialGuidedTourSummary;
