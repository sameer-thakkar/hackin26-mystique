import React, { useCallback, useEffect, useMemo } from 'react';
import useWindowSize from 'hooks/useWindowSize';
import { checkIfGpMotorTicketsMB } from 'utils/helper';
import { initializeZenchat, ZendeskApi } from 'utils/zenchatUtils';

interface IZendeskChat {
  uid?: string;
  isLttMonthOnMonthPage?: boolean;
}

const ZendeskChat: React.FC<IZendeskChat> = (props) => {
  const { uid, isLttMonthOnMonthPage } = props;

  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const isMobile = useWindowSize()?.width < 768;
  const shouldHideZenchatWidget = useMemo(() => {
    return (isMobile && !checkIfGpMotorTicketsMB(uid)) || isLttMonthOnMonthPage;
  }, [isMobile, uid, isLttMonthOnMonthPage]);

  const showWidget = useCallback(() => {
    ZendeskApi('messenger', 'show');
  }, []);

  const hideWidget = useCallback(() => {
    ZendeskApi('messenger', 'hide');
  }, []);

  /* keep the widget hidden by-default for hide conditions */
  const onZenchatLoaded = () => {
    ZendeskApi('messenger', shouldHideZenchatWidget ? 'hide' : 'show');
    ZendeskApi('messenger', 'close');
  };

  useEffect(() => {
    //no need to maintain ref since this is already handled by window.zE check while initialization
    initializeZenchat(onZenchatLoaded);
  }, []);

  useEffect(() => {
    if (shouldHideZenchatWidget) {
      hideWidget();
    } else {
      showWidget();
    }
  }, [hideWidget, shouldHideZenchatWidget, showWidget]);

  return null;
};

export default ZendeskChat;
