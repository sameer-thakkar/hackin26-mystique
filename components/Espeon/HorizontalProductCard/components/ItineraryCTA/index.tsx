import React from 'react';
import { strings } from 'const/strings';
import MapBackground from 'assets/mapBackground';
import Route from 'assets/route';
import { itineraryCTAStylesRecipe } from './styles';

const ItineraryCTA = ({
  onItineraryCTAClick,
}: {
  onItineraryCTAClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const styles = itineraryCTAStylesRecipe();
  return (
    <button className={styles.container} onClick={onItineraryCTAClick}>
      <MapBackground />
      <span className={styles.CTAContent}>
        <Route />
        <span>{strings.ITINERARY.TAB}</span>
      </span>
    </button>
  );
};

export default ItineraryCTA;
