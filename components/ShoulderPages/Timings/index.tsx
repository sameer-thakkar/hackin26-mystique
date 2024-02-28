import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import LongForm from 'components/common/LongForm';
import Image from 'UI/Image';
import { IImageProps } from 'UI/Image/interface';
import { generateSidenavId } from 'utils/helper';
import { getPoiTimingsInfo } from 'utils/parsers/poi';
import renderShortCodes from 'utils/shortCodes';
import { SHOULDER_TIMINGS_SCALE_TYPES } from 'const/index';
import { strings } from 'const/strings';
import Banner from '../components/Banner';
import IconScale from '../components/IconScale';
import TimingsTable from '../components/TimingsTable';
import { ITimingsPageProps, ITimingsTableProps } from '../interface';
import {
  BestTimeHeader,
  BestTimeSubHeader,
  PageContainer,
  TimingNotes,
  TimingTablesContainer,
} from './styles';

const Breadcrumbs = dynamic(
  () => import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
);

const TimingsPage = ({
  data,
  breadcrumbs,
  taggedCity,
  primaryCity,
  isMobile,
  poiInfo,
  automatedBreadcrumbsExists,
  extractedPrismicBreadcrumbs,
  extractedProductCardsSlice,
  parentProps,
  featuredImage,
}: ITimingsPageProps) => {
  const { featured_title: featuredTitle } = data;
  const renderedFeaturedTitle = renderShortCodes(featuredTitle)?.join?.('');
  const { poi } = poiInfo || { poi: {} };
  const lang = data?.content_framework?.lang;
  const timingsInfo = getPoiTimingsInfo(poi, lang);
  const weekInfoExists = Object.keys(poi?.bestTimeToVisit?.week || {}).length;
  const yearInfoExists = Object.keys(poi?.bestTimeToVisit?.year || {}).length;
  const PRODUCT_CARDS_LIMIT = 4;

  return (
    <>
      <Banner
        title={renderedFeaturedTitle}
        poiInfo={{
          TODAY: timingsInfo?.today,
          LAST_ADMISSION: timingsInfo?.lastAdmission,
        }}
      />
      <PageContainer>
        <Conditional if={automatedBreadcrumbsExists}>
          <Breadcrumbs
            breadcrumbs={breadcrumbs || {}}
            taggedCity={taggedCity}
            primaryCity={primaryCity}
            isContentPage={true}
            isMobile={isMobile}
            isRevampedShoulderPage
          />
        </Conditional>
        <Conditional if={timingsInfo.timingTablesData?.length}>
          <BestTimeHeader
            id={generateSidenavId(
              `${poiInfo?.poi?.name} ${strings.CONTENT_PAGE.TIMINGS}`
            )}
          >
            {poi?.name}
          </BestTimeHeader>
        </Conditional>
        <Conditional if={extractedPrismicBreadcrumbs?.length}>
          <LongForm content={extractedPrismicBreadcrumbs || []} />
        </Conditional>
        <Conditional if={timingsInfo.timingTablesData?.length}>
          <TimingTablesContainer>
            <div className="tables">
              {timingsInfo.timingTablesData?.map(
                (tableData: ITimingsTableProps, index: number) => (
                  <TimingsTable
                    key={index}
                    rows={tableData.rows}
                    columns={tableData.columns}
                    isMobile={isMobile}
                  />
                )
              )}
            </div>
            <Conditional if={featuredImage?.url}>
              <Image
                width={isMobile ? 327 : 384}
                height={isMobile ? 184 : 306}
                {...(featuredImage as IImageProps)}
              />
            </Conditional>
          </TimingTablesContainer>
        </Conditional>
        <TimingNotes
          dangerouslySetInnerHTML={{
            __html: poi?.content?.data?.timingNotes || '',
          }}
        />
      </PageContainer>
      <Conditional if={extractedProductCardsSlice?.length}>
        <LongForm
          content={extractedProductCardsSlice || []}
          {...parentProps}
          categoryTourListData={{
            ...parentProps.categoryTourListData,
            productCardsLimit: PRODUCT_CARDS_LIMIT,
          }}
        />
      </Conditional>
      <Conditional if={poi?.name && (weekInfoExists || yearInfoExists)}>
        <PageContainer>
          <BestTimeHeader
            id={generateSidenavId(
              `${strings.CONTENT_PAGE.BEST_TIME_TO_VISIT} ${poi?.name}`
            )}
          >
            {strings.CONTENT_PAGE.BEST_TIME_TO_VISIT} {poi?.name}
          </BestTimeHeader>
          <Conditional if={weekInfoExists}>
            <BestTimeSubHeader>
              {strings.CONTENT_PAGE.WEEKDAY_VS_WEEKEND}
            </BestTimeSubHeader>
            <IconScale
              values={poi?.bestTimeToVisit?.week}
              lang={lang}
              type={SHOULDER_TIMINGS_SCALE_TYPES.week}
            />
          </Conditional>
          <Conditional if={yearInfoExists}>
            <BestTimeSubHeader>
              {strings.CONTENT_PAGE.PEAK_VS_LOW_SEASON}
            </BestTimeSubHeader>
            <IconScale
              values={poi?.bestTimeToVisit?.year}
              lang={lang}
              type={SHOULDER_TIMINGS_SCALE_TYPES.year}
            />
          </Conditional>
        </PageContainer>
      </Conditional>
    </>
  );
};

export default TimingsPage;
