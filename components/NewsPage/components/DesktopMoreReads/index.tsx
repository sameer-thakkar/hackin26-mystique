import React, { useContext, useEffect, useRef, useState } from 'react';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import type {
  TDesktopMoreReadsProps,
  TNumberOfImagesInCarousel,
} from 'components/NewsPage/components/DesktopMoreReads/interface';
import {
  Container,
  Wrapper,
} from 'components/NewsPage/components/DesktopMoreReads/styles';
import Swiper from 'components/Swiper';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import { genUniqueId } from 'utils';
import { trackEvent } from 'utils/analytics';
import { formatDateToString } from 'utils/dateUtils';
import { getLangObject, truncate } from 'utils/helper';
import { extractFirstRichTextSliceContent } from 'utils/parser';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  NEWS_PAGE_DATE_FORMAT,
  NEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';
import { AVATAR, LTT_CHEVRON_LEFT, LTT_CHEVRON_RIGHT } from 'assets/SvgIcons';

/* IMAGE_DIMENSIONS specifies dimension of images based on total number of images (property in this object) in carousel */
const IMAGE_DIMENSIONS = {
  0: {
    width: '282',
    height: '178',
  },
  1: {
    width: '684',
    height: '398',
  },
  2: {
    width: '588',
    height: '368',
  },
  3: {
    width: '384',
    height: '240',
  },
} as const;

const PARAGRAPH_LENGTH = {
  0: 70,
  1: 150,
  2: 180,
  3: 80,
} as const;

const DesktopMoreReads: React.FC<TDesktopMoreReadsProps> = ({ content }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const moreReadsRef = useRef(null);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const { host, lang, isDev } = useContext(MBContext);
  const isMoreReadsSectionVisible = useOnScreen({
    ref: moreReadsRef,
    unobserve: true,
  });
  const { uniqueArticlesWithSameTgidData, featuredArticles, CFData } = content;
  const { MORE_READS } = strings.NEWS_PAGE;

  const finalContentForMoreReads = [
    ...(uniqueArticlesWithSameTgidData ? uniqueArticlesWithSameTgidData : []),
    ...(featuredArticles ? featuredArticles.slice(4) : []),
  ];

  useEffect(() => {
    if (!swiper) return;
    setActiveSlideIdx(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  useEffect(() => {
    if (isMoreReadsSectionVisible) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.MORE_READS,
      });
    }
  }, [isMoreReadsSectionVisible]);

  const changeSlide = (noOfSlide: number) => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx + noOfSlide;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
    }
    return;
  };

  const swiperParams: SwiperProps = {
    spaceBetween: 24,
    slidesPerView:
      finalContentForMoreReads.length < 4
        ? finalContentForMoreReads.length % 4
        : 4,
    allowTouchMove: false,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
  };

  const handleArticleClick = (index: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.MORE_READS,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
    return;
  };

  return (
    <Conditional if={finalContentForMoreReads?.length > 0}>
      <Container ref={moreReadsRef}>
        <div className="title-wrapper">
          <h2>{MORE_READS}</h2>
          <Conditional if={finalContentForMoreReads?.length > 4}>
            <div className="icons">
              <LTT_CHEVRON_LEFT
                onClick={() => changeSlide(-1)}
                disabled={activeSlideIdx <= 0}
              />
              <LTT_CHEVRON_RIGHT
                onClick={() => changeSlide(1)}
                disabled={activeSlideIdx + 4 >= finalContentForMoreReads.length}
              />
            </div>
          </Conditional>
        </div>

        <Wrapper $noOfArticles={finalContentForMoreReads.length}>
          <Swiper {...swiperParams}>
            {finalContentForMoreReads.map((article, index) => {
              const { first_publication_date, uid } = article;
              let { heading, author_name, banner_image } = article.data;

              heading = truncate(heading, 50);
              const formattedPublishedDateAndTime = formatDateToString(
                new Date(first_publication_date),
                'en',
                NEWS_PAGE_DATE_FORMAT
              );

              const redirectionUrl = convertUidToUrl({
                uid,
                lang: getLangObject(lang).code,
                isDev,
                hostname: host,
              });

              const truncatedContent = truncate(
                extractFirstRichTextSliceContent(CFData, uid),
                PARAGRAPH_LENGTH[
                  (finalContentForMoreReads.length < 4
                    ? finalContentForMoreReads.length % 4
                    : 3) as TNumberOfImagesInCarousel
                ]
              );

              return (
                <a
                  href={redirectionUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleArticleClick(index)}
                  key={genUniqueId()}
                >
                  <div className="article-wrapper" key={index}>
                    <div className="image-wrapper">
                      <Image
                        url={banner_image.url}
                        alt="article"
                        fill
                        height={
                          IMAGE_DIMENSIONS[
                            (finalContentForMoreReads.length %
                              4) as TNumberOfImagesInCarousel
                          ].height
                        }
                        width={
                          IMAGE_DIMENSIONS[
                            (finalContentForMoreReads.length %
                              4) as TNumberOfImagesInCarousel
                          ].width
                        }
                      />
                    </div>
                    <div className="content">
                      <time>{formattedPublishedDateAndTime}</time>
                      <h3>{heading}</h3>
                      <div className="article-content">{truncatedContent}</div>
                      <Conditional if={author_name}>
                        <span className="author-name">
                          {AVATAR}
                          {author_name}
                        </span>
                      </Conditional>
                    </div>
                  </div>
                </a>
              );
            })}
          </Swiper>
        </Wrapper>
      </Container>
    </Conditional>
  );
};

export default DesktopMoreReads;
