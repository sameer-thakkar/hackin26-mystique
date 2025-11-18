import { Link, Text } from '@headout/eevee';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import GroupBookingSvg from 'assets/groupBookingSvg';
import { groupBookingCtaRecipe } from './styles';

const GroupBookingCTA = ({
  ctaUrl,
  tgid,
}: {
  ctaUrl: string;
  tgid: number | string;
}) => {
  const styles = groupBookingCtaRecipe();
  return (
    <div className={styles.root}>
      <Text as="h3" className={styles.title}>
        {strings.GROUP_BOOKING.TITLE}
      </Text>
      <Text as="p" className={styles.subtext}>
        {strings.GROUP_BOOKING.SUBTEXT}
      </Text>
      <Link
        text={strings.GROUP_BOOKING.LINK_TEXT}
        size="medium"
        className={styles.link}
        as="a"
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent({
            eventName: ANALYTICS_EVENTS.GROUP_BOOKING_CTA_CLICKED,
            [ANALYTICS_PROPERTIES.TGID]: tgid,
          });
        }}
      />
      <GroupBookingSvg className={styles.svg} />
      <span className={styles.gradient} />
    </div>
  );
};

export default GroupBookingCTA;
