import { useContext } from 'react';
import { PrismicDocumentWithUID } from '@prismicio/types';
import { getIntlDate } from '@headout/espeon/utils/date';
import Conditional from 'components/common/Conditional';
import type { TDesktopFeaturedNewsProps } from 'components/NewsPage/components/DesktopFeaturedNews/interface';
import { FeaturedNewsContainer } from 'components/NewsPage/components/DesktopFeaturedNews/styles';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { getLangObject, truncate } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  NEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';
import Avatar from 'assets/avatar';

const DesktopFeaturedNews: React.FC<
  React.PropsWithChildren<TDesktopFeaturedNewsProps>
> = ({ featuredNewsData, newsLandingPageUrl }) => {
  const { lang, isDev, host } = useContext(MBContext);
  const { prismicContent } = featuredNewsData;
  const { FEATURED_NEWS, ALL_NEWS } = strings.NEWS_PAGE;

  const handleArticleClick = (index: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.FEATURED_NEWS,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
    return;
  };

  const handleCTAClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_NEWS,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.FEATURED_NEWS,
    });
    return;
  };

  return (
    <Conditional if={prismicContent?.length > 0}>
      <FeaturedNewsContainer>
        <div className="title-wrapper">
          <h2>{FEATURED_NEWS}</h2>
          <a
            href={newsLandingPageUrl}
            onClick={handleCTAClick}
            role="button"
            tabIndex={0}
            target="_blank"
          >
            {ALL_NEWS}
          </a>
        </div>
        <div className="articles">
          {prismicContent
            ?.slice(0, 3)
            .map((article: PrismicDocumentWithUID, index: number) => {
              const { data, first_publication_date } = article;
              let { heading, banner_image, author_name } = data;
              heading = truncate(heading, 55);

              const formattedPublishedDateAndTime = getIntlDate({
                lang,
                date: new Date(first_publication_date).toString(),
                dateFormat: 'MMM-DD-YYYY',
              });

              const redirectionUrl = convertUidToUrl({
                uid: article.uid,
                lang: getLangObject(lang).code,
                isDev,
                hostname: host,
              });

              return (
                <article className="news-article" key={heading}>
                  <a
                    href={redirectionUrl}
                    key={index}
                    target="_blank"
                    onClick={() => handleArticleClick(index)}
                  >
                    <div className="article-image">
                      <Image
                        url={banner_image?.url}
                        height={88}
                        width={140}
                        alt={'News Article'}
                        fetchPriority="high"
                        loading="eager"
                        loadHigherQualityImage={true}
                      />
                    </div>
                  </a>
                  <div className="article-info">
                    <a
                      href={redirectionUrl}
                      key={index}
                      target="_blank"
                      onClick={() => handleArticleClick(index)}
                    >
                      <span className="published-date">
                        {formattedPublishedDateAndTime}
                      </span>
                      <h4>{heading}</h4>
                      <Conditional if={author_name}>
                        <div className="author-details">
                          {Avatar}
                          <span>{author_name}</span>
                        </div>
                      </Conditional>
                    </a>
                  </div>
                </article>
              );
            })}
        </div>
      </FeaturedNewsContainer>
    </Conditional>
  );
};

export default DesktopFeaturedNews;
