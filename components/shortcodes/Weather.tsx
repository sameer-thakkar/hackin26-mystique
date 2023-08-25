import { TrainWrapper } from 'components/shortcodes/styles';
import { SEASON } from 'assets/SvgIcons';

const Weather = () => {
  return <TrainWrapper>{SEASON()}</TrainWrapper>;
};

export default Weather;
