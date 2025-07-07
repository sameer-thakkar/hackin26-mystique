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
  const { isMobile } = useRecoilValue(appAtom);

  const handleScroll = (e: React.UIEvent) => {
    e.stopPropagation();
  };

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
          usePortal={true}
          portalContainer={
            document.getElementById(
              'itinerary-swipesheet-portal'
            ) as HTMLElement
          }
          mwebPagePadding={16}
        />
      </div>
    </>
  );
};

export default Itinerary;
