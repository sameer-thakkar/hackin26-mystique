import { NextApiRequest, NextApiResponse } from 'next';
import type { TCalculatedRatings } from 'types/reviews';
import { CALCULATED_RATINGS } from 'constants/calculatedRatings';

type ResponseData = {
  data?: TCalculatedRatings;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the key from the query parameters
  const { uid } = req.query;

  // Validate the key parameter
  if (!uid || typeof uid !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid uid parameter' });
  }

  // Look up the ratings data for the provided uid
  const ratingsData = CALCULATED_RATINGS[uid];

  // If no data found for the uid, return a 404
  if (!ratingsData) {
    return res.status(404).json({ error: `No ratings found for key: ${uid}` });
  }

  // Return the ratings data
  return res.status(200).json({ data: ratingsData });
}
