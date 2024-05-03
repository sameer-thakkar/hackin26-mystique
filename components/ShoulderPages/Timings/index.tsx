import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import LongForm from 'components/common/LongForm';
import Image from 'UI/Image';
import { IImageProps } from 'UI/Image/interface';
import { generateSidenavId } from 'utils/helper';
import { getPoiTimingsInfo } from 'utils/parsers/poi';
import renderShortCodes from 'utils/shortCodes';
import { appAtom } from 'store/atoms/app';
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
  SectionDescription,
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
  childPoisInfo,
  automatedBreadcrumbsExists,
  extractedPrismicBreadcrumbs,
  extractedProductCardsSlice,
  parentProps,
  featuredImage,
}: ITimingsPageProps) => {
  const { featured_title: featuredTitle } = data;
  const renderedFeaturedTitle = renderShortCodes(featuredTitle)?.join?.('');
  const { language } = useRecoilValue(appAtom);
  const timingsInfo = getPoiTimingsInfo(poiInfo, language);
  const childTimingsInfo = childPoisInfo?.map((childPoi) =>
    getPoiTimingsInfo(childPoi, language)
  );
  const weekInfoExists = Object.keys(
    poiInfo?.bestTimeToVisit?.week || {}
  ).length;
  const yearInfoExists = Object.keys(
    poiInfo?.bestTimeToVisit?.year || {}
  ).length;
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
              `${poiInfo?.name} ${strings.CONTENT_PAGE.TIMINGS}`
            )}
          >
            {poiInfo?.name}
          </BestTimeHeader>
          <SectionDescription
            dangerouslySetInnerHTML={{
              __html: poiInfo?.content?.data?.timingDescription,
            }}
          />
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
                    initiallyCollapsed={index !== 0}
                    rows={tableData.rows}
                    columns={tableData.columns}
                    isMobile={isMobile}
                    hideCollapse={!isMobile && !!featuredImage?.url}
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
          <TimingNotes
            dangerouslySetInnerHTML={{
              __html: poiInfo?.content?.data?.timingNotes || '',
            }}
          />
        </Conditional>
        <Conditional if={childTimingsInfo?.length}>
          {childTimingsInfo?.map((childTiming, index) => {
            const childPoiInfo = childPoisInfo?.[index] || {};
            return (
              <>
                <BestTimeHeader
                  id={generateSidenavId(
                    `${childPoiInfo?.name} ${strings.CONTENT_PAGE.TIMINGS}`
                  )}
                >
                  {childPoiInfo.name}
                </BestTimeHeader>
                <SectionDescription
                  dangerouslySetInnerHTML={{
                    __html: childPoiInfo.content?.data?.timingDescription,
                  }}
                />
                <TimingTablesContainer key={index}>
                  <div className="tables">
                    {childTiming.timingTablesData?.map(
                      (tableData: ITimingsTableProps, index: number) => (
                        <TimingsTable
                          key={index}
                          initiallyCollapsed={index !== 0}
                          rows={tableData.rows}
                          columns={tableData.columns}
                          isMobile={isMobile}
                          hideCollapse={
                            !isMobile &&
                            !!childPoiInfo.collectionInfo?.heroImageUrl
                          }
                        />
                      )
                    )}
                  </div>
                  <Conditional if={childPoiInfo.collectionInfo?.heroImageUrl}>
                    <Image
                      width={isMobile ? 327 : 384}
                      height={isMobile ? 184 : 306}
                      url={childPoiInfo.collectionInfo?.heroImageUrl}
                      alt={
                        childPoiInfo.collectionInfo?.heroMedia?.metadata
                          ?.altText
                      }
                    />
                  </Conditional>
                </TimingTablesContainer>
                <TimingNotes
                  dangerouslySetInnerHTML={{
                    __html: childPoiInfo.content?.data?.timingNotes || '',
                  }}
                />
              </>
            );
          })}
        </Conditional>
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
      <Conditional if={poiInfo?.name && (weekInfoExists || yearInfoExists)}>
        <PageContainer>
          <BestTimeHeader
            id={generateSidenavId(
              `${strings.CONTENT_PAGE.BEST_TIME_TO_VISIT} ${poiInfo?.name}`
            )}
          >
            {strings.CONTENT_PAGE.BEST_TIME_TO_VISIT} {poiInfo?.name}
          </BestTimeHeader>
          <Conditional if={weekInfoExists}>
            <BestTimeSubHeader>
              {strings.CONTENT_PAGE.WEEKDAY_VS_WEEKEND}
            </BestTimeSubHeader>
            <SectionDescription
              dangerouslySetInnerHTML={{
                __html:
                  poiInfo?.content?.data?.bestTimeToVisitContent
                    ?.weekdayVsWeekend,
              }}
            />
            <IconScale
              values={poiInfo?.bestTimeToVisit?.week}
              lang={language}
              type={SHOULDER_TIMINGS_SCALE_TYPES.week}
            />
          </Conditional>
          <Conditional if={yearInfoExists}>
            <BestTimeSubHeader>
              {strings.CONTENT_PAGE.PEAK_VS_LOW_SEASON}
            </BestTimeSubHeader>
            <SectionDescription
              dangerouslySetInnerHTML={{
                __html:
                  poiInfo?.content?.data?.bestTimeToVisitContent
                    ?.peakSeasonVsLowSeason,
              }}
            />
            <IconScale
              values={poiInfo?.bestTimeToVisit?.year}
              lang={language}
              type={SHOULDER_TIMINGS_SCALE_TYPES.year}
            />
          </Conditional>
        </PageContainer>
      </Conditional>
    </>
  );
};

export default TimingsPage;
