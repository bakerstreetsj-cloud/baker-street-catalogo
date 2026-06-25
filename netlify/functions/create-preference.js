const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ACCESS_TOKEN = APP_USR-8659553275287332-062210-b6acbb535dff81b52dd23384119b10f8-3491566792;

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Bad Request' };
  }

  const preference = {
    items: body.items,
    payer: {
      name: body.nombre,
      phone: { area_code: '264', number: body.telefono }
    },
    back_urls: {
      success: 'https://bakerstreetsj-cloud.github.io/baker-street-catalogo/pedidos/?pago=ok',
      failure: 'https://bakerstreetsj-cloud.github.io/baker-street-catalogo/pedidos/?pago=error',
      pending: 'https://bakerstreetsj-cloud.github.io/baker-street-catalogo/pedidos/?pago=pendiente'
    },
    auto_return: 'approved',
    statement_descriptor: 'Baker Street Libreria',
    external_reference: body.nombre + ' - ' + body.telefono
  };

  return new Promise((resolve) => {
    const data = JSON.stringify(preference);
    const options = {
      hostname: 'api.mercadopago.com',
      path: '/checkout/preferences',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(response);
          resolve({
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ init_point: parsed.init_point, id: parsed.id })
          });
        } catch {
          resolve({ statusCode: 500, body: 'Error parsing MP response' });
        }
      });
    });

    req.on('error', (e) => resolve({ statusCode: 500, body: e.message }));
    req.write(data);
    req.end();
  });
};
