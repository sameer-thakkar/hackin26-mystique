import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';

const TagSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 57px auto;
  font-family: ${HALYARD.FONT_STACK};
  width: calc(100vw - (5.46vw * 2));
  h2 {
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    margin: 0;
    margin-bottom: 32px;
  }
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const TagsWrapper = styled.div`
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.a`
  display: block;
  margin-right: 16px;
  margin-bottom: 15px;
  width: max-content;
  padding: 16px;
  border-radius: 4px;
  background-color: ${COLORS.GRAY.G8};
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${COLORS.GRAY.G3};
`;
interface TagsProps {
  collections: any[];
  uid: string;
  title: string;
}

const Tags: FunctionComponent<React.PropsWithChildren<TagsProps>> = ({
  collections,
  uid,
  title,
}) => {
  const { host, isDev } = useContext(MBContext);

  const finalCollection = collections.filter(
    (collection) => collection.uid !== uid
  );

  const tagsMarkup = finalCollection.map((collection) => {
    const { data, id, uid } = collection || {};
    const { microbrand_url: microbrandUrl, collection_name: collectionName } =
      data || {};
    const url = microbrandUrl
      ? getValidUrl(microbrandUrl?.trim())
      : convertUidToUrl({ uid, isDev, hostname: host });
    return (
      <Tag key={id} href={url}>
        {collectionName}
      </Tag>
    );
  });
  return (
    <TagSection>
      <h2>{title}</h2>
      <TagsWrapper>{tagsMarkup}</TagsWrapper>
    </TagSection>
  );
};
export default Tags;
