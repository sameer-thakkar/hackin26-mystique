import { useEffect, useRef, useState } from 'react';
import type Plyr from 'plyr';
import { TVideoPlayerProps } from 'components/common/VideoPlayer/interface';
import { TitleBar, VideoContainer } from 'components/common/VideoPlayer/styles';
import Button from 'UI/Button';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import WhiteCrossArrow from 'assets/whiteCrossArrow';
import 'plyr/dist/plyr.css';

const VideoPlayer: React.FC<React.PropsWithChildren<TVideoPlayerProps>> = ({
  videoUrl,
  videoTitle,
  closePlayer,
  className = '',
  showMuteControls = false,
  playPauseThreshold = 1,
  tgid,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerState, setPlayerState] = useState(-1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [_, setHidePlayButton] = useState(false);
  const [isPlayerReady, setReady] = useState(false);

  const ref = useRef<HTMLVideoElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const plyr = useRef<Plyr>();
  const containerRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen({
    ref: containerRef,
    options: { threshold: playPauseThreshold },
  });

  useEffect(() => {
    if (!ref.current || plyr.current) return;
    const initialisePlyr = async () => {
      let controls = [
        'play',
        'play-large',
        'current-time',
        'progress',
        'duration',
        'fullscreen',
      ];

      if (showMuteControls)
        controls = [
          ...controls.slice(0, controls.length - 1),
          'mute',
          controls[controls.length - 1],
        ];

      const Plyr = await require('plyr');
      const player: Plyr = new Plyr(ref.current, {
        fullscreen: { fallback: false, iosNative: false },
        autoplay: true,
        muted: false,
        controls,
      });
      plyr.current = player;
      setReady(true);

      player.source = {
        type: 'video',
        sources: [
          {
            src: videoUrl,
          },
        ],
      };
    };

    initialisePlyr();
  }, [ref]);

  useEffect(() => {
    const player = plyr.current;

    if (!player || !isPlayerReady) return;

    player?.on('statechange', ({ detail: { code } }) => setPlayerState(code));

    player?.once('controlsshown', () => {
      const timeline = document.querySelector<HTMLInputElement>(
        'input[data-plyr="seek"]'
      );
      if (timeline) {
        timeline.onmousedown = () => setIsSeeking(true);
        timeline.ontouchstart = () => setIsSeeking(true);
        timeline.onmouseup = () => setIsSeeking(false);
        timeline.ontouchend = () => setIsSeeking(false);
      }
    });

    const onHideControls = () => {
      setHidePlayButton(true);
    };
    const onShowControls = () => {
      setHidePlayButton(false);
    };
    const playerButton = playButtonRef.current;

    playerButton?.addEventListener('touchstart', onHideControls);
    playerButton?.addEventListener('touchmove', onHideControls);
    playerButton?.addEventListener('touchend', onShowControls);

    return () => {
      if (!player) return;

      player.off('statechange', ({ detail: { code } }) => setPlayerState(code));

      playerButton?.removeEventListener('touchstart', onHideControls);
      playerButton?.removeEventListener('touchmove', onHideControls);
      playerButton?.removeEventListener('touchend', onShowControls);
    };
  }, [isPlayerReady]);

  useEffect(() => {
    let videoViewed = {
      '10': false,
      '25': false,
      '50': false,
      '75': false,
      '90': false,
      '100': false,
    };

    const interval = setInterval(() => {
      if (!plyr.current || !plyr.current.currentTime || !plyr.current.playing)
        return;

      const { currentTime, duration } = plyr.current;

      const percentageViewed = (currentTime * 100) / duration;
      const lastVideoViewed = { ...videoViewed };

      for (let index = 0; index < Object.keys(videoViewed).length; index++) {
        const currentTrackPercent = Object.keys(videoViewed)[
          index
        ] as keyof typeof videoViewed;
        if (videoViewed[currentTrackPercent]) continue;

        if (percentageViewed >= Number(currentTrackPercent)) {
          lastVideoViewed[currentTrackPercent] = true;
        } else break;
      }

      Object.keys(lastVideoViewed).forEach((key) => {
        const isRecorded = videoViewed[key as keyof typeof videoViewed];
        if (!isRecorded && lastVideoViewed[key as keyof typeof videoViewed])
          trackEvent({
            eventName: ANALYTICS_EVENTS.YT_VIDEO_VIEWED,
            [ANALYTICS_PROPERTIES.PERCENTAGE_VIEWED]: key,
            [ANALYTICS_PROPERTIES.TGID]: tgid,
          });
      });

      videoViewed = lastVideoViewed;
    }, 5000);

    return () => clearInterval(interval);
  }, [plyr.current]);

  useEffect(() => {
    if (!plyr.current) return;
    const seeking = isSeeking || plyr.current.seeking;
    if ((playerState === 2 || playerState === 0) && !seeking) {
      const { enabled, active, exit } = plyr.current.fullscreen;
      if (enabled && active) exit();
      setIsPlaying(false);
    } else if (playerState === 1) {
      if (!isPlaying) setIsPlaying(true);
    }

    return () => {
      setIsPlaying(true);
    };
  }, [playerState, isSeeking, plyr]);

  useEffect(() => {
    if (!plyr.current || !playPauseThreshold) return;

    if (isOnScreen) plyr.current.play();
    else plyr.current.pause();
  }, [plyr, isOnScreen, playPauseThreshold]);

  return (
    <VideoContainer
      className={`${className} plyr-container`}
      ref={containerRef}
    >
      {(videoTitle || closePlayer) && (
        <TitleBar>
          {videoTitle && <h3>{videoTitle}</h3>}
          {closePlayer && (
            <Button onClick={closePlayer}>{WhiteCrossArrow}</Button>
          )}
        </TitleBar>
      )}

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={ref} />
    </VideoContainer>
  );
};

export default VideoPlayer;
