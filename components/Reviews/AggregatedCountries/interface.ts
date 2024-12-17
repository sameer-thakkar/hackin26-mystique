type TReviewCountry = {
  code: string;
  displayName: string;
};

export type TReviewCountries = {
  countries: TReviewCountry[];
  count: number;
};

export type TAggregatedCountriesProps = {
  slideAnimation?: boolean;
  reviewCountries: TReviewCountries;
  isMobile?: boolean;
};
