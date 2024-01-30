import React, { useContext, useEffect } from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import { NO_OF_CARDS_IN_ROW } from 'components/MicrositeV2/PopulateProducts';
import InteractionContext from 'contexts/Interaction';
import { MBContext } from 'contexts/MBContext';
import { addUrlParams } from 'utils/urlUtils';
import { DESCRIPTORS, DESIGN, PAGETYPE } from 'const/index';

const DetailedProductCard = dynamic(
  () =>
    import(
      /* webpackChunkName: "DetailedProductCard" */ './DetailedProductCard/index'
    )
);
const V3DetailedProductCard = dynamic(
  () => import(/* webpackChunkName: "V3DetailedProductCard" */ '../Product')
);

const Product = dynamic(
  /* webpackChunkName: "V2ProductCard" */ () =>
    import('components/MicrositeV2/Product')
);

const ProductsRow = styled.div<{ isV3Design: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 24px;
  grid-row-gap: 24px;
  max-width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: ${({ isV3Design }) =>
      `repeat(${isV3Design ? 1 : 2}, 1fr)`};
    grid-column-gap: 16px;
  }
`;

export const RowComponent = (props: any) => {
  const {
    isMobile,
    tgidsSubArr,
    allTours,
    hasCategoryTourList,
    isEntertainmentMb,
    currentLanguage,
    host,
    uid,
    sectionId,
    isListicle,
    isDev,
    sectionIndex,
  } = props;
  // @ts-expect-error TS(2339): Property 'activeCategoryId' does not exist on type... Remove this comment to see the full error message
  const { activeCategoryId, activeTour, clickTour, closeTour } =
    useContext(InteractionContext) || {};
  const { design } = useContext(MBContext);
  const isV3Design = design === DESIGN.V3;
  const router = useRouter();

  // For Mobile each section has 4 cards, so only 1 section can be in viewport. on dweb at max two rows can be on viewport on load.
  const shouldLazyLoad = isMobile ? sectionIndex >= 1 : sectionIndex >= 2;

  const {
    tgid: activeTgid,
    section: activeSection,
    autoScroll,
  } = activeTour || {};

  const totalPreviousCardRendered =
    sectionIndex *
    (isMobile ? NO_OF_CARDS_IN_ROW.MOBILE : NO_OF_CARDS_IN_ROW.DESKTOP);

  const getDescriptors = (
    descriptors: Record<string, any>[],
    { minDuration, maxDuration }: any
  ) => {
    const allDescriptors = descriptors?.map((item) => item.code);
    if (minDuration & maxDuration) {
      allDescriptors.push(DESCRIPTORS.DURATION);
    }
    return allDescriptors;
  };

  const getV3DetailedCard = (tgid: any, index: number) => {
    const currTour = allTours[tgid];
    if (!currTour) return null;
    const {
      title,
      listingPrice,
      secondaryDescriptors,
      highlights,
      primaryCategory,
      primaryCollection,
      primarySubCategory,
      minDuration,
      maxDuration,
      combo,
      multiVariant,
      productImage,
    } = currTour;
    return (
      <V3DetailedProductCard
        key={tgid}
        tgid={tgid}
        uid={uid}
        currentLanguage={currentLanguage}
        title={title}
        descriptors={getDescriptors(secondaryDescriptors, {
          minDuration,
          maxDuration,
        })}
        isScratchPriceEnabled
        scorpioData={{
          highlights,
          minDuration,
          maxDuration,
          multiVariant,
          combo,
          imageUrl: isMobile ? productImage : '',
        }}
        host={host}
        showCard={tgid === activeTgid}
        primaryCategory={primaryCategory}
        primaryCollection={primaryCollection}
        primarySubCategory={primarySubCategory}
        indexPosition={totalPreviousCardRendered + index}
        isMobile={isMobile}
        isV3Design={isV3Design}
        position={totalPreviousCardRendered + (index + 1)}
        tourPrices={{ [tgid]: { listingPrice } }}
      />
    );
  };

  const handleProductClicked = (productTgid: any, event: any) => {
    if (event.type === 'keydown') {
      event.target.blur();
      return;
    }
    if (isMobile) {
      if (isV3Design) {
        clickTour(productTgid, false, sectionId, false);
        addUrlParams({
          urlParams: { ...router.query, pid: productTgid, popup: 'details' },
          historyState: {
            ...window.history.state,
            pid: productTgid,
            popup: 'details',
          },
          replace: false,
        });
      } else {
        props.changePage({
          name: PAGETYPE.MOBILE_PRODUCT_PAGE,
          tgid: productTgid,
        });
      }
    } else {
      clickTour(productTgid, false, sectionId);
    }
  };

  const closeDescription = () => {
    closeTour();
  };

  useEffect(() => {
    if (!window) return;
    if (activeTgid && autoScroll)
      scroller.scrollTo(`${activeSection}-${activeTgid}`, {
        duration: 750,
        delay: 80,
        smooth: 'easeInQuad',
        offset: 45,
      });
  }, [activeTgid]);

  return (
    <LazyComponent target={shouldLazyLoad ? 'USER' : 'NONE'}>
      <>
        <ProductsRow isV3Design={isV3Design}>
          {tgidsSubArr.map((tgid: any, index: number) => (
            <Product
              tgid={tgid}
              productClick={handleProductClicked}
              isEntertainmentMb={isEntertainmentMb}
              allTours={allTours}
              isMobile={isMobile}
              key={index}
              cardIdPrefix={sectionId}
              activeCategoryId={activeCategoryId}
              host={host}
              uid={uid}
              isV3Design={isV3Design}
            />
          ))}
          <Conditional if={!isEntertainmentMb && !isV3Design}>
            {tgidsSubArr.map((tgid: any, index: number) => (
              <DetailedProductCard
                showDescCard={tgid === activeTgid}
                tgidClicked={tgid}
                allTours={allTours}
                hasCategoryTourList={hasCategoryTourList}
                isEntertainmentMb={isEntertainmentMb}
                currentLanguage={currentLanguage}
                host={host}
                uid={uid}
                key={tgid}
                cardPosition={index + 1}
                closeDescription={closeDescription}
                isListicle={isListicle}
                isDev={isDev}
                cardRanking={totalPreviousCardRendered + (index + 1)}
              />
            ))}
          </Conditional>
        </ProductsRow>
        <Conditional if={isV3Design}>
          {tgidsSubArr.map((tgid: any, index: number) => {
            return getV3DetailedCard(tgid, index);
          })}
        </Conditional>
      </>
    </LazyComponent>
  );
};
