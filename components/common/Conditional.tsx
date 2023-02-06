const Conditional = ({
  if: condition,
  children
}: any) => {
  return condition ? children : null;
};

export default Conditional;
