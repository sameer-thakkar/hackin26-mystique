import React from 'react';
import styled from 'styled-components';
import Image from 'UI/Image';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';

const StyledTrustBoosters = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  justify-items: left;
  justify-content: space-between;
  grid-gap: 32px;
  margin-top: 32px;
  margin-bottom: 59px;
  .trust-booster {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 8px;
    align-items: center;
  }
  .trust-booster img {
    width: 40px;
    height: 40px;
  }
  .trust-booster picture {
    display: flex;
    align-items: center;
  }
  .booster-content {
    display: grid;
    grid-template-rows: auto auto;
    grid-row-gap: 4px;
  }
  .trust-booster .booster-heading {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
    color: ${COLORS.GRAY.G2};
  }
  .trust-booster .booster-text {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 14px;
    font-weight: 400;
    line-height: 15px;
    color: ${COLORS.GRAY.G2};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const TrustBoosters = (props: any) => {
  const { boosters, isMobile } = props;
  if (isMobile) return null;
  return (
    <StyledTrustBoosters className="trust-boosters">
      {boosters.map((booster: any, index: number) => {
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
    </StyledTrustBoosters>
  );
};

export default TrustBoosters;
