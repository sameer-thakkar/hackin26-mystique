import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { IFilteredDescriptorProps } from 'components/PinnedCard/interface';
import { PinnedCardWrapper } from 'components/PinnedCard/styles';
import Button from 'UI/Button';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { trackEvent } from 'utils/analytics';
import { parseDescriptors } from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import COLORS from 'const/colors';
import { descriptorIcons } from 'const/descriptorIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { STAR } from 'assets/SvgIcons';

const DescriptorList = (props: IFilteredDescriptorProps) => {
  const { filteredDescriptor } = props;
  return (
    <>
      {filteredDescriptor?.map((descriptor: Record<string, string>) => {
        const { code, name } = descriptor;
        if (name && code) {
          const DiscSvgElm = descriptorIcons[code];
          return (
            <div key={name} className="descriptors">
              <DiscSvgElm className="descSvg" />
              <span>{name}</span>
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

const PinnedCard = (props: any) => {
  const { lang, nakedDomain, redirectToHeadoutBookingFlow } = useContext(
    MBContext
  );
  const currency = useRecoilValue(currencyAtom);
  const { productInfo } = props;

  const {
    descriptors,
    id: tgid,
    flowType,
    listingPrice,
    name,
    imageUrl,
    primaryCategory,
  } = productInfo;

  const filteredDescriptors = parseDescriptors(descriptors);
  const bookingURL = createBookingURL({
    nakedDomain,
    lang,
    tgid,
    redirectToHeadoutBookingFlow,
    currency,
    flowType,
  });

  const ratingCount = (reviewCount: number) => {
    return reviewCount > 999
      ? `${(reviewCount / 1000).toFixed(1)}k`
      : reviewCount;
  };

  const clickHandler = () => {
    window.open(bookingURL);
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.DISCOUNT]:
        listingPrice?.originalPrice > listingPrice?.finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: listingPrice?.currencyCode,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: listingPrice?.finalPrice,
      [ANALYTICS_PROPERTIES.RANKING]: 1,
      [ANALYTICS_PROPERTIES.IS_PINNED_CARD]: 'Yes',
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: name,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
    });
  };

  return (
    <PinnedCardWrapper>
      <div className="product-image">
        <Image url={imageUrl} alt={name} />
      </div>
      <div className="product-description">
        <div className="product-name">
          <h3>{name}</h3>
        </div>
        <div className="rating">
          <Conditional if={productInfo?.averageRating}>
            <span className="avg-rating">
              <span className="rating-number">
                {productInfo.averageRating.toFixed?.(1)}
              </span>
              {STAR(COLORS.PRIMARY.JOY_MUSTARD)}
            </span>
          </Conditional>
          <Conditional if={productInfo?.reviewCount}>
            <span className="total-rating">
              ({ratingCount(productInfo.reviewCount)})
            </span>
          </Conditional>
        </div>
        <div className="descriptors-list">
          <DescriptorList filteredDescriptor={filteredDescriptors} />
        </div>
      </div>
      <div className="divider" />
      <div className="cta-container">
        <PriceBlock
          lang="en-us"
          listingPrice={productInfo?.listingPrice}
          showScratchPrice
        />
        <Button
          className={`tour-book-now-cta`}
          fillType="fill"
          role="button"
          tabIndex={0}
          onClick={clickHandler}
          widthProp="100%"
        >
          {strings.CHECK_AVAIL}
        </Button>
      </div>
    </PinnedCardWrapper>
  );
};
export default PinnedCard;
