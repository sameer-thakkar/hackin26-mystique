import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import LongForm from 'components/common/LongForm';
import Image from 'UI/Image';
import { generateSidenavId } from 'utils/helper';
import { getPoiTimingsInfo } from 'utils/parsers/poi';
import renderShortCodes from 'utils/shortCodes';
import { appAtom } from 'store/atoms/app';
import {
  getLocalizedQuarters,
  SHOULDER_TIMINGS_SCALE_TYPES,
} from 'const/index';
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
  TabsContainer,
  TimingNotes,
  TimingsTableTabsViewContainer,
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
  const poiName = poiInfo?.content?.data?.name ?? poiInfo?.name;

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
            id={generateSidenavId(`${poiName} ${strings.CONTENT_PAGE.TIMINGS}`)}
          >
            {poiName}
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
          <TimingsTableTabsView
            isMobile={isMobile}
            imageUrl={featuredImage?.url}
            timingsTableData={timingsInfo.timingTablesData}
            imageAltText={featuredImage?.alt}
            lang={language}
          />

          <TimingNotes
            dangerouslySetInnerHTML={{
              __html: poiInfo?.content?.data?.timingNotes || '',
            }}
          />
        </Conditional>
        <Conditional if={childTimingsInfo?.length}>
          {childTimingsInfo
            ?.filter((childTiming) => childTiming.timingTablesData?.length)
            .map((childTiming, index) => {
              const childPoiInfo = childPoisInfo?.[index] || {};
              const childPoiName = childPoiInfo?.name;
              return (
                <>
                  <BestTimeHeader
                    id={generateSidenavId(
                      `${childPoiName} ${strings.CONTENT_PAGE.TIMINGS}`
                    )}
                  >
                    {childPoiName}
                  </BestTimeHeader>
                  <SectionDescription
                    dangerouslySetInnerHTML={{
                      __html: childPoiInfo.content?.data?.timingDescription,
                    }}
                  />
                  <TimingsTableTabsView
                    isMobile={isMobile}
                    imageUrl={childPoiInfo.collectionInfo?.heroImageUrl}
                    timingsTableData={childTiming.timingTablesData}
                    imageAltText={
                      childPoiInfo.collectionInfo?.heroMedia?.metadata?.altText
                    }
                    lang={language}
                  />
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
      <Conditional if={poiName && (weekInfoExists || yearInfoExists)}>
        <PageContainer>
          <BestTimeHeader
            id={generateSidenavId(
              `${strings.CONTENT_PAGE.BEST_TIME_TO_VISIT} ${poiName}`
            )}
          >
            {strings.CONTENT_PAGE.BEST_TIME_TO_VISIT} {poiName}
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

const groupTablesByQuarter = ({
  timingsTableData,
  localizedQuarters,
}: {
  timingsTableData: any[];
  localizedQuarters: ReturnType<typeof getLocalizedQuarters>;
}) => {
  const { JAN_MAR, APR_JUN, JUL_SEP, OCT_DEC } = localizedQuarters;
  const tablesByQuarter: Record<string, any> = {
    [JAN_MAR]: [],
    [APR_JUN]: [],
    [JUL_SEP]: [],
    [OCT_DEC]: [],
  };

  timingsTableData.forEach((tableData) => {
    const quarters = tableData.columns[0].quarters;
    quarters?.forEach((quarterLabel: string) => {
      if (quarterLabel in tablesByQuarter) {
        tablesByQuarter[quarterLabel].push(tableData);
      }
    });
  });

  return tablesByQuarter;
};

const TimingsTableTabsView = ({
  timingsTableData,
  isMobile,
  imageUrl,
  imageAltText,
  lang,
}: {
  timingsTableData: any;
  isMobile: boolean;
  imageUrl?: string;
  imageAltText?: string;
  lang: string;
}) => {
  const localizedQuarters = getLocalizedQuarters(lang);
  const [activeQuarter, setActiveQuarter] = useState<string>(
    localizedQuarters.JAN_MAR
  );

  const tablesByQuarter = groupTablesByQuarter({
    timingsTableData,
    localizedQuarters,
  });

  const totalTables = timingsTableData.length;

  // Remove empty quarters
  Object.keys(tablesByQuarter).forEach((key) => {
    if (tablesByQuarter[key].length === 0) {
      delete tablesByQuarter[key];
    }
  });

  return (
    <TimingsTableTabsViewContainer>
      <Conditional if={totalTables > 1}>
        <TabsContainer>
          {Object.keys(tablesByQuarter).map(
            (quarterLabel: string, index: number) => (
              <div
                onClick={() => setActiveQuarter(quarterLabel)}
                className={`tab ${quarterLabel === activeQuarter && 'active'}`}
                key={index}
                role="tab"
                tabIndex={index}
              >
                {quarterLabel}
              </div>
            )
          )}
          <div className={`tab tab-extra`} role="tab"></div>
        </TabsContainer>
      </Conditional>

      <TimingTablesContainer>
        <div className="tables">
          {tablesByQuarter[activeQuarter]?.map(
            (tableData: ITimingsTableProps, index: number) => (
              <TimingsTable
                key={index}
                initiallyCollapsed={!imageUrl}
                rows={tableData.rows}
                columns={tableData.columns}
                isMobile={isMobile}
                hideCollapse={!isMobile && !!imageUrl}
              />
            )
          )}
        </div>

        <Conditional if={imageUrl}>
          <Image
            width={isMobile ? 327 : 384}
            height={isMobile ? 184 : 306}
            url={imageUrl ?? ''}
            alt={imageAltText ?? ''}
          />
        </Conditional>
      </TimingTablesContainer>
    </TimingsTableTabsViewContainer>
  );
};

export default TimingsPage;
