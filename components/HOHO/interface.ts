export type HOHOCardProps = {
  isMobile: boolean;
  variants: Record<string, any>;
  tourGroupData: Record<string, any>;
  tourGroupId: number | string;
  routeDetails: Record<string, any>;
  currency: string | null;
  index: number;
};

//NOTE: Will modify this accordingly once we start consuming data from the API
