const MODIFIED_VIDEO_POSITION_UID = ['www.flamenco-show-tickets.com.seville'];
export const getVideoPosition = (uid: string) => {
  if (MODIFIED_VIDEO_POSITION_UID.includes(uid)) {
    return 1;
  }
  return 0;
};
