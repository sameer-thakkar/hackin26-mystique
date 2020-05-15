const fs = require('fs');
const axios = require('axios');

// Loading .env
require('dotenv').config();

const BATCH_SIZE = 10;

const generateNowJson = async (env) => {
  let aliases;
  const {
    data: { data },
  } = await axios.get(
    'https://professorx-headout.herokuapp.com/api/subdomain',
    {
      headers: {
        'x-professor-secret': process.env.PROFESSORX_SECRET,
      },
    }
  );
  aliases = data.reduce((acc, record) => {
    if (record.fields[env]) {
      return [
        ...acc,
        `${env === 'stage' ? 'stage.' : ''}${record.fields.name}`,
      ];
    }
    return acc;
  }, []);

  const baseJson = require(`${__dirname}/base-json.js`);

  let extendJson;
  if (env === 'stage') {
    extendJson = { name: 'mystique stage' };
  } else if (env === 'production') {
    extendJson = { name: 'mystique prod' };
  }

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
          ? alias.split('.').join(' ')
          : extendJson.name,
    };

    fs.writeFileSync(
      `${__dirname}/../${fileName}`,
      JSON.stringify(fileContent)
    );
  });
};

module.exports = generateNowJson;
