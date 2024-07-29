import { createContext, useContext, useState } from 'react';
import { ItineraryViewMode } from 'components/common/Itinerary/ItineraryViewSwitch/interface';

interface ItineraryContextType {
  activeItineraryStopId: number | null;
  setActiveItineraryStopId: (state: number | null) => void;
  activeStopIndex: number | undefined | null;
  setActiveStopIndex: (state: number | undefined | null) => void;
  isItineraryDetailsSwipeSheetOpen: boolean;
  setIsItineraryDetailsSwipeSheetOpen: (state: boolean) => void;
  itineraryViewMode: ItineraryViewMode;
  setItineraryViewMode: (state: ItineraryViewMode) => void;
}

const itineraryContext = createContext({} as ItineraryContextType);

export const useItinerary = () => useContext(itineraryContext);

export const ItineraryProvider: React.FC<{}> = ({ children }) => {
  const [activeItineraryStopId, setActiveItineraryStopId] = useState<
    number | null
  >(null);
  const [activeStopIndex, setActiveStopIndex] = useState<
    number | undefined | null
  >(null);
  const [
    isItineraryDetailsSwipeSheetOpen,
    setIsItineraryDetailsSwipeSheetOpen,
  ] = useState<boolean>(false);
  const [itineraryViewMode, setItineraryViewMode] = useState<ItineraryViewMode>(
    ItineraryViewMode.TIMELINE
  );

  const { Provider: ItineraryContextProvider } = itineraryContext;

  return (
    <ItineraryContextProvider
      value={{
        activeItineraryStopId,
        setActiveItineraryStopId,
        activeStopIndex,
        setActiveStopIndex,
        isItineraryDetailsSwipeSheetOpen,
        setIsItineraryDetailsSwipeSheetOpen,
        itineraryViewMode,
        setItineraryViewMode,
      }}
    >
      {children}
    </ItineraryContextProvider>
  );
};
