import React from 'react';
import COLORS from 'const/colors';

type TBoosterProps = { color: string; text: string };

const Booster = ({ color, text }: TBoosterProps) => {
  return (
    <span className="inline-booster" style={{ color }}>
      {text}
    </span>
  );
};

Booster.defaultProps = {
  color: COLORS.TEXT.BEACH,
};

export default Booster;
