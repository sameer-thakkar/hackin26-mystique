import { AirportTransferFeatures } from 'components/AirportTransfers/AirportTransferFeatures';
import { AirportTransferReviews } from 'components/AirportTransfers/Review/index';
import { TransferVehicleTypesCarousel } from 'components/slices/AirportTransfers/TransferVehicleTypesCarousel';
import { SLICE_TYPES } from 'const/index';

export const LongFormAndStaticContent = ({
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
      <TransferVehicleTypesCarousel
        isMobile={isMobile}
        sliceItems={carsCarouselSlice?.items}
      />

      <AirportTransferFeatures isMobile={isMobile} />

      <AirportTransferReviews isMobile={isMobile} />
    </>
  );
};
