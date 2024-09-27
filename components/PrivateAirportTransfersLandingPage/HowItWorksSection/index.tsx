import ListicleSectionV2 from 'components/slices/ListicleSectionV2';
import { useTrackElementView } from 'hooks/useTrackElementView';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { ListicleSectionStyleOverrides } from './style';

export const HowItWorksSection = ({
  listicleSectionSlice,
}: {
  listicleSectionSlice: Record<string, any>;
}) => {
  const { primary, slices } = listicleSectionSlice ?? {};

  const { listicle_title, listicle_type, settings_type } = primary ?? {};

  const ref = useTrackElementView({
    eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
    properties: {
      [ANALYTICS_PROPERTIES.SECTION]: 'How It Works',
      [ANALYTICS_PROPERTIES.RANKING]: 1,
    },
  });

  if (!listicleSectionSlice) {
    return null;
  }

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
