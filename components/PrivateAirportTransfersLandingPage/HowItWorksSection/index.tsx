import ListicleSectionV2 from 'components/slices/ListicleSectionV2';
import { useTrackElementView } from 'hooks/useTrackElementView';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { ListicleSectionStyleOverrides } from './style';

export const HowItWorksSection = ({
  listicleSectionSlice,
}: {
  listicleSectionSlice: Record<string, any>;
}) => {
  const {
    primary: { listicle_title, listicle_type, settings_type },
    slices,
  } = listicleSectionSlice;

  const ref = useTrackElementView({
    eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
    properties: {
      [ANALYTICS_PROPERTIES.SECTION]: 'How It Works',
      [ANALYTICS_PROPERTIES.RANKING]: 1,
    },
  });

  return (
    <ListicleSectionStyleOverrides ref={ref}>
      <ListicleSectionV2
        settings={settings_type}
        title={listicle_title}
        type={listicle_type?.toLowerCase()}
        childSlices={slices}
        prismicDocsForListicle={[]}
        collectionsInListicles={[]}
      />
    </ListicleSectionStyleOverrides>
  );
};
