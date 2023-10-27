import { TNewsMetaProps } from 'components/NewsPage/components/NewsMeta/interface';
import { AVATAR } from 'assets/SvgIcons';

const NewsMeta: React.FC<TNewsMetaProps> = ({ metaContent }) => {
  const { heading, authorName, formattedPublishedDateAndTime } = metaContent;
  return (
    <div className="news-meta">
      <h1>{heading}</h1>
      <div className="author-meta">
        {AVATAR}
        <span className="author-name">{authorName}</span>
        <time dateTime={formattedPublishedDateAndTime}>
          {formattedPublishedDateAndTime}
        </time>
      </div>
    </div>
  );
};

export default NewsMeta;
