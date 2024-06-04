import { AirportTransferReviews } from 'components/AirportTransfers/Review/index';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import { TransferVehicleTypesCarousel } from 'components/slices/AirportTransfers/TransferVehicleTypesCarousel';
import { SLICE_TYPES } from 'const/index';
import { AirportTransferFeatures } from '../AirportTransferFeatures';
import { WorldMapTrustBooster } from '../WorldMapTrustBooster';

export const AirportTransferLFAndStaticContent = ({
  isMobile,
  content,
  airportTransferVariant,
}: {
  isMobile: boolean;
  content: any[];
  airportTransferVariant?: 'Control' | 'Treatment';
}) => {
  const carsCarouselSlice = content?.find(
    (slice) => slice.slice_type === SLICE_TYPES.CARS_CAROUSEL
  );

  return (
    <>
      <Conditional if={airportTransferVariant === 'Control'}>
        <AirportTransferFeatures isMobile={isMobile} />
      </Conditional>

      <Conditional if={airportTransferVariant === 'Treatment'}>
        <LazyComponent placeHolderHeight="26rem">
          <WorldMapTrustBooster isMobile={isMobile} />
        </LazyComponent>
      </Conditional>

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
