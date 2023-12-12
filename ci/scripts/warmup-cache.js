const axios = require('axios');
const path = require('path');
const fs = require('fs');

const FETCH_BATCH_SIZE = 20;

const listFiles = (startPath, files = []) => {
  // Read the contents of the directory
  const thisFiles = fs.readdirSync(startPath);

  // Iterate through each file
  thisFiles.forEach((file) => {
    // Construct full file path
    const filePath = path.join(startPath, file);

    // Check if it's a directory
    if (fs.statSync(filePath).isDirectory()) {
      listFiles(filePath, files);
    } else {
      files.push(filePath);
    }
  });
  return files;
};

function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

const warmupCache = async () => {
  const files = listFiles('.next/static');
  const assets = files
    .filter((file) => !file.includes('.map'))
    .map((file) => file.replace('.next/', '_next/'));

  const assetBatches = chunkArray(assets, FETCH_BATCH_SIZE);

  for (let assetBatch of assetBatches) {
    await Promise.allSettled(
      assetBatch.map((assetPath) => {
        const url = `https://assets.${
          process.env.APP_ENV === 'test' ? 'test-' : ''
        }headout.com/mystique/${assetPath}`;
        return axios.get(url).then((res) => {
          if (!res.headers['age']) {
            // eslint-disable-next-line no-console
            console.log(`Warmed up ${url} [${res.status}]`);
          }
          return res;
        });
      })
    );
  }
};

warmupCache();
