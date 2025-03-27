import { GDPR_COUNTRY_CODES } from 'const/index';

/**
 * Check if a country is GDPR compliant
 * @param countryCode ISO country code (e.g., 'US', 'GB')
 * @returns boolean indicating if the country is GDPR compliant
 */
export const isGDPRCompliantCountry = (countryCode?: string) =>
  countryCode ? GDPR_COUNTRY_CODES.includes(countryCode) : false;

/**
 * Get the region for a country (e.g., 'Europe', 'North America')
 * This is a simplified example - you would need to expand this with actual region mappings
 * @param countryCode ISO country code (e.g., 'US', 'GB')
 * @returns Region name or undefined if not found
 */
export const getCountryRegion = (countryCode?: string) => {
  if (!countryCode) return undefined;

  // Example mapping - expand as needed
  const regionMap: Record<string, string> = {
    US: 'North America',
    CA: 'North America',
    GB: 'Europe',
    FR: 'Europe',
    DE: 'Europe',
    IT: 'Europe',
    ES: 'Europe',
    JP: 'Asia',
    CN: 'Asia',
    IN: 'Asia',
    AU: 'Oceania',
    NZ: 'Oceania',
    BR: 'South America',
    AR: 'South America',
    ZA: 'Africa',
    EG: 'Africa',
  };

  return regionMap[countryCode] || 'Other';
};
