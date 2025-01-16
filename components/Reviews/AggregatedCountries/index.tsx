import { useContext, useEffect, useRef } from 'react';
import Marquee from 'react-light-marquee';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import useAutoPlayingLottieAnimation from 'hooks/useAutoPlayingLottieAnimations';
import useOnScreen from 'hooks/useOnScreen';
import { strings } from 'const/strings';
import { HEARTS_LOTTIE_URL } from './constants';
import type { TAggregatedCountriesProps } from './interface';
import {
  CountryFlagItem,
  CountryFlagsContainer,
  TopBorder,
  WrapperContainer,
} from './style';
import { getCountryFlagUrl } from './utils';

const AggregatedCountries = ({
  slideAnimation,
  reviewCountries,
  isMobile = false,
}: TAggregatedCountriesProps) => {
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { lang } = useContext(MBContext);

  const { countries, count } = reviewCountries;
  const countryFlagUrls = countries.map(({ code }) => getCountryFlagUrl(code));
  const mainCountries = countries
    .slice(0, 3)
    .map(({ displayName }) => displayName)
    .join(', ');

  useAutoPlayingLottieAnimation({
    ref: lottieContainerRef,
    animationProperties: { loop: true, path: HEARTS_LOTTIE_URL },
  });

  const isOnScreen = useOnScreen({
    ref: wrapperRef,
    options: { threshold: !isMobile ? 0.9 : 0.6 },
  });

  useEffect(() => {
    if (!!slideAnimation && wrapperRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            wrapperRef.current?.classList.add('loaded');
          }, 1000);
        }
      });

      observer.observe(wrapperRef.current!);

      return () => observer.disconnect();
    }
  }, [slideAnimation]);

  return (
    <>
      <Conditional if={isMobile}>
        <TopBorder />
      </Conditional>

      <WrapperContainer
        ref={wrapperRef}
        $hasSlideAnimation={slideAnimation}
        className={`lang-${lang} review-banner`}
      >
        <CountryFlagsContainer className={`country-flags lang-${lang}`}>
          <Marquee id="countries" direction="up" speed={20} play={isOnScreen}>
            {countryFlagUrls.map((url, index) => (
              <CountryFlagItem key={countryFlagUrls.length + index}>
                <Image
                  className="country-flag"
                  url={url}
                  alt={countries[index].displayName ?? 'country flag'}
                  height={22.5}
                  width={30}
                />
              </CountryFlagItem>
            ))}
          </Marquee>
        </CountryFlagsContainer>

        <div
          className="guest-text"
          dangerouslySetInnerHTML={{
            __html: strings.formatString(
              strings.AGGREGATED_COUNTRIES,
              mainCountries,
              count.toString()
            ),
          }}
        />

        <div className="hearts-lottie" ref={lottieContainerRef} />
      </WrapperContainer>
    </>
  );
};

export default AggregatedCountries;
