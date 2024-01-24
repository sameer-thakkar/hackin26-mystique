import React, { useEffect, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

type IFrameProps = {
  name?: string;
  src: string;
  frameborder?: number | string;
  allow?: string;
  allowfullscreen?: string;
  height?: string;
};

const IFrameContainer = styled.div<{
  $paddingBottom: string | undefined;
}>`
  position: relative;
  padding-bottom: ${({ $paddingBottom }) =>
    $paddingBottom ? $paddingBottom : '56.25%'};
  padding-top: 35px;
  height: 0;
  overflow: hidden;
`;

const StyledIFrame = styled.iframe<{ $border: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height }) => (height ? height : '100%')};
  border: ${({ $border }) => `${$border}px`};
`;

const StyledContainer = styled.div`
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

/**
 *
 * Use the `iframe` shortcode to embed different media (videos, other websites etc.).
 *
 * Example Use:
 *
 * ```js
 * {iframe src="https://www.youtube.com/embed/GrrpLGAD_Y0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope
 * picture-in-picture" allowfullscreen}
 * ```
 *
 */

const IFrame: React.FC<IFrameProps> = ({
  name,
  src,
  frameborder = 0,
  allow = '',
  allowfullscreen = 'false',
  ...otherProps
}) => {
  const [isPlayed, setIsPlayed] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  useEffect(() => {
    if (videoProgress) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.YT_VIDEO_VIEWED,
        [ANALYTICS_PROPERTIES.PERCENT_VIEWED]: `${videoProgress}%`,
      });
    }
  }, [videoProgress]);

  const allowFullScreen = allowfullscreen === 'false' ? false : true;
  if (!src) {
    return null;
  }

  const isYoutube = src.startsWith('https://www.youtube.com');
  const videoIdIncludingParams = src?.split('embed/')?.[1];
  const videoId = videoIdIncludingParams?.split('?')[0];

  const checkVideoProgress = (e: any) => {
    const currentTime = e.target.getCurrentTime();
    const totalDuration = e.target.getDuration();
    const progressPercentage = (currentTime / totalDuration) * 100;
    if (progressPercentage >= 10 && progressPercentage < 25) {
      setVideoProgress(10);
    } else if (progressPercentage >= 25 && progressPercentage < 50) {
      setVideoProgress(25);
    } else if (progressPercentage >= 50 && progressPercentage < 75) {
      setVideoProgress(50);
    } else if (progressPercentage >= 75 && progressPercentage < 90) {
      setVideoProgress(75);
    } else if (progressPercentage >= 90) {
      setVideoProgress(90);
    }
  };

  const trackVideoPlayed = (e: any) => {
    const videoTitle = e?.target?.videoTitle;
    if (!isPlayed) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.YT_VIDEO_PLAYED,
        [ANALYTICS_PROPERTIES.VIDEO_TITLE]: videoTitle,
      });
      setIsPlayed(true);
    }
  };
  const trackVideoLoaded: YouTubeProps['onReady'] = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.YT_VIDEO_LOADED,
    });
  };
  const trackVideoProgress: YouTubeProps['onStateChange'] = (e) => {
    setInterval(() => checkVideoProgress(e), 5000);
  };

  return (
    <>
      <IFrameContainer {...{ $paddingBottom: otherProps.height }}>
        <Conditional if={isYoutube}>
          <StyledContainer>
            <YouTube
              videoId={videoId}
              onReady={trackVideoLoaded}
              onStateChange={trackVideoProgress}
              onPlay={trackVideoPlayed}
            />
          </StyledContainer>
        </Conditional>
        <Conditional if={!isYoutube}>
          <StyledIFrame
            {...(name && { name })}
            src={src}
            allow={allow}
            allowFullScreen={allowFullScreen}
            loading="lazy"
            $border={Number(frameborder)}
            {...otherProps}
          />
        </Conditional>
      </IFrameContainer>
    </>
  );
};

export default IFrame;
