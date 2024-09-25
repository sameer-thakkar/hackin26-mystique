import { AirportTransferReviews } from 'components/AirportTransfers/Review/index';
import LazyComponent from 'components/common/LazyComponent';
import { TransferVehicleTypesCarousel } from 'components/slices/AirportTransfers/TransferVehicleTypesCarousel';
import { SLICE_TYPES } from 'const/index';
import { AirportTransferFeatures } from '../AirportTransferFeatures';

export const AirportTransferLFAndStaticContent = ({
  isMobile,
  content,
}: {
  isMobile: boolean;
  content: any[];
}) => {
  const carsCarouselSlice = content?.find(
    (slice) => slice.slice_type === SLICE_TYPES.CARS_CAROUSEL
  );

  return (
    <>
      <AirportTransferFeatures isMobile={isMobile} />

      <LazyComponent placeHolderHeight="17rem">
        <AirportTransferReviews isMobile={isMobile} />
      </LazyComponent>

      <TransferVehicleTypesCarousel
        isMobile={isMobile}
        sliceItems={carsCarouselSlice?.items}
      />
    </>
  );
};
