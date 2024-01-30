// move-icons.js
const { parse, join } = require('path');
const { writeFileSync } = require('fs');

module.exports = function (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source, { parser: 'tsx' });

  // Function to convert snake_case to camelCase
  const toCamelCase = (str) =>
    str.toLowerCase().replace(/([-_]\w)/g, (g) => g[1].toUpperCase());

  // Update export statements
  root.find(j.ExportNamedDeclaration).forEach((path) => {
    const declarations = path.value.declaration.declarations;

    if (declarations) {
      declarations.forEach((declaration) => {
        const iconName = declaration.id.name;
        const camelCaseIconName = toCamelCase(iconName);

        // Ensure the first character is uppercase
        const camelCaseIconNameUppercaseFirst = camelCaseIconName.charAt(0).toUpperCase() + camelCaseIconName.slice(1);

        // Determine the new file path based on the source file
        const sourceFilePath = file.path;
        const { dir } = parse(sourceFilePath);
        const iconFilePath = join(dir, `${camelCaseIconName}.tsx`);

        // Create a new file for each icon
        const newSource = `const ${camelCaseIconNameUppercaseFirst} = ${j(declaration.init).toSource()}\nexport default ${camelCaseIconNameUppercaseFirst};\n`;
        writeFileSync(iconFilePath, newSource);
      });
    }
  });

  // Remove the original export content
  root.find(j.ExportNamedDeclaration).remove();

  // Save the changes
  return root.toSource();
};
