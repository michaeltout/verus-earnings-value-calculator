const { FROM_DATE, TO_DATE, PRICE_FILE_NAME } = require('./config')
const fs = require('fs');
const BigNumber = require('bignumber.js');
const { default: axios } = require('axios');

async function main() {
  console.log("Fetching prices...")
  const res = await axios.get(`https://api.coingecko.com/api/v3/coins/verus-coin/market_chart/range?vs_currency=usd&from=${FROM_DATE.toString()}&to=${TO_DATE.toString()}`)
  
  const prices = res.data;

  let priceMap = {}

  console.log(prices)

  prices.prices.forEach(ohcv => {
    priceMap[(BigNumber(ohcv[0]).dividedBy(1000)).toString()] = BigNumber(ohcv[1]).toString()
  });

  fs.writeFile(PRICE_FILE_NAME, JSON.stringify(priceMap), 'utf8', () => {
    console.log("Done writing price file.")
  });
}

main()


