import { hashCode } from 'utils/integerUtils';
import { FLAGS_FOLDER_URL, HEADOUT_REVIEWER_TAG } from 'const/index';

export const getRandomReviewerImage = (
  nonCustomerName: string = ''
): string => {
  const userNameHash = hashCode(nonCustomerName);
  const totalAvatarVariants = 24;
  const avatarIndex = userNameHash % totalAvatarVariants;
  const isEvenNameLength = nonCustomerName.length % 2 === 0;
  const finalAvatarIndex =
    isEvenNameLength || avatarIndex === 0 ? avatarIndex + 1 : avatarIndex;

  return `https://cdn-imgix.headout.com/reviews/avatars/Avatar_${finalAvatarIndex}.svg`;
};

export const getCountryFlagUrl = (countryCode?: string) =>
  FLAGS_FOLDER_URL + '/' + countryCode?.toLowerCase() + '.svg';

export const getFirstName = (fullName: string) => {
  if (!fullName) return '';

  const name = fullName.trim();
  if (name && name.includes(' ')) {
    return name.slice(0, name.indexOf(' '));
  }

  return name;
};

export const isDefaultReviewerName = (name: string) => {
  return name?.toLowerCase().trim().includes(HEADOUT_REVIEWER_TAG);
};
