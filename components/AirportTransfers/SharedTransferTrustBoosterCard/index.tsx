import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import {
  AT_SHARED_TRUSTBOOSTER_ILLUSTRATION_URL,
  AT_TRUSTED_PARTNERS_IMG_URL,
} from 'const/airportTransfers';
import { strings } from 'const/strings';
import { SparkleSVG } from 'assets/airportTransfers/ctaCardsSVGs';
import { CardContainer } from './style';

export const SharedTransferTrustBoosterCard = ({
  isSmall,
  hasAirportTabs = false,
}: {
  isSmall?: boolean;
  hasAirportTabs?: boolean;
}) => {
  return (
    <CardContainer $isSmall={isSmall} $hasTabsAbove={hasAirportTabs}>
      <div className="card-title">
        {strings.formatString(
          strings.AIRPORT_TRANSFER.TRUSTED_PARTNERS,
          <span className="purps-text">
            {strings.AIRPORT_TRANSFER.WORLDWIDE}
          </span>
        )}
      </div>

      <Conditional if={!isSmall}>
        <ul className="trust-points">
          <li>
            <SparkleSVG />
            {strings.AIRPORT_TRANSFER.COMFORTABLE_RIDES}
          </li>
          <li>
            <SparkleSVG />
            {strings.AIRPORT_TRANSFER.FREQUENT_DEPARTURES}
          </li>

          <li>
            <SparkleSVG />
            {strings.AIRPORT_TRANSFER.MULTIPLE_TRANSPORT_OPTIONS}
          </li>
        </ul>
      </Conditional>

      <div className="brands-img">
        <Image
          url={AT_TRUSTED_PARTNERS_IMG_URL}
          alt="Airport Transfer Brands"
          fill
          aspectRatio="4.23"
        />
      </div>

      <p>{strings.AIRPORT_TRANSFER.AND_MANY_MORE}</p>

      <Conditional if={!isSmall}>
        <div className="illustration">
          <Image
            url={AT_SHARED_TRUSTBOOSTER_ILLUSTRATION_URL}
            alt="Shared transfers illustration"
            fill
          />
        </div>
      </Conditional>
    </CardContainer>
  );
};
