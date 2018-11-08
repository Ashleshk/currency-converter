const axios = require('axios');

const getExchangeRate = async (from, to) => {
  try {
  const response = await axios.get('http://data.fixer.io/api/latest?access_key=28fb091f0ecba07964b7843abea0f119');
  const euro = 1 / response.data.rates[from];
  const rate = euro * response.data.rates[to];

  if (isNaN(rate)) {
    throw new Error();
  }

  return rate;
} catch (e) {
  throw new Error(`Unable to get exchange rate for ${from} and ${to}.`);
}
};

const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
    return response.data.map((country) => country.name);
  } catch (e) {
    throw new Error(`Unable to get countries that use ${currencyCode}.`)
  }
};

const convertCurrency = async (from, to, amount) => {
  const rate = await getExchangeRate(from, to);
  const countries = await getCountries(to);
  const convertedAmount = (amount * rate).toFixed(2); 
  return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries:\n ${countries.join('\n ')}`;
};

convertCurrency('USD', 'CAD', 20).then((message) => {
  console.log(message);
}).catch((e) => {
  console.log(e.message);
});

