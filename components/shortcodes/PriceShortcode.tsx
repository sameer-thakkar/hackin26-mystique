import React, { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { currencyAtom } from 'store/atoms/currency';

export type TPriceShortcode = {
  entity: 'COLLECTION' | 'CATEGORY' | 'SUBCATEGORY' | 'TGID';
  id: string;
  city?: string;
};

const PriceShortcode = ({ entity, id, city }: TPriceShortcode) => {
  const { lang } = useContext(MBContext);
  const currencyCode = useRecoilValue(currencyAtom);
  const includeIds = entity === 'COLLECTION';

  const params = {
    ...(lang && {
      language: lang,
    }),
    ...(currencyCode && {
      currency: currencyCode,
    }),
    ...(city && { city }),
    ...(includeIds && { 'ids[]': id }),
  };
  let endpoint, price;
  switch (entity) {
    case 'COLLECTION':
      endpoint = HeadoutEndpoints.Collection;
      break;
    case 'TGID':
      endpoint = HeadoutEndpoints.TourGroupsV6;
      break;
    case 'CATEGORY':
      endpoint = HeadoutEndpoints.TourGroupListByCategoryV6;
      break;
    case 'SUBCATEGORY':
      endpoint = HeadoutEndpoints.TourGroupListBySubCategoryV6;
      break;
    default:
      endpoint = HeadoutEndpoints.TourGroupsV6;
      break;
  }
  const finalEndpoint = getHeadoutApiUrl({
    endpoint,
    id,
    params,
  });

  const { data } = useSWR(finalEndpoint, {
    fetcher: swrFetcher,
  });

  switch (entity) {
    case 'COLLECTION':
      price = data?.collections?.[0]?.startingPrice?.listingPrice;
      break;
    case 'TGID':
      price = data?.listingPrice?.finalPrice;
      break;
    case 'CATEGORY':
    case 'SUBCATEGORY':
      price = data?.unFilteredMetaData?.minPrice;
      break;
    default:
      price = data?.listingPrice?.finalPrice;
      break;
  }

  return (
    <Conditional if={price}>
      <LocalisedPrice
        price={Number(price)}
        currencyCode={currencyCode ?? data?.currencyCode}
        lang={lang}
      />
    </Conditional>
  );
};

export default PriceShortcode;
