import { useContext } from 'react';
import { PrismicDocumentWithUID } from '@prismicio/types';
import Conditional from 'components/common/Conditional';
import type { TDesktopFeaturedNewsProps } from 'components/NewsPage/components/DesktopFeaturedNews/interface';
import { FeaturedNewsContainer } from 'components/NewsPage/components/DesktopFeaturedNews/styles';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { formatDateToString } from 'utils/dateUtils';
import { truncate } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  NEWS_PAGE_DATE_FORMAT,
  // CTA_TYPE,
  NEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';
import { AVATAR } from 'assets/SvgIcons';

const DesktopFeaturedNews: React.FC<TDesktopFeaturedNewsProps> = ({
  featuredNewsData,
}) => {
  const { lang, isDev, host } = useContext(MBContext);
  const { prismicContent } = featuredNewsData;
  const { FEATURED_NEWS } = strings.NEWS_PAGE;

  const handleArticleClick = (index: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.FEATURED_NEWS,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
    return;
  };

  // const handleCTAClick = () => {
  //   trackEvent({
  //     eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
  //     [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_NEWS,
  //     [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.FEATURED_NEWS,
  //   });
  //   return;
  // };

  return (
    <Conditional if={prismicContent?.length > 0}>
      <FeaturedNewsContainer>
        <div className="title-wrapper">
          <h2>{FEATURED_NEWS}</h2>
          {/* <u onClick={handleCTAClick} role="button" tabIndex={0}>
            {ALL_NEWS}
          </u> */}
        </div>
        <div className="articles">
          {prismicContent
            ?.slice(0, 4)
            .map((article: PrismicDocumentWithUID, index: number) => {
              const { data, first_publication_date } = article;
              let { heading, banner_image, author_name } = data;
              heading = truncate(heading, 55);

              const formattedPublishedDateAndTime = formatDateToString(
                new Date(first_publication_date),
                'EN',
                NEWS_PAGE_DATE_FORMAT
              );

              const redirectionUrl = convertUidToUrl({
                uid: article.uid,
                lang: getHeadoutLanguagecode(lang),
                isDev,
                hostname: host,
              });

              return (
                <a
                  href={redirectionUrl}
                  key={index}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleArticleClick(index)}
                >
                  <article className="news-article">
                    <div className="article-image">
                      <Image
                        url={banner_image?.url}
                        height={88}
                        width={140}
                        alt={'News Article'}
                        fetchPriority="high"
                        loading="eager"
                      />
                    </div>
                    <div className="article-info">
                      <span className="published-date">
                        {formattedPublishedDateAndTime}
                      </span>
                      <h4>{heading}</h4>
                      <Conditional if={author_name}>
                        <div className="author-details">
                          {AVATAR}
                          <span>{author_name}</span>
                        </div>
                      </Conditional>
                    </div>
                  </article>
                </a>
              );
            })}
        </div>
      </FeaturedNewsContainer>
    </Conditional>
  );
};

export default DesktopFeaturedNews;
