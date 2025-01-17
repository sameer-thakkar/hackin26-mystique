import React, { useEffect, useMemo, useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import {
  CurrencySelectorWrapper,
  StyledCurrencyListContent,
  StyledNoValues,
  StyledSearchBox,
} from 'components/common/LocalePopover/currencySelectorMobile/styles';
import {
  IcurrencyMapkeyType,
  ICurrencySelectorMobile,
} from 'components/common/LocalePopover/interface';
import RadioList from 'components/common/RadioList';
import { getCurrencyOptionsMobile } from 'utils/localeSelectorUtlis';
import {
  MORE_CURRENCIES,
  POPULAR_CURRENCIES,
} from 'const/localeSelectorConstants';
import { strings } from 'const/strings';
import SearchIcon from 'assets/searchIcon';

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

  const isCurrenciesEmpty =
    currencyMap[MORE_CURRENCIES]?.length === 0 &&
    currencyMap[POPULAR_CURRENCIES]?.length === 0;

  const isNoBorderBottom =
    searchQuery && currencyMap[MORE_CURRENCIES]?.length ? false : true;

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
          onChange={(e: any) => {
            setSearchQuery(e.currentTarget.value);
          }}
        />
        <div className="input-icon">{SearchIcon}</div>
      </StyledSearchBox>
      <Conditional if={isCurrenciesEmpty}>
        <StyledNoValues>{`${strings.NO_RESULT_FOUND}`}</StyledNoValues>
      </Conditional>
      <Conditional if={!isCurrenciesEmpty}>
        <StyledCurrencyListContent>
          {Object.keys(currencyMap || {})?.map((item) => {
            return (
              <Conditional
                key={item}
                if={currencyMap?.[item as IcurrencyMapkeyType]?.length}
              >
                <CurrencySelectorWrapper $isMarginBottom={!searchQuery}>
                  <Conditional if={!searchQuery}>
                    <div className="header">
                      {item === POPULAR_CURRENCIES
                        ? strings.POPULAR_CURRENCIES
                        : strings.MORE_CURRENCIES}
                    </div>
                  </Conditional>
                  <RadioList
                    onChange={onCurrencyChange}
                    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string'.
                    currentValue={activeCurrency}
                    isCurrencyLabel={true}
                    items={getListItems(item as IcurrencyMapkeyType)}
                    isNoBorderBottom={
                      item === POPULAR_CURRENCIES && isNoBorderBottom
                    }
                  />
                </CurrencySelectorWrapper>
              </Conditional>
            );
          })}
        </StyledCurrencyListContent>
      </Conditional>
    </>
  );
}

export default CurrencySelectorMobile;
