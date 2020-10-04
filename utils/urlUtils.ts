export const isAmpUrl = (query) => {
  return query.amp === '1';
};

export const getNonAmpUrl = (asPath) => {
  return asPath && asPath.replace('amp=1', '');
};
