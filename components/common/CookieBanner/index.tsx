import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CloseButton,
  CookieContainer,
  StyledLink,
  TextContainer,
} from 'components/common/CookieBanner/styles';
import { CookieBannerProps } from 'components/common/CookieBanner/types';
import { COOKIE_BANNER_KEY } from 'const/index';
import { strings } from 'const/strings';
import { Cookie, CrossIconSvg } from 'assets/SvgIcons';

const CookieBanner = ({
  isMobile,
  isGDPRCompliant,
  pageType,
}: CookieBannerProps) => {
  const [cookieBannerState, setCookieBannerState] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const router = useRouter();
  const path = useRef<any>();

  const hideCookieBanner = () => {
    setCookieBannerState(false);
    localStorage.setItem(COOKIE_BANNER_KEY, 'shown');
  };

  const hide = (
    e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  ) => {
    e?.stopPropagation();
    setTimeout(hideCookieBanner, 300);
    setIsHidden(true);
  };

  useEffect(() => {
    const storedState = localStorage.getItem(COOKIE_BANNER_KEY);
    const alreadyShown =
      storedState && ['shown', 'rendered'].includes(storedState);
    const showCookieBanner = isGDPRCompliant && !alreadyShown;
    if (showCookieBanner) {
      setCookieBannerState(showCookieBanner);
      localStorage.setItem(COOKIE_BANNER_KEY, 'rendered');
    } else if (!isGDPRCompliant && !alreadyShown) {
      localStorage.setItem(COOKIE_BANNER_KEY, 'not compliant');
    }
  }, [isGDPRCompliant]);

  useEffect(() => {
    if (!path.current) {
      path.current = router.asPath;
      return;
    }
    hide();
  }, [router.asPath]);

  if (!cookieBannerState) return null;

  return (
    <CookieContainer
      $isHidden={isHidden}
      key={'cookie-banner'}
      $pageType={pageType}
    >
      <Cookie className="cookie-icon" />
      <TextContainer>
        {isMobile
          ? strings.COOKIE_BANNER.MOBILE
          : strings.COOKIE_BANNER.DESKTOP}{' '}
        <Link href={'/privacy-policy/'} passHref>
          <StyledLink
            onClick={hide}
            id="cookie-privacy-policy-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {strings.COOKIE_BANNER.LEARN_MORE}
          </StyledLink>
        </Link>
      </TextContainer>
      <CloseButton onClick={hide}>
        <CrossIconSvg />
      </CloseButton>
    </CookieContainer>
  );
};

export default CookieBanner;
