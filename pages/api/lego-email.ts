import type { NextApiRequest, NextApiResponse } from 'next';

const EmailResponse = async (_req: NextApiRequest, res: NextApiResponse) => {
  const { query, body } = _req;
  const { uid } = query || {};

  await fetch(`https://lego.headout.com/api/template/${uid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((r) => r.json())
    .then((r) => {
      res.setHeader('Content-type', 'application/json');
      const response = r;
      res.write(JSON.stringify(response));
      res.end();
    });
};

export default EmailResponse;
