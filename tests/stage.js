const runTests = require("./mystique-tests");
const pagespeedTests = require("./pagespeed-tests");

runTests("stage");
pagespeedTests("stage");
