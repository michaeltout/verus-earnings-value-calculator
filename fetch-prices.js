const { FROM_DATE, TO_DATE, PRICE_FILE_NAME } = require('./config')
const fs = require('fs');
const BigNumber = require('bignumber.js');
const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();

async function main() {
  console.log("Fetching prices...")
  let data = await CoinGeckoClient.coins.fetchMarketChartRange('verus-coin', {
    from: FROM_DATE,
    to: TO_DATE,
  });
  
  const prices = data.data.prices 

  let priceMap = {}

  console.log(prices)

  prices.forEach(ohcv => {
    priceMap[(BigNumber(ohcv[0]).dividedBy(1000)).toString()] = BigNumber(ohcv[1]).toString()
  });

  fs.writeFile(PRICE_FILE_NAME, JSON.stringify(priceMap), 'utf8', () => {
    console.log("Done writing price file.")
  });
}

main()


