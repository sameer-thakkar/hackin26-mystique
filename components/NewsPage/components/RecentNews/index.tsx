import { useContext, useEffect, useRef, useState } from 'react';
import { scroller } from 'react-scroll';
import { useRouter } from 'next/router';
import Conditional from 'components/common/Conditional';
import MobileMoreReads from 'components/NewsPage/components/MobileMoreReads';
import { TRecentNewsProps } from 'components/NewsPage/components/RecentNews/interface';
import {
  ButtonWrapper,
  Cell,
  Content,
  ImageContainer,
  Meta,
  Wrapper,
} from 'components/NewsPage/components/RecentNews/styles';
import Button from 'UI/Button';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { formatDateToString } from 'utils/dateUtils';
import { truncate } from 'utils/helper';
import { extractFirstRichTextSliceContent } from 'utils/parser';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  NEWS_PAGE_DATE_FORMAT,
  NEWS_PAGE_SECTIONS,
  QUERY_PARAMS,
} from 'const/index';
import { strings } from 'const/strings';
import Avatar from 'assets/avatar';

const RecentNews: React.FC<TRecentNewsProps> = (props) => {
  const { lang, isDev, host } = useContext(MBContext);
  const recentNewsRef = useRef(null);
  const isRecentNewsSectionVisible = useOnScreen({
    ref: recentNewsRef,
    unobserve: true,
  });
  const { query, push: routerPush, asPath } = useRouter();
  const { page = 0 } = query;
  const [articlesToShow, setArticlesToShow] = useState(
    16 + (page as number) * 8
  );

  const { allArticles, CFData, isMobile } = props;

  const { NEWS_PAGE } = strings;
  const { RECENT_NEWS, SHOW_MORE_ARTICLES, COLLAPSE_ALL } = NEWS_PAGE;

  const getUpdatedQuery = () => {
    const url = typeof window === 'undefined' ? asPath : location?.href;
    const query = new URLSearchParams(url?.split('?')?.[1]);
    const queryLimit = query.get(QUERY_PARAMS.PAGE) || page;

    query.set(
      QUERY_PARAMS.PAGE,
      articlesToShow >= allArticles?.length
        ? '0'
        : String(Number(queryLimit) + 1)
    );
    return query;
  };

  const handleShowMoreCTAClick = () => {
    if (articlesToShow >= allArticles?.length) {
      scroller.scrollTo('recent-news', {
        duration: 600,
        offset: -100,
        smooth: 'easeInOutQuint',
      });
      setArticlesToShow(16);
    } else {
      setArticlesToShow(articlesToShow + 8);
    }
    routerPush(`?${getUpdatedQuery().toString()}`, undefined, {
      shallow: true,
    });
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.SHOW_MORE_ARTICLES,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.RECENT_NEWS,
    });
  };

  const handleArticleClick = (index: number, title: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.RECENT_NEWS,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.TITLE]: title,
    });
    return;
  };

  useEffect(() => {
    if (isRecentNewsSectionVisible) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.RECENT_NEWS,
      });
    }
  }, [isRecentNewsSectionVisible]);

  return (
    <Conditional if={allArticles?.length > 0}>
      <Conditional if={!isMobile}>
        <h2 id="recent-news">{RECENT_NEWS}</h2>
        <Wrapper ref={recentNewsRef}>
          {allArticles?.slice(0, articlesToShow)?.map((article, index) => {
            const { data, first_publication_date, uid } = article;
            const { banner_image, heading, author_name } = data;
            const formattedPublishedDateAndTime = formatDateToString(
              new Date(first_publication_date),
              'en',
              NEWS_PAGE_DATE_FORMAT
            );
            const truncatedContent = truncate(
              extractFirstRichTextSliceContent(CFData, uid),
              75
            );
            const articleUrl = convertUidToUrl({
              uid,
              lang,
              isDev,
              hostname: host,
            });

            return (
              <a
                href={articleUrl}
                key={article.uid}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleArticleClick(index, heading)}
              >
                <Cell>
                  <ImageContainer>
                    <Image
                      url={banner_image?.url}
                      aspectRatio={'16:10'}
                      fill
                      alt="Show Image"
                      loading="lazy"
                    />
                  </ImageContainer>
                  <Content>
                    <time>{formattedPublishedDateAndTime}</time>
                    <h3>{heading}</h3>
                    <p>{truncatedContent}</p>
                  </Content>
                  <Meta>
                    {Avatar}
                    <span>{author_name}</span>
                  </Meta>
                </Cell>
              </a>
            );
          })}
        </Wrapper>
        <Conditional if={allArticles?.length >= 16}>
          <ButtonWrapper>
            <Button className="show-more" onClick={handleShowMoreCTAClick}>
              {articlesToShow >= allArticles?.length
                ? COLLAPSE_ALL
                : SHOW_MORE_ARTICLES}
            </Button>
          </ButtonWrapper>
        </Conditional>
      </Conditional>
      <Conditional if={isMobile}>
        <MobileMoreReads
          content={{
            uniqueArticlesWithSameTgidData: allArticles,
            featuredArticles: [],
            CFData: {},
          }}
          showAllNewsCTA={false}
          heading={NEWS_PAGE.RECENT_NEWS}
          showMoreCTAText={NEWS_PAGE.SHOW_MORE_ARTICLES}
          numberOfArticlesToShow={allArticles?.length}
          initialArticlesToShow={5}
        />
      </Conditional>
    </Conditional>
  );
};
export default RecentNews;
