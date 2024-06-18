export type TItineraryViewSwitchComponentProps = {
  viewMode?: ItineraryViewMode;
  onChangeViewMode?: (mode: ItineraryViewMode) => void;
};

export enum ItineraryViewMode {
  MAP = 'map',
  TIMELINE = 'timeline',
}
