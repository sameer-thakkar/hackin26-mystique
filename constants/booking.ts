export enum BOOKING_FLOW_TYPE {
  SEATMAP = 'SEATMAP',
  SVG = 'SVG',
  NORMAL = 'NORMAL',
  COMBO = 'COMBO',
  RESERVATION = 'RESERVE',
}

export const BOOKING_FLOW_STAGE = {
  SELECT: 'select',
  CHECKOUT: 'checkout',
  /* SVG FLOW */
  SVG_SELECT: 'svg-select',
  SVG_VARIANT: 'svg-variant',
  /* SEATMAP FLOW */
  SEATMAP_SELECT: 'seatmap-select',
  SEATMAP_VARIANT: 'seatmap-variant',
  SEATMAP_CHECKOUT: 'seatmap-checkout',
  /* POST-CHECKOUT */
  MICROAUTH: 'payment-verification',
  CONFIRMATION: 'confirmation',
};
