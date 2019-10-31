const fs = require("fs");
const BATCH_SIZE = 32;

module.exports = env => {
  const aliases = require(`${__dirname}/${env}/aliases.js`);
  const baseJson = require(`${__dirname}/base-json.js`);
  const extendJson = require(`${__dirname}/${env}/extend-json.js`);

  const nowFilesRequired = Math.ceil(aliases.length / BATCH_SIZE);

  [...new Array(nowFilesRequired)].forEach((_item, idx) => {
    const fileName = `now.${env}.${idx + 1}.json`;
    const fileContent = {
      ...baseJson,
      ...extendJson,
      alias: aliases.slice(idx * BATCH_SIZE, (idx + 1) * BATCH_SIZE)
    };

    fs.writeFileSync(
      `${__dirname}/../${fileName}`,
      JSON.stringify(fileContent)
    );
  });
};
