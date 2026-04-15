const fs = require('fs');
const path = require('path');

const JS_REPLACEMENTS = {
  'www.test-headout.com': `${process.env.NEXT_PUBLIC_ODE_NAMESPACE}.deimos.dev-headout.com`,
  'zapdos.test-headout.com': `${process.env.NEXT_PUBLIC_ODE_NAMESPACE}.zapdos.dev-headout.com`,
  'api.test-headout.com': `${process.env.NEXT_PUBLIC_ODE_NAMESPACE}.api.dev-headout.com`,
  'calipso.test-headout.internal': `${process.env.NEXT_PUBLIC_ODE_NAMESPACE}.api.dev-headout.com`,
  'headout-calipso.headout-calipso.svc.cluster.local': `${process.env.NEXT_PUBLIC_ODE_NAMESPACE}.api.dev-headout.com`,
  '"test"': '"ondemand"',
};

const targetDirectory = path.join(__dirname, '../../.next/');

function performReplaceOnFile(fullPath, replacements) {
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const modifiedContent = Object.entries(replacements).reduce(
    (content, [findString, replaceString]) => {
      const escapedFindString = findString.replace(/\./g, '\\.');
      return content.replace(new RegExp(escapedFindString, 'g'), replaceString);
    },
    fileContent
  );

  fs.writeFileSync(fullPath, modifiedContent, 'utf8');
}

function performFindAndReplace(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isFile()) {
      if (!fullPath.includes('.js')) return;
      performReplaceOnFile(fullPath, JS_REPLACEMENTS);
    } else if (entry.isDirectory()) {
      performFindAndReplace(fullPath); // Recursive call for subdirectories
    }
  });
}

performFindAndReplace(targetDirectory);
// Update .env.local File
performReplaceOnFile(path.join(__dirname, '../../.env.local'), {
  ...JS_REPLACEMENTS,
  "'test'": "'ondemand'",
});
// eslint-disable-next-line no-console
console.log('Replacements complete.');
