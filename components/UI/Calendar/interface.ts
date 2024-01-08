export type TCalendarProps = {
  tgid: string | number;
  flowType: string;
  onDateSelect: ({
    date,
    isAvailable,
    isDiscounted,
  }: {
    date: string;
    isAvailable: boolean;
    isDiscounted: boolean;
  }) => void;
  selectedDate: string | null;
  isMobile: boolean;
  calendarInventory?: Record<string, any> | null;
  showTwoMonths?: boolean;
  showTimeslotsOnDateSelection?: boolean;
  timeSlots?: any[];
  isCalendarPopupOpen: boolean;
  onClose?: () => void;
};
