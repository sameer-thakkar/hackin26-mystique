import { useEffect, useMemo, useRef, useState } from 'react';
import type { TStopLabelProps } from 'components/common/Itinerary/ItinerarySwipeSheet/components/StopLabel/interface';
import { getStopLabelText } from 'components/common/Itinerary/ItinerarySwipeSheet/components/StopLabel/utils';
import {
  HiddenText,
  Sign,
  SignBackgroundArtifact,
  SignContainer,
  SignText,
  SignTextWrapper,
} from './styles';

const StopLabel = (props: TStopLabelProps) => {
  const labelText = useMemo(() => getStopLabelText(props), [props]);
  const [width, setWidth] = useState(0);
  const hiddenTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hiddenTextRef.current) {
      setWidth(hiddenTextRef.current.offsetWidth);
    }
  }, [labelText]);

  return (
    <>
      <SignContainer>
        <Sign>
          <SignBackgroundArtifact />
          <SignTextWrapper $width={width} $skipAnimation={props.skipAnimation}>
            <SignText>{labelText}</SignText>
          </SignTextWrapper>
        </Sign>
      </SignContainer>
      <HiddenText ref={hiddenTextRef}>{labelText}</HiddenText>
    </>
  );
};

export default StopLabel;
