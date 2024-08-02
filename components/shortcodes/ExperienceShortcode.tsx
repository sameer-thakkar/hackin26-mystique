import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import Product from 'components/Product/index';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { getHeadoutApiUrl, HeadoutEndpoints } from 'utils/apiUtils';
import { getHostName, isMobile } from 'utils/helper';
import { getScorpioData } from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import COLORS from 'const/colors';
import { LOG_LEVELS } from 'const/logs';
import { strings } from 'const/strings';
import { sendLog } from '../../utils/logger';
import { TExperienceDrawerPortal } from './types';

export type TExperienceShortcode = {
  type: 'POPUP' | 'REDIRECT';
  id: string;
  text: string;
};

const ExperienceShortcode = ({ type, id, text }: TExperienceShortcode) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scorpioData, setScorpioData] = useState<Record<string, any> | null>(
    null
  );
  const { nakedDomain, lang, host, isDev, isStage } = useContext(MBContext);
  const currencyCode = useRecoilValue(currencyAtom);
  const currencyList = useRecoilValue(currencyListAtom);
  const hostname = getHostName(isStage, isDev, host);

  const hasTourGroupData = !!scorpioData?.[id];

  const bookingURL = createBookingURL({
    nakedDomain,
    lang,
    tgid: id,
    currency: currencyCode,
  });

  const currency = currencyList?.find((c) => c.code === currencyCode);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen]);

  const handleDrawer = useCallback(
    (isOpen: boolean = false) => {
      setIsDrawerOpen(isOpen);
    },
    [setIsDrawerOpen]
  );

  const childProps = useMemo(
    () => ({
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
    }),
    [handleDrawer, host, id, lang, scorpioData]
  );
  const isCombo = scorpioData?.[id]?.combo;

  const fetchTourGroupDataAndSetState = useCallback(async () => {
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
    let data;
    let responseData;

    try {
      data = await fetch(tourGroupEndpoint);
      responseData = await data.json();
    } catch (err) {
      sendLog({
        level: LOG_LEVELS.ERROR,
        message: `[experience-short-code] - props - ${JSON.stringify({
          type,
          id,
        })}`,
        err,
      });

      return;
    }

    if (!responseData) {
      return;
    }

    const scorpioDataResponse = await getScorpioData({
      finalTours: responseData?.tourGroups,
      currency,
      language: lang,
      localizedStrings: strings,
    });

    setScorpioData(scorpioDataResponse);
  }, [currency, currencyCode, hostname, id, lang, type]);

  useEffect(() => {
    fetchTourGroupDataAndSetState();
  }, []);

  return (
    <>
      <Conditional if={type === 'REDIRECT' && id}>
        {hasTourGroupData && !isCombo ? (
          <a href={bookingURL} target="_blank">
            {text}
          </a>
        ) : (
          text
        )}
      </Conditional>
      <Conditional if={type === 'POPUP' && id}>
        {hasTourGroupData && !isCombo ? (
          <span
            onClick={openDrawer}
            role="button"
            tabIndex={0}
            style={{ color: COLORS.CANDY.PRIMARY, cursor: 'pointer' }}
          >
            {text}
          </span>
        ) : (
          text
        )}
        <ExperienceDrawerPortal isDrawerOpen={isDrawerOpen} {...childProps} />
      </Conditional>
    </>
  );
};

const ExperienceDrawerPortal = (props: TExperienceDrawerPortal) => {
  const { isDrawerOpen, ...restProps } = props;

  if (!isDrawerOpen || !restProps?.scorpioData) {
    return null;
  }

  return (
    <React.Fragment>
      {createPortal(
        <Product {...restProps} />,
        document.body,
        'experience-popup'
      )}
    </React.Fragment>
  );
};

export default ExperienceShortcode;
