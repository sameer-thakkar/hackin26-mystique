import { useContext, useEffect, useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import { TMobileMoreReadsProps } from 'components/NewsPage/components/MobileMoreReads/interface';
import { Wrapper } from 'components/NewsPage/components/MobileMoreReads/styles';
import Button from 'UI/Button';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { formatDateToString } from 'utils/dateUtils';
import { getLangObject, truncate } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  NEWS_PAGE_DATE_FORMAT,
  NEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';
import Avatar from 'assets/avatar';

const MobileMoreReads: React.FC<TMobileMoreReadsProps> = ({
  content,
  showAllNewsCTA,
  heading,
  showMoreCTAText,
  numberOfArticlesToShow, // This higlights the total number of articles to show in component
  initialArticlesToShow,
  newsLandingPageUrl,
}) => {
  const { host, lang, isDev } = useContext(MBContext);
  const [articlesToShow, setArticlesToShow] = useState(initialArticlesToShow);
  const moreReadsRef = useRef(null);
  const isMoreReadsSectionVisible = useOnScreen({
    ref: moreReadsRef,
    unobserve: true,
  });

  const { ALL_NEWS } = strings.NEWS_PAGE;
  const { uniqueArticlesWithSameTgidData = [], featuredArticles = [] } =
    content;

  const moreReadsData = [
    ...(uniqueArticlesWithSameTgidData ? uniqueArticlesWithSameTgidData : []),
    ...(featuredArticles ? featuredArticles.slice(4) : []),
  ].slice(0, numberOfArticlesToShow);

  const handleArticleClick = (index: number, title: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.MORE_READS,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.TITLE]: title,
    });
    return;
  };

  const handleCTAClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_NEWS,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.MORE_READS,
    });
    return;
  };

  useEffect(() => {
    if (isMoreReadsSectionVisible) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.MORE_READS,
      });
    }
  }, [isMoreReadsSectionVisible]);

  return (
    <Conditional if={moreReadsData?.length > 0}>
      <Wrapper ref={moreReadsRef}>
        <div className="heading-wrapper">
          <h2>{heading}</h2>
          <Conditional if={showAllNewsCTA}>
            <a href={newsLandingPageUrl} onClick={handleCTAClick}>
              {ALL_NEWS}
            </a>
          </Conditional>
        </div>
        <div className="articles">
          {moreReadsData
            .slice(0, articlesToShow)
            ?.map((article, index: number) => {
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
                lang: getLangObject(lang).code,
                isDev,
                hostname: host,
              });

              return (
                <article className="news-article" key={heading}>
                  <a
                    href={redirectionUrl}
                    key={article.uid}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleArticleClick(index, heading)}
                  >
                    <div className="article-image">
                      <Image
                        url={banner_image?.url}
                        height={88}
                        width={140}
                        alt={'News Article'}
                        fetchPriority="low"
                      />
                    </div>
                  </a>
                  <div className="article-info">
                    <a
                      href={redirectionUrl}
                      key={article.uid}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleArticleClick(index, heading)}
                    >
                      <span className="published-date">
                        {formattedPublishedDateAndTime}
                      </span>
                      <h4>{heading}</h4>
                    </a>
                    <Conditional if={author_name}>
                      <div className="author-details">
                        <span>
                          {Avatar}
                          {author_name}
                        </span>
                      </div>
                    </Conditional>
                  </div>
                </article>
              );
            })}
          <Conditional if={articlesToShow < moreReadsData.length}>
            <Button
              className="load-more"
              onClick={() =>
                setArticlesToShow(articlesToShow + initialArticlesToShow)
              }
            >
              {showMoreCTAText}
            </Button>
          </Conditional>
        </div>
      </Wrapper>
    </Conditional>
  );
};

export default MobileMoreReads;
