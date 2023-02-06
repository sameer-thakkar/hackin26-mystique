import React from 'react';
import COLORS from 'const/colors';

const Booster: React.FC<{ color: string; text: string }> = (props) => {
  const { color, text } = props;
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
