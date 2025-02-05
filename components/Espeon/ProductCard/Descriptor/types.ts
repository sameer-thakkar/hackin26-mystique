import type { TClassName } from 'components/Espeon/types';

/* eslint-disable @typescript-eslint/naming-convention */
export enum EDescriptorCode {
  OPERATING_HOURS = 'OPERATING_HOURS',
  FREE_CANCELLATION = 'FREE_CANCELLATION',
  EXTENDED_VALIDITY = 'EXTENDED_VALIDITY',
  INSTANT_CONFIRMATION = 'INSTANT_CONFIRMATION',
  DURATION = 'DURATION',
  MOBILE_TICKET = 'MOBILE_TICKET',
  AUDIO_GUIDE = 'AUDIO_GUIDE',
  GUIDED_TOUR = 'GUIDED_TOUR',
  TRANSFERS = 'TRANSFERS',
  HOTEL_PICKUP = 'HOTEL_PICKUP',
  MEALS_INCLUDED = 'MEALS_INCLUDED',
  SKIP_THE_LINE = 'SKIP_THE_LINE',
  FLEXIBLE_DURATION = 'FLEXIBLE_DURATION',
  MODE_OF_TRANSPORT = 'MODE_OF_TRANSPORT',
}
/* eslint-enable @typescript-eslint/naming-convention */

export type TDescriptorCodes = Array<EDescriptorCode>;

export type TDescriptor = TClassName & {
  code: EDescriptorCode;
  label: string;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  variant?: 'small';
  showIcon?: boolean | string;
};

export type TDescriptorIcon = {
  descriptorCode: EDescriptorCode;
};

export enum EProductDescriptor {
  GUIDED_TOUR = 'GUIDED_TOUR',
  OPERATING_HOURS = 'OPERATING_HOURS',
  FREE_CANCELLATION = 'FREE_CANCELLATION',
  EXTENDED_VALIDITY = 'EXTENDED_VALIDITY',
  FLEXIBLE_DURATION = 'FLEXIBLE_DURATION',
  DURATION = 'DURATION',
  AUDIO_GUIDE = 'AUDIO_GUIDE',
  MEALS_INCLUDED = 'MEALS_INCLUDED',
  INSTANT_CONFIRMATION = 'INSTANT_CONFIRMATION',
  MOBILE_TICKET = 'MOBILE_TICKET',
  TRANSFERS = 'TRANSFERS',
  HOTEL_PICKUP = 'HOTEL_PICKUP',
  GROUP_SIZE = 'GROUP_SIZE',
}
