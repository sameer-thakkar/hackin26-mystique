import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import PracticalInfoCalendar from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/PracticalInfoCalendar';
import PracticalInfoDistance from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/PracticalInfoDistance';
import PracticalInfoLocation from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/PracticalInfoLocation';
import PracticalInfoOpeningHours from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/PracticalInfoOpeningHours';
import PracticalInfoSeason from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/PracticalInfoSeason';
import { ISettingsContainerProps } from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/interfaces';
import {
  GradientWrapper,
  RichTextContainer,
  SettingsWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import { shortCodeSerializer } from 'utils/shortCodes';
import { SETTINGS_TYPE } from 'const/index';
import { strings } from 'const/strings';

const SettingsOne = ({
  richTextData,
  practicalInfo,
  settingsType,
  overflow,
  text,
  onClickMapLink,
  isMobile,
}: ISettingsContainerProps) => {
  const {
    calendar,
    duration,
    season,
    openingHours,
    location,
    distance,
    findItOnMap,
  } = practicalInfo || {};
  return (
    <SettingsWrapper
      overflow={overflow ? overflow : undefined}
      className="listicle-settings-container"
    >
      <Conditional if={settingsType === SETTINGS_TYPE.SETTINGS_THREE}>
        <Conditional if={calendar}>
          <PracticalInfoCalendar calendar={calendar} isSettingsOne={false} />
        </Conditional>

        <Conditional if={openingHours?.length}>
          <PracticalInfoOpeningHours openingHours={openingHours} />
        </Conditional>

        <Conditional if={season}>
          <PracticalInfoSeason season={season} />
        </Conditional>

        <Conditional if={distance || duration}>
          <PracticalInfoDistance distance={distance} duration={duration} />
        </Conditional>
      </Conditional>

      <Conditional if={settingsType === SETTINGS_TYPE.SETTINGS_TWO}>
        <Conditional if={calendar}>
          <PracticalInfoCalendar calendar={calendar} />
        </Conditional>

        <Conditional if={location}>
          <PracticalInfoLocation
            location={location}
            findItOnMap={findItOnMap}
          />
        </Conditional>

        <Conditional if={openingHours?.length}>
          <PracticalInfoOpeningHours openingHours={openingHours} />
        </Conditional>

        <Conditional if={distance || duration}>
          <PracticalInfoDistance distance={distance} duration={duration} />
        </Conditional>

        <Conditional if={season}>
          <PracticalInfoSeason season={season} />
        </Conditional>
      </Conditional>

      <Conditional
        if={
          settingsType === SETTINGS_TYPE.SETTINGS_ONE ||
          settingsType == SETTINGS_TYPE.SETTINGS_THREE
        }
      >
        <RichTextContainer
          isSettingsOne={settingsType === SETTINGS_TYPE.SETTINGS_ONE}
        >
          <PrismicRichText
            field={richTextData}
            components={shortCodeSerializer}
          />
        </RichTextContainer>
      </Conditional>

      <Conditional if={settingsType === SETTINGS_TYPE.SETTINGS_ONE}>
        <Conditional if={calendar}>
          <PracticalInfoCalendar calendar={calendar} isSettingsOne={true} />
        </Conditional>

        <Conditional if={location}>
          <PracticalInfoLocation
            location={location}
            findItOnMap={findItOnMap}
            onClickMapLink={onClickMapLink}
          />
        </Conditional>

        <Conditional if={openingHours?.length}>
          <PracticalInfoOpeningHours openingHours={openingHours} />
        </Conditional>

        <Conditional if={distance || duration}>
          <PracticalInfoDistance distance={distance} duration={duration} />
        </Conditional>

        <Conditional if={season}>
          <PracticalInfoSeason season={season} />
        </Conditional>
      </Conditional>

      <Conditional if={settingsType === SETTINGS_TYPE.SETTINGS_TWO}>
        <RichTextContainer isSettingsOne={false}>
          <PrismicRichText
            field={richTextData}
            components={shortCodeSerializer}
          />
        </RichTextContainer>
      </Conditional>

      <Conditional if={settingsType === SETTINGS_TYPE.SETTINGS_THREE}>
        <Conditional if={location}>
          <PracticalInfoLocation
            location={location}
            findItOnMap={findItOnMap}
            isSettingsThree={true}
          />
        </Conditional>
      </Conditional>

      <Conditional if={text === strings.READ_MORE && isMobile}>
        <GradientWrapper />
      </Conditional>
    </SettingsWrapper>
  );
};

export default SettingsOne;
