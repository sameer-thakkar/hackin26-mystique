import type { ChangeEvent } from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import Conditional from 'components/common/Conditional';
import type { TItineraryViewSwitchComponentProps } from 'components/common/Itinerary/ItineraryViewSwitch/interface';
import { ItineraryViewMode } from 'components/common/Itinerary/ItineraryViewSwitch/interface';
import {
  StyledItineraryViewSwitchContainer,
  StyledToggleSwitch,
} from 'components/common/Itinerary/ItineraryViewSwitch/styles';
import { strings } from 'const/strings';
import ListToMap from 'assets/listToMap';
import MapToList from 'assets/mapToList';

const ItineraryViewSwitch = ({
  viewMode = ItineraryViewMode.TIMELINE,
  onChangeViewMode,
}: TItineraryViewSwitchComponentProps) => {
  const [activeViewMode, setActiveViewMode] = useState(viewMode);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const mode = e.target.checked
      ? ItineraryViewMode.MAP
      : ItineraryViewMode.TIMELINE;
    setActiveViewMode(mode);
    onChangeViewMode?.(mode);
  };

  const checked = activeViewMode === ItineraryViewMode.MAP;

  return (
    <StyledItineraryViewSwitchContainer>
      <span className={classNames('label timeline', !checked && 'active')}>
        {strings.ITINERARY.TIMELINE_VIEW}
      </span>
      <StyledToggleSwitch $isChecked={checked}>
        <input
          className="input-element"
          type="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <div className="slider">
          <div className="icon-container">
            <Conditional if={checked}>
              <div className="icon">
                <ListToMap />
              </div>
            </Conditional>
            <Conditional if={!checked}>
              <div className="icon">
                <MapToList />
              </div>
            </Conditional>
          </div>
        </div>
      </StyledToggleSwitch>
      <span className={classNames('label map', checked && 'active')}>
        {strings.ITINERARY.MAP_VIEW}
      </span>
    </StyledItineraryViewSwitchContainer>
  );
};

export default ItineraryViewSwitch;
