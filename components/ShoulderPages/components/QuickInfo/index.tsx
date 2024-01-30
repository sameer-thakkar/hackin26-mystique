import Conditional from 'components/common/Conditional';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import ChevronRightIcon from 'assets/chevronRight';
import { IQuickInfoProps } from '../../interface';
import RedirectionIcon from '../RedirectIcon';
import { Container, CTA } from './styles';

const QuickInfo = ({ info = {}, CTALink, id }: IQuickInfoProps) => {
  const onCtaClick =
    (key: keyof typeof en.CONTENT_PAGE, ctaType?: string) => () => {
      trackEvent({
        eventName: ANALYTICS_EVENTS.SHOULDER_PAGE_CTA_CLICKED,
        [ANALYTICS_PROPERTIES.SECTION]: 'Quick Information',
        [ANALYTICS_PROPERTIES.CTA_TYPE]: ctaType || CTA_TYPE.BUTTON,
        [ANALYTICS_PROPERTIES.LABEL]: en.CONTENT_PAGE[key],
      });
    };

  return (
    <Container id={id}>
      <h2>{strings.CONTENT_PAGE.QUICK_INFORMATION}</h2>
      <div className="pairs-container">
        {Object.entries(info).map(([key, val]) => {
          const { value, Icon, url } = val;
          return (
            <div key={key} className="pair">
              <Conditional if={Icon}>
                <div className="icon">
                  <Icon />
                </div>
              </Conditional>
              <div className="text-container">
                <p className="label">
                  {
                    strings.CONTENT_PAGE[
                      key as keyof typeof strings.CONTENT_PAGE
                    ]
                  }
                </p>
                <Conditional if={!url}>
                  <p>{value}</p>
                </Conditional>
                <Conditional if={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onCtaClick(
                      key as keyof typeof strings.CONTENT_PAGE
                    )}
                  >
                    <p>{value}</p>
                    <RedirectionIcon aria-hidden="true" />
                  </a>
                </Conditional>
              </div>
            </div>
          );
        })}
      </div>
      <Conditional if={CTALink}>
        <CTA
          href={CTALink}
          target="_blank"
          onClick={onCtaClick('PLAN_YOUR_VISIT', CTA_TYPE.TEXT)}
        >
          {strings.CONTENT_PAGE.PLAN_YOUR_VISIT}
          <ChevronRightIcon
            strokeColor={COLORS.BRAND.PURPS}
            fillColor={COLORS.BRAND.PURPS}
          />
        </CTA>
      </Conditional>
    </Container>
  );
};

export default QuickInfo;
