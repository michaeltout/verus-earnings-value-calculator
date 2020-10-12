const {
  TO_DATE,
  FROM_DATE,
  FILENAME_IN,
  FILENAME_OUT,
  PRICE_FILE_NAME
} = require('./config')

var fs = require('fs');
var getPriceForTime = require('./prices');
const BigNumber = require('bignumber.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: `./${FILENAME_OUT}`,
  header: [
      {id: 'type', title: 'Type'},
      {id: 'buy', title: 'Buy'},
      {id: 'buycur', title: 'Cur.'},
      {id: 'sell', title: 'Sell'},
      {id: 'sellcur', title: 'Cur.'},
      {id: 'fee', title: 'Fee'},
      {id: 'feecur', title: 'Cur.'},
      {id: 'exchange', title: 'Exchange'},
      {id: 'group', title: 'Group'},
      {id: 'comment', title: 'Comment'},
      {id: 'date', title: 'Date'},
      {id: 'usdvalue', title: 'Value in USD'}
  ]
});

console.log("Loading prices...")
fs.readFile(PRICE_FILE_NAME, 'utf8', (err, priceData) => {
  if (err) {
    console.warn("Error reading price data")
    console.warn(err); return 0
  }
  if (!priceData) {console.warn("No price data"); return 0}

  console.log("Prices loaded.")
  const prices = JSON.parse(priceData)

  console.log("Loading transactions...")
  fs.readFile(FILENAME_IN, 'utf8', (err, txData) => {
    if (err) {
      console.warn("Error reading tx data")
      console.warn(err); return 0
    }
    if (!txData) {console.warn("No tx data"); return 0}

    console.log("Transactions loaded.")
    const transactions = JSON.parse(txData)
    let results = []
    let totalVrsc = 0
    let totalUsd = 0
    
    console.log("\nSaving Coinbase Txs...")
    transactions.forEach((tx) => {
      if ((tx.category === 'generate' || tx.category === 'mint') 
          && Number(tx.blocktime) < TO_DATE 
          && Number(tx.blocktime) > FROM_DATE) {
        let txDate = new Date(tx.blocktime*1000)
        let toPush = {
          type: "Mining",
          buy: tx.amount,
          buycur: "VRSC",
          sell: "",
          sellcur: "",
          fee: "",
          feecur: "",
          exchange: "",
          group: "",
          comment: tx.category === "mint" ? "Staking" : "Mining",
          date: `${txDate.getUTCFullYear()}-${
            txDate.getUTCMonth() + 1
          }-${txDate.getUTCDate()} ${txDate.getUTCHours()}:${txDate.getUTCMinutes()}:${txDate.getUTCSeconds()}`,
          usdvalue: (BigNumber(getPriceForTime(prices, tx.blocktime)).multipliedBy(BigNumber(tx.amount))).toNumber(),
        };
        totalUsd += toPush.usdvalue
        totalVrsc += tx.amount
        results.push(toPush)
      }
    })
  
    csvWriter.writeRecords(results)
    .then(() => {
      console.log(`Recorded ${results.length} staking/mining transaction(s)!`)
      console.log(`\nTotal VRSC: ${totalVrsc}`)
      console.log(`Total USD: ${totalUsd}`)
      console.log(`Wrote detailed outputs to ${FILENAME_OUT}\n`)
    })
    .catch(err => {
      console.log("\nError writing file:")
      console.log(err.message + '\n')
    })
  });
})
