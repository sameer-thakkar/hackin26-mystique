import dynamic from 'next/dynamic';
import { SwiperOptions } from 'swiper';
import Conditional from 'components/common/Conditional';
import { TTrustBoosterProps } from 'components/MicrositeV2/BannerV2TrustBooster/interface';
import {
  Container,
  Wrapper,
} from 'components/MicrositeV2/BannerV2TrustBooster/style';
import { entertainmentMBTrustBoosters } from 'const/entertainmentMBTrustBoosters';
import { COLLECTION_ID_CITIES_MAP, LTD_COLLECTION_ID } from 'const/index';
import { strings } from 'const/strings';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const TrustBooster = ({ isMobile, collectionId }: TTrustBoosterProps) => {
  const ICONS = [
    {
      name: strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS
        .BOX_OFFICE_TICKETS.NAME,
      icon: entertainmentMBTrustBoosters['BOX_OFFICE_TICKETS'],
      description:
        strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS.BOX_OFFICE_TICKETS
          .DESCRIPTION,
    },
    {
      name: strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS
        .CHOOSE_YOUR_SEATS.NAME,
      icon: entertainmentMBTrustBoosters['CHOOSE_YOUR_SEATS'],
      description:
        strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS.CHOOSE_YOUR_SEATS
          .DESCRIPTION,
    },
    {
      name: strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS.EXCLUSIVE_DEALS
        .NAME,
      icon: entertainmentMBTrustBoosters['EXCLUSIVE_DEALS'],
      description: strings.formatString(
        strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS.EXCLUSIVE_DEALS
          .DESCRIPTION,
        `${COLLECTION_ID_CITIES_MAP[collectionId ?? LTD_COLLECTION_ID]}`
      ),
    },
    {
      name: strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS.BOOK_AND_RELAX
        .NAME,
      icon: entertainmentMBTrustBoosters['BOOK_AND_RELAX'],
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
    <Container>
      <Wrapper>
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
