const ALLOWED_PATHS = [
  '/xnurta/common/sponsored-categories',
  '/xnurta/portfolios',
];

exports.handler = async function(event) {
  const path = event.queryStringParameters?.path || '';

  if (!ALLOWED_PATHS.includes(path)) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  const qs = new URLSearchParams(event.queryStringParameters);
  qs.delete('path');
  const qsStr = qs.toString();
  const url = `https://amazon-api.bluestars.vn${path}${qsStr ? '?' + qsStr : ''}`;

  const res = await fetch(url, {
    headers: { 'X-API-Key': process.env.XNURTA_API_KEY },
  });

  const body = await res.text();
  return {
    statusCode: res.status,
    headers: { 'Content-Type': 'application/json' },
    body,
  };
};
