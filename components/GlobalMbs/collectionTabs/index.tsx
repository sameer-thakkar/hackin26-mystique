import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Tabs from 'components/GlobalMbs/Tabs';
import RowComponent from 'components/GlobalMbs/collectionTabs/rowComponent';
import { HALYARD } from 'const/ui-constants';
import { chunkArray } from 'utils/arrayUtils';

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
  currencies?: any[];
  ticketPages?: any[];
}

const CollectionCard: FunctionComponent<CollectionCardProps> = ({
  collections,
  title,
  currencies,
  ticketPages = [],
}) => {
  const tabs = [];
  const tabTitles = collections
    ?.map((collection) => collection?.data?.primary_category)
    ?.filter((tag, index, self) => self.indexOf(tag) === index);
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const allCategoryIds = collections
      ?.filter((collection) => collection?.data?.headout_category_id)
      .map((data) => data?.data?.headout_category_id);

    const categoryIds = Array.from(new Set([...allCategoryIds]));
    if (categoryIds?.length) {
      const promises = categoryIds?.map((id) =>
        fetch(`https://api.headout.com/api/v1/feed/category/get/${id}/`)
      );
      Promise.all(promises)
        .then((responses) =>
          Promise.all(responses?.map((response) => response.json()))
        )
        .then(async (data) => {
          if (data?.length) {
            const currencyCode =
              data[0]?.products[0]?.listingPrice?.currencyCode;

            const currency = currencies
              ?.filter((currency) => currency?.code === currencyCode)
              ?.reduce((acc, curr) => acc + curr, {});

            const formattedData = data?.map((cat) => {
              const startingPrice = Math.min(
                ...cat?.products?.map(
                  (ticket) => ticket?.listingPrice?.finalPrice
                )
              );

              return {
                catId: cat?.categories[0]?.id,
                startingPrice,
                currency,
              };
            });

            setCategoryData(formattedData);
          }
        });
    }
  }, []);

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
          categoryData={categoryData}
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
            (item) => item?.category == title
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
              categoryData={categoryData}
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
