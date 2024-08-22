import Image from 'UI/Image';
import { strings } from 'const/strings';
import { LegendMarker } from 'assets/legendMarker';
import { ICONS } from '../constants';
import { LegendContainer, LegendItem } from './styles';

const Legend = () => {
  return (
    <LegendContainer>
      <LegendItem>
        <LegendMarker />
        <span className="icon-text">{strings.CRUISES.BOARDING_POINTS}</span>
      </LegendItem>
      <LegendItem>
        <Image
          url={ICONS.PASS_BY}
          alt="legend-attraction-item"
          height={24}
          width={24}
        />
        <span className="icon-text">{strings.CRUISES.LANDMARKS}</span>
      </LegendItem>
    </LegendContainer>
  );
};

export default Legend;
