const https = require('https');

/**
 * Utility to prevent cloud providers (like Render) from putting the free-tier service to sleep.
 * It sends a GET request to the app's root URL every 14 minutes.
 */
const keepAlive = () => {
    const url = process.env.BACKEND_URL;
    
    // Only execute if BACKEND_URL explicitly exists (meaning we are intentionally in production)
    if (!url) {
        console.log('[Keep-Alive] BACKEND_URL not defined in environment variables. Self-ping inactive.');
        return;
    }

    const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 Minutes
    
    console.log(`[Keep-Alive] Monitor active. Scheduled to ping ${url} every 14 minutes.`);

    setInterval(() => {
        https.get(url, (res) => {
            // Discard the response buffer to free memory
            res.on('data', () => {});
            res.on('end', () => {
                console.log(`[Keep-Alive] Successfully refreshed instance state. Status: ${res.statusCode}`);
            });
        }).on('error', (err) => {
            console.error(`[Keep-Alive] Network request failed: ${err.message}`);
        });
    }, PING_INTERVAL_MS);
};

module.exports = keepAlive;
