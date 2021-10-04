const promClient = require('prom-client');

const registry = new promClient.Registry();
promClient.collectDefaultMetrics({
  register: registry,
});

const Metrics = async (req, res) => {
  return res.send(await registry.metrics());
};

export default Metrics;
