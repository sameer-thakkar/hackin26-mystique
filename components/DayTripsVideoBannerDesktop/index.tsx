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
import VideoMask from './assets/VideoMask';
import { dayTripsStyles } from './styles';

const DayTripsVideoBannerDesktop = ({
  uid,
  collectionId,
}: {
  uid: string;
  collectionId: number;
}) => {
  const styles = dayTripsStyles();
  const videoPlayerRef = useRef<TDayTripsVideoPlayerRef>(null);

  const handleWatchVideoClick = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.handleVideoClick(
        DayTripsVideoPlayerPlayType.BUTTON_CLICK
      );
    }
  };

  const handleVideoPlayerReady = (player: Plyr) => {
    player.muted = true;
    player.pause();
  };

  const { previewVideo, video1080, thumbnail } =
    DAY_TRIPS_COLLECTION_MBS_VIDEOS[uid] || {};

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Text as="h2" className={styles.title}>
          {strings.DAY_TRIPS_BANNER.BANNER_TITLE}
        </Text>
        <Text as="p" className={styles.description}>
          {strings.DAY_TRIPS_BANNER.BANNER_DESCRIPTION}
        </Text>
        <Button
          as={'button'}
          className={styles.watchButton}
          btnType="black"
          variant="primary"
          size="medium"
          primaryText={strings.DAY_TRIPS_BANNER.WATCH_VIDEO}
          onClick={handleWatchVideoClick}
          iconPosition="leading"
          icon={<PlayVideoIcon height={16} width={16} />}
        />
      </div>
      <div className={styles.videoSection}>
        <div className={styles.mask}>
          <VideoMask />
        </div>
        <DayTripsVideoPlayer
          section={DayTripsVideoPlayerSection.LIST}
          ref={videoPlayerRef}
          previewVideoUrl={previewVideo}
          videoUrl={video1080}
          thumbnailUrl={thumbnail}
          height={331}
          playPauseThreshold={0.4}
          showPlayButton
          muted
          onPlayerReady={handleVideoPlayerReady}
          collectionId={collectionId}
        />
      </div>
      <div className={classNames(styles.blurCircle, styles.circle1)} />
      <div className={classNames(styles.blurCircle, styles.circle2)} />
    </div>
  );
};

export default DayTripsVideoBannerDesktop;
