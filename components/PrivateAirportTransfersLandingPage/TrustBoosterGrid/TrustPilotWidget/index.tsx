import { useContext, useLayoutEffect } from 'react';
import Script from 'next/script';
import { css, cx } from 'styled-system/css';
import { MBContext } from 'contexts/MBContext';
import {
  TRUSTPILOT_BUSINESS_UNIT_ID,
  TRUSTPILOT_TEMPLATE_ID,
} from './constants';
import {
  trustpilotWidgetContainerStyles,
  trustpilotWidgetContentStyles,
} from './styles';
import type { TTrustpilotWidgetProps } from './types';
import { getTrustPilotWidgetLanguageLocale } from './utils';

const TrustpilotWidget = ({
  height = '150px',
  isMobile,
}: TTrustpilotWidgetProps) => {
  const { lang } = useContext(MBContext);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !window.Trustpilot) {
      return;
    }

    window.Trustpilot?.loadFromElement(
      document.querySelector('.trustpilot-widget')
    );
  }, [isMobile]);

  const trustpilotWidgetDynamicStyles = css({
    '--trustpilot-widget-height': height,
  });

  return (
    <>
      <Script
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
      />
      <div className={trustpilotWidgetContainerStyles}>
        <div
          className={cx(
            trustpilotWidgetContentStyles,
            trustpilotWidgetDynamicStyles
          )}
        >
          <div
            className="trustpilot-widget"
            data-locale={getTrustPilotWidgetLanguageLocale(lang)}
            data-template-id={TRUSTPILOT_TEMPLATE_ID}
            data-businessunit-id={TRUSTPILOT_BUSINESS_UNIT_ID}
            data-style-height={height}
            data-style-width="100%"
            data-style-margin="0"
            data-style-padding="0"
            data-theme="dark"
          />
        </div>
      </div>
    </>
  );
};

export default TrustpilotWidget;
