import { IIconScaleType } from 'components/ShoulderPages/interface';
import { SHOULDER_TIMINGS_SCALE_ICONS_VALUES } from 'utils/contentPageUtils';
import { longDaytoShort, longMonthtoShort } from 'utils/dateUtils';
import {
  SHOULDER_TIMINGS_SCALE_LEGENDS,
  SHOULDER_TIMINGS_SCALE_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import { Legend, Row, StyledContainer, Tile } from './styles';

const IconScale = ({ values = {}, type, lang }: IIconScaleType) => {
  return (
    <StyledContainer>
      <Row>
        {Object.entries(values)?.map(
          ([label, val], index) =>
            SHOULDER_TIMINGS_SCALE_ICONS_VALUES[val] && (
              <Tile key={index}>
                <p>
                  {type == SHOULDER_TIMINGS_SCALE_TYPES.week
                    ? longDaytoShort({ fullWeekday: label, lang })
                    : longMonthtoShort({ fullMonth: label, lang })}
                </p>
                {SHOULDER_TIMINGS_SCALE_ICONS_VALUES[val]?.()}
              </Tile>
            )
        )}
      </Row>
      <Row id="timings-scale-legends">
        {SHOULDER_TIMINGS_SCALE_LEGENDS[type]
          // remove unused legend elements
          .filter((legend) =>
            Object.values(values)?.some((value) => value == legend)
          )
          .map((legend) => (
            <Legend key={legend}>
              {SHOULDER_TIMINGS_SCALE_ICONS_VALUES[legend]?.()}
              {
                strings.CONTENT_PAGE[
                  legend as keyof typeof strings.CONTENT_PAGE
                ]
              }
            </Legend>
          ))}
      </Row>
    </StyledContainer>
  );
};

export default IconScale;
