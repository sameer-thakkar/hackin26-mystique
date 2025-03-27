import {
  DROPS_ELIGIBLE_URLS,
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
 * Checks if the current page is eligible for Drops banner based on its URL
 * @param uid - The unique identifier of the page
 * @returns boolean - Whether the page is eligible for Drops banner
 */
export const checkDropsBannerEligibility = (uid: string): boolean => {
  if (!uid) return false;

  // Normalize the uid to handle trailing slashes and protocol variations
  const normalizedUid = getUID(uid);

  // Check if the normalized uid matches or is included in any of the eligible URLs
  for (const uid of DROPS_ELIGIBLE_URLS) {
    if (uid === normalizedUid || normalizedUid.includes(uid)) {
      return true;
    }
  }

  return false;
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

  const isUAEUser = countryCode === 'AE';

  // Non-UAE users who have shown intent are not eligible
  if (hasShownIntent && !isUAEUser) {
    return false;
  }

  // User must be on an eligible page
  return checkDropsBannerEligibility(uid);
};
