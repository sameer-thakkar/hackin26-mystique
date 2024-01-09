import React, { useContext } from 'react';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';

export type TCollectionMBShortcode = {
  id: string;
  text: string;
};

const CollectionMBShortcode = ({ id, text }: TCollectionMBShortcode) => {
  const { categoryHeaderMenu }: Record<string, any> = useContext(MBContext);
  const { CITY_ATTRACTIONS } = categoryHeaderMenu;
  const { menu: cityAttractionItems } = CITY_ATTRACTIONS || {};
  const microbrandCollection = Object.values(
    cityAttractionItems as Record<string, any>
  )?.find((item: any) => item?.collectionId === +id);
  const { url: MBLink } = microbrandCollection || {};

  return (
    <>
      <Conditional if={MBLink}>
        <a href={MBLink} target="_blank" rel="noreferrer">
          {text}
        </a>
      </Conditional>
      <Conditional if={!MBLink}>
        <span>{text}</span>
      </Conditional>
    </>
  );
};

export default CollectionMBShortcode;
