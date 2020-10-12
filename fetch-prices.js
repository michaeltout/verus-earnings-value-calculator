const { FROM_DATE, TO_DATE, PRICE_FILE_NAME } = require('./config')
const fs = require('fs');
const fetch = require('node-fetch');
const BigNumber = require('bignumber.js');

console.log("Fetching prices...")
fetch(
  `https://api.coinpaprika.com/v1/coins/vrsc-verus-coin/ohlcv/historical?start=${FROM_DATE}&end=${TO_DATE}`
)
  .then((res) => res.json())
  .then(res => {
    let priceMap = {}

    res.forEach(ohcv => {
      priceMap[(BigNumber(Date.parse(ohcv.time_open)).dividedBy(1000)).toString()] = BigNumber(ohcv.high)
        .plus(BigNumber(ohcv.low))
        .dividedBy(2)
        .toString();
    });

    fs.writeFile(PRICE_FILE_NAME, JSON.stringify(priceMap), 'utf8', () => {
      console.log("Done writing price file.")
    });
  })
  .catch((e) => {
    console.error(e);
  }); 



