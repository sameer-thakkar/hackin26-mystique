import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { MBContext } from 'contexts/MBContext';
import { currencyAtom } from 'store/atoms/currency';
import { priceSelector } from 'store/selectors/price';
import { appAtom } from 'store/atoms/app';
import Drawer from 'components/common/Drawer';
import SwipeableTabs, {
  Panel,
  Tab,
  TabControl,
} from 'components/common/SwipeableTabs';
import RadioList, { RadioItemArg } from 'components/common/RadioList';
import Conditional from 'components/common/Conditional';
import { GlobeIcon } from 'assets/SvgIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CURRENCY_CODES_ORDER,
  LOCALE_ORDER,
  TOP_CURRENCIES,
} from 'const/index';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { strings } from 'const/strings';
import { getLangObject } from 'utils/helper';
import { convertUidToUrl } from 'utils/urlUtils';
import { sendVariableToDataLayer, trackEvent } from 'utils/analytics';

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
      border-radius: 2;
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
  ${({ $isActive }) =>
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
}) => {
  const { uid, host, isDev } = useContext(MBContext);
  const menuItemRef = useRef(null);
  const currentTabInView = useRef({ trackingLabel: '' });
  const trackerRef = useRef({
    requestedAt: new Date().getTime(),
    tracked: false,
    isManual: false,
  });
  const { state, contents } = useRecoilValueLoadable(priceSelector);
  const { initialCurrency } = useRecoilValue(appAtom);
  const [isDrawerActive, setDrawerActive] = useState(false);
  const [activeCurrency, setCurrency] = useRecoilState(currencyAtom);
  const getLanguageURL = ({ code }) => {
    return convertUidToUrl({
      uid,
      hostname: host,
      lang: code,
      isDev,
    });
  };
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

  useEffect(() => {
    const { requestedAt, tracked, isManual } = trackerRef.current ?? {};
    const useSSRPrice = state === 'hasValue' ? contents.useSSRPrice : true;

    if (state === 'hasValue' && !useSSRPrice && !tracked && requestedAt) {
      trackerRef.current.tracked = true;
      trackEvent({
        eventName: ANALYTICS_EVENTS.LOCALE_PRICE_LOADED,
        [ANALYTICS_PROPERTIES.LOAD_TIME]:
          new Date().getTime() - trackerRef.current.requestedAt,
        [ANALYTICS_PROPERTIES.CURRENCY]: activeCurrency,
        [ANALYTICS_PROPERTIES.TRIGGERED_BY]: isManual
          ? 'Manual Currency Change'
          : 'Page Reload',
      });
    }
  }, [state, activeCurrency]);

  const getCurrentTabInView = () => currentTabInView.current.trackingLabel;

  const onLocaleSelectorClick = () => {
    setDrawerActive(!isDrawerActive);
    trackEvent({
      eventName: ANALYTICS_EVENTS.LOCALE_CLICKED,
    });
  };

  const onTabView = ({ trackingLabel }) => {
    currentTabInView.current.trackingLabel = trackingLabel;
    trackEvent({
      eventName: ANALYTICS_EVENTS.LOCALE_POPUP_VIEWED,
      [ANALYTICS_PROPERTIES.OPTION_TYPE]: trackingLabel,
    });
  };

  const onLanguageChange = ({ code }: RadioItemArg) => {
    window.location.href = getLanguageURL({ code });
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
  };

  let tabsArray = [];
  if (hasCurrencySelector) {
    tabsArray.push({
      body: (
        <RadioList
          onChange={onCurrencyChange}
          currentValue={activeCurrency}
          items={(sortedCurrencies ?? []).map((c) => ({
            label: `${c.currencyName} (${c.code})`,
            value: c.code,
            ...c,
          }))}
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
              <StyledLink
                onClick={(e) => {
                  e.preventDefault();
                }}
                href={l.code !== currentLanguage ? getLanguageURL(l) : null}
              >
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
      <IconWrapper $isActive={isDrawerActive} onClick={onLocaleSelectorClick}>
        <GlobeIcon />
      </IconWrapper>
      <Conditional if={isDrawerActive}>
        <Drawer
          $drawerStyles={drawerStyles}
          noMargin
          closeHandler={trackedOnClose}
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
