const ONE_EPOCH_DAY = 86400

const getPriceForTime = function(prices, time) {
  return prices[(time - (time%ONE_EPOCH_DAY)).toString()]
}

module.exports = getPriceForTime