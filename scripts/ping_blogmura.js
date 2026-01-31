const https = require('https');

const PING_URL = 'https://ping.blogmura.com/xmlrpc/nnzyvgc8ql4z/';
const SITE_NAME = 'トルコリラ・ウォッチ';
const SITE_URL = 'https://lira-watch.sbs/';

const xmlPayload = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param>
      <value><string>${SITE_NAME}</string></value>
    </param>
    <param>
      <value><string>${SITE_URL}</string></value>
    </param>
  </params>
</methodCall>`;

const url = new URL(PING_URL);

const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
        'Content-Type': 'text/xml',
        'Content-Length': Buffer.byteLength(xmlPayload)
    }
};

const req = https.request(options, (res) => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response:', data);
        if (res.statusCode === 200 && data.includes('<member><name>flerror</name><value><boolean>0</boolean></value></member>')) {
            console.log('✅ Ping sent successfully!');
        } else if (res.statusCode === 200 && (data.includes('Thanks for the ping') || data.includes('Ping received'))) {
            console.log('✅ Ping sent successfully! (Alternate success message)');
        } else {
            console.log('⚠️  Ping might have failed or returned an unexpected response.');
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
});

req.write(xmlPayload);
req.end();

console.log(`Sending ping to ${PING_URL}...`);
console.log(`Site: ${SITE_NAME} (${SITE_URL})`);
