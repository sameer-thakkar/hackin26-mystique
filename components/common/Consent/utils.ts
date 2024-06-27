// Need two version because, data is from Categorization (Full Country Name) & API Country (ISO Country Code)
const FALLBACK_HIDE_COUNTRIES: Array<string> = ['United States', 'US'];

export const getConsentFallback = ({ country }: { country: string }) => {
  if (FALLBACK_HIDE_COUNTRIES.includes(country)) return false; // hide banner

  return true; // show banner
};
