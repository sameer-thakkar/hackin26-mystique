export type CalendarProps = {
  isMobile: boolean;
  tgid: string | number;
  variantName: string;
  tourGroupName: string;
  currency: string | null;
  fromDate?: string;
  toDate?: string;
  variantId?: string | number;
  tourId?: string | number;
  isActive?: boolean;
  onClickout?: () => void;
  setIsLoading: (arg: boolean) => void;
  onDateClick?: (arg: any) => void;
};
