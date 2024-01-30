import Conditional from 'components/common/Conditional';
import AnimatedCarousel from 'components/Product/components/AnimationWrapper';
import { TSpecialProductType } from 'components/Product/interface';
import {
  AnimationHeader,
  SpecialGuidedTourDetail,
  SpecialGuidedTourDetailSeparator,
  SpecialGuidedTourDetailsWrapper,
  SpecialGuidedTourHeader,
  SpecialGuidedTourHeaderWrapper,
  SpecialGuidedTourWrapper,
} from 'components/Product/styles';
import { strings } from 'const/strings';
import EngagingStoriesIcon from 'assets/engagingStoriesIcon';
import LeafDesktop from 'assets/leafdesktop';
import LeafMobile from 'assets/leafmobile';
import LocalGuideIcon from 'assets/localGuideIcon';
import TopRatedIcon from 'assets/topRatedIcon';

export const SpecialGuidedTour = ({
  Product,
  isMobile,
}: TSpecialProductType) => {
  return (
    <SpecialGuidedTourWrapper>
      {[...Array(isMobile ? 3 : 6).keys()].map((i) => (
        <div key={`ellipse-${i}`} className="ellipse" />
      ))}
      <SpecialGuidedTourHeaderWrapper>
        <SpecialGuidedTourHeader>
          {isMobile ? LeafMobile : LeafDesktop}
          <div className="special-product-header">
            {strings.SPECIAL_PRODUCT_HEADING}
          </div>
          {isMobile ? LeafMobile : LeafDesktop}
        </SpecialGuidedTourHeader>
        <SpecialGuidedTourDetailsWrapper>
          <SpecialGuidedTourDetail>
            <div className="icon-container">{LocalGuideIcon}</div>
            <div className="detail-label">
              {strings.SPECIAL_PRODUCT_DESCRIPTORS.LOCAL_GUIDES}
            </div>
          </SpecialGuidedTourDetail>
          <SpecialGuidedTourDetailSeparator />
          <SpecialGuidedTourDetail>
            <div className="icon-container">{TopRatedIcon}</div>
            <div className="detail-label">
              {strings.SPECIAL_PRODUCT_DESCRIPTORS.TOP_RATED}
            </div>
          </SpecialGuidedTourDetail>
          <SpecialGuidedTourDetailSeparator />
          <SpecialGuidedTourDetail>
            <div className="icon-container">{EngagingStoriesIcon}</div>
            <div className="detail-label">
              {strings.SPECIAL_PRODUCT_DESCRIPTORS.ENGAGING_STORIES}
            </div>
          </SpecialGuidedTourDetail>
        </SpecialGuidedTourDetailsWrapper>
        <Conditional if={!isMobile}>
          <AnimationHeader>{strings.HEAR_FROM_OUR_GUESTS}</AnimationHeader>
          <AnimatedCarousel />
        </Conditional>
      </SpecialGuidedTourHeaderWrapper>
      {Product}
      <Conditional if={isMobile}>
        <AnimationHeader>{strings.HEAR_FROM_OUR_GUESTS}</AnimationHeader>
        <AnimatedCarousel isMobile />
      </Conditional>
    </SpecialGuidedTourWrapper>
  );
};
