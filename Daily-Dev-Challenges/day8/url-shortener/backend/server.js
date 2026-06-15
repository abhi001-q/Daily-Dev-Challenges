// backend/server.js
const express = require('express');
const { nanoid } = require('nanoid');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('frontend'));

// In‑memory store for URLs and click counts
const urlStore = {};

// Create short URL
app.post('/api/shorten', (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }
  const shortId = nanoid(8);
  urlStore[shortId] = { originalUrl, clicks: 0 };
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
  res.json({ shortUrl, shortId });
});

// Redirect and count click
app.get('/:id', (req, res) => {
  const entry = urlStore[req.params.id];
  if (!entry) {
    return res.status(404).send('Not found');
  }
  entry.clicks += 1;
  res.redirect(entry.originalUrl);
});

// Get analytics for a short URL
app.get('/api/analytics/:id', (req, res) => {
  const entry = urlStore[req.params.id];
  if (!entry) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({ originalUrl: entry.originalUrl, clicks: entry.clicks });
});

app.listen(port, () => {
  console.log(`URL Shortener backend listening at http://localhost:${port}`);
});
