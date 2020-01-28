import React, { useState, useEffect } from "react";
import { STAR } from "../../static/svg-icons";
import { GRAPHIK, COLORS } from "../../constants/ui-constants";
const RatingBoosterCombo = props => {
  const { tgid, text } = props;
  const [booster, setBooster] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(`https://api.headout.com/api/v5/tour-group/get/${tgid}`)
      .then(res => res.json())
      .then(data => {
        setBooster({
          isLoaded: true,
          rating: data.averageRating,
          boosterText: text || data.callToAction
        });
        setReady(true);
      });
  }, []);

  return ready ? (
    <>
      <span className="booster-container">
        {booster.rating ? (
          <span className="rating">
            {STAR("#FFBB58")}
            {booster.rating}
          </span>
        ) : (
          <span className="new">NEW</span>
        )}
        <span>{booster.boosterText ? " | " + booster.boosterText : ""}</span>
      </span>
      <style jsx>{`
        .booster-container {
          margin-top: 4px;
          display: grid;
          grid-template-columns: auto auto auto;
          justify-content: left;
          align-items: center;
          font-weight: ${GRAPHIK.REGULAR};
          grid-gap: 5px;
          font-size: 12px;
          font-family: ${GRAPHIK.FONT_STACK};
          line-height: 1;
        }
        .booster-container .new {
          color: ${COLORS.TEAL};
        }
        .booster-container .rating {
          display: grid;
          grid-gap: 5px;
          grid-template-columns: auto auto;
          align-items: center;
        }
      `}</style>
    </>
  ) : (
    <>{"\u00A0"}</>
  );
};

export default RatingBoosterCombo;
