import CityGuide from 'components/CityPageContainer/CityGuide';
import LazyComponent from 'components/common/LazyComponent';
import { useTrackElementView } from 'hooks/useTrackElementView';
import { sentenceCase } from 'utils/stringUtils';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { CityGuideStylesOverrides } from '../style';

export const CityGuideSection = ({
  taggedCity,
  cityGuideData,
  host,
  isDev,
  isMobile,
  currentLanguage,
}: {
  taggedCity: string;
  cityGuideData: any;
  host: string;
  isDev: boolean;
  isMobile: boolean;
  currentLanguage: string;
}) => {
  const ref = useTrackElementView({
    eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
    properties: {
      [ANALYTICS_PROPERTIES.SECTION]: 'City Guide',
      [ANALYTICS_PROPERTIES.RANKING]: 6,
    },
  });

  return (
    <LazyComponent>
      <CityGuideStylesOverrides ref={ref}>
        <CityGuide
          mbCityDisplayName={sentenceCase(taggedCity ?? '')}
          cityGuideData={cityGuideData}
          host={host}
          isDev={isDev}
          isMobile={isMobile}
          lang={currentLanguage}
          shouldTrackView={false}
        />
      </CityGuideStylesOverrides>
    </LazyComponent>
  );
};
