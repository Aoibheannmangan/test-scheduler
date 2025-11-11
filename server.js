const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// Middleware for security and performance
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));  // Logging

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Example API route
app.get('/api/some-endpoint', (req, res) => {
  res.json({ message: 'Test' });
});

// Catch-all handler for all routes to serve the React app
app.use((req, res, next) => {
  res.status(404).json({
    message: `The URL ${req.originalUrl} doesn't exist`
  });
});


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Set the port and listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
