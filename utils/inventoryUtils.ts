export const simplifySlotData = (
  inventorySlotsResponse: SlotsApiResponse
): SimplifiedSlotsData => {
  const { slots, ...meta } = inventorySlotsResponse;
  const simplifiedSlots = slots.map(({ startDate, startTime, endTime }) => ({
    startDate,
    startTime,
    endTime,
  }));
  return { slots: simplifiedSlots, ...meta };
};
