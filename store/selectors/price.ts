import { selector } from 'recoil';
import { appAtom } from 'store/atoms/app';
import { currencyAtom } from 'store/atoms/currency';
import { tgidListAtom } from 'store/atoms/tgidList';
import { fetchTourListV6 } from 'utils/apiUtils';
import { getHostName } from 'utils/helper';

export const priceSelector = selector({
  key: 'price',
  get: ({ get }) => {
    const { host, isDev, isStage, initialCurrency } = get(appAtom);
    const activeCurrency = get(currencyAtom);
    const { tgids: tgidList, isCollecting } = get(tgidListAtom);

    if (initialCurrency === activeCurrency || isCollecting)
      return Promise.resolve({ useSSRPrice: true });

    return fetchTourListV6({
      hostname: getHostName(isStage, isDev, host),
      tgids: tgidList.filter(Boolean),
      currency: activeCurrency,
    }).then((json) => ({ ...json, useSSRPrice: false }));
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});
