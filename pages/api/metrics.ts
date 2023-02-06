import type { NextApiRequest, NextApiResponse } from 'next';

const promClient = require('prom-client');

const registry = new promClient.Registry();
promClient.collectDefaultMetrics({
  register: registry,
});

const Metrics = async (_req: NextApiRequest, res: NextApiResponse) => {
  return res.send(await registry.metrics());
};

export default Metrics;
