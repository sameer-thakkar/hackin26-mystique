import React, { useContext, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import Product from 'components/Product/index';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getHostName, isMobile } from 'utils/helper';
import { getScorpioData } from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import COLORS from 'const/colors';
import { strings } from 'const/strings';

export type TExperienceShortcode = {
  type: 'POPUP' | 'REDIRECT';
  id: string;
  text: string;
};

const ExperienceShortcode = ({ type, id, text }: TExperienceShortcode) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { nakedDomain, lang, host, isDev, isStage } = useContext(MBContext);
  const currencyCode = useRecoilValue(currencyAtom);
  const currencyList = useRecoilValue(currencyListAtom);
  const hostname = getHostName(isStage, isDev, host);

  const bookingURL = createBookingURL({
    nakedDomain,
    lang,
    tgid: id,
    currency: currencyCode,
  });

  const currency = currencyList?.find((c) => c.code === currencyCode);
  const params = {
    'ids[]': id,
    ...(lang && {
      language: lang,
    }),
    ...(currencyCode && {
      currency: currencyCode,
    }),
  };
  const tourGroupEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    id: null,
    hostname,
    params,
  });
  const { data: tourListData } = useSWR(tourGroupEndpoint, {
    fetcher: swrFetcher,
  });

  const scorpioData = getScorpioData({
    finalTours: tourListData?.tourGroups,
    currency,
    language: lang,
    localizedStrings: strings,
  });
  const handleDrawer = (isOpen: boolean) => {
    setIsDrawerOpen(isOpen);
  };

  const childProps = {
    tgid: id,
    showNextAvailable: true,
    descriptors: scorpioData?.[id]?.descriptors,
    scorpioData: scorpioData?.[id],
    tourPrices: scorpioData,
    currentLanguage: lang,
    isMobile: isMobile(),
    host,
    defaultOpen: false,
    isShortcodePopup: true,
    handleShortcodeDrawer: handleDrawer,
  };
  const isCombo = scorpioData?.[id]?.combo;

  return (
    <>
      <Conditional if={type === 'REDIRECT' && id}>
        {tourListData?.tourGroups?.length && !isCombo ? (
          <a href={bookingURL} target="_blank">
            {text}
          </a>
        ) : (
          text
        )}
      </Conditional>
      <Conditional if={type === 'POPUP' && id}>
        {tourListData?.tourGroups?.length && !isCombo ? (
          <span
            onClick={() => setIsDrawerOpen(true)}
            role="button"
            tabIndex={0}
            style={{ color: COLORS.CANDY.PRIMARY, cursor: 'pointer' }}
          >
            {text}
          </span>
        ) : (
          text
        )}
        <Conditional if={isDrawerOpen}>
          <Product {...childProps} />
        </Conditional>
      </Conditional>
    </>
  );
};

export default ExperienceShortcode;
