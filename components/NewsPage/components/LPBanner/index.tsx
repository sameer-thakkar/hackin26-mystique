import React, { useCallback, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import { TNewsLandingPageProps } from 'components/NewsPage/components/LPBanner/interface';
import {
  BannerInfo,
  Content,
  ImageContainer,
  MetaInfo,
  PaginatorContainer,
  Tag,
  Wrapper,
} from 'components/NewsPage/components/LPBanner/styles';
import Image from 'UI/Image';
import { Paginator } from 'UI/Paginator';
import { MBContext } from 'contexts/MBContext';
import useWindowSize from 'hooks/useWindowSize';
import { trackEvent } from 'utils/analytics';
import { formatDateToString } from 'utils/dateUtils';
import { truncate } from 'utils/helper';
import { modulus } from 'utils/integerUtils';
import { extractFirstRichTextSliceContent } from 'utils/parser';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  NEWS_PAGE_DATE_FORMAT,
  NEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';
import {
  AVATAR,
  NEWS_PAGE_NEXT_ICON,
  NEWS_PAGE_PREV_ICON,
} from 'assets/SvgIcons';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "LandingPageSwiper" */ 'components/Swiper')
);

const LandingPageBanner: React.FC<TNewsLandingPageProps> = (props) => {
  const isMobile = useWindowSize().width! < 768;
  const [swiper, setSwiper] = useState<TSwiper | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { lang, isDev, host } = useContext(MBContext);
  const updateIndex = useCallback(() => {
    if (swiper !== null) {
      const slideIndex = swiper?.realIndex;
      setActiveIndex(slideIndex);
    }
  }, [swiper]);

  const { featuredArticles, CFData } = props;
  const { READ_MORE, NEWS_PAGE } = strings;
  const { FEATURED } = NEWS_PAGE;

  useEffect(() => {
    if (!swiper || swiper?.destroyed) return;

    swiper.on('slideChange', updateIndex);

    return () => {
      if (swiper && !swiper.destroyed) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [swiper, updateIndex, activeIndex]);

  const swiperOptions: SwiperProps = {
    autoplay: {
      delay: isMobile ? 5000 : 10000,
    },
    spaceBetween: 12,
    loop: true,
    lazy: true,
    allowTouchMove: isMobile,
    navigation: {
      prevEl: '.previous-button',
      nextEl: '.next-button',
    },
    onSwiper: (swiper) => setSwiper(swiper),
  };

  const handleArticleClick = (index: number, title: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.LANDING_PAGE_BANNER,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.TITLE]: title,
    });
    return;
  };

  const handlePrevChevronClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
      [ANALYTICS_PROPERTIES.DIRECTION]: 'Previous',
      [ANALYTICS_PROPERTIES.CATEGORY]: NEWS_PAGE_SECTIONS.LANDING_PAGE_BANNER,
    });
  };
  const handleNextChevronClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
      [ANALYTICS_PROPERTIES.DIRECTION]: 'Next',
      [ANALYTICS_PROPERTIES.CATEGORY]: NEWS_PAGE_SECTIONS.LANDING_PAGE_BANNER,
    });
  };

  return (
    <Conditional if={featuredArticles?.length > 0}>
      <Wrapper>
        <Swiper {...swiperOptions}>
          {featuredArticles.slice(0, 5)?.map((article, index) => {
            const { data, first_publication_date, uid } = article;
            const { banner_image, heading, author_name } = data;
            const truncatedContent = truncate(
              extractFirstRichTextSliceContent(CFData, article.uid),
              isMobile ? 160 : 200
            );
            const formattedPublishedDateAndTime = formatDateToString(
              new Date(first_publication_date),
              'EN',
              NEWS_PAGE_DATE_FORMAT
            );
            const redirectUrl = convertUidToUrl({
              uid,
              lang,
              isDev,
              hostname: host,
            });

            return (
              <a
                className="swiper-container"
                key={article.uid}
                href={redirectUrl}
                target={'_blank'}
                rel={'noreferrer'}
                onClick={() => handleArticleClick(index, heading)}
              >
                <ImageContainer>
                  <Image
                    url={banner_image.url}
                    alt="Banner Image"
                    className="banner-image"
                    aspectRatio={'16:9'}
                    priority
                  />
                  <Tag>{FEATURED.toUpperCase()}</Tag>
                </ImageContainer>
                <BannerInfo>
                  <h2>{truncate(heading, 100)}</h2>
                  <Content>
                    <p>{truncatedContent} </p>
                    <u>{READ_MORE}</u>
                  </Content>
                  <MetaInfo>
                    {AVATAR}
                    <span className="author-name">{author_name}</span>
                    <time dateTime={formattedPublishedDateAndTime}>
                      {formattedPublishedDateAndTime}
                    </time>
                  </MetaInfo>
                </BannerInfo>
              </a>
            );
          })}
        </Swiper>
        <div
          className="previous-button"
          onClick={handlePrevChevronClick}
          role="button"
          tabIndex={0}
        >
          {NEWS_PAGE_PREV_ICON}
        </div>
        <div
          className="next-button"
          onClick={handleNextChevronClick}
          role="button"
          tabIndex={0}
        >
          {NEWS_PAGE_NEXT_ICON}
        </div>
      </Wrapper>
      <PaginatorContainer>
        <Paginator
          tabSize={0.9375}
          dotSize={0.25}
          totalCount={
            featuredArticles?.length < 5
              ? modulus(featuredArticles?.length, 5)
              : 5
          }
          activeIndex={activeIndex}
        />
      </PaginatorContainer>
    </Conditional>
  );
};

export default LandingPageBanner;
