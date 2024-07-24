import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import Cookies from 'js-cookie';
import Conditional from 'components/common/Conditional';
import { ButtonLoader } from 'components/common/LocalePopover/ButtonLoader';
import {
  ILocalePopOverContentSection,
  IPopover,
} from 'components/common/LocalePopover/interface';
import LocalePopOverContent from 'components/common/LocalePopover/LocalePopOverContent';
import {
  StyleContainer,
  StyledButtonWrapper,
  StyledHeaderItem,
  StyledPopOver,
  StyledPopOverContent,
  StyledPopOverHeader,
  StyledPopOverWrapper,
  StyledVerticalDivider,
} from 'components/common/LocalePopover/styles';
import { MBContext } from 'contexts/MBContext';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { getNakedDomain } from 'utils';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { throttle } from 'utils/helper';
import {
  getCurrencyOptions,
  getDisplayCurrencyString,
  getSortedLanguages,
} from 'utils/localeSelectorUtlis';
import { currencyAtom } from 'store/atoms/currency';
import { localeLoaderAtom } from 'store/atoms/localeLoader';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COOKIE,
  IPopularLanguage,
  LANGUAGE_MAP,
  LANGUAGE_MAP_TRANSLATE_CONSTANT,
  LanguagesUnion,
  THEMES,
} from 'const/index';
import {
  CURRENCY,
  LANGUAGE,
  MORE_CURRENCIES,
  POPULAR_CURRENCIES,
} from 'const/localeSelectorConstants';
import { strings } from 'const/strings';
import Globe from 'assets/globe';
import GlobeIcon from 'assets/globeIcon';

function PopOver(props: IPopover) {
  const {
    currencies = [],
    languages = [],
    currentLanguage,
    isDarkMode,
    hasLanguageDropdown,
    hasCurrencySelector,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const [activeCurrency, setCurrency] = useRecoilState(currencyAtom);
  const pageMetaData = useRecoilValue(metaAtom);
  const [localeLoader, setLocaleLoader] = useRecoilState(localeLoaderAtom);
  const parentRef = useRef(null);

  const router = useRouter();
  const { mbTheme, host } = useContext(MBContext);

  useEffect(() => {
    Cookies.set(COOKIE.LANG, currentLanguage, {
      domain: getNakedDomain(host),
      path: '/',
      expires: 30,
    });
  }, [currentLanguage, host]);

  useEffect(() => {
    const scrollHandler = () => {
      setScrollPos(window.pageYOffset);
      if (scrollPos > 80 && isOpen) {
        setIsOpen(false);
      }
    };
    const throttledScrollHandler = throttle(scrollHandler, 500);
    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [scrollPos]);

  const handleClick = () => {
    setIsOpen((prevState) => !prevState);
    setActiveTabIndex(0);
  };

  useCaptureClickOutside(
    parentRef,
    () => {
      if (isOpen) handleClick();
    },
    []
  );

  const sortedLanguages = useMemo(() => {
    return getSortedLanguages(currentLanguage, languages);
  }, [languages]);

  const trackLanguageChange = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: any
  ) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_LANGUGAGE_CHANGED,
      [ANALYTICS_PROPERTIES.LANGUAGE]: option.value,
    });
    setIsOpen(false);
    if (
      !(event?.metaKey || event?.ctrlKey || option?.value === currentLanguage)
    ) {
      setLocaleLoader(true);
    }
  };

  const trackLanguageShown = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPDOWN_SHOWN,
      [ANALYTICS_PROPERTIES.HEADER]: LANGUAGE_MAP[currentLanguage].displayName,
      ...getCommonEventMetaData(pageMetaData),
    });
  };

  const languageOptions = sortedLanguages.map(({ code, url }) => ({
    label: LANGUAGE_MAP[code as LanguagesUnion].displayName,
    subLabel:
      LANGUAGE_MAP_TRANSLATE_CONSTANT()[code as IPopularLanguage] ||
      LANGUAGE_MAP[code as LanguagesUnion]?.translatedName,
    value: code,
    itemProps: {
      href: url,
      as: 'a',
    },
    activeLabel:
      currentLanguage === code ? (
        <>
          {mbTheme !== THEMES.MIN_BLUE ? Globe : null}
          {LANGUAGE_MAP[currentLanguage].code.toUpperCase()}
        </>
      ) : null,
  }));

  const currencyOptions = useMemo(() => {
    return getCurrencyOptions(currencies);
  }, [activeCurrency]);

  const trackCurrencyChange = (option: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_CURRENCY_CHANGED,
      [ANALYTICS_PROPERTIES.CURRENCY]: option.value,
    });
  };

  const trackCurrencyShown = () => {
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

  const handleChange = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: any
  ) => {
    setIsOpen(false);
    if (option.value !== activeCurrency) {
      setCurrency(option.value);
      trackCurrencyChange(option);
      if (!(event?.metaKey || event?.ctrlKey)) {
        setLocaleLoader(true);
      }
      // push to the back of callstack, ensures currencyCode cookie is set.
      setTimeout(router.reload);
    }
  };

  let tabs: any[] = [];

  if (hasLanguageDropdown && languageOptions?.length > 0) {
    tabs = [
      {
        title: strings.LANGUAGE,
        sections: [
          {
            id: 1,
            title: '',
            options: languageOptions,
            currentValue: currentLanguage,
            onClick: trackLanguageChange,
            type: LANGUAGE,
          },
        ],
      },
      ...tabs,
    ];
  }

  if (hasCurrencySelector) {
    tabs = [
      ...tabs,
      {
        title: strings.CURRENCY,
        sections: [
          {
            id: 2,
            title: strings.POPULAR_CURRENCIES,
            options: currencyOptions[POPULAR_CURRENCIES],
            currentValue: activeCurrency,
            onClick: handleChange,
            type: CURRENCY,
          },
          {
            id: 3,
            title: strings.MORE_CURRENCIES,
            options: currencyOptions[MORE_CURRENCIES],
            currentValue: activeCurrency,
            onClick: handleChange,
            type: CURRENCY,
          },
        ],
      },
    ];
  }

  const onOpenPopOver = () => {
    if (isOpen === false) {
      trackLanguageShown();
    }
    setIsOpen(!isOpen);
  };

  const onChangeTab = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    event.stopPropagation();
    if (index === 0) {
      trackLanguageShown();
    } else {
      trackCurrencyShown();
    }
    setActiveTabIndex(index);
  };

  return (
    <StyledPopOver ref={parentRef}>
      <Conditional if={localeLoader}>
        <ButtonLoader isDarkMode={isDarkMode} isMobile={false} />
      </Conditional>
      <Conditional
        if={!localeLoader && hasLanguageDropdown && hasCurrencySelector}
      >
        <StyledButtonWrapper
          className="locale-button-wrapper"
          $isDarkMode={isDarkMode}
          onClick={onOpenPopOver}
        >
          <div className="icon">
            <GlobeIcon stroke={isDarkMode ? COLORS.GRAY.G8 : COLORS.GRAY.G3} />
          </div>
          <div className="button-text">
            {LANGUAGE_MAP?.[currentLanguage]?.displayName}
          </div>
          <Conditional if={activeCurrency}>
            <StyledVerticalDivider $isDarkMode={isDarkMode} />
            <div className="button-text">{activeCurrency}</div>
          </Conditional>
        </StyledButtonWrapper>
      </Conditional>

      <StyledPopOverWrapper $isOpen={isOpen}>
        <StyledPopOverHeader className="locale-popover-header">
          {tabs?.map((item, index) => {
            return (
              <Conditional
                key={index}
                if={
                  !(
                    item.title === LANGUAGE &&
                    languageOptions.length &&
                    hasLanguageDropdown
                  )
                }
              >
                <StyledHeaderItem
                  onClick={(event) => {
                    onChangeTab(event, index);
                  }}
                  $isActive={activeTabIndex === index}
                  className={
                    activeTabIndex === index ? 'selected-header-active' : ''
                  }
                >
                  {item.title}
                </StyledHeaderItem>
              </Conditional>
            );
          })}
        </StyledPopOverHeader>
        <StyleContainer>
          <Conditional if={tabs?.[activeTabIndex]?.sections}>
            {tabs[activeTabIndex]?.sections?.map(
              (section: ILocalePopOverContentSection, index: number) => {
                return (
                  <StyledPopOverContent key={section.id}>
                    <Conditional if={section.type !== LANGUAGE}>
                      <div className="content-header">{section?.title}</div>
                    </Conditional>
                    <Conditional if={section?.options}>
                      <div
                        className={`content-layer ${
                          index === tabs[activeTabIndex]?.sections?.length - 1
                            ? ''
                            : 'content-layer-border'
                        }`}
                      >
                        <LocalePopOverContent section={section} />
                      </div>
                    </Conditional>
                  </StyledPopOverContent>
                );
              }
            )}
          </Conditional>
        </StyleContainer>
      </StyledPopOverWrapper>
    </StyledPopOver>
  );
}

export default PopOver;
