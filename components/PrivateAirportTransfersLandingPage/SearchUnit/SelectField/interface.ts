export type TSelectFieldProps = {
  icon: React.ReactNode;
  value?: string;
  topLabel: string;
  placeHolderText: string;
  onClick: () => void;
  isFocused: boolean;
  error?: boolean;
  className?: string;
};
