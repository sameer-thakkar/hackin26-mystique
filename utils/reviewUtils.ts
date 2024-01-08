import { hashCode } from 'utils/integerUtils';

export const getRandomReviewerImage = (nonCustomerName: string): string => {
  const userNameHash = hashCode(nonCustomerName);
  const totalAvatarVariants = 24;
  const avatarIndex = userNameHash % totalAvatarVariants;
  const isEvenNameLength = nonCustomerName.length % 2 === 0;
  const finalAvatarIndex =
    isEvenNameLength || avatarIndex === 0 ? avatarIndex + 1 : avatarIndex;

  return `https://cdn-imgix.headout.com/reviews/avatars/Avatar_${finalAvatarIndex}.svg`;
};
