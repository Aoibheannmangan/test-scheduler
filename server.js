const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Example API route
app.get('/api/some-endpoint', (req, res) => {
  res.json({ message: 'Test' });
});

// Serve static files from React build
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

app.get('/:wildcard(*)', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
