import { useRecoilValue } from 'recoil';
import type {
  TExtendedItineraryProps,
  TItineraryComponentProps,
} from '@headout/espeon/components/ItineraryV2';
import { ItineraryV2 as EspeonItinerary } from '@headout/espeon/components/ItineraryV2';
import { appAtom } from 'store/atoms/app';
import { strings } from 'const/strings';
import Conditional from '../Conditional';
import { itneraryStylesOverride } from './styles';

const Itinerary = (
  props: Omit<TExtendedItineraryProps<TItineraryComponentProps>, 'showTitle'>
) => {
  const { isHohoItinerary } = props;
  const { isMobile, isBot } = useRecoilValue(appAtom);

  const handleScroll = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  const portalContainer =
    typeof window !== 'undefined'
      ? document.getElementById('itinerary-swipesheet-portal')
      : null;

  return (
    <>
      <Conditional if={!isMobile}>
        <h6
          id="itinerary-section-title"
          data-itinerary-section-title="true"
          data-qa-marker="qaid-itinerary-section-title"
        >
          {isHohoItinerary ? strings.HOHO.ROUTES : strings.ITINERARY.TAB}
        </h6>
      </Conditional>
      <div onScroll={handleScroll} className={itneraryStylesOverride}>
        <EspeonItinerary
          {...props}
          showTitle={false}
          disablePathChange={true}
          mwebPagePadding={16}
          portalContainer={portalContainer as HTMLElement}
          isBot={isBot}
          consumer="mystique"
        />
      </div>
    </>
  );
};

export default Itinerary;
