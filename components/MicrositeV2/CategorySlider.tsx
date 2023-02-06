import React, { useState, useContext, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
import ProductsContext from 'contexts/Products';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import Conditional from 'components/common/Conditional';

const DetailedProductCard = dynamic(
  () =>
    import(
      /* webpackChunkName: "DetailedProductCard" */ 'components/MicrositeV2/DetailedProductCard'
    ),
  {
    ssr: false,
  }
);
const Swiper = dynamic(() =>
  import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);
const Product = dynamic(() =>
  import(/* webpackChunkName: "Product" */ 'components/MicrositeV2/Product')
);

const StyledCategorySlider = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 16px;

  .swiper-container {
    width: 100%;
    margin: auto;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .card {
    background: #ecf0f1;
    padding: 10px;
  }
  .category-slider .content > h2 {
    margin: 0;
    margin-bottom: 8px;
  }
  .content > p {
    width: 60%;
    margin: 0;
    margin-bottom: 16px;
  }
  .slider-container {
    overflow: hidden;
    display: flex;
    width: 100%;
    /* TODO: Remove this from here. [Safari Fix] */
    max-width: 1200px;
    margin: auto;
  }
  .slider-wrap {
    display: grid;
    position: relative;
  }
  .controls {
    display: flex;
  }
  .controls .btn {
    position: absolute;
    top: 88px;
    transform: translateY(-50%);
    left: -32px;
    display: flex;
    cursor: pointer;
  }
  .controls .btn-right {
    left: unset;
    right: -32px;
  }
  .availability p {
    font-size: 12px !important;
    line-height: 12px !important;
    color: ${COLORS.TEXT.BEACH} !important;
    text-align: left !important;
    font-family: ${HALYARD.FONT_STACK} !important;
  }
  .controls .btn svg {
    stroke-width: 1.5px;
  }
  .content > p {
    width: 100%;
  }
  .controls .btn-right svg {
    transform: rotate(180deg);
  }
  .swiper-wrapper {
    display: grid;
    grid-auto-flow: column;
    justify-content: left;
  }
  @media (min-width: 768px) {
    .content {
      max-width: 588px;
    }
  }
  @media (max-width: 768px) {
    grid-row-gap: 8px;
  }
`;

const CategorySlider = (props: any) => {
  const {
    tgidsArray,
    carouselOptions,
    currentLanguage,
    uid,
    heading = '',
    description,
    isFirstTourOpen = false,
    isEntertainmentMb,
    category,
    excludedTgids,
    hasCategoryTourList = false,
    categoryTourListData = {},
  } = props;
  let autoScroll = !isFirstTourOpen;

  const carouselId = heading?.replace(/\s/g, '-').toLowerCase() || '';
  const [swiper, updateSwiper] = useState(null);
  const [currentIndex, updateCurrentIndex] = useState(0);
  const productsContext = useContext(ProductsContext);
  // @ts-expect-error TS(2339): Property 'allTours' does not exist on type 'null'.
  const { allTours, isMobile } = productsContext;

  let filteredTgids;
  const categoryDataObj = {};

  const categoryDataArray = Object.keys(categoryTourListData)?.length
    ? categoryTourListData[category]
    : [];

  if (categoryDataArray?.length) {
    categoryDataArray?.forEach((c: any) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      categoryDataObj[c?.tgid] = c;
    });
  }
  const categoryTours =
    hasCategoryTourList && categoryDataArray?.length
      ? categoryDataObj
      : allTours;

  if (hasCategoryTourList) {
    const re = /\s*(?:,)\s*/g;
    const excludedTours = excludedTgids
      ? excludedTgids?.split(re)?.map((tgid: any) => +tgid)
      : [];
    const allTgids = categoryDataArray?.map((c: any) => c?.tgid);
    filteredTgids = allTgids?.filter((tgid: any) => {
      return (
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        categoryDataObj[tgid] &&
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        categoryDataObj[tgid]?.available &&
        !excludedTours.includes(tgid)
      );
    });
  } else {
    filteredTgids = tgidsArray?.filter(
      (tgid: any, index: number, arr: any) =>
        allTours[tgid] &&
        allTours[tgid].available &&
        arr.slice(0, index).indexOf(tgid) == -1
    );
  }

  const [tgidClicked, setTgidClicked] = useState(
    !isMobile && isFirstTourOpen ? filteredTgids[0] : null
  );

  const goNext = () => {
    if (swiper !== null) {
      (swiper as any).slideNext();
    }
  };

  const goPrev = () => {
    if (swiper !== null) {
      (swiper as any).slidePrev();
    }
  };

  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const updateIndex = useCallback(() => updateCurrentIndex(swiper.realIndex), [
    swiper,
  ]);

  useEffect(() => {
    if (swiper !== null) {
      (swiper as any).on('slideChange', updateIndex);
    }
    return () => {
      if (swiper !== null) {
        (swiper as any).off('slideChange', updateIndex);
      }
    };
  }, [swiper, updateIndex]);

  const handleProductClicked = (productTgid: any) => {
    setTgidClicked((prevTgid: any) =>
      prevTgid != productTgid ? productTgid : null
    );
  };

  const closeDescription = () => {
    setTgidClicked(null);
  };

  const cardPosition = filteredTgids?.indexOf(tgidClicked) + 1;
  const elementId =
    heading?.trim().replace(/\s/g, '-').toLowerCase() || filteredTgids[0];

  useEffect(() => {
    if (!window) return;
    if (tgidClicked && autoScroll)
      scroller.scrollTo(`${carouselId}-${tgidClicked}`, {
        duration: 750,
        delay: 100,
        smooth: 'easeInQuad',
        offset: 100,
      });
    autoScroll = true;
  }, [tgidClicked]);

  if (!filteredTgids?.length) return null;

  return (
    <StyledCategorySlider id={elementId}>
      <Conditional if={heading || description}>
        <div className="content">
          <Conditional if={heading}>
            <h2>{heading}</h2>
          </Conditional>
          <Conditional if={description}>
            <p>{description}</p>
          </Conditional>
        </div>
      </Conditional>
      <div className="slider-wrap">
        <div className="slider-container">
          <Swiper
            {...carouselOptions}
            slidesPerGroup={4}
            onSwiper={updateSwiper}
          >
            {filteredTgids.map((tgid: any, index: number) => {
              return (
                <div key={index} className="swiper-slide">
                  <Product
                    tgid={tgid}
                    productClick={handleProductClicked}
                    allTours={categoryTours}
                    isMobile={isMobile}
                    imageId={tgid}
                    cardIdPrefix={carouselId}
                    isEntertainmentMb={isEntertainmentMb}
                  />
                </div>
              );
            })}
          </Swiper>
        </div>
        <div className="controls">
          {swiper && !(swiper as any).isBeginning ? (
            <div
              className="swiper-btn btn btn-left"
              role="button"
              tabIndex={0}
              onClick={goPrev}
            >
              {CHEVRON_LEFT}
            </div>
          ) : null}
          {swiper && !(swiper as any).isEnd ? (
            <div
              className="swiper-btn btn btn-right"
              onClick={goNext}
              tabIndex={0}
              role="button"
            >
              {CHEVRON_LEFT}
            </div>
          ) : null}
        </div>
      </div>
      <div className="slider-product-description">
        <Conditional if={tgidClicked}>
          <DetailedProductCard
            tgidClicked={tgidClicked}
            key={carouselId}
            hasCategoryTourList={hasCategoryTourList}
            allTours={categoryTours}
            isMobile={isMobile}
            isEntertainmentMb={isEntertainmentMb}
            currentLanguage={currentLanguage}
            uid={uid}
            cardPosition={cardPosition - currentIndex}
            closeDescription={closeDescription}
          />
        </Conditional>
      </div>
    </StyledCategorySlider>
  );
};

CategorySlider.defaultProps = {
  carouselOptions: {
    direction: 'horizontal',
    speed: 650,
    slidesPerView: 4,
    spaceBetween: 24,
    navigaton: {
      nextEl: '.swiper-btn.btn-left',
      prevEl: '.swiper-btn.btn-right',
    },
  },
};

export default CategorySlider;
