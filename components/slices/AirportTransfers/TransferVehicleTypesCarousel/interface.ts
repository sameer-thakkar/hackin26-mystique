import { TVehicleTypes } from 'const/airportTransfers';

export type TTransferVehicleTypesCarouselProps = {
  sliceItems: {
    card_title: string;
    card_subtitle: string;
    card_tag: string;
    vehicle_type: TVehicleTypes;
    passenger_info: string | null;
    luggage_info: string | null;
  }[];
  isMobile: boolean;
};
