declare module '@headout/aer' {
  type ButtonType = import('./declarationType').ButtonType;
  function getFontDetailsByLabel(label: string): string;
  type tokens = {
    colors: Record<string, any>;
    gradients: Record<string, any>;
    typography: Record<string, any>;
  };
  const PhoneInput: React.FC<any>;
  const Icon: React.FC<any>;
  const TextBlock: React.FC<any>;
  const Input: React.FC<any>;
  const Image: React.FC<any>;
  const Link: React.FC<any>;
  const OldButton: React.FC<any>;
  const Dropdown: React.FC<any>;
  const Container: React.FC<any>;
  const ContainerItem: React.FC<any>;
  const FormElement: React.FC<any>;
  const DateListItem: React.FC<any>;
  const TabularDropdown: React.FC<any>;
  const Button: React.FC<ButtonType>;
}
