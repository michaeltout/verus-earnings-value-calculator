// CONFIGURE SCRIPT HERE
const TO_DATE = 1577836800 // Top date bound in epoch time
const FROM_DATE = 1546300800 // Bottom date bound in epoch time
const FILENAME_OUT = "coinbase_records.csv" // Name of file to be imported to cointracking
const FILENAME_IN = "txs.txt" // Output from listtransactions api call pointed towards txt file
const PRICE_FILE_NAME = 'prices.txt' // Name of the json file that prices are fetched and saved to
// CONFIGURE SCRIPT HERE

module.exports = {
  TO_DATE,
  FROM_DATE,
  FILENAME_IN,
  FILENAME_OUT,
  PRICE_FILE_NAME
}