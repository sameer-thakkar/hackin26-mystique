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
import {
  ENGAGING_STORIES_ICON,
  LeafDesktop,
  LeafMobile,
  LOCAL_GUIDE_ICON,
  TOP_RATED_ICON,
} from 'assets/SvgIcons';

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
            <div className="icon-container">{LOCAL_GUIDE_ICON}</div>
            <div className="detail-label">
              {strings.SPECIAL_PRODUCT_DESCRIPTORS.LOCAL_GUIDES}
            </div>
          </SpecialGuidedTourDetail>
          <SpecialGuidedTourDetailSeparator />
          <SpecialGuidedTourDetail>
            <div className="icon-container">{TOP_RATED_ICON}</div>
            <div className="detail-label">
              {strings.SPECIAL_PRODUCT_DESCRIPTORS.TOP_RATED}
            </div>
          </SpecialGuidedTourDetail>
          <SpecialGuidedTourDetailSeparator />
          <SpecialGuidedTourDetail>
            <div className="icon-container">{ENGAGING_STORIES_ICON}</div>
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
