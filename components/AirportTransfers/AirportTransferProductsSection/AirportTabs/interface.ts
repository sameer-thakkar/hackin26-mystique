export type TAirportTabsProps = {
  airportsList: string[];
  selectedAirport: string;
  setSelectedAirport: (airport: string) => void;
  isMobile: boolean;
  hasCategoryHeaderMenuOnTop: boolean;
};
