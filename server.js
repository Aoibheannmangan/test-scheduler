const express = require('express');
const path = require('path');
const app = express();

// Serve static files first
app.use(express.static(path.join(__dirname, 'build')));

// Example API route
app.get('/api/some-endpoint', (req, res) => {
    res.json({ message: "Test" });
});

// Handle all other routes (React client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server on specified port (5000 or process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
