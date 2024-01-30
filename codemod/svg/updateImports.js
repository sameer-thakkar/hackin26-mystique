// update-imports.js
const { join } = require('path');

module.exports = function (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source, { parser: 'tsx' });

  // Function to convert snake_case to PascalCase
  const toPascalCase = (str) =>
    str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());

  // Function to get the last segment of a path
  const getLastSegment = (path) => path.split('/').pop();

  // Update import statements
  root
    .find(j.ImportDeclaration, {
      source: {
        value: (path) => path.includes('/assets/SvgIcons'),
      },
    })
    .forEach((path) => {
      // Extract the last segment of the path (potential import name)
      const lastSegment = getLastSegment(path.value.source.value);
      const iconName = toPascalCase(lastSegment.replace('.tsx', ''));

      // Construct the new import path
      const updatedImportPath = join('assets', iconName.toLowerCase());

      // Update the import path and specifier
      j(path).replaceWith(
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier(iconName))],
          j.literal(updatedImportPath)
        )
      );

      // Update usages within the file
      root
        .find(j.Identifier, { name: path.node.specifiers[0].local.name })
        .forEach((identifierPath) => {
          j(identifierPath).replaceWith(j.identifier(iconName));
        });
    });

  // Save the changes
  return root.toSource();
};
