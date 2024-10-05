const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;

// Serve static files (for React or any frontend framework)
app.use(express.static(path.join(__dirname, 'build')));

// Handle all routes (for React Router or any SPA routing)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Set up SSL
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app);

sslServer.listen(PORT, () => {
    console.log(`Frontend running securely on https://localhost:${PORT}`);
});
