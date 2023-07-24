import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import CurrencySelector from 'components/common/CurrencySelector';
import Drawer from 'components/common/Drawer';
import LanguageSelector from 'components/common/LanguageSelector';
import RadioList, { RadioItemArg } from 'components/common/RadioList';
import SwipeableTabs, {
  Panel,
  Tab,
  TabControl,
} from 'components/common/SwipeableTabs';
import { sendVariableToDataLayer, trackEvent } from 'utils/analytics';
import { getLocalisedCurrencySymbol } from 'utils/currency';
import { getLangObject } from 'utils/helper';
import { appAtom } from 'store/atoms/app';
import { currencyAtom } from 'store/atoms/currency';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CURRENCY_CODES_ORDER,
  LOCALE_ORDER,
  TOP_CURRENCIES,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { GlobeIcon } from 'assets/SvgIcons';

const DrawerTabHeading = styled.div`
  ${expandFontToken(FONTS.SUBHEADING_LARGE)}
  text-decoration: none;
  cursor: pointer;
  padding-top: 12px;
  color: inherit;
  @media (max-width: 768px) {
  }
`;

const drawerStyles = css`
  .close-icon {
    position: absolute;
    top: 2px;
    right: 14px;
    cursor: pointer;
    padding: 14px;
  }
  ${TabControl} {
    padding: 0 24px;
  }
  ${Panel} {
    padding: 0 24px;
    max-height: calc(444px - 70px);
    overflow-y: scroll;
    :after {
      height: 10px;
      content: '';
      display: block;
    }
    ::-webkit-scrollbar {
      width: 2px;
    }
    ::-webkit-scrollbar-track {
      /* box-shadow: inset 0 0 2px transparent; */
      border-radius: 2px;
    }
    ::-webkit-scrollbar-thumb {
      background: ${COLORS.GRAY.G4};
      border-radius: 5px;
    }
  }
  @media (max-width: 768px) {
    .close-icon {
      top: 24px;
    }
    ${Panel} {
      padding: 0 24px;
      max-height: calc(100vh - 152px);
      overflow-y: scroll;
      &:after {
        height: 50px;
        display: block;
        content: '';
      }
    }
    ${TabControl} {
      padding: 0 24px 0 12px;
    }
    ${Tab} {
      margin: 0 12px;
    }
  }
`;

const StyledLink = styled.a`
  color: inherit;
`;

const IconWrapper = styled.div`
  padding: 10px 12px;
  display: flex;
  border-radius: 4px;
  cursor: pointer;
  ${({
    // @ts-expect-error TS(2339): Property '$isActive' does not exist on type 'Pick<... Remove this comment to see the full error message
    $isActive,
  }) =>
    $isActive &&
    `
    background: ${COLORS.GRAY.G8};
  `}
  svg {
    height: 20px;
    width: 20px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    border-radius: 100px;
  }
`;

const LocaleSelector = ({
  languages,
  currencies,
  currentLanguage,
  hasLanguageDropdown = true,
  hasCurrencySelector = true,
  isMobile = false,
}: any) => {
  const menuItemRef = useRef(null);
  const router = useRouter();
  const currentTabInView = useRef({ trackingLabel: '' });
  const trackerRef = useRef({
    requestedAt: new Date().getTime(),
    tracked: false,
    isManual: false,
  });
  const { initialCurrency } = useRecoilValue(appAtom);
  const [isDrawerActive, setDrawerActive] = useState(false);
  const [activeCurrency, setCurrency] = useRecoilState(currencyAtom);
  const sortedCurrencies = useMemo(() => {
    const finalTopCurrencies = TOP_CURRENCIES.filter(
      (c) => initialCurrency !== c
    );
    const orderedCurrencies = Array.from(
      new Set([activeCurrency, ...finalTopCurrencies, ...CURRENCY_CODES_ORDER])
    );
    const currenciesShallowClone = [...currencies];
    return currenciesShallowClone.sort(
      (cA, cB) =>
        orderedCurrencies.indexOf(cA.code) - orderedCurrencies.indexOf(cB.code)
    );
  }, [currencies, activeCurrency]);

  const sortedLanguages = useMemo(() => {
    const orderedLocales = Array.from(
      new Set([getLangObject(currentLanguage).code, ...LOCALE_ORDER])
    );
    const languagesShallowClone = [...languages];

    return languagesShallowClone.sort(
      (lA, lB) =>
        orderedLocales.indexOf(lA.code) - orderedLocales.indexOf(lB.code)
    );
  }, [languages]);

  const getCurrentTabInView = () => currentTabInView.current.trackingLabel;

  const onLocaleSelectorClick = () => {
    setDrawerActive(!isDrawerActive);
    trackEvent({
      eventName: ANALYTICS_EVENTS.LOCALE_CLICKED,
    });
  };

  const onTabView = ({ trackingLabel }: any) => {
    currentTabInView.current.trackingLabel = trackingLabel;
    trackEvent({
      eventName: ANALYTICS_EVENTS.LOCALE_POPUP_VIEWED,
      [ANALYTICS_PROPERTIES.OPTION_TYPE]: trackingLabel,
    });
  };

  const onLanguageChange = ({ code, url }: RadioItemArg) => {
    window.location.href = url;
    trackEvent({
      eventName: ANALYTICS_EVENTS.LOCALE_OPTION_SELECTED,
      [ANALYTICS_PROPERTIES.OPTION_TYPE]: 'Language',
      [ANALYTICS_PROPERTIES.OPTION_NAME]: code,
    });
    onDrawerClose();
  };

  const trackedOnClose = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.LOCALE_POPUP_CLOSED,
      [ANALYTICS_PROPERTIES.OPTION_TYPE]: getCurrentTabInView(),
    });
    setDrawerActive(false);
  };

  const onDrawerClose = () => {
    setDrawerActive(false);
  };

  const onCurrencyChange = ({ code }: RadioItemArg) => {
    trackerRef.current = {
      requestedAt: new Date().getTime(),
      tracked: false,
      isManual: true,
    };

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.CURRENCY,
      value: code,
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.LOCALE_OPTION_SELECTED,
      [ANALYTICS_PROPERTIES.OPTION_TYPE]: 'Currency',
      [ANALYTICS_PROPERTIES.OPTION_NAME]: code,
    });
    setCurrency(code);
    onDrawerClose();

    // push to the back of callstack, ensures currencyCode cookie is set.
    setTimeout(router.reload);
  };

  if (!isMobile) {
    return (
      <>
        <Conditional if={hasLanguageDropdown}>
          <LanguageSelector
            languages={sortedLanguages}
            currentLanguage={currentLanguage}
            isMobile={isMobile}
          />
        </Conditional>
        <CurrencySelector currencies={sortedCurrencies} />
      </>
    );
  }

  let tabsArray = [];
  if (hasCurrencySelector) {
    tabsArray.push({
      body: (
        <RadioList
          onChange={onCurrencyChange}
          // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string'.
          currentValue={activeCurrency}
          items={(sortedCurrencies ?? []).map((currency) => {
            const { code } = currency;
            const symbolString = getLocalisedCurrencySymbol({
              currencyCode: code,
              currencyDisplay: 'symbol',
              lang: currentLanguage,
            });

            return {
              label: `${currency.currencyName} (${symbolString})`,
              value: currency.code,
              ...currency,
            };
          })}
        />
      ),
      header: <DrawerTabHeading>{strings.CURRENCY}</DrawerTabHeading>,
      trackingLabel: 'Currency',
    });
  }

  if (hasLanguageDropdown && languages?.length > 1) {
    tabsArray.unshift({
      body: (
        <RadioList
          currentValue={currentLanguage}
          onChange={onLanguageChange}
          items={sortedLanguages.map((l) => ({
            label: (
              <StyledLink href={l.code !== currentLanguage ? l.url : null}>
                {getLangObject(l.code).displayName}
              </StyledLink>
            ),
            value: l.code,
            ...l,
          }))}
        />
      ),
      header: <DrawerTabHeading>{strings.LANGUAGE}</DrawerTabHeading>,
      trackingLabel: 'Language',
    });
  }

  if (!tabsArray.length) return null;

  return (
    <>
      <IconWrapper
        className="globe-icon"
        // @ts-expect-error TS(2769): No overload matches this call.
        $isActive={isDrawerActive}
        onClick={onLocaleSelectorClick}
      >
        <GlobeIcon />
      </IconWrapper>
      <Conditional if={isDrawerActive}>
        <Drawer
          $drawerStyles={drawerStyles}
          noMargin
          closeHandler={trackedOnClose}
          // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'HTMLElement... Remove this comment to see the full error message
          container={menuItemRef?.current}
        >
          <SwipeableTabs tabs={tabsArray} onTabView={onTabView} />
        </Drawer>
      </Conditional>
      <div ref={menuItemRef}></div>
    </>
  );
};

export default LocaleSelector;
