import dayjs from 'dayjs';
import Conditional from 'components/common/Conditional';
import { TShowPageDescriptorSectionProps } from 'components/MicrositeV2/LttShowPageV2/ShowPageDescriptorSection/interface';
import {
  DescriptorsWrapper,
  ShowPageDescriptorSectionWrapper,
  SpecialOfferBanner,
} from 'components/MicrositeV2/LttShowPageV2/ShowPageDescriptorSection/stlye';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import { trackEvent } from 'utils/analytics';
import { descriptorIcons } from 'const/descriptorIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';

const ShowPageDescriptorSection = ({
  microBrandsHighlight,
  isMobile,
}: TShowPageDescriptorSectionProps) => {
  const { detailsObjects, hasSpecialOffer, specialOffer } =
    parseShowPageData(microBrandsHighlight);
  const ageSuitabilitySection = document.getElementById(`Age & content guide`);
  const { offerHeading, offerText } = specialOffer ?? {};

  const {
    [strings.SHOW_PAGE.DURATION]: duration,
    [strings.SHOW_PAGE.AGE_LIMIT]: ageLimit,
    [strings.SHOW_PAGE.CLOSING_DATE]: closingDate,
  } = detailsObjects;

  const descriptors: Record<string, { content: string; icon: any }> = {
    duration: {
      content: duration,
      icon: descriptorIcons['DURATION'],
    },
    dates: {
      content: closingDate,
      icon: descriptorIcons['EXTENDED_VALIDITY'],
    },
    age: {
      content: ageLimit,
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
        strings.LTT_SHOW_PAGE.CONTENT_SECTION_HEADERS
          .AGE_SUITABILITY_AND_GUIDELINES,
    });
    window.scrollTo({
      top: ageSuitabilitySection.offsetTop - 16 * (isMobile ? 8 : 10),
      behavior: 'smooth',
    });
  };

  return (
    <ShowPageDescriptorSectionWrapper>
      <DescriptorsWrapper>
        {Object.keys(descriptors).map((key) => {
          const { content, icon: Icon } = descriptors[key];
          if (!content) return null;
          return (
            <div className="descriptor" key={key}>
              <div className="icon">
                <Icon />
              </div>
              <div className="content">
                <span className="title">{key.toUpperCase()}</span>
                <div
                  className={`value ${key} ${
                    ageSuitabilitySection ? '' : 'no-highlight'
                  } `}
                  {...(key === 'age' && {
                    onClick: jumpToAgeSuitability,
                    id: 'age-suitability',
                  })}
                >
                  <span>
                    {key === 'dates'
                      ? strings.formatString(
                          strings.LTT_SHOW_PAGE.UNTIL_DATE,
                          dayjs(content).format('D MMMM YYYY')
                        )
                      : content}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </DescriptorsWrapper>

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
