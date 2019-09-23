const signale = require("signale");
const fetch = require("isomorphic-unfetch");

// fetch("https://mystique-tests.headout.com/run.prod.json")
fetch("https://www.json-generator.com/api/json/get/ceaegykWcy?indent=2")
  // fetch('https://mystique-tests.headout.com/features')
  .then(res => res.json())
  .then(data => {
    const { statusCode } = data.report;
    console.log({ statusCode });
    const fatalErrors = statusCode["500"];
    if (fatalErrors && fatalErrors.length) {
      fatalErrors.map(url => signale.fatal(url));
      signale.fatal(
        new Error(`${fatalErrors.length} URLs have 500 status code`)
      );
      signale.complete({
        prefix: "[tests]",
        message: "Build Failed!"
      });
      process.exit(1);
      return;
    }

    signale.success({
      prefix: "[tests]",
      message: "Build Success!"
    });
  })
  .catch(e => {
    signale.fatal("Something went wrong", e);
  });
