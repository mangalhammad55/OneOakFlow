const mongoose = require('mongoose');
const axios = require('axios');
const Country = require('../models/Country');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // const { data } = await axios.get('https://restcountries.com/v3.1/all');
    const { data } = await axios.get('https://restcountries.com/v3.1/all?fields=name,capital,region,currencies,flag,cca2');

    const formatted = data.map(c => ({
      name: c.name.common,
      capital: c.capital?.[0] || 'N/A',
      continent: c.region,
      currencies: Object.keys(c.currencies || {}),
      flag: c.flag,
      cca2: c.cca2
    }));

    await Country.deleteMany({});
    await Country.insertMany(formatted);
    console.log('DB populated successfully.');
    process.exit();
  } catch (err) {
    console.error('Failed to populate DB:', err);
    process.exit(1);
  }
})();
