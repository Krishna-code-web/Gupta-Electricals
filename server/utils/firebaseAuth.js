const https = require('https');
const jwt = require('jsonwebtoken');

let publicKeysCache = null;
let keysExpiryTime = 0;

/**
 * Fetches Google's public x509 certificates used for Firebase ID tokens.
 * Implements in-memory caching based on Cache-Control max-age header.
 */
const fetchGooglePublicKeys = () => {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    if (publicKeysCache && now < keysExpiryTime) {
      return resolve(publicKeysCache);
    }

    const options = {
      hostname: 'www.googleapis.com',
      path: '/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js HTTPS'
      }
    };

    https.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Google certs request failed with status: ${res.statusCode}. Body: ${data}`));
        }

        try {
          const keys = JSON.parse(data);
          
          // Parse Cache-Control header to respect certificate expiration
          const cacheControl = res.headers['cache-control'];
          let maxAge = 3600; // default fallback to 1 hour
          if (cacheControl) {
            const match = cacheControl.match(/max-age=(\d+)/);
            if (match) {
              maxAge = parseInt(match[1], 10);
            }
          }
          
          publicKeysCache = keys;
          keysExpiryTime = now + (maxAge * 1000);
          resolve(keys);
        } catch (error) {
          reject(new Error(`Failed to parse Google public keys JSON: ${error.message}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

/**
 * Decodes and verifies a client-provided Firebase ID token.
 * Validates issuer, audience (projectId), expiration, and signature.
 * 
 * @param {string} idToken The Firebase ID Token from client
 * @returns {Promise<object>} Decoded token payload if verification succeeds
 */
const verifyFirebaseToken = async (idToken) => {
  if (!idToken) {
    throw new Error('Token is missing');
  }

  // Decode the token with header to extract Key ID (kid)
  const decoded = jwt.decode(idToken, { complete: true });
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Invalid Firebase token format');
  }

  const kid = decoded.header.kid;
  const publicKeys = await fetchGooglePublicKeys();
  
  console.log('Firebase Verification Debug:');
  console.log('- Token KID:', kid);
  console.log('- Token preview:', idToken.substring(0, 30) + '...');
  console.log('- Available KIDs in Google Certs:', Object.keys(publicKeys));

  const cert = publicKeys[kid];

  if (!cert) {
    throw new Error(`Public key not found for token key ID (kid): ${kid}`);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured in server env');
  }

  const options = {
    algorithms: ['RS256'],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`
  };

  return new Promise((resolve, reject) => {
    jwt.verify(idToken, cert, options, (err, verifiedToken) => {
      if (err) {
        reject(new Error(`Firebase ID token verification failed: ${err.message}`));
      } else {
        resolve(verifiedToken);
      }
    });
  });
};

module.exports = { verifyFirebaseToken };
