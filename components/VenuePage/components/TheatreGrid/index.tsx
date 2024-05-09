import { useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import { getVerticalImageUrl } from 'components/NewsPage/utils';
import { DrawerOptions } from 'components/ReviewsPage/components/SortByPopup/styles';
import TabWrapper from 'components/slices/TabWrapper';
import Image from 'UI/Image';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { convertUidToUrl } from 'utils/urlUtils';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import RightArrow from 'assets/rightArrow';
import SEATS from 'assets/seats';
import STARS_GROUP from 'assets/starsGroup';
import THEATRE_LOCATION from 'assets/theatreLocation';
import Chips from '../Chips';
import { TGridUi, TTheatreChips, TTheatreGrid } from './interface';
import {
  Cell,
  ChipsWrapper,
  DrawerStyles,
  ImageWrapper,
  MoreDetailsCta,
  NowPlaying,
  SeatingInfo,
  SeatsInfo,
  Separator,
  TheatreAddress,
  TheatreInfo,
  TheatreMetaInfo,
  Wrapper,
} from './styles';

const TheatreGrid = ({ data, hostname, language, isMobile }: TTheatreGrid) => {
  if (data?.length > 1) {
    const tabsArray = data.map((groupData: Record<string, any>) => {
      const { groupName, theatresData, showPageDocuments } = groupData ?? {};
      return {
        heading: groupData.groupName,
        children: (
          <GridUI
            heading={groupName}
            theatresData={theatresData}
            showPageDocuments={showPageDocuments}
            hostname={hostname}
            language={language}
            isMobile={isMobile}
          />
        ),
      };
    });

    return (
      <TabWrapper
        tabElements={tabsArray}
        renderTabElements
        jumpscroll
        makeTabElementsCrawlable
      />
    );
  }

  return (
    <GridUI
      heading={data[0]?.groupName}
      theatresData={data[0]?.theatresData}
      showPageDocuments={data[0]?.showPageDocuments}
      isMobile={isMobile}
      hostname={hostname}
      language={language}
    />
  );
};

export const OptionJSX = ({
  mediaData,
  nowPlayingShows,
  showPageDocuments,
  hostname,
  language,
}: TTheatreChips) => {
  const { VIEW_DETAILS } = strings;
  return (
    <ul>
      {nowPlayingShows?.map((show: any, index: number) => {
        const showId = show?.id;
        const showPageUid = showPageDocuments?.find((showData: any) => {
          return showData?.data?.tgid == showId;
        })?.uid;

        const showPageUrl = convertUidToUrl({
          uid: showPageUid,
          hostname,
          lang: getHeadoutLanguagecode(language),
        });
        const verticalImageUrl = getVerticalImageUrl(
          mediaData?.resourceEntityMedias,
          showId
        );

        return (
          <div className="show-list-item" key={index}>
            <Image
              url={verticalImageUrl}
              height={57}
              width={38}
              alt={show.name}
            />
            <div className="show-details">
              <span> {show.name}</span>
              <a href={showPageUrl} target="_blank" rel="noreferrer">
                {VIEW_DETAILS}
                {RightArrow}
              </a>
            </div>
          </div>
        );
      })}
    </ul>
  );
};

const TheatreChips = ({
  nowPlayingShows,
  showPageDocuments,
  hostname,
  language,
  isMobile,
  mediaData,
}: TTheatreChips) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const cellRef = useRef(null);
  const { THEATRE_PAGE } = strings;
  const { NOW_PLAYING } = THEATRE_PAGE;

  useCaptureClickOutside(
    cellRef,
    () => {
      setShowDrawer(false);
      setShowTooltip(false);
    },
    []
  );

  return (
    <>
      <ChipsWrapper ref={cellRef}>
        {nowPlayingShows?.map((show, index) => {
          const nowPlayingShowTgid = show?.id;
          const showPageUid = showPageDocuments?.find((showData) => {
            return showData?.data?.tgid == nowPlayingShowTgid;
          })?.uid;

          const showPageUrl = convertUidToUrl({
            uid: showPageUid,
            hostname,
            lang: getHeadoutLanguagecode(language),
          });

          return (
            <Chips
              key={index}
              nowPlayingShows={nowPlayingShows}
              index={index}
              nowPlayingShowTgid={nowPlayingShowTgid}
              isMobile={isMobile}
              setShowDrawer={setShowDrawer}
              setShowTooltip={setShowTooltip}
              showTooltip={showTooltip}
              mediaData={mediaData}
              showPageUrl={showPageUrl}
              showName={show.name}
              hostname={hostname}
              showPageDocuments={showPageDocuments}
              language={language}
            />
          );
        })}
      </ChipsWrapper>
      <Conditional if={showDrawer && isMobile}>
        <Drawer
          $drawerStyles={DrawerStyles}
          heading={NOW_PLAYING}
          closeHandler={() => setShowDrawer(false)}
          container={cellRef.current}
        >
          <DrawerOptions>
            <OptionJSX
              mediaData={mediaData}
              hostname={hostname}
              showPageDocuments={showPageDocuments}
              language={language}
              nowPlayingShows={nowPlayingShows}
              isMobile={isMobile}
            />
          </DrawerOptions>
        </Drawer>
      </Conditional>
    </>
  );
};

const GridUI = ({
  theatresData,
  showPageDocuments,
  hostname,
  language,
  isMobile,
}: TGridUi) => {
  const { THEATRE_LANDING_PAGE, THEATRE_PAGE, MORE_DETAILS } = strings;
  const { CAPACITY, SEAT_PLAN } = THEATRE_LANDING_PAGE;
  const { NOW_PLAYING } = THEATRE_PAGE;

  const handleMoreDetailsCTAClick = (heading: string, theatreName: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.THEATRE_PAGE.THEATRE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'More Details',
      [ANALYTICS_PROPERTIES.SECTION]: heading,
      [ANALYTICS_PROPERTIES.THEATRE_NAME]: theatreName,
    });
  };

  const handleTheatreAddressClick = (theatreName: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.THEATRE_PAGE.THEATRE_ADDRESS_CLICKED,
      [ANALYTICS_PROPERTIES.THEATRE_NAME]: theatreName,
    });
  };

  const handleViewSeatingPlanCTAClick = (theatreName: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.THEATRE_PAGE.THEATRE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'View Seating Plan',
      [ANALYTICS_PROPERTIES.SECTION]: 'Theatre Card',
      [ANALYTICS_PROPERTIES.THEATRE_NAME]: theatreName,
    });
  };

  return (
    <>
      <Wrapper>
        {theatresData?.map((theatre) => {
          const {
            theatreName,
            theatreImage,
            seatingCapacity,
            seatingPageLink,
            theatreLocation,
            theatreLocationCta,
            nowPlayingShows,
            uid,
            mediaData,
          } = theatre ?? {};
          const theatreUrl = convertUidToUrl({
            uid,
            lang: getHeadoutLanguagecode(language),
            hostname,
          });

          return (
            <Cell key={uid}>
              <ImageWrapper>
                <Image
                  url={theatreImage}
                  height={isMobile ? 153 : 163}
                  width={isMobile ? 327 : 384}
                  alt={theatreName}
                />
              </ImageWrapper>
              <TheatreInfo>
                <h3>{theatreName}</h3>
                <TheatreMetaInfo>
                  <SeatingInfo>
                    <Conditional if={seatingCapacity}>
                      <SEATS />
                      <SeatsInfo>
                        <p>
                          {strings.formatString(CAPACITY, seatingCapacity || 0)}
                        </p>
                        <Conditional if={seatingPageLink}>
                          <a
                            href={seatingPageLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() =>
                              handleViewSeatingPlanCTAClick(theatreName)
                            }
                          >
                            {SEAT_PLAN}
                          </a>
                        </Conditional>
                      </SeatsInfo>
                    </Conditional>
                  </SeatingInfo>
                  <Conditional if={theatreLocationCta && theatreLocation}>
                    <TheatreAddress>
                      <div className="icon">
                        <THEATRE_LOCATION />
                      </div>

                      <a
                        href={theatreLocationCta}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleTheatreAddressClick(theatreName)}
                      >
                        <u>{theatreLocation}</u>
                      </a>
                    </TheatreAddress>
                  </Conditional>
                </TheatreMetaInfo>
                <Conditional if={nowPlayingShows?.length > 0}>
                  <NowPlaying>
                    <Separator />
                    <h3>
                      {NOW_PLAYING.toUpperCase()} <STARS_GROUP />
                    </h3>
                    <TheatreChips
                      showPageDocuments={showPageDocuments}
                      nowPlayingShows={nowPlayingShows}
                      hostname={hostname}
                      language={language}
                      isMobile={isMobile}
                      mediaData={mediaData}
                    />
                  </NowPlaying>
                </Conditional>
                <MoreDetailsCta
                  href={theatreUrl}
                  target="_blank"
                  onClick={() =>
                    handleMoreDetailsCTAClick('Theatre Card', theatreName)
                  }
                >
                  {MORE_DETAILS}
                </MoreDetailsCta>
              </TheatreInfo>
            </Cell>
          );
        })}
      </Wrapper>
    </>
  );
};

export default TheatreGrid;
