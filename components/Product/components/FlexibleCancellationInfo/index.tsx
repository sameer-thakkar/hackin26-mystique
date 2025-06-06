import { useEffect } from 'react';
import { Button, Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { FLEXI_CANCELLATION_SHIELD_SVG_URL } from 'const/flexibleCancellation';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import CrossiconSvg from 'assets/crossiconSvg';
import {
  SparkGreenSVG,
  SupplySVG,
  ZeroQuestionsSVG,
} from 'assets/flexibleCancellation';
import {
  boostersContainerStyles,
  boosterStyle,
  buttonContainerStyles,
  cancellationInfoListStyles,
  cancellationLayoutStyle,
} from './style';

type TFlexibleCancellationInfoProps = {
  isMobile: boolean;
  onClose: () => void;
};

export const FlexibleCancellationInfo = ({
  isMobile,
  onClose,
}: TFlexibleCancellationInfoProps) => {
  useEffect(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.POPUP_VIEWED,
      [ANALYTICS_PROPERTIES.POPUP_TYPE]: 'Flexible Cancellation',
    });
  }, []);

  return (
    <div className={cancellationLayoutStyle}>
      <Image
        url={FLEXI_CANCELLATION_SHIELD_SVG_URL}
        alt="flexi-cancellation-shield"
        width={70}
        height={65.55}
      />

      <CrossiconSvg className="cross" onClick={onClose} />

      <Text textStyle={'heading.medium'}>
        {strings.DESCRIPTORS.FLEXIBLE_CANCELLATION}
      </Text>

      <div className={boostersContainerStyles}>
        <span>
          <SparkGreenSVG />
          <Text className={boosterStyle}>
            {strings.FLEXIBLE_CANCELLATION.FULL_REFUND}
          </Text>
        </span>

        <span>
          <SupplySVG />
          <Text className={boosterStyle}>
            {strings.FLEXIBLE_CANCELLATION.INSTANT}
          </Text>
        </span>

        <span>
          <ZeroQuestionsSVG />
          <Text className={boosterStyle}>
            {strings.FLEXIBLE_CANCELLATION.NO_QUESTIONS}
          </Text>
        </span>
      </div>

      <Text
        textStyle={isMobile ? 'heading.small' : 'ui.label.large.heavy'}
        color={isMobile ? 'semantic.text.grey.1' : 'semantic.text.grey.2'}
        className={css({
          marginTop: 'space.12',
        })}
      >
        {strings.FLEXIBLE_CANCELLATION.TNC}
      </Text>

      <ul className={cancellationInfoListStyles}>
        <li>{strings.FLEXIBLE_CANCELLATION.ELIGIBILITY}</li>
        <li>{strings.FLEXIBLE_CANCELLATION.CANCELLATION_DEADLINE}</li>
        <li>{strings.FLEXIBLE_CANCELLATION.REFUND_AMOUNT}</li>
        <li>{strings.FLEXIBLE_CANCELLATION.NON_TRANSFERABLE}</li>
        <li>{strings.FLEXIBLE_CANCELLATION.GUIDELINES}</li>
      </ul>

      <div className={buttonContainerStyles}>
        <Button
          variant="primary"
          size="medium"
          as="button"
          primaryText="Okay"
          btnType="black"
        />
      </div>
    </div>
  );
};
