import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { GLOBE } from 'assets/SvgIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LanguagesUnion,
  LANGUAGE_MAP,
  LOCALE_ORDER,
  THEMES,
} from 'const/index';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { metaAtom } from 'store/atoms/meta';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { getLangObject } from 'utils/helper';
import { MBContext } from 'contexts/MBContext';
import DropdownSelector from 'components/common/DropdownSelector';
import Cookies from 'js-cookie';
import { getDomainFromUid } from 'utils/urlUtils';

const LanguageSelector = (props: any) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    currentLanguage,
    languages: availableLanguages,
  }: { currentLanguage: LanguagesUnion; languages: any } = props;

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
    />
  );
};

export default LanguageSelector;
