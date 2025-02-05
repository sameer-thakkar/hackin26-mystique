import type { SystemStyleObject } from '@headout/pixie/types';
import type { TLanguages } from 'components/Espeon/constants/localisation/types';

export enum EDescriptorCode {
  AudioGuide = 'AUDIO_GUIDE',
  Duration = 'DURATION',
  ExtendedValidity = 'EXTENDED_VALIDITY',
  FlexibleDuration = 'FLEXIBLE_DURATION',
  FreeCancellation = 'FREE_CANCELLATION',
  GuidedTour = 'GUIDED_TOUR',
  HotelPickup = 'HOTEL_PICKUP',
  InstantConfirmation = 'INSTANT_CONFIRMATION',
  MealsIncluded = 'MEALS_INCLUDED',
  MobileTicket = 'MOBILE_TICKET',
  ModeOfTransport = 'MODE_OF_TRANSPORT',
  OperatingHours = 'OPERATING_HOURS',
  SkipTheLine = 'SKIP_THE_LINE',
  Transfers = 'TRANSFERS',
}

export type TDescriptorVariant = 'short' | 'long';
export type TDescriptorLayout = 'row' | 'column';
export type TDescriptorType = 'STANDARD' | 'INCLUSION_BASED';

export type TDescriptorsProps = {
  descriptors: TDescriptorItem[];
  variant: TDescriptorVariant;
  layout: TDescriptorLayout;
  isMobile?: boolean;
  displayLimit?: number;
  overrideStyles?: SystemStyleObject;
  lang?: TLanguages;
  showSpacer?: boolean;
  showMore?: boolean;
  showMoreLabel?: string;
};

export type TDescriptorItem = {
  code: EDescriptorCode;
  name: string;
  displayName: string;
  iconUrl: string;
  description: string;
  type: TDescriptorType;

  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
};

/**
 * assumptions
 * - always show icon for long descriptors
 * - with display limit will only be applicable for desktop
 * - always don't show icon for short descriptors
 *
 * use cases list based on assumptions
 * - Long Descriptors (always with icon)
 *  - Desktop
 *    - row layout
 *      - without display limit
 *      - with display limit
 *        - with more label
 *        - without more label
 *    - column layout
 *      - without display limit
 *      - with display limit
 *        - with more label
 *        - without more label
 *  - Mobile
 *    - row layout
 *      - without display limit
 *      - with display limit
 *        - without more label
 *    - column layout
 *      - without display limit
 *      - with display limit
 *        - without more label
 *
 * - Short Descriptors (never with icon)
 *  - Desktop
 *    - row layout
 *      - without display limit
 *      - with display limit
 *        - with more label
 *        - without more label
 *    - column layout
 *      - without display limit
 *      - with display limit
 *        - with more label
 *        - without more label
 *  - Mobile
 *    - row layout
 *      - without display limit
 *      - with display limit
 *        - without more label
 *    - column layout
 *      - without display limit
 *      - with display limit
 *        - without more label
 */
