import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
// Components
import Conditional from 'components/common/Conditional';
const Product = dynamic(() => import('components/MicrositeV2/Product'));
// Constants, Context
import InteractionContext from 'contexts/Interaction';
import { expandFontToken } from 'const/typography';
import { CHEVRON_LEFT_DEFAULT, CHEVRON_RIGHT_DEFAULT } from 'assets/SvgIcons';
import { ANALYTICS_PROPERTIES } from 'const/index';
import { trackEvent } from 'utils/analytics';

import { LTD_DISCOVERY_EXPERIMENT_CATEGORY_MAP as categoryNameMap } from 'constants/index';

const Slider = dynamic(() => import('UI/Slider'));

const Category = styled.div`
  position: relative;
  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;

    .category-name {
      ${expandFontToken('Heading/Large')};
    }

    .see-all {
      ${expandFontToken('Button/Small')};
      cursor: pointer;
      margin-right: 1rem;
    }
  }

  .product-list {
    overflow-x: scroll;
    overflow-y: hidden;
    margin-top: 2rem;
    min-height: 19.375rem;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }

    .product-wrapper {
      width: 17.625rem;
      margin-right: 1.5rem;
    }

    .prev-slide,
    .next-slide {
      top: 40%;
      right: 0;
      svg {
        height: 48px !important;
        width: 48px !important;
        transform: rotate(0deg);
      }
    }
    .prev-slide {
      left: -1.5rem;
      right: auto;
    }
    .next-slide {
      right: -1.5rem;
    }
  }
  @media (max-width: 768px) {
    .category-header {
      margin-top: 0rem;
      position: relative;
      min-width: calc(100vw - 16px);
      .category-name {
        ${expandFontToken('Heading/Small')};
      }

      .see-all {
        ${expandFontToken('UI/Label Regular')};
        right: 4px;
        position: absolute;
      }
    }
    .product-list {
      margin-top: 1rem;
      margin-bottom: 4px;
      min-height: 14.375rem;
      position: relative;
      min-width: calc(100vw - 16px);
      .product-wrapper {
        width: 156px;
        margin-right: 0;

        .product-v2-title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
`;

const CategorisedProductsWrapper = styled.div`
  margin-top: 2rem;
  padding: 0;
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
`;

const CategorisedPopulateProducts = (props) => {
  const { categories, allTours, sectionId, host, uid, isMobile, directTgid } =
    props;
  const { activeCategoryId } = useContext(InteractionContext) || {};
  const [viewedTgids] = useState<string[]>([]);
  const onSeeAllClicked = (url, category) => {
    trackEvent({
      eventName: 'See All Clicked',
      Category: category,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const categoriesToShow = Object.keys(categoryNameMap).map((categoryName) => {
    const category = categories.find((c) => c.name === categoryName);
    if (!category) return;
    return {
      ...category,
      displayName: categoryNameMap[category.name].displayName,
      products: category?.ranking?.popularity?.slice(0, 10),
      redirectUrl: categoryNameMap[category.name].url,
    };
  });

  const calculateSlidesPerView = () => {
    const clientWidth = document.documentElement.clientWidth;
    // Total width (Subtracting margins) / width of each slide
    return (clientWidth - 16 * 2) / 156;
  };

  const swiperParams = {
    direction: 'horizontal',
    speed: 650,
    slidesPerView: isMobile ? calculateSlidesPerView() : 4,
    spaceBetween: isMobile ? 12 : 24,
    preloadImages: false,
    lazy: true,
    navigaton: {
      nextEl: '.swiper-btn.btn-left',
      prevEl: '.swiper-btn.btn-right',
    },
    slidesPerGroup: isMobile ? 2 : 3,
    pagination: false,
    shouldSwiperUpdate: false,
  };

  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: 0.5,
    };

    let observer = new IntersectionObserver((elements) => {
      elements.forEach((intersectionEntry) => {
        const { isIntersecting } = intersectionEntry;
        const [ranking, category, tgid] =
          intersectionEntry.target.id.split('-');
        const trackAlreadyViewedKey = `${category}-${tgid}`;

        const id = Number(tgid);
        if (isIntersecting && !viewedTgids.includes(trackAlreadyViewedKey)) {
          trackEvent({
            eventName: 'Experience Card Visible',
            [ANALYTICS_PROPERTIES.TGID]: id,
            [ANALYTICS_PROPERTIES.RANKING]: Number(ranking),
            Category: category,
            'Is Pinned Card': directTgid === id,
          });

          viewedTgids.push(trackAlreadyViewedKey);
        }
      });
    }, options);

    setTimeout(() => {
      const productCards = document.getElementsByClassName('product-wrapper');
      for (let i = 0; i < productCards.length; i++) {
        observer.observe(productCards[i]);
      }
    }, 500);

    return () => {
      const productCards = document.getElementsByClassName('product-wrapper');
      for (let i = 0; i < productCards.length; i++) {
        observer.unobserve(productCards[i]);
      }
    };
  }, []);

  const slideChangeCallback = (realIndex, currentIndex, category) => {
    trackEvent({
      eventName: 'Chevron Clicked',
      'Next Items Count': realIndex - currentIndex,
      Category: category,
    });
  };
  return (
    <CategorisedProductsWrapper>
      {categoriesToShow.map((category) => (
        <Conditional key={category.id} if={category.products.length > 0}>
          <Category className="category-row" id={category.name}>
            <div className="category-header">
              <span className="category-name">{category.displayName}</span>
              <Conditional if={category.redirectUrl}>
                <span
                  className="see-all"
                  onClick={() =>
                    onSeeAllClicked(category.redirectUrl, category.name)
                  }
                  tabIndex={0}
                  role="button"
                >
                  See All
                  <Conditional if={!isMobile}>{` >`}</Conditional>
                </span>
              </Conditional>
            </div>
            <div className="product-list">
              <Slider
                nextButton={isMobile ? null : CHEVRON_RIGHT_DEFAULT}
                prevButton={isMobile ? null : CHEVRON_LEFT_DEFAULT}
                sliderOptions={swiperParams}
                slideChangeCallback={(realIndex, currentIndex) =>
                  slideChangeCallback(realIndex, currentIndex, category.name)
                }
              >
                {category.products.map((tgid, index) => (
                  <div
                    className="product-wrapper swiper-lazy"
                    id={`${index + 1}-${category.name}-${tgid}`}
                    key={tgid}
                  >
                    <Product
                      tgid={tgid}
                      isEntertainmentMb={true}
                      allTours={allTours}
                      isMobile={false}
                      key={tgid}
                      cardIdPrefix={sectionId}
                      activeCategoryId={activeCategoryId}
                      host={host}
                      uid={uid}
                      ranking={index + 1}
                      ltdCategory={category.name}
                      isPinnedCard={directTgid === tgid}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </Category>
        </Conditional>
      ))}
    </CategorisedProductsWrapper>
  );
};

export default CategorisedPopulateProducts;
