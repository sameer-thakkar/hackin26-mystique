import { useContext } from 'react';
import { MBContext } from 'contexts/MBContext';
import { getCountryRegion, isGDPRCompliantCountry } from 'utils/countryUtils';
import { getCountryFlagUrl } from 'utils/reviewUtils';

/**
 * Hook to access the user's country information from the MBContext
 * @returns Object containing country code and utility functions
 */
export const useUserCountry = () => {
  const { userCountry } = useContext(MBContext);

  return {
    countryCode: userCountry,
    isGDPRCompliant: isGDPRCompliantCountry(userCountry),
    getFlagUrl: () => getCountryFlagUrl(userCountry),
    getRegion: () => getCountryRegion(userCountry),
  };
};
