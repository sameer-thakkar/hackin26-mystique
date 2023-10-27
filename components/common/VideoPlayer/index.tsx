import { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import { TVideoPlayerProps } from 'components/common/VideoPlayer/interface';
import { TitleBar, VideoContainer } from 'components/common/VideoPlayer/styles';
import Button from 'UI/Button';
import { WHITE_CROSS_ARROW } from 'assets/SvgIcons';
import 'plyr/dist/plyr.css';

const VideoPlayer: React.FC<TVideoPlayerProps> = ({
  videoUrl,
  videoTitle,
  closePlayer,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerState, setPlayerState] = useState(-1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [_, setHidePlayButton] = useState(false);

  const ref = useRef<HTMLVideoElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const plyr = useRef<Plyr>();

  useEffect(() => {
    if (!ref.current || plyr.current) return;

    const player = new Plyr(ref.current, {
      fullscreen: { fallback: true, iosNative: false },
      autoplay: true,
      muted: true,
      controls: [
        'play',
        'play-large',
        'current-time',
        'progress',
        'duration',
        'fullscreen',
      ],
    });
    player.source = {
      type: 'video',
      sources: [
        {
          src: videoUrl,
        },
      ],
    };

    player.on('statechange', ({ detail: { code } }) => setPlayerState(code));

    player.once('controlsshown', () => {
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

    plyr.current = player;

    ['touchstart', 'touchmove', 'touchend'].forEach((event) => {
      playButtonRef.current?.addEventListener(event, () => {
        setHidePlayButton(event !== 'touchend');
      });
    });
  }, [ref]);

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

  return (
    <VideoContainer>
      <TitleBar>
        <h3>{videoTitle}</h3>
        <Button onClick={closePlayer}>{WHITE_CROSS_ARROW}</Button>
      </TitleBar>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={ref} />
    </VideoContainer>
  );
};

export default VideoPlayer;
