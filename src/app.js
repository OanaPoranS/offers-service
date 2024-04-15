const express = require('express');
const bodyParser = require('body-parser');

const { getStoredOffers, storeOffers } = require('./data/offers');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/offers', async (req, res) => {
  try {
    const storedOffers = await getStoredOffers();
    // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
    if(storedOffers) {
      res.json({ offers: storedOffers });

    }
  }
    catch {
      console.error('Error retrieving offers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/offers/:id', async (req, res) => {
  try {
    const storeOffers = await getStoredOffers();
    const offer = storeOffers.find((offer) => offer.id === req.params.id);
    if(offer) {
      res.json({ offer });
    } else {
      res.status(404).json({ error: 'Offer not found' });
    }
  } catch {
    console.error('Error retrieving offer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/offers/:id', async (req, res) => {
  try {
    const storedOffers = await getStoredOffers(); 
    const offer = storedOffers.find((offer) => offer.id === req.params.id);
    if (offer) {
        let updatedOffer;
        const hasReachedLimit = offer.timesPurchased >= offer.limit; 
        if(hasReachedLimit) {
          updatedOffer = { ...offer, timesPurchased: offer.limit, limitReached: true};
        } else {
          updatedOffer = { ...offer, timesPurchased: ++offer.timesPurchased};
        }
      storedOffers[offer] = updatedOffer; 
      await storeOffers(storedOffers);
      res.json(updatedOffer);
    } else {
      res.status(404).json({ error: 'Offer not found' }); 
    }
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 8080
app.listen(port)
console.log(`app is running on: http://localhost:${port}`)
