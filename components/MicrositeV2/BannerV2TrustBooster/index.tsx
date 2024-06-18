import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SwiperOptions } from 'swiper';
import Conditional from 'components/common/Conditional';
import { TTrustBoosterProps } from 'components/MicrositeV2/BannerV2TrustBooster/interface';
import {
  Container,
  Wrapper,
} from 'components/MicrositeV2/BannerV2TrustBooster/style';
import { metaAtom } from 'store/atoms/meta';
import { V2TrustBoosters } from 'const/entertainmentMBTrustBoosters';
import { strings } from 'const/strings';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const TrustBooster = ({ isMobile, isHOHORevamp }: TTrustBoosterProps) => {
  const { city } = useRecoilValue(metaAtom) as Record<string, any>;

  const ICONS = isHOHORevamp
    ? [
        {
          name: strings.HOHO.TRUST_BOOSTERS.LAST_MIN.NAME,
          icon: V2TrustBoosters['LAST_MIN'],
          description: strings.HOHO.TRUST_BOOSTERS.LAST_MIN.DESCRIPTION,
        },
        {
          name: strings.HOHO.TRUST_BOOSTERS.COST_EFF.NAME,
          icon: V2TrustBoosters['EXCLUSIVE_DEALS'],
          description: strings.HOHO.TRUST_BOOSTERS.COST_EFF.DESCRIPTION,
        },
        {
          name: strings.HOHO.TRUST_BOOSTERS.DAILY_RIDES.NAME,
          icon: V2TrustBoosters['CALENDAR'],
          description: strings.HOHO.TRUST_BOOSTERS.DAILY_RIDES.DESCRIPTION,
        },
        {
          name: strings.HOHO.TRUST_BOOSTERS.BOOK_RELAX.NAME,
          icon: V2TrustBoosters['BOOK_AND_RELAX'],
          description: strings.HOHO.TRUST_BOOSTERS.BOOK_RELAX.DESCRIPTION,
        },
      ]
    : [
        {
          name: strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS
            .BOX_OFFICE_TICKETS.NAME,
          icon: V2TrustBoosters['BOX_OFFICE_TICKETS'],
          description:
            strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS
              .BOX_OFFICE_TICKETS.DESCRIPTION,
        },
        {
          name: strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS
            .CHOOSE_YOUR_SEATS.NAME,
          icon: V2TrustBoosters['CHOOSE_YOUR_SEATS'],
          description:
            strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS
              .CHOOSE_YOUR_SEATS.DESCRIPTION,
        },
        {
          name: strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS
            .EXCLUSIVE_DEALS.NAME,
          icon: V2TrustBoosters['EXCLUSIVE_DEALS'],
          description: strings.formatString(
            strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS.EXCLUSIVE_DEALS
              .DESCRIPTION,
            city?.name || ''
          ),
        },
        {
          name: strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS
            .BOOK_AND_RELAX.NAME,
          icon: V2TrustBoosters['BOOK_AND_RELAX'],
          description:
            strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS.BOOK_AND_RELAX
              .DESCRIPTION,
        },
      ];

  const swiperParams: SwiperOptions = {
    slidesPerView: isMobile ? 1 : ICONS.length,
    spaceBetween: 20,
    loop: isMobile,
    autoplay: {
      delay: 3000,
    },
    direction: isMobile ? 'vertical' : 'horizontal',
    autoHeight: true,
  };
  return (
    <Container $isHOHORevamp={isHOHORevamp}>
      <Wrapper $isHOHORevamp={isHOHORevamp}>
        <Conditional if={isMobile}>
          <Swiper {...swiperParams}>
            {ICONS.map((item, index) => {
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
          {ICONS.map((item, index) => {
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
