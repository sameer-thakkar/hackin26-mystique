import React, { useState } from 'react';
import styled from 'styled-components';
import { THEMES } from 'constants/index';
import { COLORS, SOLEIL } from 'constants/ui-constants';
import { useRecoilState } from 'recoil';
import { currencyAtom } from 'store/atoms/currency';

const StyledCurrencySelector = styled.div`
  margin-left: 32px;
  position: relative;
  .currency-dropdown a {
    color: #444444;
    text-decoration: none;
  }
  .currency-dropdown {
    display: none;
    position: absolute;
    right: 0;
    top: 50px;
  }
  &:after {
    // this adds white space below the active text,
    // increasing the hover area
    content: '';
    display: block;
    height: 30px;
    position: absolute;
    left: 0;
    width: 200%;
    left: -100%;
  }
  .currency-item {
    display: flex;
    align-items: center;
    border-bottom: 0.5px dotted #d8d8d8;
    background-color: ${({ theme }) => theme.primaryBackground};
    background-color: #fff;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    padding: 10px 25px;
    cursor: pointer;
  }
  .currency-dropdown span {
    color: ${COLORS.FOUR_BLACK};
  }
  .currency-item:hover {
    color: #ec1943;
  }
  .curr {
    transform: translateY(-2px);
    white-space: nowrap;
  }
  .selected-tab {
    color: ${COLORS.RHAPSODY};
  }
  .currency-dropdown-active {
    display: block;
  }
`;

const MobileCurrencySelector = styled.div`
  position: relative;
  margin: 0;
  span {
    text-transform: uppercase;
    padding: 4px; /* increase trigger area */
    padding-left: 12px;
    display: block;
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 14px;
    color: ${({ theme }) => theme.primaryBGText};
  }
  select {
    width: 20px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
`;

const StyledCurrency = styled.span`
  margin-top: 7px;
  font-family: ${SOLEIL.FONT_STACK};
  font-size: 16px;
  color: #545454;
  cursor: pointer;
  transform: translateY(-3px);
  svg {
    margin-right: 6px;
    margin-bottom: -2px;
  }
  ${({ theme }) =>
    theme.theme === THEMES.MIN_BLUE
      ? `
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 4px;
      align-items: center;
      .chevron {
        transform: scale(0.7);
      }
      .chevron::before,
      .chevron::after {
        background-color: ${theme.primaryBGText};
        width: 
      }
    `
      : ``}
  @media (max-width: 768px) {
    display: none;
  }
`;

const CurrencyPlaceholder = styled.div`
  width: 60px;
  background: ${COLORS.CHALK};
  display: block;
  height: 16px;
  margin-left: 32px;
`;

const CurrencySelector = (props) => {
  const {
    currentCurrency,
    isAmp,
    currencies: tempCurrencies,
    isMobile,
  } = props;

  const [isActive, toggleActive] = useState(false);
  const [activeCurrency, setCurrency] = useRecoilState(currencyAtom);
  const currencies = tempCurrencies.map((c) => c?.currency);
  const currencySymbolMap = [...currencies, currentCurrency]?.reduce(
    (acc, currency) => ({
      ...acc,
      [currency?.code]: { ...currency },
    }),
    {}
  );
  const getDisplayCurrencyString = ({ currencyObj, full = false }) =>
    full
      ? `${currencyObj?.currencyName} (${currencyObj?.localSymbol}${currencyObj?.code})`
      : `${currencyObj?.localSymbol} ${currencyObj?.code}`;
  const finalActiveCurrency = activeCurrency || currentCurrency?.code;
  const activeCurrencyObj = currencySymbolMap[finalActiveCurrency];
  const displayCurrency = getDisplayCurrencyString({
    currencyObj: activeCurrencyObj,
  });

  const handleChange = (value) => {
    toggleActive(!isActive);
    setCurrency(value);
  };

  if (!finalActiveCurrency || !activeCurrencyObj?.localSymbol)
    return <CurrencyPlaceholder />;

  if (isMobile) {
    return (
      <MobileCurrencySelector>
        <span>{finalActiveCurrency}</span>
        {isAmp ? (
          <select
            value={finalActiveCurrency}
            onChange={(e) => e.target.blur()}
            onBlur={(e) => handleChange(e?.target?.value)}
            // @ts-ignore
            on="change:AMP.navigateTo(url=event.value)"
            role="button"
            tabIndex={0}
          >
            {currencies.map((currency, index) => {
              return (
                <option value={currency.code} key={index}>
                  {getDisplayCurrencyString({
                    currencyObj: currency,
                    full: true,
                  })}
                </option>
              );
            })}
          </select>
        ) : (
          <select
            value={finalActiveCurrency}
            onChange={(e) => e.target.blur()}
            onBlur={(e) => handleChange(e?.target?.value)}
          >
            {currencies.map((currency, index) => {
              return (
                <option value={currency.code} key={index}>
                  {getDisplayCurrencyString({
                    currencyObj: currency,
                    full: true,
                  })}
                </option>
              );
            })}
          </select>
        )}
      </MobileCurrencySelector>
    );
  }

  return (
    <StyledCurrencySelector
      onMouseEnter={() => toggleActive(true)}
      onMouseLeave={() => toggleActive(false)}
    >
      <StyledCurrency>{displayCurrency}</StyledCurrency>
      <div
        className={`currency-dropdown ${
          isActive ? 'currency-dropdown-active' : ''
        }`}
      >
        {currencies.map((currency, index) => {
          return (
            <div
              className={
                finalActiveCurrency == currency.code ? 'selected-tab' : ''
              }
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => handleChange(currency.code)}
            >
              <div className="currency-item">
                <span className="curr">
                  {getDisplayCurrencyString({
                    currencyObj: currency,
                    full: true,
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </StyledCurrencySelector>
  );
};

export default CurrencySelector;
