import { useRecoilValue } from 'recoil';
import type {
  TExtendedItineraryProps,
  TItineraryComponentProps,
} from '@headout/espeon/components/Itinerary';
import { Itinerary as EspeonItinerary } from '@headout/espeon/components/Itinerary';
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
          {...(isBot
            ? {
                portalContainer: portalContainer as HTMLElement,
                usePortal: true,
              }
            : {
                usePortal: false,
                portalContainer: undefined,
              })}
        />
      </div>
    </>
  );
};

export default Itinerary;
