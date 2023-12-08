import dynamic from 'next/dynamic';
import { SwiperOptions } from 'swiper';
import Conditional from 'components/common/Conditional';
import { TTrustBoosterProps } from 'components/MicrositeV2/BannerV2TrustBooster/interface';
import {
  Container,
  Wrapper,
} from 'components/MicrositeV2/BannerV2TrustBooster/style';
import { lttTrustBoostersIcons } from 'const/lttTrustBoosters';
import { strings } from 'const/strings';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const TrustBooster = ({ isMobile }: TTrustBoosterProps) => {
  const icons = [
    {
      name: strings.LTT_LANDING_PAGE.TRUST_BOOSTERS.INSTANT_TICKETS.NAME,
      icon: lttTrustBoostersIcons['INSTANT_TICKET'],
      description:
        strings.LTT_LANDING_PAGE.TRUST_BOOSTERS.INSTANT_TICKETS.DESCRIPTION,
    },
    {
      name: strings.LTT_LANDING_PAGE.TRUST_BOOSTERS.PRICES_LOVE.NAME,
      icon: lttTrustBoostersIcons['PRICES'],
      description:
        strings.LTT_LANDING_PAGE.TRUST_BOOSTERS.PRICES_LOVE.DESCRIPTION,
    },
    {
      name: strings.LTT_LANDING_PAGE.TRUST_BOOSTERS.CHOOSE_SEATS.NAME,
      icon: lttTrustBoostersIcons['SEATS'],
      description:
        strings.LTT_LANDING_PAGE.TRUST_BOOSTERS.CHOOSE_SEATS.DESCRIPTION,
    },
    {
      name: strings.LTT_LANDING_PAGE.TRUST_BOOSTERS.OFFICIAL_LTT.NAME,
      icon: lttTrustBoostersIcons['OFFICIAL_TICKET'],
      description:
        strings.LTT_LANDING_PAGE.TRUST_BOOSTERS.OFFICIAL_LTT.DESCRIPTION,
    },
  ];

  const swiperParams: SwiperOptions = {
    slidesPerView: isMobile ? 1 : icons.length,
    spaceBetween: 20,
    loop: isMobile,
    autoplay: {
      delay: 3000,
    },
    direction: isMobile ? 'vertical' : 'horizontal',
    autoHeight: true,
  };
  return (
    <Container>
      <Wrapper>
        <Conditional if={isMobile}>
          <Swiper {...swiperParams}>
            {icons.map((item, index) => {
              return (
                <div className="trust-booster" key={index}>
                  <div className="icon">{item.icon}</div>
                  <div className="description">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </Swiper>
        </Conditional>
        <Conditional if={!isMobile}>
          {icons.map((item, index) => {
            return (
              <div className="trust-booster" key={index}>
                <div className="icon">{item.icon}</div>
                <div className="description">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </Conditional>
      </Wrapper>
    </Container>
  );
};

export default TrustBooster;
