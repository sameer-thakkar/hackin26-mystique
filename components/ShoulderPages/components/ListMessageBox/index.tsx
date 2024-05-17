import Conditional from 'components/common/Conditional';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import ChevronRightIcon from 'assets/chevronRight';
import StarIcon from 'assets/listStar';
import { IMessageBoxProps } from '../../interface';
import { Container, CTA, List } from './styles';

const MessageBox = ({ list = [], CTALink }: IMessageBoxProps) => {
  const title = strings.CONTENT_PAGE.DID_YOU_KNOW;

  const onCtaClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.SHOULDER_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: title,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.TEXT,
      [ANALYTICS_PROPERTIES.LABEL]: en.CONTENT_PAGE.MORE_INTERESTING_FACTS,
    });
  };
  return (
    <Container>
      <p className="title">{title}</p>
      <List>
        {list?.map(({ content }, index) => (
          <div key={index}>
            <StarIcon />
            <p>{content}</p>
          </div>
        ))}
      </List>
      <Conditional if={CTALink}>
        <CTA href={CTALink} target="_blank" onClick={onCtaClick}>
          {strings.CONTENT_PAGE.MORE_INSIGHTS}
          <ChevronRightIcon
            strokeColor={COLORS.BRAND.PURPS}
            fillColor={COLORS.BRAND.PURPS}
          />
        </CTA>
      </Conditional>
    </Container>
  );
};

export default MessageBox;
