import { useEffect } from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { tgidListAtom } from 'store/atoms/tgidList';
import { priceSelector } from 'store/selectors/price';

const usePrice = ({ tgid, ssrListingPrice }) => {
  const [tgidList, setTgidList] = useRecoilState(tgidListAtom);
  const { state, contents: tourListAPIData } = useRecoilValueLoadable(
    priceSelector
  );
  const isLoading = state !== 'hasError' && state === 'loading';

  useEffect(() => {
    if (!tgidList.tgids.includes(tgid)) {
      /**
       * Everytime a tgid is added to list `isCollecting` is set to true, a parallel side effect sets it to false after some timeout (check tgidListAtom)
       * The flag exists to avoid multiple API calls on restoring Last Selected Currency (reload).
       * This is not required if we dont retain currency, as we fetch only when `activeCurrency` changes and when manually being changed via UI, tgidList would already be fully populated.
       */
      setTgidList({ tgids: [...tgidList.tgids, tgid], isCollecting: true });
    }
  }, [setTgidList, tgid, tgidList]);

  switch (state) {
    case 'hasValue':
      if (tourListAPIData.useSSRPrice)
        return { listingPrice: ssrListingPrice, isLoading };
      const tourGroupMap = tourListAPIData.tourGroups.reduce(
        (acc, { id, listingPrice }) => ({ ...acc, [id]: listingPrice }),
        {}
      );
      return { isLoading, listingPrice: tourGroupMap[tgid] };

    case 'hasError':
    case 'loading':
      return {
        isLoading,
        listingPrice: ssrListingPrice,
      };

    default:
      return {
        isLoading: false,
        listingPrice: ssrListingPrice,
      };
  }
};

export default usePrice;
