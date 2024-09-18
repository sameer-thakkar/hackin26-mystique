const Conditional = ({ if: condition, children }: any) => {
  return condition ? children ?? null : null;
};

export default Conditional;
