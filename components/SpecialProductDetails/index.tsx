import { SwiperProps } from 'swiper/react';
import SpecialProductDetailLabel from 'components/SpecialProductDetailLabel';
import { SpecialProductDetailsWrapper } from 'components/SpecialProductDetails/styles';
import SwiperWrapper from 'components/Swiper';
import { strings } from 'const/strings';
import {
  ENGAGING_STORIES_ICON,
  LeafLeftDesktop,
  LeafLeftMobile,
  LeafRightDesktop,
  LeafRightMobile,
  LOCAL_GUIDE_ICON,
  TOP_RATED_ICON,
} from 'assets/SvgIcons';

const SpecialProductDetailLabelListDesktop = () => (
  <div className="special-product-details-labels">
    <SpecialProductDetailLabel
      icon={LOCAL_GUIDE_ICON}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.LOCAL_GUIDES}
    />
    <div className="special-product-details-separator" />
    <SpecialProductDetailLabel
      icon={ENGAGING_STORIES_ICON}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.ENGAGING_STORIES}
    />
    <div className="special-product-details-separator" />
    <SpecialProductDetailLabel
      icon={TOP_RATED_ICON}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.TOP_RATED}
    />
  </div>
);

const swiperConfig: SwiperProps = {
  spaceBetween: 12,
  centeredSlides: true,
  speed: 3000,
  autoplay: {
    delay: 0,
    disableOnInteraction: true,
  },
  loop: true,
  slidesPerView: 'auto',
  allowTouchMove: false,
  createElements: true,
};

const SpecialProductDetailLabelListMobile = () => (
  <SwiperWrapper className="special-product-details-labels" {...swiperConfig}>
    <SpecialProductDetailLabel
      icon={LOCAL_GUIDE_ICON}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.LOCAL_GUIDES}
    />
    <div className="special-product-details-separator" />
    <SpecialProductDetailLabel
      icon={ENGAGING_STORIES_ICON}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.ENGAGING_STORIES}
    />
    <div className="special-product-details-separator" />
    <SpecialProductDetailLabel
      icon={TOP_RATED_ICON}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.TOP_RATED}
    />
    <div className="special-product-details-separator" />
  </SwiperWrapper>
);

const SpecialProductDetails = ({
  isMobile,
  isOpeningAnimationComplete,
}: {
  isMobile: boolean;
  isOpeningAnimationComplete: boolean;
}) => (
  <SpecialProductDetailsWrapper
    $isOpeningAnimationComplete={isOpeningAnimationComplete}
  >
    <div className="special-product-header-wrapper">
      {isMobile ? LeafLeftMobile : LeafLeftDesktop}
      <div className="special-product-header">
        {strings.SPECIAL_PRODUCT_HEADING}
      </div>
      {isMobile ? LeafRightMobile : LeafRightDesktop}
    </div>
    <div className="special-product-header-separator" />
    {isMobile ? (
      <SpecialProductDetailLabelListMobile />
    ) : (
      <SpecialProductDetailLabelListDesktop />
    )}
  </SpecialProductDetailsWrapper>
);

export default SpecialProductDetails;
