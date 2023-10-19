import React, { useEffect, useMemo, useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import {
  CurrencySelectorWrapper,
  StyledSearchBox,
} from 'components/common/LocalePopover/currencySelectorMobile/styles';
import {
  IcurrencyMapkeyType,
  ICurrencySelectorMobile,
} from 'components/common/LocalePopover/interface';
import RadioList from 'components/common/RadioList';
import { getCurrencyOptionsMobile } from 'utils/localeSelectorUtlis';
import { POPULAR_CURRENCIES } from 'const/localeSelectorConstants';
import { strings } from 'const/strings';
import { SEARCH_ICON } from 'assets/SvgIcons';

function CurrencySelectorMobile({
  onCurrencyChange,
  activeCurrency,
  sortedCurrencies = [],
}: ICurrencySelectorMobile) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  const lowerCaseSearchQuery = searchQuery.toLowerCase() || '';

  const currencyMap = useMemo(() => {
    return getCurrencyOptionsMobile(sortedCurrencies, lowerCaseSearchQuery);
  }, [searchQuery]);

  const getListItems = (item: IcurrencyMapkeyType) => {
    const data = (currencyMap[item] ?? [])?.map((currency) => {
      return {
        label: `${currency.currencyName}`,
        value: currency.code,
        ...currency,
      };
    });
    return data || [];
  };

  return (
    <>
      <StyledSearchBox isDarkMode={false}>
        <input
          ref={inputRef}
          type="text"
          placeholder={strings.SEARCH}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.currentTarget.value);
          }}
        />
        <div className="input-icon">{SEARCH_ICON}</div>
      </StyledSearchBox>
      {Object.keys(currencyMap || {})?.map((item) => {
        return (
          <Conditional
            key={item}
            if={currencyMap?.[item as IcurrencyMapkeyType]?.length}
          >
            <CurrencySelectorWrapper>
              <div className="header">
                {item === POPULAR_CURRENCIES
                  ? strings.POPULAR_CURRENCIES
                  : strings.MORE_CURRENCIES}
              </div>
              <RadioList
                onChange={onCurrencyChange}
                // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string'.
                currentValue={activeCurrency}
                isCurrencyLabel={true}
                items={getListItems(item as IcurrencyMapkeyType)}
              />
            </CurrencySelectorWrapper>
          </Conditional>
        );
      })}
    </>
  );
}

export default CurrencySelectorMobile;
