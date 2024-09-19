import { useContext, useEffect, useState } from 'react';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import type { TMobileFeaturedNewsProps } from 'components/NewsPage/components/MobileFeaturedNews/interface';
import { Wrapper } from 'components/NewsPage/components/MobileFeaturedNews/styles';
import Swiper from 'components/Swiper';
// import Button from 'UI/Button';
import Image from 'UI/Image';
import { Paginator } from 'UI/Paginator';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { formatDateToString } from 'utils/dateUtils';
import { getLangObject, truncate } from 'utils/helper';
import { extractFirstRichTextSliceContent } from 'utils/parser';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  NEWS_PAGE_DATE_FORMAT,
  NEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';

const MobileFeaturedNews: React.FC<TMobileFeaturedNewsProps> = ({
  featuredNewsContent,
  newsLandingPageUrl,
}) => {
  const [_, setActiveSlideIdx] = useState<number>(0);
  const [swiper, setSwiperInstance] = useState<TSwiper>();
  const { host, lang, isDev } = useContext(MBContext);

  const { content } = featuredNewsContent;
  const { FEATURED_NEWS, ALL_NEWS } = strings.NEWS_PAGE;

  useEffect(() => {
    if (!swiper) return;
    setActiveSlideIdx(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  const swiperParams: SwiperProps = {
    slidesPerView: 1,
    spaceBetween: 24,
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
    onSlideChange: () => setActiveSlideIdx(swiper?.activeIndex!),
  };

  const handleCTAClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_NEWS,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.FEATURED_NEWS,
    });
    return;
  };

  const handleArticleClick = (index: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.FEATURED_NEWS,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
    return;
  };

  return (
    <Conditional if={content?.length > 0}>
      <Wrapper>
        <div className="heading-wrapper">
          <h2>{FEATURED_NEWS}</h2>
          <a href={newsLandingPageUrl} onClick={handleCTAClick}>
            {ALL_NEWS}
          </a>
        </div>

        <Swiper {...swiperParams}>
          {content?.slice(0, 4).map((article, index: number) => {
            const { data, first_publication_date } = article;
            const { content_framework_ref } = data;
            let { heading, banner_image } = data;
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
            const truncatedContent = truncate(
              extractFirstRichTextSliceContent(
                content_framework_ref?.data?.body
              ),
              70
            );

            return (
              <a
                href={redirectionUrl}
                key={index}
                target="_blank"
                onClick={() => handleArticleClick(index)}
              >
                <article className="news-article">
                  <div className="article-image">
                    <Image
                      url={banner_image?.url}
                      fill
                      alt={'News Article'}
                      fetchPriority="low"
                      loadHigherQualityImage={true}
                    />
                  </div>
                  <div className="article-info">
                    <div className="published-date">
                      {formattedPublishedDateAndTime}
                    </div>
                    <h4>{heading}</h4>
                    <span className="article-content">{truncatedContent}</span>
                  </div>
                </article>
              </a>
            );
          })}
        </Swiper>
        <div className="paginator">
          <Paginator
            tabSize={0.9375}
            dotSize={0.25}
            totalCount={content.length >= 4 ? 4 : content.length % 4}
            activeIndex={Number(swiper?.activeIndex)}
          />
        </div>
      </Wrapper>
    </Conditional>
  );
};

export default MobileFeaturedNews;
