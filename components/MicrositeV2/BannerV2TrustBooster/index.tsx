import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SwiperOptions } from 'swiper';
import Conditional from 'components/common/Conditional';
import { TTrustBoosterProps } from 'components/MicrositeV2/BannerV2TrustBooster/interface';
import {
  Container,
  Wrapper,
} from 'components/MicrositeV2/BannerV2TrustBooster/style';
import Image from 'UI/Image';
import { TPrismicTrustBooster } from 'utils/prismicUtils/interface';
import { metaAtom } from 'store/atoms/meta';
import { V2TrustBoosters } from 'const/entertainmentMBTrustBoosters';
import { strings } from 'const/strings';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const TrustBooster = ({
  isMobile,
  isHOHORevamp,
  trustBoosters = [],
  isEntertainmentBanner = false,
}: TTrustBoosterProps) => {
  const { city } = useRecoilValue(metaAtom) as Record<string, any>;

  const formatTrustBoosters = (trustBoosters: TPrismicTrustBooster[]) => {
    return (
      trustBoosters?.map?.(
        ({
          booster_title,
          booster_description,
          icon_url,
        }: TPrismicTrustBooster) => {
          return {
            name: booster_title,
            description: booster_description,
            icon: icon_url.url,
          };
        }
      ) ?? []
    );
  };

  const getTrustBoosters = () => {
    if (isHOHORevamp) {
      return [
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
      ];
    }

    if (isEntertainmentBanner) {
      return formatTrustBoosters(trustBoosters);
    }

    return [
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
          strings.ENTERTAINMENT_MB_LANDING_PAGE.TRUST_BOOSTERS.CHOOSE_YOUR_SEATS
            .DESCRIPTION,
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
  };

  let ICONS = getTrustBoosters();

  if (!ICONS?.length) {
    return <></>;
  }

  const swiperParams: SwiperOptions = {
    slidesPerView: isMobile ? 1 : ICONS?.length,
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
            {ICONS?.map((item, index) => {
              return (
                <div className="trust-booster" key={index}>
                  <Conditional if={isHOHORevamp || !isEntertainmentBanner}>
                    <div className="icon">{item.icon}</div>
                  </Conditional>
                  <Conditional if={!isHOHORevamp && isEntertainmentBanner}>
                    <Image
                      url={item.icon as string}
                      className="icon"
                      alt="trust-booster-image"
                    />
                  </Conditional>
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
          {ICONS?.map((item, index) => {
            return (
              <div className="trust-booster" key={index}>
                <Conditional if={isHOHORevamp || !isEntertainmentBanner}>
                  <div className="icon">{item.icon}</div>
                </Conditional>
                <Conditional if={!isHOHORevamp && isEntertainmentBanner}>
                  <Image
                    url={item.icon as string}
                    className="icon"
                    alt="trust-booster-image"
                  />
                </Conditional>
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
