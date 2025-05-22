import { useContext, useEffect, useState } from 'react';
import { getIntlDate } from '@headout/espeon/utils/date';
import Conditional from 'components/common/Conditional';
import { TShowPageDescriptorSectionProps } from 'components/MicrositeV2/ShowPageV2/ShowPageDescriptorSection/interface';
import {
  DescriptorsWrapper,
  Divider,
  ShowPageDescriptorSectionWrapper,
  SpecialOfferBanner,
} from 'components/MicrositeV2/ShowPageV2/ShowPageDescriptorSection/stlye';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { convertDateToIsoDate } from 'utils/dateUtils';
import { descriptorIcons } from 'const/descriptorIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  INVALID_DATE,
  PERMANENT_SHOWS_TGIDS,
} from 'const/index';
import { strings } from 'const/strings';
import { useIsLTTShowPageExperiementEnabled } from '../hooks/useIsLTTShowPageExperiementEnabled';

const ShowPageDescriptorSection = ({
  microBrandsHighlight,
  isMobile,
  tgid,
  uid,
}: TShowPageDescriptorSectionProps) => {
  const { detailsObjects, hasSpecialOffer, specialOffer } =
    parseShowPageData(microBrandsHighlight);
  const [ageSuitabilitySectionExists, setAgeSuitabilitySectionExists] =
    useState(false);
  const { offerHeading, offerText } = specialOffer ?? {};

  const { lang } = useContext(MBContext);

  const { isShowPageExperiment } = useIsLTTShowPageExperiementEnabled(uid);

  const {
    [strings.SHOW_PAGE.DURATION]: duration,
    [strings.SHOW_PAGE.AGE_LIMIT]: ageLimit,
    [strings.SHOW_PAGE.CLOSING_DATE]: closingDate,
  } = detailsObjects;

  const descriptors: Record<
    string,
    { content: string; icon: any; label: string }
  > = {
    duration: {
      content: duration,
      label: strings.SHOW_PAGE.DURATION ?? 'Duration',
      icon: descriptorIcons['DURATION'],
    },
    ...(!PERMANENT_SHOWS_TGIDS.includes(tgid) && {
      dates: {
        content: closingDate,
        label: strings.SHOW_PAGE.CLOSING_DATE ?? 'Closing Date',
        icon: descriptorIcons['EXTENDED_VALIDITY'],
      },
    }),
    age: {
      content: ageLimit,
      label: strings.SHOW_PAGE.AGE_LIMIT ?? 'Age',
      icon: descriptorIcons['USER'],
    },
  };

  const jumpToAgeSuitability = () => {
    const ageSuitabilitySection =
      document.getElementById(`Age & content guide`);
    if (!ageSuitabilitySection) return;
    trackEvent({
      eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.INFO_HEADING]:
        strings.SHOW_PAGE_V2.CONTENT_SECTION_HEADERS
          .AGE_SUITABILITY_AND_GUIDELINES,
    });
    window.scrollTo({
      top: ageSuitabilitySection.offsetTop - 16 * (isMobile ? 8 : 10),
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    const ageSuitabilitySection =
      document.getElementById(`Age & content guide`);
    setAgeSuitabilitySectionExists(!!ageSuitabilitySection);
  }, []);

  return (
    <ShowPageDescriptorSectionWrapper
      $isShowPageExperiment={isShowPageExperiment}
    >
      <DescriptorsWrapper numberOfDescriptors={Object.keys(descriptors).length}>
        {Object.keys(descriptors).map((key) => {
          const { content, icon: Icon, label } = descriptors[key];
          if (!content) return null;

          return (
            <div className="descriptor" key={key}>
              <div className="icon">
                <Icon />
              </div>
              <div className="content">
                <span className="title">{label.toUpperCase()}</span>
                <div
                  className={`value ${key} ${
                    ageSuitabilitySectionExists ? '' : 'no-highlight'
                  } `}
                  {...(key === 'age' && {
                    onClick: jumpToAgeSuitability,
                    id: 'age-suitability',
                  })}
                >
                  <span>
                    {key === 'dates' &&
                    convertDateToIsoDate(content) !== INVALID_DATE
                      ? strings.formatString(
                          strings.SHOW_PAGE_V2.UNTIL_DATE,
                          getIntlDate({
                            date: convertDateToIsoDate(content),
                            lang,
                            options: {
                              dateStyle: 'long',
                            },
                          })
                        )
                      : content}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </DescriptorsWrapper>

      <Conditional if={isShowPageExperiment}>
        <Divider />
      </Conditional>

      <Conditional if={hasSpecialOffer && offerText}>
        <SpecialOfferBanner>
          <div className="icon"></div>
          <div className="content">
            <div className="title">
              {offerHeading ?? strings.SPECIAL_OFFER}{' '}
            </div>
            <div className="offer-text">{offerText}</div>
          </div>
        </SpecialOfferBanner>
      </Conditional>
    </ShowPageDescriptorSectionWrapper>
  );
};

export default ShowPageDescriptorSection;
