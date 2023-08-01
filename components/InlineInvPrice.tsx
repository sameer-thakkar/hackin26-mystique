import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { legacyBooleanCheck } from 'utils';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getLocalisedPrice } from 'utils/currency';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';

const InlineScratchPrice = styled.span`
  text-decoration: line-through;
  margin-left: 5px;
  color: rgba(84, 84, 84, 0.7);
`;

type TInventoryPrice = {
  type: string;
  retailPrice: number;
  listingPrice: number;
  discount: number;
};

export type TInlineInvPrice = {
  tgid: string;
  tid: string;
  'scratch-price': string;
};

const InlineInvPrice = ({
  tgid,
  tid,
  'scratch-price': scratchPrice,
}: TInlineInvPrice) => {
  const [inventoryPrice, setInventoryPrice] = useState<TInventoryPrice | null>(
    null
  );
  const [hasScratchPrice, setHasScratchPrice] = useState(
    legacyBooleanCheck(scratchPrice)
  );

  const { lang } = useContext(MBContext);

  const currencyCode = useRecoilValue(currencyAtom);
  const currencyList = useRecoilValue(currencyListAtom);

  const params = {
    ...(lang && {
      language: lang,
    }),
    ...(currencyCode && {
      currency: currencyCode,
    }),
  };
  const tourGroupEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupInventoriesV7,
    id: tgid,
    params,
  });
  const { data: inventoryData, error } = useSWR(tourGroupEndpoint, {
    fetcher: swrFetcher,
  });

  useEffect(() => {
    if (tid && inventoryData && !error) {
      const tidData = inventoryData?.availabilities.find(
        (inv: Record<string, any>) => inv.tourId === Number(tid)
      );
      const { priceProfile } = tidData ?? {};
      const { persons } = priceProfile ?? {};
      setInventoryPrice(persons?.[0]);
      setHasScratchPrice(persons?.[0]?.discount > 0);
    }
  }, [tid, inventoryData, error]);

  return (
    <Conditional if={inventoryData && !error}>
      <>
        <Conditional if={inventoryPrice?.listingPrice}>
          <LocalisedPrice
            price={Number(inventoryPrice?.listingPrice)}
            currencyCode={currencyCode ?? inventoryData?.currencyCode}
            lang={lang}
          />
        </Conditional>
        <Conditional if={hasScratchPrice}>
          <InlineScratchPrice>
            {getLocalisedPrice({
              price: Number(inventoryPrice?.retailPrice),
              currencyCode: currencyCode ?? inventoryData?.currencyCode,
              lang: lang,
              currencyList,
            })}
          </InlineScratchPrice>
        </Conditional>
      </>
    </Conditional>
  );
};

export default InlineInvPrice;
