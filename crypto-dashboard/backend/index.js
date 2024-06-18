const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

let cache = null;
let cacheTimestamp = 0;
let rateLimitExceeded = false;
const CACHE_DURATION = 60000; 
app.get('/api/crypto', async (req, res) => {
  const now = Date.now();

  if (rateLimitExceeded) {
    console.log('Rate limit exceeded, serving from cache');
    return res.status(429).send('Rate limit exceeded. Please try again later.');
  }

  if (cache && (now - cacheTimestamp < CACHE_DURATION)) {
    console.log('Serving from cache');
    return res.json(cache);
  }

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    });
    cache = response.data;
    cacheTimestamp = now;
    rateLimitExceeded = false;
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);

      if (error.response.status === 429) {
        rateLimitExceeded = true;
        setTimeout(() => {
          rateLimitExceeded = false;
        }, 60000); // Retry after 60 seconds
      }
    }
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
