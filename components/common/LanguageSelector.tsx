import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Cookies from 'js-cookie';
import DropdownSelector from 'components/common/DropdownSelector';
import { MBContext } from 'contexts/MBContext';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { getLangObject } from 'utils/helper';
import { getDomainFromUid } from 'utils/urlUtils';
import { metaAtom } from 'store/atoms/meta';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LANGUAGE_MAP,
  LanguagesUnion,
  LOCALE_ORDER,
  THEMES,
} from 'const/index';
import { GLOBE } from 'assets/SvgIcons';

const LanguageSelector = (props: any) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    currentLanguage,
    languages: availableLanguages,
    isDarkMode,
  }: {
    currentLanguage: LanguagesUnion;
    languages: any;
    isDarkMode: boolean;
  } = props;

  const { mbTheme, uid, isDev } = useContext(MBContext);

  const selectorRef = useRef(null);
  const parentRef = useRef(null);
  const exceptionElementRefs = [parentRef];
  const pageMetaData = useRecoilValue(metaAtom);
  const trackDropdownShown = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPDOWN_SHOWN,
      [ANALYTICS_PROPERTIES.HEADER]: LANGUAGE_MAP[currentLanguage].displayName,
      ...getCommonEventMetaData(pageMetaData),
    });
  };
  const handleClick = () => {
    setShowDropdown((prevState) => !prevState);
    if (!showDropdown) trackDropdownShown();
  };

  const sortedLanguages = useMemo(() => {
    const orderedLocales = Array.from(
      new Set([getLangObject(currentLanguage).code, ...LOCALE_ORDER])
    );
    const languagesShallowClone = [...availableLanguages];

    return languagesShallowClone.sort(
      (lA, lB) =>
        orderedLocales.indexOf(lA.code) - orderedLocales.indexOf(lB.code)
    );
  }, [availableLanguages]);

  useCaptureClickOutside(
    selectorRef,
    () => {
      if (showDropdown) handleClick();
    },
    exceptionElementRefs
  );

  const trackLanguageChange = (option: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_LANGUGAGE_CHANGED,
      [ANALYTICS_PROPERTIES.LANGUAGE]: option.value,
    });
  };
  const domain = getDomainFromUid(uid ?? LANGUAGE_MAP.en.locale);

  useEffect(() => {
    Cookies.set('content_lang', currentLanguage, {
      // @ts-expect-error TS(2322): Type 'string | null | undefined' is not assignable... Remove this comment to see the full error message
      domain: isDev ? null : domain?.replace('www.', ''),
      path: '',
    });
  }, [currentLanguage]);

  const options = sortedLanguages.map(({ code, url }) => ({
    label: LANGUAGE_MAP[code as LanguagesUnion].displayName,
    value: code,
    itemProps: {
      href: url,
      as: 'a',
    },
    activeLabel:
      currentLanguage === code ? (
        <>
          {mbTheme !== THEMES.MIN_BLUE ? GLOBE : null}
          {LANGUAGE_MAP[currentLanguage].code.toUpperCase()}
        </>
      ) : null,
  }));

  return (
    <DropdownSelector
      // @ts-expect-error TS(2322): Type '{ label: any; value: any; itemProps: { href:... Remove this comment to see the full error message
      currentValue={options.find((opt) => opt.value === currentLanguage)}
      onChange={trackLanguageChange}
      // @ts-expect-error TS(2322): Type '{ label: any; value: any; itemProps: { href:... Remove this comment to see the full error message
      options={options}
      onShowDropdown={trackDropdownShown}
      isCrawlable
      isDarkMode={isDarkMode}
    />
  );
};

export default LanguageSelector;
