import {
  Container,
  Wrapper,
} from 'components/MicrositeV2/LttLandingPageV2/BannerV2TrustBooster/style';
import { lttTrustBoostersIcons } from 'const/lttTrustBoosters';
import { ITrustBoosterProps } from './interface';

const icons = [
  {
    name: 'Instant tickets',
    icon: lttTrustBoostersIcons['INSTANT_TICKET'],
    description: 'Confirmation straight from the box office.',
  },
  {
    name: `Prices you'll love`,
    icon: lttTrustBoostersIcons['PRICES'],
    description: 'Unbeatable prices for must-see shows.',
  },
  {
    name: 'Choose your seats',
    icon: lttTrustBoostersIcons['SEATS'],
    description: 'Get the best seats for every show.',
  },
  {
    name: 'Official London Theatre Tickets',
    icon: lttTrustBoostersIcons['OFFICIAL_TICKET'],
    description: 'Book swiftly and securely with us.',
  },
];

const TrustBooster = ({ pinnedCardPresent }: ITrustBoosterProps) => {
  return (
    <Container pinnedCardPresent={pinnedCardPresent}>
      <Wrapper>
        {icons.map((item, index) => {
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
      </Wrapper>
    </Container>
  );
};

export default TrustBooster;
