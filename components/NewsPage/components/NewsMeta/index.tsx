import { TNewsMetaProps } from 'components/NewsPage/components/NewsMeta/interface';
import Avatar from 'assets/avatar';

const NewsMeta: React.FC<React.PropsWithChildren<TNewsMetaProps>> = ({
  metaContent,
}) => {
  const { heading, authorName, formattedPublishedDateAndTime } = metaContent;
  return (
    <div className="news-meta">
      <h1>{heading}</h1>
      <div className="author-meta">
        {Avatar}
        <span className="author-name">{authorName}</span>
        <time dateTime={formattedPublishedDateAndTime}>
          {formattedPublishedDateAndTime}
        </time>
      </div>
    </div>
  );
};

export default NewsMeta;
