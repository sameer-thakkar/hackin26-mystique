import React, { useState, useEffect } from 'react';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { STAR } from 'assets/SvgIcons';
import { strings } from 'const/strings';
import { HEADOUT_API_ENDPOINT } from 'const/index';

const RatingBoosterCombo = (props) => {
  const { tgid, text } = props;
  const [booster, setBooster] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(`${HEADOUT_API_ENDPOINT}/v5/tour-group/list?ids%5B%5D=${tgid}`)
      .then((res) => res.json())
      .then((data) => {
        const tour = data?.tourGroups[0];
        setBooster({
          isLoaded: true,
          rating: tour?.averageRating,
          boosterText: text || tour?.callToAction,
        });
        setReady(true);
      });
  }, [tgid, text]);

  return ready ? (
    <>
      <span className="cta-booster-combo booster-container">
        {booster.rating ? (
          <span className="booster-rating">
            {STAR('#FFBB58')}
            {booster.rating}
          </span>
        ) : (
          <span className="new">{strings.NEW}</span>
        )}
        <span className="booster-text">
          {booster.boosterText ? ' | ' + booster.boosterText : ''}
        </span>
      </span>
      <style jsx>{`
        .booster-container {
          display: grid;
          grid-template-columns: auto auto auto;
          justify-content: left;
          align-items: center;
          font-weight: 400;
          grid-gap: 5px;
          font-size: 12px;
          font-family: ${HALYARD.FONT_STACK};
          line-height: 1;
          color: ${COLORS.GRAY.G2};
        }
        .booster-container .new {
          color: ${COLORS.TEXT.BEACH};
        }
        .booster-container .booster-rating {
          display: grid;
          grid-gap: 5px;
          grid-template-columns: auto auto;
          align-items: center;
        }
        .booster-container .booster-text {
          color: ${COLORS.GRAY.G2};
        }
      `}</style>
      <style jsx global>{`
        .booster-rating svg {
          height: 12px;
          width: 12px;
          margin-bottom: 1px;
        }
      `}</style>
    </>
  ) : (
    <>{'\u00A0'}</>
  );
};

export default RatingBoosterCombo;
