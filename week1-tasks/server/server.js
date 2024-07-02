const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;  

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quotesdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Quote Schema
const quoteSchema = new mongoose.Schema({
  content: String,
  author: String
});

const Quote = mongoose.model('Quote', quoteSchema);

// Routes
app.get('/api/random-quote', async (req, res) => {
  try {
    const response = await axios.get('https://type.fit/api/quotes');
    const quotes = response.data;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    console.log('Random Quote:', randomQuote); // Log the random quote
    res.json(randomQuote);
  } catch (error) {
    console.error('Error fetching quote from API:', error);
    res.status(500).json({ message: 'Error fetching quote' });
  }
});

app.get('/api/quotes/search', async (req, res) => {
  const { author } = req.query;
  try {
    const quotes = await Quote.find({ author: new RegExp(author, 'i') });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching quotes' });
  }
});

// Fallback route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
