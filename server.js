require('dotenv').config(); // allows reading .env
const express = require('express');
const app = express();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

// POST /create-checkout-session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'FreeEmail Premium' },
          unit_amount: 1000, // $10 in cents
          recurring: { interval: 'month' }
        },
        quantity: 1
      }],
      mode: 'subscription',
      success_url: 'https://YOUR-FRONTEND.com/premium-success',
      cancel_url:  'https://YOUR-FRONTEND.com/premium-cancel',
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
