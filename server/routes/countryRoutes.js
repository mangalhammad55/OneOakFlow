const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const Fuse = require('fuse.js');
const axios = require('axios');

router.get('/search', async (req, res) => {
  const { name, continent, sortBy, page = 1, limit = 10 } = req.query;
  let filter = {};
  if (continent) filter.continent = continent;
  let countries = await Country.find(filter);

  if (name) {
    const fuse = new Fuse(countries, { keys: ['name'], threshold: 0.3 });
    countries = fuse.search(name).map(result => result.item);
  }

  if (sortBy === 'name') countries.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'capital') countries.sort((a, b) => a.capital.localeCompare(b.capital));
  if (sortBy === 'currency') countries.sort((a, b) => (a.currencies[0] || '').localeCompare(b.currencies[0] || ''));

  const start = (page - 1) * limit;
  const paginated = countries.slice(start, start + parseInt(limit));
  res.json({ results: paginated, total: countries.length });
});

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { data } = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Country not found' });
  }
});

module.exports = router;