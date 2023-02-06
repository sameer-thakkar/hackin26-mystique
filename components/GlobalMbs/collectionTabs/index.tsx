import { useContext, useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { MBContext } from 'contexts/MBContext';
import Tabs from 'components/GlobalMbs/Tabs';
import RowComponent from 'components/GlobalMbs/collectionTabs/rowComponent';
import { HALYARD } from 'const/ui-constants';
import { chunkArray } from 'utils/arrayUtils';
import {
  getHeadoutApiUrl,
  HeadoutEndpoints,
  swrFetcher,
  swrMultiFetcher,
} from 'utils/apiUtils';
import { getHostName } from 'utils/helper';

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: calc(100% - (5.46vw * 2));
  @media (max-width: 768px) {
    width: unset;
    padding: 0 16px;
  }
`;

const Title = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
`;

interface CollectionCardProps {
  collections: any[];
  title: string;
  city?: string;
  ticketPages?: any[];
}

const CollectionCard = ({
  collections,
  title,
  ticketPages = [],
  city,
}: CollectionCardProps) => {
  const tabs = [];
  const tabTitles = collections
    ?.map((collection) => collection?.data?.primary_category)
    ?.filter((tag, index, self) => self.indexOf(tag) === index);
  const { isDev, host, isStage, lang } = useContext(MBContext);
  const hostname = getHostName(isStage, isDev, host);
  const allCategoryIds = collections
    .map((collection) => collection?.data?.headout_category_id)
    ?.filter(Boolean);
  const categoryIds = Array.from(new Set([...allCategoryIds]));

  const allCollectionIds = collections
    .map((collection) => collection?.data?.headout_collection_id)
    ?.filter(Boolean);
  const collectionIds = Array.from(new Set([...allCollectionIds]));

  const collectionEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.Collection,
    hostname,
    params: {
      'ids[]': collectionIds?.join(','),
      currency: 'USD',
      ...(lang && {
        language: lang,
      }),
    },
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | nu... Remove this comment to see the full error message
    id: null,
  });

  const allCategoryEndpoints = categoryIds?.map((id) => {
    return getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.TourGroupListByCategoryV6,
      hostname,
      params: {
        // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
        city,
        currency: 'USD',
        ...(lang && {
          language: lang,
        }),
      },
      id,
    });
  });

  // @ts-expect-error TS(2345): Argument of type '[string | undefined, { fetcher: ... Remove this comment to see the full error message
  const { data: collectionData } = useSWR(collectionEndpoint, {
    fetcher: swrFetcher,
  });
  const { data: categoryData } = useSWR(allCategoryEndpoints, {
    fetcher: swrMultiFetcher,
  });

  const collectionPrices = collectionData
    ? collectionData?.collections?.map((collection: any) => {
        const { id, startingPrice } = collection ?? {};
        return {
          id,
          startingPrice: startingPrice?.listingPrice,
          currency: startingPrice?.currency,
        };
      })
    : [];
  const categoryPrices = categoryData
    ? categoryData?.map((cat) => {
        const { category, unFilteredMetaData, currency } = cat ?? {};
        return {
          id: category?.id,
          startingPrice: unFilteredMetaData?.minPrice,
          currency: currency?.code,
        };
      })
    : [];

  const [row, setRow] = useState();
  if (collections?.length) {
    const DEFAULT_TITLE = 'All';
    const allCollections = chunkArray([...collections], 4);

    const defaultTab = {
      header: DEFAULT_TITLE,
      body: allCollections?.map((collection, index) => (
        <RowComponent
          key={index}
          sectionIndex={index}
          setSectionIndex={row}
          setRow={setRow}
          cards={collection}
          categoryData={[...collectionPrices, ...categoryPrices]}
          ticketPages={ticketPages}
        />
      )),
    };

    tabs?.push(defaultTab);
    tabTitles?.forEach((title) => {
      const data = collections?.filter(
        (collection) =>
          collection?.data?.primary_category === title ||
          collection?.data?.secondary_categories?.filter(
            (item: any) => item?.category == title
          )?.length
      );

      if (data?.length) {
        const collections = chunkArray([...data], 4);
        const object = {
          header: title,
          body: collections?.map((collection, index) => (
            <RowComponent
              key={index}
              sectionIndex={index}
              setSectionIndex={row}
              setRow={setRow}
              cards={collection}
              categoryData={[...collectionPrices, ...categoryPrices]}
              ticketPages={ticketPages}
            />
          )),
        };
        tabs.push(object);
      }
    });
  }

  return (
    <>
      <TitleWrapper>
        <Title>{title}</Title>
      </TitleWrapper>
      <Tabs tabs={tabs} defaultActiveIndex={0} isCollectionCard />
    </>
  );
};

export default CollectionCard;
