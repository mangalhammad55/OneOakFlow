const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const Fuse = require('fuse.js');
const axios = require('axios');

router.get('/search', async (req, res) => {
  console.log('Search endpoint hit');
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


router.get('/suggestions', async (req, res) => {
  console.log('Suggestions endpoint hit');
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Name query is required' });

    const countries = await Country.find({
      name: { $regex: name, $options: 'i' }
    }).limit(10);

    const names = countries.map(c => c.name); 
    res.json(names);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
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