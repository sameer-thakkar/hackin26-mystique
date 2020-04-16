import React from 'react';
import { COLORS } from '../constants/ui-constants';

const Booster = (props) => {
  const { color, text } = props;
  return (
    <span className="inline-booster" style={{ color }}>
      {text}
    </span>
  );
};

Booster.defaultProps = {
  color: COLORS.TEAL,
};

export default Booster;
