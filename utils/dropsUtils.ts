import {
  cityDropsEligibleUrls,
  dropsEligibleCountries,
  dropsExitIntentAvailabilityClickedKey,
} from 'components/AppDrops/constants';
import { getUID } from './helper';
import { isBrowser } from './platformUtils';

/**
 * This is to track if the CTA is clicked in the session
 * This is to avoid showing exit intent to non UAE users if they have shown intent already
 */
export const storeDropsExitIntentAvailabilityClicked = () => {
  if (!isBrowser) return;

  try {
    // Check if cookie exists
    const cookieExists = document.cookie
      .split('; ')
      .some((c) => c.startsWith(`${dropsExitIntentAvailabilityClickedKey}=`));

    if (!cookieExists) {
      document.cookie = `${dropsExitIntentAvailabilityClickedKey}=true;path=/`;
    }
  } catch (error) {
    // Silent fail if cookie operations fail
  }
};

/**
 * Checks if the user and page are eligible for Drops based on UID
 * @param uid - The unique identifier of the page
 * @returns { isEligible: boolean; city: string | null } - Whether the user is eligible and the corresponding city
 */
export const checkDropsEligibility = (
  uid: string
): { isEligible: boolean; city: string | null } => {
  if (!uid) return { isEligible: false, city: null };

  const normalizedUid = getUID(uid);

  for (const [city, urls] of Object.entries(cityDropsEligibleUrls)) {
    for (const eligibleUid of urls) {
      if (
        eligibleUid === normalizedUid ||
        normalizedUid.includes(eligibleUid)
      ) {
        return { isEligible: true, city };
      }
    }
  }

  return { isEligible: false, city: null };
};

/**
 * Checks if the user is eligible for the global exit intent
 * @param uid - The unique identifier of the page
 * @param countryCode - The country code of the user
 * @returns boolean - Whether the user is eligible for the global exit intent
 */
export const checkIsEligibleForExitIntent = (
  uid: string,
  countryCode: string
) => {
  let hasShownIntent = false;

  if (isBrowser) {
    try {
      hasShownIntent = document.cookie
        .split('; ')
        .some((c) => c.startsWith(`${dropsExitIntentAvailabilityClickedKey}=`));
    } catch (error) {
      // Silent fail if cookie operations fail
    }
  }

  const isDropsCountry = dropsEligibleCountries.includes(countryCode);

  // Non-drops eligible countries users who have shown intent are not eligible
  if (hasShownIntent && !isDropsCountry) {
    return false;
  }

  const pageEligibility = checkDropsEligibility(uid);
  return pageEligibility?.isEligible;
};

/**
 * Sets experience names in the Rive animation based on city code and platform
 * @param rive - The Rive instance
 * @param cityCode - The city code to get experience names for
 * @param strings - The strings object containing experience names
 * @param isMobile - Whether the platform is mobile
 */
export const setRiveExperienceNames = (
  rive: any,
  cityCode: string | null,
  strings: any,
  isMobile?: boolean
) => {
  if (!rive || !cityCode) return;

  const experiences =
    strings.DROPS.RIVE?.[cityCode as keyof typeof strings.DROPS.RIVE]?.[
      isMobile ? 'MWEB_ExperienceName' : 'DWEB_ExperienceName'
    ];

  const experienceNames = experiences.names;
  const experiencePrices = experiences.prices;
  const dropsPrices = experiences.dropsPrice;

  const cityName = cityCode.toLowerCase();
  const prefix = isMobile ? `mweb_${cityName}` : `dweb_${cityName}`;

  if (experienceNames) {
    [...experienceNames, ...experienceNames].forEach(
      (name: string, index: number) => {
        rive.setTextRunValue(`${prefix}_exp_${index + 1}`, name);
      }
    );
  }
  if (experiencePrices && isMobile) {
    [...experiencePrices, ...experiencePrices].forEach(
      (price: string, index: number) => {
        rive.setTextRunValue(`${prefix}_price_${index + 1}`, price);
      }
    );
  }
  if (dropsPrices && isMobile) {
    [...dropsPrices, ...dropsPrices].forEach((price: string, index: number) => {
      rive.setTextRunValue(`${prefix}_drops_price_${index + 1}`, price);
    });
  }
};
