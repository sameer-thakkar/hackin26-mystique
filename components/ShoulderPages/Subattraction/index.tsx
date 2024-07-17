import { Key, useState } from 'react';
import Modal from 'react-modal';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import LastMinuteFilters from 'components/common/LastMinuteFilters';
import PopulateProducts from 'components/PopulateProducts';
import StaticBanner from 'components/StaticBanner';
import { getBannerAndFooterSubtext, getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getCurrentOperatingSchedule } from 'utils/dateUtils';
import { generateSidenavId } from 'utils/helper';
import { getPoiTimingsInfo } from 'utils/parsers/poi';
import { convertUidToUrl } from 'utils/urlUtils';
import { appAtom } from 'store/atoms/app';
import { currencyAtom } from 'store/atoms/currency';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  MB_CATEGORISATION,
} from 'const/index';
import { strings } from 'const/strings';
import CheckCircle from 'assets/checkCircle';
import CloseIcon from 'assets/closeIcon';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';
import TimingsTable from '../components/TimingsTable';
import { ISubattractionPageProps } from '../interface';
import {
  Arrows,
  ModalContent,
  modalStyles,
  Navigation,
  ParentTicketsTitle,
  ProductContainer,
  Row,
  SwiperWrapper,
} from './styles';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const SWIPER_BREAKPOINTS = {
  500: {
    slidesPerView: 1,
  },
  515: {
    slidesPerView: 1.5,
  },
  650: {
    slidesPerView: 2,
  },
  750: {
    slidesPerView: 2.5,
  },
  1200: {
    slidesPerView: 3,
  },
};

const SubattractionPage = ({
  data = {},
  isMobile,
  poiInfo: parentPoiInfo,
  featuredImage,
  subattractionChildPoiData,
  uid,
}: ISubattractionPageProps) => {
  const [, setActiveSwiperIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const { SUBATTRACTION_TYPE } = MB_CATEGORISATION;
  const { language: lang } = useRecoilValue(appAtom);
  const currency = useRecoilValue(currencyAtom);
  const updateIndex = () => {
    if (isMobile || !swiper) return;
    setActiveSwiperIndex(swiper.realIndex);
  };

  const {
    subattractionParentCollectionData,
    parentLandingPageDocument,
    childTgidsData = {},
    parentTgidsData = {},
    parentTgidsList,
    childTgidsList,
    baseLangCategorisationMetadata,
    collectionData,
  } = data;

  const { uid: parentUID, data: parentData } = parentLandingPageDocument ?? {};
  const {
    banner_and_footer_combinations: parentBannerFooterCombinations,
    is_poi_mb: isPoiMb,
  } = parentData ?? {};

  let { subattraction_type, subattraction_banner_disclaimer } =
    baseLangCategorisationMetadata;

  const swiperParams: SwiperProps = {
    loop: false,
    freeMode: false,
    grabCursor: true,
    onTouchEnd: () => {},
    draggable: true,
    spaceBetween: isMobile ? 16 : 24,
    allowTouchMove: true,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onSlideChange: () => updateIndex(),
    slidesPerView: isMobile ? 1.05 : 1,
  };
  const langCode = getHeadoutLanguagecode(lang);
  const parentProductCards = PopulateProducts({
    asHook: true,
    uncategorizedTours: parentTgidsList.map(({ id }: any) => ({ tgid: id })),
    isMobile,
    forceMobile: true,
    productCardsLimit: 5,
    scorpioData: parentTgidsData,
    uid,
    isPoiMwebCard: true,
    isTicketCard: false,
    isCollectionMB: false,
    hasOffer: false,
    currentLanguage: langCode,
    disableShowingNewCard: true,
    sectionId: 'main',
    hasCategoryTourList: false,
    isEntertainmentMb: false,
    isListicle: false,
    isDiscountedPage: true,
    isSubattraction: true,
    showPopup: true,
    currency,
    showNextAvailable: true,
    enableEarliestAvailability: true,
    horizontalProductCard: true,
  });

  const mappedChildTgidsList = childTgidsList?.map(({ id }: any) => ({
    tgid: id,
  }));
  const [orderedFilteredTours, setOrderedFilteredTours] =
    useState(mappedChildTgidsList);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isTourListFiltered, setIsTourListFiltered] = useState(false);

  const poiInfo =
    subattraction_type === SUBATTRACTION_TYPE.A
      ? parentPoiInfo
      : subattractionChildPoiData;
  const timingsInfo = poiInfo ? getPoiTimingsInfo(poiInfo, lang, true) : null;
  const currentOperatingSchedule = getCurrentOperatingSchedule(
    poiInfo?.operatingSchedules
  );
  const timingsTableData = getPoiTimingsInfo(
    {
      operatingSchedules: [currentOperatingSchedule],
    },
    lang
  )?.timingTablesData?.[0];

  const headerText = data?.heading || data?.featured_title;
  let subHeaderText;
  let headerCollectionData;
  let ratingsInfo;
  let parentTicketsTitle;
  switch (subattraction_type) {
    case SUBATTRACTION_TYPE.A:
      subHeaderText =
        parentPoiInfo?.name &&
        strings.formatString(
          strings.CONTENT_PAGE.INCLUDED_WITH_TICKETS,
          parentPoiInfo?.name
        );
      headerCollectionData = subattractionParentCollectionData;
      ratingsInfo = subattractionParentCollectionData?.ratingsInfo;
      parentTicketsTitle =
        parentPoiInfo?.name && isMobile
          ? strings.CONTENT_PAGE.SELECT_YOUR_EXPERIENCE
          : parentPoiInfo?.name && !isMobile
          ? strings.formatString(
              strings.CONTENT_PAGE.EXPLORE_PARENT_TICKETS,
              parentPoiInfo?.name
            )
          : '';
      break;
    case SUBATTRACTION_TYPE.B:
      subHeaderText =
        parentPoiInfo?.name &&
        strings.formatString(
          strings.CONTENT_PAGE.INCLUDED_WITH_SOME_TICKETS,
          parentPoiInfo?.name
        );
      headerCollectionData = subattractionParentCollectionData;
      ratingsInfo = subattractionParentCollectionData?.ratingsInfo;
      parentTicketsTitle =
        parentPoiInfo?.name &&
        strings.formatString(
          strings.CONTENT_PAGE.EXPLORE_PARENT_TICKETS,
          parentPoiInfo?.name
        );
      break;
    case SUBATTRACTION_TYPE.C:
      headerCollectionData = collectionData?.collection;
      ratingsInfo = collectionData?.collection?.ratingsInfo;
      subattraction_banner_disclaimer = getBannerAndFooterSubtext(
        isPoiMb,
        parentBannerFooterCombinations
      );
      parentTicketsTitle =
        parentPoiInfo?.name &&
        strings.formatString(
          strings.CONTENT_PAGE.EXPLORE_PARENT_TICKETS,
          parentPoiInfo?.name
        );
  }
  const parentUrl = convertUidToUrl({ uid: parentUID, lang: langCode });
  const goNext = () => {
    if (!swiper) return;
    swiper.slideNext();

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: 'Explore All',
      [ANALYTICS_PROPERTIES.DIRECTION]: 'Forward',
    });
  };

  const goPrev = () => {
    if (!swiper) return;
    swiper.slidePrev();

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: 'Explore All',
      [ANALYTICS_PROPERTIES.DIRECTION]: 'Backward',
    });
  };

  const handleSeeAllClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOULDER_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.LABEL]: 'See All',
    });
  };

  const toggleModal = () => setModalIsOpen((prev) => !prev);

  return (
    <>
      <Conditional if={timingsInfo?.today}>
        <Modal
          style={modalStyles(isMobile)}
          onRequestClose={toggleModal}
          isOpen={modalIsOpen}
        >
          <ModalContent>
            <button onClick={toggleModal}>
              <CloseIcon />
            </button>
            <h2>{poiInfo?.name}</h2>
            <h1>{strings.CONTENT_PAGE.OPERATING_HOURS}</h1>
            <div className="divider" />
            <TimingsTable
              isSubattraction
              rows={timingsTableData.rows}
              columns={timingsTableData.columns}
              isMobile={isMobile}
            />
          </ModalContent>
        </Modal>
      </Conditional>
      <StaticBanner
        id={generateSidenavId(headerText)}
        bannerImages={[featuredImage]}
        bannerHeading={headerText}
        bannerSubText={subHeaderText as string}
        bannerSubTextIcon={
          subattraction_type === SUBATTRACTION_TYPE.A
            ? () => <CheckCircle />
            : undefined
        }
        bannerDisclaimerText={subattraction_banner_disclaimer}
        isMobile={isMobile}
        collectionDetails={headerCollectionData}
        ratingsAndReviewsData={ratingsInfo}
        subattractionParentChip={{
          url: parentUrl,
          title: parentPoiInfo?.name,
        }}
        extraPairs={{
          TIMINGS: timingsInfo?.today,
          RECOMMENDED_DURATION: poiInfo?.recommendedDuration,
        }}
        onTimingsClick={toggleModal}
        bannerDescriptors={[]}
        shouldDisplayTrustBoosters={false}
        isNonPoiMB={false}
        isNonPoiCollectionMB={false}
        isHOHORevamp={false}
        isHOHO={false}
        forceMobile
      />
      <Conditional if={mappedChildTgidsList?.length}>
        <Conditional if={isMobile}>
          <LastMinuteFilters
            setOrderedFilteredTours={setOrderedFilteredTours}
            orderedTours={mappedChildTgidsList}
            setProductsLoading={setProductsLoading}
            changeTourListFilterStatus={(state) => {
              if (state !== isTourListFiltered) setIsTourListFiltered(state);
            }}
          />
        </Conditional>
        <PopulateProducts
          currency={currency}
          isMobile={isMobile}
          productCardsLimit={10}
          scorpioData={childTgidsData}
          {...{ [isMobile ? 'isPoiMwebCard' : 'isModifiedProductCard']: true }}
          uncategorizedTours={orderedFilteredTours}
          productsLoading={productsLoading}
          hideHeading
          uid={uid}
          isTicketCard={false}
          isCollectionMB={false}
          hasOffer={false}
          currentLanguage={langCode}
          sectionId={'main'}
          hasCategoryTourList={false}
          isEntertainmentMb={false}
          isListicle={false}
          isDiscountedPage={true}
          showNextAvailable
          enableEarliestAvailability
          disableShowingNewCard
          showPopup
          verticalProductCard
        />
      </Conditional>
      <Conditional if={parentProductCards.length}>
        <SwiperWrapper id={generateSidenavId(parentTicketsTitle)}>
          <Navigation>
            <ParentTicketsTitle>{parentTicketsTitle}</ParentTicketsTitle>
            <Row>
              <Conditional if={parentUrl}>
                <a href={parentUrl} onClick={handleSeeAllClick}>
                  {strings.SEE_ALL}
                </a>
              </Conditional>
              <Conditional if={!isMobile}>
                <Arrows>
                  <LttChevronLeft
                    onClick={goPrev}
                    disabled={swiper?.isBeginning}
                  />
                  <LttChevronRight onClick={goNext} disabled={swiper?.isEnd} />
                </Arrows>
              </Conditional>
            </Row>
          </Navigation>
          <Swiper {...swiperParams} breakpoints={SWIPER_BREAKPOINTS}>
            {parentProductCards.map((Product: any, index: Key) => (
              <ProductContainer key={index}>{Product}</ProductContainer>
            ))}
          </Swiper>
        </SwiperWrapper>
      </Conditional>
    </>
  );
};

export default SubattractionPage;
