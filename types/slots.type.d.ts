type SlotsApiResponse = {
  currency: Currency;
  fromDate: string;
  slots: Slot[];
  toDate: string;
  vendorCode: string;
};

type Currency = {
  code: string;
  currency: string;
  currencyName: string;
  localSymbol: string;
  precision: number;
  symbol: string;
};

type Slot = {
  availability: Availability;
  discount: number;
  endTime: string;
  finalPriceProfile: FinalPriceProfile;
  inventoryId: number | null;
  originalPriceProfileId: number;
  originalStartTime: string;
  paxAvailability: PaxAvailability[];
  remaining: number;
  startDate: string;
  startTime: string;
  tourId: number;
};

type FinalPriceProfile = {
  groups: any[];
  id: number;
  persons: Person[];
  type: string;
};

type Person = {
  ageFrom: number | null;
  ageTo: number | null;
  description: string;
  discount: number;
  displayName: string;
  margin: number | null;
  netPrice: number | null;
  price: number | null;
  priceProfileId: number;
  priceProfilePersonId: number;
  type: string;
};

type PaxAvailability = {
  availability: string;
  paxCaps: PaxCaps;
  paxTypes: string[];
  remaining: number;
};

type PaxCaps = {
  [k: string]: {
    maxPax: number | null;
    minPax: number | null;
  };
};

type SimplifiedSlot = {
  startDate: string;
  startTime: string;
  endTime: string;
};

type SimplifiedSlotsData = UpdateType<
  SlotsApiResponse,
  {
    slots: SimplifiedSlot[];
  }
>;
