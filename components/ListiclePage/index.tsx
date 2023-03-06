import React, { useEffect, useState } from 'react';
import Prismic from 'prismic-javascript';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { Client } from 'config/prismic-config';
import { useWindowWidth } from '@react-hook/window-size';
import PopulateMeta from 'components/common/NextSeoMeta';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import OverflowScroll from 'components/UI/OverflowScroll';
import Dropdown, { DropdownItem } from 'components/UI/Dropdown';
import Spinner from 'components/UI/Spinner';
import LongForm from 'components/common/LongForm';
import ListicleCard from 'components/ListiclePage/ListicleCard';
import WhyBookFromUs from 'components/ListiclePage/WhyBookFromUs';
import { getAlternateLanguages } from 'utils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { groupSlices } from 'utils/helper';
import { getLogoRedirectionUrl } from 'utils/urlUtils';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { HEADOUT_API_ENDPOINT } from 'const/index';
import { CHEVRON_LEFT_CIRCLE } from 'assets/SvgIcons';

const Slider = dynamic(() => import('UI/Slider'));
const Banner = dynamic(() => import('components/MicrositeV2/Banner'));

dayjs.extend(isBetween);

const BannerWrapper = styled.div`
  margin-top: 80px;
`;

const Wrapper = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 64px auto 0;
  @media (max-width: 768px) {
    margin: 40px auto 0;
  }
`;

const Content = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  color: ${COLORS.GRAY.G2};
  width: 792px;
  margin-right: 24px;
  @media (max-width: 768px) {
    margin: 0 16px;
  }
`;

const Title = styled.div`
  font-size: 26px;
  line-height: 35px;
  font-weight: 600;
  color: black;

  margin-bottom: 16px;
`;

const ListicleCommonSummary = styled.div`
  p {
    margin: 0;
  }
  line-height: 160%;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const CategorySlider = styled.div<{ stickCategorySlider?: boolean }>`
  ${(props) => {
    if (props.stickCategorySlider) {
      return `
        position: fixed;
        top: 0;
        width: 1200px;
        z-index: 3;
        background: white;
        display: flex;
        align-items: center;
        height: 80px;
    `;
    } else {
      return `
        margin-bottom: 24px;
        .swiper-slide {
          width: max-content;
        }`;
    }
  }}
  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    z-index: 3;
    background: white;
    height: 56px;
    display: flex;
    align-items: center;
  }
`;

const Category = styled.div<{ active?: boolean }>`
  font-size: 20px;
  width: max-content;
  text-decoration: none;

  color: ${({ active }) =>
    active ? `${COLORS.BRAND.PURPS}` : `${COLORS.GRAY.G2}`};
`;

const ListicleDescription = styled.div`
  p {
    margin: 0;
  }
  line-height: 160%;
  margin-bottom: 8px;
`;

const FilterWrapper = styled.div`
  display: grid;
  grid-template-columns: max-content minmax(144px, max-content);
  justify-content: flex-end;
  grid-gap: 11px;
  font-size: 12px;
  line-height: 12px;
  span {
    justify-self: flex-end;
    align-self: center;
  }
`;

const DropdownTrigger = styled.div`
  border: 1px solid #fbfbfb;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  padding: 11px;

  color: #a4a4a4;

  font-size: 8px;
  line-height: 15px;
  div {
    color: black;
    font-size: 12px;
    line-height: 12px;
  }
`;

const SpinnerWrapper = styled.div`
  margin: 64px auto;
  width: max-content;
`;

const LongFormWrapper = styled.div`
  margin-top: 40px;
`;

const getToursAvailability = async (tours = []) => {
  let data = await Promise.all(
    tours.map((tour) => {
      return fetch(
        `${HEADOUT_API_ENDPOINT}/v5/tour-group/slots/get/${
          (tour as any).data.tgid
        }?for-days=90`
      ).then((r) => r.json());
    })
  );

  data = data.map((item, index) => ({
    ...item,
    tgid: (tours[index] as any).uid,
  }));

  const result = {
    monthOne: [],
    monthTwo: [],
    monthThree: [],
  };

  data.forEach((item) => {
    item.slots.forEach((slot: any) => {
      if (
        dayjs(slot.startDate).isBetween(
          dayjs(),
          dayjs().add(1, 'month').date(0)
        )
      ) {
        // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        if (!result.monthOne.includes(item.tgid)) {
          // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
          result.monthOne.push(item.tgid);
        }
      } else if (
        dayjs(slot.startDate).isBetween(
          dayjs().add(1, 'month').date(1),
          dayjs().add(2, 'month').date(1)
        )
      ) {
        // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        if (!result.monthTwo.includes(item.tgid)) {
          // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
          result.monthTwo.push(item.tgid);
        }
      } else if (
        dayjs(slot.startDate).isBetween(
          dayjs().add(2, 'month').date(1),
          dayjs().add(3, 'month').date(1)
        )
      ) {
        // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        if (!result.monthTwo.includes(item.tgid)) {
          // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
          result.monthTwo.push(item.tgid);
        }
      }
    });
  });

  return new Promise((resolve) => {
    resolve(result);
  });
};

const Listicle = (props: any) => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [stickElements, setStickElements] = useState(false);
  const [availableTours, setAvailableTours] = useState({});
  const width = useWindowWidth();
  const filterOptions = {
    all: 'All Shows',
    monthOne: dayjs().format('MMMM'),
    monthTwo: dayjs().add(1, 'month').format('MMMM'),
    monthThree: dayjs().add(2, 'month').format('MMMM'),
  };

  // Slots effect
  useEffect(() => {
    getToursAvailability(tours).then((data) => {
      // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
      setAvailableTours(data);
    });
  }, [tours, setAvailableTours]);

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

  // Scroll listener effect
  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      if (window.pageYOffset > 650) {
        return setStickElements(true);
      } else if (window.pageYOffset < 550) {
        return setStickElements(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, setStickElements]);

  const {
    data,
    lang,
    uid,
    host,
    isDev,
    serverRequestStartTimestamp,
    commonHeader,
    commonFooter,
    contentFramework,
    alternate_languages,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    domainConfig,
  } = props;

  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );

  const contentFrameworkSlices = groupSlices(
    contentFramework?.data?.body || []
  );

  const {
    common_data: commonData,
    listicle_description: listicleDescription,
    listicle_category_name: listicleCategoryName,
    canonical_link,
    other_meta_tags,
    faq_schema,
    seo_keywords,
    title,
    description,
    image,
    noindex,
  } = data;

  const currentLanguage = lang.split('-')[0];
  const hostSplit = host.split('.');
  hostSplit.shift();
  const bookingUrl = `https://book.${hostSplit.join('.')}${
    currentLanguage === 'en' ? '' : `/${currentLanguage}`
  }/book/`;
  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: currentLanguage,
    isDev,
    host,
  });

  // Fetching all tours of the listicle categories using tags and then fetching tour data
  useEffect(() => {
    setLoading(true);
    Client()
      .query(Prismic.Predicates.any('document.tags', [uid]), { lang })
      .then(async (res: any) => {
        const tourData = await Promise.all(
          res.results.map((tour: any) => {
            return fetch(
              `${HEADOUT_API_ENDPOINT}/v5/tour-group/get/${
                tour.data.tgid
              }?fetch-variants=false&fetch-collection-svg=false&language=${
                currentLanguage || 'en'
              }`
            ).then((r) => r.json());
          })
        );
        setLoading(false);
        const result = tourData.map((tour: any, index) => {
          return {
            ...res.results[index],
            ...tour,
            bookingUrl,
          };
        });
        // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
        setTours(result);
        // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
        setFilteredTours(result);
      })
      .catch((err: any) => {
        console.log(err); //eslint-disable-line
      });
  }, [
    uid,
    lang,
    setLoading,
    setTours,
    setFilteredTours,
    currentLanguage,
    bookingUrl,
  ]);

  const {
    data: {
      enable_group_booking: enableGroupBooking,
      header_links: headerLinks,
    },
  } = commonHeader;

  const {
    data: {
      listicle_banner_images: listicleBannerImages,
      listicle_common_title: listicleCommonTitle,
      listicle_common_summary: listicleCommonSummary,
      listicle_categories: listicleCategories,
      why_book_from_us: whyBookFromUsData = [],
      header_scripts,
      google_site_verification,
      bing_site_verification,
    },
  } = commonData;

  const {
    faviconUrl,
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};

  // Head Props
  const headProps = {
    canonical_link,
    other_meta_tags,
    faq_schema,
    seo_keywords,
    title,
    description,
    image,
    noindex,
    header_scripts,
    google_site_verification,
    bing_site_verification,
  };

  const handleFilter = (month: any) => {
    setActiveFilter(month);
    if (month === 'all') {
      setFilteredTours(tours);
    } else {
      setFilteredTours(
        tours.filter((tour) => {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          if (availableTours[month].includes((tour as any).uid)) return true;
          return false;
        })
      );
    }
  };

  const FilterElement = () => (
    <FilterWrapper>
      <span>Filter Shows</span>
      <Dropdown
        triggerElement={
          <DropdownTrigger>
            Months
            {/* @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
            <div>{filterOptions[activeFilter]}</div>
          </DropdownTrigger>
        }
      >
        {Object.keys(filterOptions).map((month, index) => {
          return (
            <DropdownItem
              key={index}
              {...(activeFilter === month && { active: true })}
              onClick={() => {
                handleFilter(month);
              }}
            >
              {/* @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
              {filterOptions[month]}
            </DropdownItem>
          );
        })}
      </Dropdown>
    </FilterWrapper>
  );

  return (
    <>
      <PopulateMeta
        {...{
          prismicData: headProps,
          datePublished,
          dateModified,
          serverRequestStartTimestamp,
          languages: alternateLanguages,
          isMobile,
          bannerImages: listicleBannerImages,
          faviconUrl,
          logoUrl: logoUrl,
        }}
      />
      <Header
        languages={alternateLanguages}
        headerLinks={headerLinks}
        currentLanguage={currentLanguage}
        logoUrl={logoUrl}
        logoAltText={whiteLabelName || ''}
        uid={uid}
        isMobile={isMobile}
        showGroupBooking={enableGroupBooking === 'Yes'}
        logoRedirectionURL={logoRedirectionUrl}
        host={''}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
      />
      <BannerWrapper>
        {listicleBannerImages.length ? (
          <Banner
            banners={listicleBannerImages.map(({ image }: any) => ({
              url: image.url || '',
              alt: image.alt || 'banner-image',
            }))}
            isMobile={isMobile}
            ready={true}
          />
        ) : null}
      </BannerWrapper>
      <Wrapper>
        <Content>
          <Title>{listicleCommonTitle}</Title>
          <ListicleCommonSummary>
            <RichText
              render={listicleCommonSummary}
              htmlSerializer={shortCodeSerializer}
            />
          </ListicleCommonSummary>
          {isMobile ? (
            <CategorySlider>
              <OverflowScroll>
                {listicleCategories.map((category: any, index: number) => {
                  return (
                    <Category
                      key={index}
                      {...(listicleCategoryName.toLowerCase() ===
                      category.listicle_category_name.toLowerCase()
                        ? { active: true }
                        : {
                            as: 'a',
                            href: category.listicle_category_link?.url || '/',
                          })}
                    >
                      {category.listicle_category_name}
                    </Category>
                  );
                })}
              </OverflowScroll>
            </CategorySlider>
          ) : (
            <CategorySlider stickCategorySlider={stickElements}>
              <Slider
                sliderOptions={{ slidesPerView: 'auto', spaceBetween: 24 }}
                nextButton={CHEVRON_LEFT_CIRCLE}
                prevButton={CHEVRON_LEFT_CIRCLE}
              >
                {listicleCategories.map((category: any, index: number) => {
                  return (
                    <Category
                      key={index}
                      {...(listicleCategoryName.toLowerCase() ===
                      category.listicle_category_name.toLowerCase()
                        ? { active: true }
                        : {
                            as: 'a',
                            href: category.listicle_category_link?.url || '/',
                          })}
                    >
                      {category.listicle_category_name}
                    </Category>
                  );
                })}
              </Slider>
              {stickElements ? <FilterElement /> : null}
            </CategorySlider>
          )}
          <ListicleDescription>
            <RichText
              render={listicleDescription}
              htmlSerializer={shortCodeSerializer}
            />
          </ListicleDescription>
          {stickElements && !isMobile ? null : <FilterElement />}
          {loading ? (
            <SpinnerWrapper>
              <Spinner>Loading...</Spinner>
            </SpinnerWrapper>
          ) : filteredTours.length === 0 ? (
            'No tours available.'
          ) : (
            filteredTours.map((tour, index) => {
              return (
                <ListicleCard
                  {...(index === 0 && { isOpen: true })}
                  currentLanguage={currentLanguage}
                  key={index}
                  isMobile={isMobile}
                  tour={tour}
                />
              );
            })
          )}
        </Content>
        {isMobile || whyBookFromUsData.length === 0 ? null : (
          <WhyBookFromUs data={whyBookFromUsData} />
        )}
      </Wrapper>
      {contentFrameworkSlices ? (
        <LongFormWrapper>
          <LongForm content={contentFrameworkSlices} isMobile={isMobile} />
        </LongFormWrapper>
      ) : null}
      <Footer
        currentLanguage={currentLanguage}
        attraction={commonFooter?.data?.attraction || 'attraction'}
        logoURL={logoUrl}
        logoAlt={whiteLabelName || ''}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        disclaimerText={commonFooter?.data?.disclaimer_text}
        slices={commonFooter?.data?.body || []}
      />
    </>
  );
};

export default Listicle;
