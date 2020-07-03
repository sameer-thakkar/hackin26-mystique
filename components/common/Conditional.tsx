const Conditional = ({ if: condition, children }) => {
  return condition ? children : null;
};

export default Conditional;
