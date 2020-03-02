const signale = require('signale');
const axios = require('axios');

module.exports = (env, slackUpdate = false) => {
  /**
   * if env === "stage"
   *    grab all production urls and test that their `stage.` equivalents are OK.
   * else
   *    grab all production urls and test against actual urls
   */
  let aliases = require(`${__dirname}/../deployment/production/aliases`);

  if (env === 'stage') {
    aliases = aliases.map(alias => `stage.${alias}`);
  }

  const opts = {
    url: aliases,
    slack_update: slackUpdate,
    env: env === 'stage' ? 'Staging' : 'Production',
  };

  return axios
    .post(`https://mystique-tests.headout.com/run/test`, opts)
    .then(response => {
      const { statusCode } = response.data.report;
      signale.info(statusCode);
      const fatalErrors = statusCode['500'];
      if (fatalErrors && fatalErrors.length) {
        fatalErrors.map(url => signale.fatal(url));
        signale.fatal(
          new Error(`${fatalErrors.length} URLs have 500 status code`)
        );
        signale.complete({
          prefix: '[tests]',
          message: 'Rollout Failed!',
        });
        process.exit(1);
      }
      signale.success({
        prefix: '[tests]',
        message: 'Tests passed successfully!',
      });
      process.exit(0);
    })
    .catch(e => {
      signale.fatal('Something went wrong', e);
    });
};
