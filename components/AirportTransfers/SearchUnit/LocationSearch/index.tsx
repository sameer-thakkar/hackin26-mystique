import { forwardRef, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useWindowWidth } from '@react-hook/window-size';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import Conditional from 'components/common/Conditional';
import { useGooglePlacesSearch } from 'hooks/airportTransfers/useGooglePlacesSearch';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import {
  LocationPinFilledSVG,
  LocationPinSVG,
} from 'assets/airportTransfers/searchUnitSVGs';
import CloseIcon from 'assets/closeIcon';
import { DrawerList, DrawerListItem } from '../BottomDrawer';
import { SelectField } from '../SelectField';
import {
  privateTransferLocationState,
  sharedTransferDirection,
} from '../state';
import { DropdownContainer } from '../style';
import {
  IconWrapper,
  LocationSearchWrapper,
  StyledInput,
  TopText,
} from './style';

export const LocationSearch = forwardRef<
  HTMLDivElement,
  {
    topText: string;
    placeholder: string;
    onValueChange: () => void;
    onClick: () => void;
    inputOnlyMode?: boolean;
    error?: boolean;
    isFocused?: boolean;
  }
>(function LocationSearchWithoutRef(
  {
    topText,
    placeholder,
    onValueChange,
    onClick,
    inputOnlyMode = false,
    error,
    isFocused,
  },
  ref
) {
  const [{ addressText }, setLocationData] = useRecoilState(
    privateTransferLocationState
  );

  const selectedDirection = useRecoilValue(sharedTransferDirection);

  const isMobile = useWindowWidth() < 768;

  const [inputValue, setInputValue] = useState(addressText);

  const { query, setQuery, clearSuggestions, suggestionsData } =
    useGooglePlacesSearch();

  // Clear location data if input is empty
  useEffect(() => {
    if (!inputValue.length && !query.length) {
      setLocationData({ addressText: '', lat: 0, long: 0 });
    }
  }, [inputValue.length, query.length, setLocationData]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (inputOnlyMode || !isMobile) return;

    const isAndroid = /android/i.test(navigator.userAgent);

    // Android pushes up the input field when keyboard is opened, before bringing it back down to the middle
    // This prevents that from happening
    if (isAndroid) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return;
    }

    inputRef.current?.focus();

    setTimeout(() => {
      window?.scrollTo(0, 50);
    }, 100);
  }, []);

  const suggestions = suggestionsData?.map(
    ({ structured_formatting, description }) => ({
      label: structured_formatting.main_text,
      subLabel: structured_formatting.secondary_text,
      value: {
        addressText: description,
      },
    })
  );

  const handleSelect = (addressText: string) => {
    setQuery(addressText, false);

    getGeocode({ address: addressText })
      .then(async (results) => {
        const { lat, lng } = getLatLng(results[0]);

        const locationData = {
          addressText,
          lat,
          long: lng,
        };

        setLocationData(locationData);

        await onValueChange();
        if (suggestionsData) clearSuggestions();

        trackEvent({
          eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_APPLIED,

          [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]:
            selectedDirection === 'TO_AIRPORT'
              ? 'Pickup Location'
              : 'Drop-off Location',
          [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_VALUE]: addressText,
        });
      })
      .catch(() => {
        clearSuggestions();
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setQuery(e.target.value);
  };

  const handleBlur = () => {
    if (!query && !inputValue && addressText) {
      setLocationData({ addressText, lat: 0, long: 0 });
    }
  };

  return (
    <LocationSearchWrapper
      ref={ref}
      onClick={onClick}
      className="location-search-wrapper"
    >
      {inputOnlyMode ? (
        <SelectField
          icon={<LocationPinSVG />}
          placeHolderText={placeholder}
          onClick={onClick}
          isFocused={false}
          value={addressText}
          topLabel=""
          error={error}
        />
      ) : (
        <div className="relative">
          <StyledInput
            ref={inputRef}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            placeholder={placeholder}
            onChange={handleInputChange}
            value={inputOnlyMode ? addressText : query || inputValue}
            data-qa-marker="location-search-input"
            onBlur={handleBlur}
            readOnly={inputOnlyMode}
            $hasError={error}
          />

          <IconWrapper>
            <LocationPinSVG />
          </IconWrapper>

          <TopText $shouldDim={!!query.trim() || !!inputValue}>
            {topText}
          </TopText>

          <Conditional if={query || inputValue}>
            <span className="clear-search-icon">
              <CloseIcon
                onClick={() => {
                  setQuery('');
                  setInputValue('');
                }}
              />
            </span>
          </Conditional>
        </div>
      )}

      <Conditional if={!isMobile && suggestions.length}>
        <DropdownContainer>
          <SuggestionsList
            suggestions={suggestions}
            addressText={addressText}
            onSelect={handleSelect}
          />
        </DropdownContainer>
      </Conditional>

      <Conditional if={isMobile && suggestions.length && !inputOnlyMode}>
        <SuggestionsList
          suggestions={suggestions}
          addressText={addressText}
          onSelect={handleSelect}
        />
      </Conditional>
    </LocationSearchWrapper>
  );
});

const SuggestionsList = ({
  suggestions,
  onSelect,
  addressText,
}: {
  suggestions: {
    label: string;
    subLabel: string;
    value: {
      addressText: string;
    };
  }[];
  addressText: string;
  onSelect: (addressText: string) => void;
}) => (
  <DrawerList>
    {suggestions?.map(({ label, subLabel, value }) => (
      <DrawerListItem
        icon={<LocationPinFilledSVG />}
        key={label}
        title={label}
        subtext={subLabel}
        onClick={() => onSelect(value.addressText)}
        isSelected={value.addressText === addressText}
        data-qa-marker="location-search-option"
      />
    ))}
  </DrawerList>
);
