import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';

const TagSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 57px auto;
  font-family: ${SOLEIL.FONT_STACK};
  width: calc(100vw - (5.46vw * 2));
  h2 {
    font-weight: ${SOLEIL.SEMIBOLD};
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
  background-color: ${COLORS.GREY.G8};
  font-weight: ${SOLEIL.SEMIBOLD};
  font-size: 12px;
  line-height: 16px;
  color: ${COLORS.GREY.G3};
`;
interface TagsProps {
  collections: any[];
  uid: string;
  title: string;
}

const Tags: FunctionComponent<TagsProps> = ({ collections, uid, title }) => {
  const finalCollection = collections.filter(
    (collection) => collection.uid !== uid
  );

  const tagsMarkup = finalCollection.map((collection) => {
    return (
      <Tag
        key={collection?.id}
        href={getValidUrl(convertUidToUrl(collection?.uid))}
      >
        {collection?.data?.collection_name}
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
