import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import { getUniqueFeaturedArticles } from 'components/NewsPage/utils';
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
import Avatar from 'assets/avatar';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';

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
  3: 70,
} as const;

const DesktopMoreReads: React.FC<TDesktopMoreReadsProps> = ({
  content,
  handleCtaClick,
  trackingObject,
}) => {
  const {
    uniqueArticlesWithSameTgidData,
    featuredArticles,
    newsLandingPageUrl,
  } = content;
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const moreReadsRef = useRef(null);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const { host, lang, isDev } = useContext(MBContext);
  const isMoreReadsSectionVisible = useOnScreen({
    ref: moreReadsRef,
    unobserve: true,
  });
  const uniqueFeaturedArticles = useMemo(
    () =>
      getUniqueFeaturedArticles(
        uniqueArticlesWithSameTgidData,
        featuredArticles.slice(3)
      ),
    [featuredArticles, uniqueArticlesWithSameTgidData]
  );

  const { MORE_READS, ALL_NEWS } = strings.NEWS_PAGE;

  const finalContentForMoreReads = [
    ...(uniqueArticlesWithSameTgidData ? uniqueArticlesWithSameTgidData : []),
    ...(featuredArticles ? uniqueFeaturedArticles : []),
  ];

  useEffect(() => {
    if (!swiper) return;
    setActiveSlideIdx(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  useEffect(() => {
    if (isMoreReadsSectionVisible) {
      trackEvent(trackingObject);
    }
  }, [isMoreReadsSectionVisible]);

  const changeSlide = (noOfSlide: number) => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx + noOfSlide;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.MORE_READS,
        [ANALYTICS_PROPERTIES.DIRECTION]:
          noOfSlide > 0 ? 'Forward' : 'Backward',
      });
    }
    return;
  };

  const swiperParams: SwiperProps = {
    className: '.more-reads-swiper',
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

  const disableLimit =
    finalContentForMoreReads?.length <= 10
      ? finalContentForMoreReads?.length
      : 10;

  return (
    <Conditional if={finalContentForMoreReads?.length > 0}>
      <Container ref={moreReadsRef}>
        <div className="title-wrapper">
          <h2>{MORE_READS}</h2>
          <div className="navigation">
            <a
              href={newsLandingPageUrl}
              onClick={handleCtaClick}
              role="button"
              tabIndex={0}
              target="_blank"
            >
              {ALL_NEWS}
            </a>
            <Conditional if={finalContentForMoreReads?.length > 4}>
              <div className="icons">
                <LttChevronLeft
                  onClick={() => changeSlide(-1)}
                  disabled={activeSlideIdx <= 0}
                />
                <LttChevronRight
                  onClick={() => changeSlide(1)}
                  disabled={activeSlideIdx + 4 >= disableLimit}
                />
              </div>
            </Conditional>
          </div>
        </div>

        <Wrapper $noOfArticles={finalContentForMoreReads.length}>
          <Swiper {...swiperParams} className="more-reads-swiper">
            {finalContentForMoreReads.slice(0, 10).map((article, index) => {
              const { first_publication_date, uid } = article ?? {};
              let {
                heading,
                author_name,
                banner_image,
                content_framework_ref,
              } = article?.data;

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
                extractFirstRichTextSliceContent(
                  content_framework_ref?.data?.body
                ),
                PARAGRAPH_LENGTH[
                  (finalContentForMoreReads.length < 4
                    ? finalContentForMoreReads.length % 4
                    : 3) as TNumberOfImagesInCarousel
                ]
              );

              return (
                <div className="article-wrapper" key={index}>
                  <a
                    href={redirectionUrl}
                    target="_blank"
                    onClick={() => handleArticleClick(index)}
                    key={genUniqueId()}
                  >
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
                    </div>
                  </a>
                  <Conditional if={author_name}>
                    <span className="author-name">
                      {Avatar}
                      {author_name}
                    </span>
                  </Conditional>
                </div>
              );
            })}
          </Swiper>
        </Wrapper>
      </Container>
    </Conditional>
  );
};

export default DesktopMoreReads;
