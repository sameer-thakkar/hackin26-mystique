declare module '@headout/aer' {
	type ButtonType = import('./declarationType').ButtonType;
	function getFontDetailsByLabel(label: string): string;
	const tokens = {
		colors: Record<string, any>,
		gradients: Record<string, any>,
		typography: Record<string, any>,
	};
	const PhoneInput = React.Component<any>;
	const Icon = React.Component<any>;
	const TextBlock = React.Component<any>;
	const Input = React.Component<any>;
	const Image = React.Component<any>;
	const Link = React.Component<any>;
	const OldButton = React.Component<any>;
	const Dropdown = React.Component<any>;
	const Container = React.Component<any>;
	const ContainerItem = React.Component<any>;
	const FormElement = React.Component<any>;
	const DateListItem = React.Component<any>;
	const TabularDropdown = React.Component<any>;
	const Button = React.Component<ButtonType>;
}
