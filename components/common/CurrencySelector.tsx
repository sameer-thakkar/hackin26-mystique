import React from 'react';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import DropdownSelector from 'components/common/DropdownSelector';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { currencyAtom } from 'store/atoms/currency';
import { metaAtom } from 'store/atoms/meta';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

const CurrencySelector = ({ currencies }: any) => {
  const [activeCurrency, setCurrency] = useRecoilState(currencyAtom);
  const router = useRouter();
  const pageMetaData = useRecoilValue(metaAtom);

  const trackDropdownShown = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPDOWN_SHOWN,
      [ANALYTICS_PROPERTIES.HEADER]: getDisplayCurrencyString({
        currencyObj: currencies.find(
          ({ code }: any) => code === activeCurrency
        ),
      }),
      ...getCommonEventMetaData(pageMetaData),
    });
  };

  const trackCurrencyChange = (option: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_CURRENCY_CHANGED,
      [ANALYTICS_PROPERTIES.CURRENCY]: option.value,
    });
  };

  const getDisplayCurrencyString = ({ currencyObj, full = false }: any) => {
    const { currencyName, localSymbol, code } = currencyObj ?? {};
    const finalLocalSymbol = localSymbol === code ? '' : localSymbol;
    return full
      ? `${currencyName} (${finalLocalSymbol}${code})`
      : `${finalLocalSymbol ? finalLocalSymbol + ' ' : ''}${code}`;
  };
  const options = currencies.map((currency: any) => {
    return {
      label: getDisplayCurrencyString({ currencyObj: currency, full: true }),
      value: currency.code,
      activeLabel: getDisplayCurrencyString({
        currencyObj: currency,
      }),
    };
  });

  const handleChange = (option: any) => {
    setCurrency(option.value);
    trackCurrencyChange(option);

    // push to the back of callstack, ensures currencyCode cookie is set.
    setTimeout(router.reload);
  };

  if (!activeCurrency) return null;

  return (
    <DropdownSelector
      currentValue={options.find((opt: any) => opt.value === activeCurrency)}
      onChange={handleChange}
      options={options}
      onShowDropdown={trackDropdownShown}
    />
  );
};

export default CurrencySelector;
