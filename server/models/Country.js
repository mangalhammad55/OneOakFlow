const mongoose = require('mongoose');
const countrySchema = new mongoose.Schema({
  name: String,
  capital: String,
  continent: String,
  currencies: [String],
  flag: String,
  cca2: String
});
module.exports = mongoose.model('Country', countrySchema);