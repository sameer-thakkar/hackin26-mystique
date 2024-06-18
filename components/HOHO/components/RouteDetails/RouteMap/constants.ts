export const ICONS = {
  default: 'https://cdn-imgix-open.headout.com/itinerary/map/empty-pin.svg',
  passBy:
    'https://cdn-imgix-open.headout.com/itinerary/map/pass-by-landmark.svg',
};

const getIconProps = (url: string, size = [45, 50], anchor = [22, 38]) => ({
  iconUrl: url,
  iconSize: size,
  iconAnchor: anchor,
  popupAnchor: [0, -30],
});

export const iconsSetup = {
  default: getIconProps(ICONS.default),
  passBy: getIconProps(ICONS.passBy, [20, 20], [10, 10]),
};
