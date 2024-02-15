import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import LongForm from 'components/common/LongForm';
import { getRelatedContentPagesUrl } from 'utils/contentPageUtils';
import { getLocalisedPrice } from 'utils/currency';
import { generateSidenavId } from 'utils/helper';
import { getPoiQuickInfo } from 'utils/parsers/poi';
import { currencyListAtom } from 'store/atoms/currencyList';
import { SHOULDER_PAGE_TYPES } from 'const/index';
import { strings } from 'const/strings';
import Banner from '../components/Banner';
import ListMessageBox from '../components/ListMessageBox';
import QuickInfo from '../components/QuickInfo';
import { IAboutPageProps } from '../interface';
import { PageContainer } from './styles';

const Breadcrumbs = dynamic(() =>
  import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
);

const AboutPage = ({
  data,
  featuredImage,
  breadcrumbs,
  taggedCity,
  primaryCity,
  isMobile,
  relatedContentPages,
  poiInfo,
  automatedBreadcrumbsExists,
  extractedBreadcrumbsSlice,
  extractedProductCardsSlice,
  categoryTourListData,
  parentProps,
}: IAboutPageProps) => {
  const { featured_title: featuredTitle } = data;
  const { poi } = poiInfo || { poi: {} };
  const lang = data?.microsite_document_ref?.lang;

  poi.minPrice = getLocalisedPrice({
    price: categoryTourListData?.minPrice,
    currencyCode: categoryTourListData?.activeCurrency?.code,
    currencyList: useRecoilValue(currencyListAtom),
    lang,
  });

  const description = poi?.content?.data?.description?.find?.(
    (desc: Record<string, any>) => desc.type == 'GENERAL'
  )?.description;

  const quickInfo = getPoiQuickInfo(
    {
      ...poi,
      ticketsUID: data?.baseLangMicrositeData?.uid,
    },
    relatedContentPages,
    lang
  );

  const factsCtaLink = getRelatedContentPagesUrl({
    relatedContentPages,
    type: SHOULDER_PAGE_TYPES.FACTS,
    lang,
  });
  const quickInfoCtaLink = getRelatedContentPagesUrl({
    relatedContentPages,
    type: SHOULDER_PAGE_TYPES.PLAN_YOUR_VISIT,
    lang,
  });

  const PRODUCT_CARDS_LIMIT = 4;

  return (
    <>
      <Banner
        imageSrc={featuredImage}
        title={featuredTitle}
        poiInfo={{
          ALSO_KNOWN_AS: poi?.content?.data?.nickname,
          FOUNDED_ON: poi?.yearOpened,
          FOUNDED_BY: poi?.architectedBy,
        }}
        description={description}
      />
      <PageContainer>
        <Conditional if={automatedBreadcrumbsExists}>
          <Breadcrumbs
            breadcrumbs={breadcrumbs || {}}
            taggedCity={taggedCity}
            primaryCity={primaryCity}
            isContentPage={true}
            isMobile={!!isMobile}
            isRevampedShoulderPage
          />
        </Conditional>
        <Conditional if={extractedBreadcrumbsSlice?.length}>
          <LongForm content={extractedBreadcrumbsSlice || []} />
        </Conditional>
        <Conditional if={Object.keys(quickInfo).length}>
          <QuickInfo
            id={generateSidenavId(strings.CONTENT_PAGE.QUICK_INFORMATION)}
            info={quickInfo}
            CTALink={quickInfoCtaLink}
          />
        </Conditional>
        <Conditional if={poi?.content?.data?.facts?.length}>
          <ListMessageBox
            list={poi?.content?.data?.facts?.slice?.(0, 3)}
            CTALink={factsCtaLink}
          />
        </Conditional>
      </PageContainer>
      <Conditional if={extractedProductCardsSlice?.length}>
        <LongForm
          content={extractedProductCardsSlice || []}
          {...parentProps}
          categoryTourListData={{
            ...categoryTourListData,
            productCardsLimit: PRODUCT_CARDS_LIMIT,
          }}
        />
      </Conditional>
    </>
  );
};

export default AboutPage;
