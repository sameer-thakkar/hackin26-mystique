import { useContext, useEffect, useState } from 'react';
import usePlacesAutoComplete, { getGeocode } from 'use-places-autocomplete';
import { MBContext } from 'contexts/MBContext';

let isScriptLoaded = false;

const embedGoogleMapsScript = () => {
  if (typeof window === 'undefined') return;

  if (document.getElementById('google-maps-script')) return;

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAoWdMfz4yF_CxxVtWK3aYBKP51fm-ivfc&libraries=places&loading=async`;
  script.async = true;
  script.onload = () => {
    isScriptLoaded = true;
  };
  document.body.appendChild(script);
};

embedGoogleMapsScript();

export const useGooglePlacesSearch = () => {
  const { primaryCity } = useContext(MBContext);

  const bounds = useProductCityBounds({
    cityName: primaryCity?.name ?? '',
    countryName: primaryCity?.country?.displayName ?? '',
  });

  const countryCode = primaryCity?.countryCode ?? '';

  const {
    ready,
    value,
    suggestions: { data, loading, status },
    setValue,
    clearSuggestions,
  } = usePlacesAutoComplete({
    initOnMount: !!bounds,
    requestOptions: {
      componentRestrictions: { country: countryCode },
      locationRestriction: bounds,
    },
    debounce: 300,
  });

  const hasNoResults = status === 'ZERO_RESULTS';

  return {
    hasNoResults,
    isLoading: !ready || loading,
    query: value,
    setQuery: setValue,
    clearSuggestions,
    suggestionsData: data,
  };
};

const BOUNDS_PADDING_IN_KM = 50;

const useProductCityBounds = ({
  cityName,
  countryName,
}: {
  cityName: string;
  countryName: string;
}) => {
  const [bounds, setBounds] = useState<google.maps.LatLngBounds>();
  ``;

  useEffect(() => {
    if (!cityName || !countryName) return;

    if (!window.google?.maps) return;
    ``;

    getGeocode({ address: `${cityName}, ${countryName}` }).then((results) => {
      const { geometry } = results[0];
      const { viewport, bounds } = geometry;

      if (bounds) {
        const extendedBounds = extendBounds(bounds, BOUNDS_PADDING_IN_KM);
        setBounds(extendedBounds);
        return;
      }

      const ne = viewport.getNorthEast();
      const sw = viewport.getSouthWest();

      const generatedBounds = new window.google.maps.LatLngBounds(sw, ne);

      const extendedBounds = extendBounds(
        generatedBounds,
        BOUNDS_PADDING_IN_KM
      );

      setBounds(extendedBounds);
    });
    // isScriptLoaded is a dependency because we want window.google and window.google.maps to be defined
  }, [cityName, countryName, isScriptLoaded]);

  return bounds;
};

function extendBounds(bounds: google.maps.LatLngBounds, kilometers: number) {
  function kmToLat(km: number) {
    return km / 111;
  }

  function kmToLng(km: number, latitude: number) {
    return km / (111 * Math.cos(latitude * (Math.PI / 180)));
  }

  // Get the NE and SW points of the bounds
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  // Calculate the new latitude/longitude
  const newNorth = ne.lat() + kmToLat(kilometers);
  const newEast = ne.lng() + kmToLng(kilometers, ne.lat());
  const newSouth = sw.lat() - kmToLat(kilometers);
  const newWest = sw.lng() - kmToLng(kilometers, sw.lat());

  const extendedBounds = new window.google.maps.LatLngBounds(
    new window.google.maps.LatLng(newSouth, newWest),
    new window.google.maps.LatLng(newNorth, newEast)
  );

  return extendedBounds;
}
