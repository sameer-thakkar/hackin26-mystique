import type { TConditional } from './types';

export const Conditional = (props: TConditional) => {
  const { if: condition, children } = props;
  return condition ? children : null;
};
