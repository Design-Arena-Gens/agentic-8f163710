const https = require('https');
const fs = require('fs');
const path = require('path');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(httpGet(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`GET ${url} -> ${res.statusCode}`));
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadTo(url, destinationPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadTo(res.headers.location, destinationPath));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`DOWNLOAD ${url} -> ${res.statusCode}`));
      }
      const file = fs.createWriteStream(destinationPath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

    const metaUrl = 'https://www.geoboundaries.org/api/current/gbOpen/IRN/ADM0/';
    const metaRaw = await httpGet(metaUrl);
    const meta = JSON.parse(metaRaw);
    const gjUrl = meta && meta.gjDownloadURL;
    if (!gjUrl) throw new Error('gjDownloadURL not found in geoBoundaries API response');

    const outPath = path.join(publicDir, 'iran.geojson');
    await downloadTo(gjUrl, outPath);
    console.log('Downloaded Iran GeoJSON to', outPath);
  } catch (err) {
    console.error('Failed to fetch Iran GeoJSON:', err.message || err);
    process.exit(1);
  }
})();
