import { useEffect, useRef, useState } from 'react';
import {
  IMailerProps,
  ISubscriptionForm,
} from 'components/CityPageContainer/Mailer/interface';
import {
  ImageContainer,
  MailerContainer,
  SubscriptionCont,
  TextContainer,
} from 'components/CityPageContainer/Mailer/styles';
import { trackPageSection } from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import Image from 'components/UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { validateEmail } from 'utils/helper';
import { SECTION_NAMES } from 'const/cityPage';
import { ANALYTICS_PROPERTIES, CTA_TYPE, EMAIL_SUBCRIPTION } from 'const/index';
import { strings } from 'const/strings';
import { GREEN_CHECK } from 'assets/SvgIcons';

export const IMAGE_DIMENSIONS = {
  DESKTOP: {
    WIDTH: '586',
    HEIGHT: '313',
  },
  MOBILE: {
    HEIGHT: '175',
    WIDTH: '327',
  },
};

const SubscriptionForm = ({
  eventName,
  isCatOrSubCatPage,
}: ISubscriptionForm) => {
  const {
    EMAIL_FIELD_PLACEHOLDER,
    SIGN_UP,
    THANK_YOU,
    SUBSCRIBED_MSG,
    ERROR_MSG,
  } = strings.EMAIL_SUBSCRIPTION;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isErr, setIsErr] = useState(false);

  const handleSubscription = () => {
    if (!userEmail || !validateEmail(userEmail)) {
      setIsErr(true);
      return;
    }
    setIsErr(false);
    trackEvent({
      eventName,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.SIGN_UP,
      [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAMES.MAILER,
      [ANALYTICS_PROPERTIES.USER_EMAIL]: userEmail,
    });
    setIsSubscribed(true);
  };

  return (
    <SubscriptionCont isErr={isErr} $isCatOrSubCatPage={isCatOrSubCatPage}>
      {isSubscribed ? (
        <div className="subcription-msg">
          {GREEN_CHECK}
          <div className="subscription-text">
            <p>{THANK_YOU}</p>
            <p>{SUBSCRIBED_MSG}</p>
          </div>
        </div>
      ) : (
        <div className="input-form">
          <div className="input-wrapper">
            <input
              className="email-input"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder={EMAIL_FIELD_PLACEHOLDER}
            />
            <Conditional if={isErr}>
              <div className="err-msg">{ERROR_MSG}</div>
            </Conditional>
          </div>
          <button className="signup-btn" onClick={handleSubscription}>
            {SIGN_UP}
          </button>
        </div>
      )}
    </SubscriptionCont>
  );
};

const Mailer = ({
  isMobile,
  heading,
  subHeading,
  eventName,
  isCatOrSubCatPage,
}: IMailerProps) => {
  const subcriptionImg = isCatOrSubCatPage
    ? EMAIL_SUBCRIPTION.BANNER_URL.CAT_SUBCAT_PAGE
    : EMAIL_SUBCRIPTION.BANNER_URL.CITY_PAGE;

  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: SECTION_NAMES.MAILER });
    }
  }, [isIntersecting]);

  const { HEIGHT, WIDTH } = isMobile
    ? IMAGE_DIMENSIONS.MOBILE
    : IMAGE_DIMENSIONS.DESKTOP;

  return (
    <MailerContainer ref={containerRef} $isCatOrSubCatPage={isCatOrSubCatPage}>
      <div className="mailer-wrapper">
        <TextContainer $isCatOrSubCatPage={isCatOrSubCatPage}>
          <p className="mailer-heading">{heading}</p>
          <p className="mailer-subheading">{subHeading}</p>
          <SubscriptionForm
            eventName={eventName}
            isCatOrSubCatPage={isCatOrSubCatPage}
          />
        </TextContainer>

        <ImageContainer>
          <Image
            width={WIDTH}
            height={HEIGHT}
            url={subcriptionImg}
            alt="Headout Email Subscription"
            className="image-wrapper"
          />
        </ImageContainer>
      </div>
    </MailerContainer>
  );
};

export default Mailer;
