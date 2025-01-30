// Load env
require('dotenv').config();

// Import express and init
const express = require('express');
// Import the 'cors' library
const cors = require('cors');

const app = express();

// Enable CORS for freeemailnow.com
app.use(cors({
  origin: 'https://freeemailnow.com'
}));

// Create Stripe instance with your secret key from .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// JSON parsing
app.use(express.json());

// POST /create-checkout-session
app.post('/create-checkout-session', async (req, res) => {
  try {
    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'FreeEmail Premium' },
          unit_amount: 1000, // $10 in cents
        },
        quantity: 1
      }],
      mode: 'subscription', // or 'payment'
      success_url: 'https://freeemailnow.com/premium-success',
      cancel_url:  'https://freeemailnow.com/premium-cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Listen
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
