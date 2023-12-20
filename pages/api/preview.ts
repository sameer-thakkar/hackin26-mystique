import type { NextApiRequest, NextApiResponse } from 'next';
import * as prismicNext from '@prismicio/next';
import { createClient } from '../../prismicio';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = createClient({ req });

  prismicNext.setPreviewData({ req, res });

  await prismicNext.redirectToPreviewURL({ req, res, client });
}
