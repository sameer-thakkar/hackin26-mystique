import React, { useEffect, useState } from 'react';
import Prismic from 'prismic-javascript';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useWindowWidth } from '@react-hook/window-size';
import { RichText } from 'prismic-reactjs';
import { SOLEIL, COLORS } from 'const/ui-constants';

import PopulateHead from '../common/meta';
import Header from '../common/Header';
import OverflowScroll from '../UI/OverflowScroll';
import Dropdown, { DropdownItem } from '../UI/Dropdown';
import Spinner from '../UI/Spinner';
import ListicleCard from './ListicleCard';
import LongForm from '../common/LongForm';
import Footer from '../common/Footer';
import WhyBookFromUs from './WhyBookFromUs';
import { groupSlices } from '../../utils/helper';
import { Client } from '../../config/prismic-config';
import { shortCodeSerializer } from '../../utils/shortCodes';
import { CHEVRON_LEFT_CIRCLE } from '../../assets/SvgIcons';
import { HEADOUT_API_ENDPOINT } from '../../constants';

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
  font-family: ${SOLEIL.FONT_STACK};
  color: ${COLORS.DAVY_GREY};
  width: 792px;
  margin-right: 24px;
  @media (max-width: 768px) {
    margin: 0 16px;
  }
`;

const Title = styled.div`
  font-size: 26px;
  line-height: 35px;
  font-weight: ${SOLEIL.SEMIBOLD};
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

const CategorySlider = styled.div`
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

const Category = styled.div`
  font-size: 20px;
  width: max-content;
  text-decoration: none;

  color: ${({ active }) =>
    active ? `${COLORS.RHAPSODY}` : `${COLORS.DAVY_GREY}`};
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
        `${HEADOUT_API_ENDPOINT}/v5/tour-group/slots/get/${tour.data.tgid}?for-days=90`
      ).then((r) => r.json());
    })
  );

  data = data.map((item, index) => ({ ...item, tgid: tours[index].uid }));

  const result = {
    monthOne: [],
    monthTwo: [],
    monthThree: [],
  };

  data.forEach((item) => {
    item.slots.forEach((slot) => {
      if (
        dayjs(slot.startDate).isBetween(
          dayjs(),
          dayjs().add(1, 'month').date(0)
        )
      ) {
        if (!result.monthOne.includes(item.tgid)) {
          result.monthOne.push(item.tgid);
        }
      } else if (
        dayjs(slot.startDate).isBetween(
          dayjs().add(1, 'month').date(1),
          dayjs().add(2, 'month').date(1)
        )
      ) {
        if (!result.monthTwo.includes(item.tgid)) {
          result.monthTwo.push(item.tgid);
        }
      } else if (
        dayjs(slot.startDate).isBetween(
          dayjs().add(2, 'month').date(1),
          dayjs().add(3, 'month').date(1)
        )
      ) {
        if (!result.monthTwo.includes(item.tgid)) {
          result.monthTwo.push(item.tgid);
        }
      }
    });
  });

  return new Promise((resolve) => {
    resolve(result);
  });
};

const Listicle = (props) => {
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
  } = props;

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
    nofollow,
    noindex,
    page_url,
  } = data;

  const currentLanguage = lang.split('-')[0];
  const hostSplit = host.split('.');
  hostSplit.shift();
  const bookingUrl = `https://book.${hostSplit.join('.')}${
    currentLanguage === 'en' ? '' : `/${currentLanguage}`
  }/book/`;

  // Fetching all tours of the listicle categories using tags and then fetching tour data
  useEffect(() => {
    setLoading(true);
    Client()
      .query(Prismic.Predicates.any('document.tags', [uid]), { lang })
      .then(async (res) => {
        const tourData = await Promise.all(
          res.results.map((tour) => {
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
        setTours(result);
        setFilteredTours(result);
      })
      .catch((err) => {
        console.log(err);
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
      logo_redirection_url: logoRedirectionURL,
      enable_powered_by_superbrand_logo: hasPoweredByHeadoutLogo,
      localization,
      enable_localization_menu,
      logo,
      logo_alt_text: logoAltText,
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
      favicon,
      header_scripts,
      google_site_verification,
      bing_site_verification,
    },
  } = commonData;

  // Head Props
  const headProps = {
    canonical_link,
    other_meta_tags,
    faq_schema,
    seo_keywords,
    title,
    description,
    image,
    nofollow,
    noindex,
    favicon,
    header_scripts,
    google_site_verification,
    bing_site_verification,
    localization,
    logo,
    page_url,
    isDev,
    currentLanguage,
    originalHost: host,
    serverRequestStartTimestamp,
  };

  const handleFilter = (month) => {
    setActiveFilter(month);
    if (month === 'all') {
      setFilteredTours(tours);
    } else {
      setFilteredTours(
        tours.filter((tour) => {
          if (availableTours[month].includes(tour.uid)) return true;
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
              {filterOptions[month]}
            </DropdownItem>
          );
        })}
      </Dropdown>
    </FilterWrapper>
  );

  return (
    <>
      <PopulateHead {...headProps} />
      <Header
        languages={localization}
        headerLinks={headerLinks}
        currentLanguage={currentLanguage}
        logoUrl={logo.url}
        logoAltText={logoAltText || logo.alt || ''}
        uid={uid}
        isMobile={isMobile}
        showGroupBooking={enableGroupBooking === 'Yes'}
        hasLanguageSelector={enable_localization_menu}
        logoRedirectionURL={logoRedirectionURL?.url || '/'}
        host={''}
        hasPoweredByHeadoutLogo={hasPoweredByHeadoutLogo || false}
      />
      <BannerWrapper>
        {listicleBannerImages.length ? (
          <Banner
            banners={listicleBannerImages.map(({ image }) => ({
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
                {listicleCategories.map((category, index) => {
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
                {listicleCategories.map((category, index) => {
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
        logoURL={commonFooter?.data?.logo?.url}
        logoAlt={commonFooter?.data?.logo?.alt}
        hasPoweredByHeadoutLogo={
          commonFooter?.data?.powered_by_superbrand || false
        }
        showDisclaimer={commonFooter?.data?.show_disclaimer}
        disclaimerText={commonFooter?.data?.disclaimer_text}
        microbrandType={commonFooter?.data?.microbrand_type}
        slices={commonFooter?.data?.body || []}
        invertLogoColor={commonFooter?.data?.invert_logo_color}
      />
    </>
  );
};

export default Listicle;
