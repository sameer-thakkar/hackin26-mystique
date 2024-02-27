import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import Cookies from 'js-cookie';
import {
  ActionButton,
  ActionContainer,
  AllowButton,
  CancelButton,
  ConsentContainer,
  consentDrawerStyles,
  ConsentFixedWrapper,
  DetailedPopupContainer,
  HeadingContainer,
  PopupButtonsContainer,
  TextContainer,
} from 'components/common/Consent/styles';
import Drawer from 'components/common/Drawer';
import Image from 'UI/Image';
import { useToast } from 'contexts/toastContext';
import useABTesting from 'hooks/useABTesting';
import { getNakedDomain } from 'utils';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import { VARIANTS } from 'const/experiments';
import { COOKIE } from 'const/index';
import { strings } from 'const/strings';

type TConsentState = 'granted' | 'denied';

const CookieBanner = dynamic(
  () =>
    import(
      /* webpackChunkName: "CookieBanner" */ 'components/common/CookieBanner'
    ),
  { ssr: false }
);

const ConsentBanner = ({
  pageType,
  isMobile,
  isGDPRCompliant,
}: {
  pageType: string;
  isMobile: boolean;
  isGDPRCompliant: boolean;
}) => {
  const { isEligible, variant } = useABTesting({
    experimentId: 'CONSENT_BANNER_EXPERIMENT',
    noTrack: true,
  });
  const isConsentTreatment = isEligible && variant === VARIANTS.TREATMENT;
  const [isVisible, setVisibility] = useState(false);
  const { host } = useRecoilValue(appAtom);
  const { pathname } = useRouter();
  const isPrivacyPage = pathname.includes('privacy-policy');
  const [showModal, setShowModal] = useState(false);
  const ReactMarkdown: any = Markdown;
  const { addToast } = useToast();

  const onConsentUpdate = ({
    state,
    actor = 'User',
  }: {
    state: TConsentState;
    actor?: 'User' | 'Logic';
  }) => {
    trackEvent({
      eventName: 'Consent Update',
      'Consent State': state,
    });
    setVisibility(false);
    setShowModal(false);
    if (actor === 'User') {
      Cookies.set(COOKIE.CONSENT_POLICY_STATE, state, {
        domain: getNakedDomain(host),
        path: '',
        expires: 30,
      });
      addToast({
        message: strings.COOKIE_CONSENT.PREFERNCES_SAVED,
        duration: 5000,
        position: 'bottom-center',
      });
    }
  };

  useEffect(() => {
    const cookieState = Cookies.get(
      COOKIE.CONSENT_POLICY_STATE
    ) as TConsentState;
    if (isPrivacyPage) return;
    if (typeof cookieState === 'undefined') {
      setVisibility(true);
    }
    if (cookieState === 'granted') {
      onConsentUpdate({ state: 'granted', actor: 'Logic' });
    }
    if (cookieState === 'denied') {
      onConsentUpdate({ state: 'denied', actor: 'Logic' });
    }
  }, [isPrivacyPage]);

  useEffect(() => {
    if (showModal) document.body.classList.add('scroll-lock');
    else document.body.classList.remove('scroll-lock');

    return () => {
      document.body.classList.remove('scroll-lock');
    };
  }, [showModal]);

  useEffect(() => {
    const onHashChange = (e: HashChangeEvent) => {
      if (e.oldURL.includes('consent')) {
        onHideModal();
      }
    };
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onHideModal();
      }
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('keydown', onKeyPress);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('keydown', onKeyPress);
    };
  }, []);

  const onShowModal = () => {
    setShowModal(true);
    const url = new URL(window.location.href);
    url.hash = 'consent';
    history.pushState({ isConsent: true }, '', url.toString());
  };

  const onHideModal = () => {
    setShowModal(false);
  };

  if (!isConsentTreatment)
    return (
      <CookieBanner
        pageType={pageType}
        isMobile={isMobile}
        isGDPRCompliant={isGDPRCompliant}
      />
    );

  if (showModal)
    return (
      <Drawer
        hideCrossIcon
        noMargin
        $drawerStyles={consentDrawerStyles}
        className="consent-drawer"
        closeHandler={onHideModal}
      >
        <DetailedPopupContainer>
          <HeadingContainer>
            <div className="consent-heading">
              {strings.COOKIE_CONSENT.HEADING}
            </div>
            <Image
              height={64}
              width={126}
              alt="privacy icon"
              url="https://cdn-imgix-open.headout.com/assets/privacy-icon.png"
            />
            <div className="sub-heading">{strings.COOKIE_CONSENT.COOKIES}</div>
          </HeadingContainer>
          <ReactMarkdown>{strings.COOKIE_CONSENT.DESCRIPTION}</ReactMarkdown>
        </DetailedPopupContainer>
        <PopupButtonsContainer>
          <AllowButton onClick={() => onConsentUpdate({ state: 'granted' })}>
            {strings.COOKIE_CONSENT.ALLOW_ALL}
          </AllowButton>
          <CancelButton onClick={() => onConsentUpdate({ state: 'denied' })}>
            {strings.COOKIE_CONSENT.DENY_ALL}
          </CancelButton>
        </PopupButtonsContainer>
      </Drawer>
    );

  return (
    <ConsentFixedWrapper $isHidden={!isVisible}>
      <ConsentContainer key={'cookie-banner'}>
        <TextContainer>
          <div>{strings.COOKIE_CONSENT.BASIC_DESCRIPTION}</div>
        </TextContainer>
        <ActionContainer>
          <ActionButton onClick={() => onConsentUpdate({ state: 'granted' })}>
            {strings.COOKIE_CONSENT.ACCEPT}
          </ActionButton>
          <CancelButton onClick={onShowModal}>
            {strings.COOKIE_CONSENT.MANAGE_PREFERENCES}
          </CancelButton>
        </ActionContainer>
      </ConsentContainer>
    </ConsentFixedWrapper>
  );
};

export default ConsentBanner;
