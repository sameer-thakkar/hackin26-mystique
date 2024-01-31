// usage: yarn jscodeshift src --extensions=js,jsx,ts,tsx --parser=tsx --transform codemod/update-component-imports.js

module.exports = function (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Define the mapping from component names to their respective submodules
  const componentMappings = {
    // Update this mapping for your specific components
    TextBlock: '@headout/aer/src/atoms/TextBlock',
    OldButton: '@headout/aer/src/atoms/OldButton',
    Link: '@headout/aer/src/atoms/Link',
    Image: '@headout/aer/src/atoms/Image',
    Input: '@headout/aer/src/atoms/Input',
    Icon: '@headout/aer/src/atoms/Icon',
    PhoneInput: '@headout/aer/src/atoms/PhoneInput',
    Dropdown: '@headout/aer/src/atoms/Dropdown',
    TabularDropdown: '@headout/aer/src/atoms/DropdownList',
    Button: '@headout/aer/src/atoms/Button',
    Container: '@headout/aer/src/layout/Container',
    ContainerItem: '@headout/aer/src/layout/ContainerItem',
    FormElement: '@headout/aer/src/molecules/FormElement',
    DateListItem: '@headout/aer/src/molecules/DateListItem',
    getFontDetailsByLabel: '@headout/aer/src/tokens/typography',
    tokens: '@headout/aer/src/tokens/index',
    // Add mappings for other named imports as needed
  };

  const aerImports = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === '@headout/aer');

  if (!aerImports.length) {
    return root.toSource({ quote: 'single', tabWidth: 4, useTabs: true });
  }

  aerImports.forEach((path) => {
    const importSpecifiers = path.node.specifiers;
    const newImports = [];

    importSpecifiers
      .map((specifier) => {
        const importName = specifier.imported.name;
        const importLocalName = specifier.local.name;
        const importPath = componentMappings[importName];
        if (importPath) {
          return newImports.push(
            j.importDeclaration(
              [j.importDefaultSpecifier(j.identifier(importLocalName))],
              j.literal(importPath)
            )
          );
        }
        return null;
      })
      .filter(Boolean);

    path.prune();

    newImports.forEach((newImport) => {
      path.insertBefore(newImport);
    });
  });

  return root.toSource({ quote: 'single', tabWidth: 4, useTabs: true });
};
