import { useRef } from 'react';
import classNames from 'classnames';
import { Button, Text } from '@headout/eevee';
import type { TDayTripsVideoPlayerRef } from 'components/DayTripsVideoPlayer';
import DayTripsVideoPlayer from 'components/DayTripsVideoPlayer';
import PlayVideoIcon from 'components/DayTripsVideoPlayer/assets/PlayVideoIcon';
import {
  DayTripsVideoPlayerPlayType,
  DayTripsVideoPlayerSection,
} from 'components/DayTripsVideoPlayer/types';
import { DAY_TRIPS_COLLECTION_MBS_VIDEOS } from 'const/daytrips';
import { strings } from 'const/strings';
import { dayTripsStyles } from './styles';

const DayTripsVideoBannerMobile = ({
  uid,
  collectionId,
}: {
  uid: string;
  collectionId: number;
}) => {
  const styles = dayTripsStyles();
  const videoPlayerRef = useRef<TDayTripsVideoPlayerRef>(null);
  const plyrInstance = useRef<Plyr | null>(null);

  const handleWatchVideoClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (videoPlayerRef.current) {
      videoPlayerRef.current?.handleVideoClick(
        DayTripsVideoPlayerPlayType.BUTTON_CLICK
      );
    }
  };

  const handleVideoPlayerReady = (player: Plyr) => {
    plyrInstance.current = player;
    player.muted = true;
    player.pause();
  };

  const { previewVideo, video1080, thumbnail } =
    DAY_TRIPS_COLLECTION_MBS_VIDEOS[uid] || {};

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerBox}>
        <Text as="span" className={styles.headerDescription}>
          {strings.DAY_TRIPS_BANNER.BANNER_DESCRIPTION_SHORT}
        </Text>
        <div className={classNames(styles.blurCircle, styles.circle1)} />
      </div>
      <div className={styles.videoSection}>
        <DayTripsVideoPlayer
          section={DayTripsVideoPlayerSection.LIST}
          ref={videoPlayerRef}
          onPlayerReady={handleVideoPlayerReady}
          previewVideoUrl={previewVideo}
          videoUrl={video1080}
          thumbnailUrl={thumbnail}
          playPauseThreshold={0.4}
          showPlayButton={false}
          isMobile
          muted
          collectionId={collectionId}
        />
        <Button
          as={'button'}
          className={styles.watchButton}
          btnType="white"
          variant="primary"
          size="small"
          onClick={handleWatchVideoClick}
          primaryText={strings.DAY_TRIPS_BANNER.WATCH_VIDEO}
          iconPosition="leading"
          icon={<PlayVideoIcon height={16} width={16} />}
        />
      </div>
    </div>
  );
};

export default DayTripsVideoBannerMobile;
