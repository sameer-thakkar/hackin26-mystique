import React from 'react';
import Image from '../UI/Image';
import { SOLEIL, COLORS } from '../../constants/ui-constants';

const TrustBoosters = (props) => {
  const { boosters } = props;
  return (
    <div className="trust-boosters">
      {boosters.map((booster, index) => {
        return (
          <div className="trust-booster" key={index}>
            <Image url={booster.image_url} alt={booster.title} />
            <div className="booster-content">
              <span className="booster-heading">{booster.title}</span>
              <span className="booster-text">{booster.description}</span>
            </div>
          </div>
        );
      })}

      <style jsx>
        {`
          .trust-boosters {
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: auto;
            justify-items: left;
            justify-content: space-between;
            grid-gap: 32px;
            margin-top: 32px;
            margin-bottom: 59px;
          }
          .trust-boosters .trust-booster {
            display: grid;
            grid-template-columns: auto auto;
            grid-gap: 8px;
            align-items: center;
          }
          .trust-boosters .trust-booster img {
            width: 40px;
            height: 40px;
          }
          .booster-content {
            display: grid;
            grid-template-rows: auto auto;
            grid-row-gap: 4px;
          }
          .trust-boosters .trust-booster .booster-heading {
            font-family: ${SOLEIL.FONT_STACK};
            font-size: 16px;
            line-height: 22px;
            color: #545454;
            font-weight: ${SOLEIL.SEMIBOLD};
            color: ${COLORS.TWO_BLACK};
          }
          .trust-boosters .trust-booster .booster-text {
            font-family: ${SOLEIL.FONT_STACK};
            font-size: 14px;
            font-weight: ${SOLEIL.REGULAR};
            line-height: 15px;
            color: ${COLORS.FOUR_BLACK};
          }

          @media (max-width: 768px) {
            .trust-boosters {
              display: none;
            }
          }
        `}
      </style>
      <style global jsx>{`
        .trust-boosters .trust-booster img {
          width: 40px;
          height: 40px;
        }
        .trust-boosters .trust-booster picture {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default TrustBoosters;
