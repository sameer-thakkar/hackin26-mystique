import { useRecoilState } from 'recoil';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { MinusIcon, PlusIcon } from 'assets/airportTransfers/searchUnitSVGs';
import { privateTransferPaxState } from '../state';
import {
  CoreNumberPicker,
  PaxItemContainer,
  PaxSelectionContainer,
} from './style';

export const AIRPORT_TRANSFERS_MAX_PAX = 20;

export const PaxSelection = () => {
  const [pax, setPax] = useRecoilState(privateTransferPaxState);

  const handlePaxChange = (value: number) => {
    setPax(value);

    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_PAX_UPDATED,
      [ANALYTICS_PROPERTIES.PAX_COUNT]: value,
    });
  };

  return (
    <PaxSelectionContainer>
      <PaxItem
        value={pax}
        setValue={handlePaxChange}
        label={strings.AIRPORT_TRANSFER.GUESTS}
        description=""
        min={1}
        max={AIRPORT_TRANSFERS_MAX_PAX}
      />
    </PaxSelectionContainer>
  );
};

const PaxItem = ({
  value,
  label,
  description,
  min,
  max,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
  label: string;
  description: string;
  min: number;
  max: number;
}) => {
  const isMinDisabled = value <= min;

  const isMaxDisabled = value >= max;

  const handleIncrement = () => {
    if (!isMaxDisabled) {
      setValue(value + 1);
    }
  };

  const handleDecrement = () => {
    if (!isMinDisabled) {
      setValue(value - 1);
    }
  };

  return (
    <PaxItemContainer data-qa-marker="pax-item">
      <div>
        <p className="label">{label}</p>
        <div className="pax-description">{description}</div>
      </div>

      <CoreNumberPicker className="core-number-picker">
        <button
          className={`action-handle`}
          data-qa-marker="decrement-button"
          onClick={handleDecrement}
          disabled={isMinDisabled}
          aria-disabled={isMinDisabled}
          aria-label="Decrease value"
        >
          <MinusIcon disabled={isMinDisabled} />
        </button>

        <p className="value">{value}</p>

        <button
          data-qa-marker="increment-button"
          className={`action-handle`}
          onClick={handleIncrement}
          aria-label="Increase value"
          aria-disabled={isMaxDisabled}
        >
          <PlusIcon disabled={isMaxDisabled} />
        </button>
      </CoreNumberPicker>
    </PaxItemContainer>
  );
};
