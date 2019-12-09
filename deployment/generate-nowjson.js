const fs = require("fs");
const BATCH_SIZE = 10;

module.exports = env => {
  const aliases = require(`${__dirname}/${env}/aliases.js`);
  const baseJson = require(`${__dirname}/base-json.js`);
  const extendJson = require(`${__dirname}/${env}/extend-json.js`);

  const nowFilesRequired = Math.ceil(aliases.length / BATCH_SIZE);

  [...new Array(nowFilesRequired)].forEach((_item, idx) => {
    const fileName = `now.${env}.${idx + 1}.json`;

    const requiredAliases = aliases.slice(
      idx * BATCH_SIZE,
      (idx + 1) * BATCH_SIZE
    );

    const alias =
      requiredAliases.length === 1 ? requiredAliases[0] : requiredAliases;

    const fileContent = {
      ...baseJson,
      ...extendJson,
      alias,
      name:
        requiredAliases.length === 1
          ? alias.split(".").join(" ")
          : extendJson.name
    };

    fs.writeFileSync(
      `${__dirname}/../${fileName}`,
      JSON.stringify(fileContent)
    );
  });
};
