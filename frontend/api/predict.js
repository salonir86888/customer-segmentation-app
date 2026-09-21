export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const { recency_days = 30, frequency_orders = 1, monetary_spend = 1000 } = req.body || {};
  const r = parseFloat(recency_days) || 0;
  const f = parseFloat(frequency_orders) || 0;
  const m = parseFloat(monetary_spend) || 0;

  let cluster_id = 0;
  let segment_name = 'Occasional / Newbies';
  let description = 'Low frequency or newly onboarded clients.';
  let recommended_strategy = 'Send onboarding welcome gifts and reviews.';

  if (m >= 35000 && f >= 8 && r <= 45) {
    cluster_id = 1;
    segment_name = 'VIP Champions';
    description = 'Top tier spenders who buy repeatedly.';
    recommended_strategy = 'Offer concierge priority & reward multipliers.';
  } else if (r > 60) {
    cluster_id = 2;
    segment_name = 'At-Risk / Dormant';
    description = 'Have not bought anything recently.';
    recommended_strategy = 'Trigger 25% discount comeback campaign.';
  } else if (f >= 10 && m < 35000) {
    cluster_id = 3;
    segment_name = 'Consistent Bargain Buyers';
    description = 'Frequent shoppers with modest order amounts.';
    recommended_strategy = 'Send bundle deals & free shipping promotions.';
  }

  return res.status(200).json({
    cluster_id,
    segment_name,
    description,
    recommended_strategy
  });
}
