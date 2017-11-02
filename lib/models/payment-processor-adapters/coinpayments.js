'use strict';

const coinpayments = require('../../vendor/coinpayments');
const constants = require('../../constants');

let coinpaymentsProcessor;

const coinpaymentsAdapter = {

  serializeData: function (data) {
    return data;
  },

  parseData: function () {
    return coinpaymentsProcessor.rawData;
  },

  addPaymentMethod: function (token) {
    return new Promise((resolve, reject) => {
      coinpayments.getCallbackAddress(token, function(err, data) {
        if (err) reject(err);
        console.log('### addPaymentMethod adapter data: ', coinpaymentsProcessor.data);
        coinpaymentsProcessor.data.push({
          token: token,
          address: data.address
        });
        return coinpaymentsProcessor.save()
          .then(resolve)
          .catch(reject);
      });
    });
  },

  // Need to test this more, but I think it works
  removePaymentMethod: function (address) {
    return new Promise((resolve, reject) => {
      const updated = coinpaymentsProcessor.data.filter(item => {
        item.address !== address;
      })

      console.log('updated: ', updated);
      coinpaymentsProcessor.data = updated;
      console.log('proc data: ', coinpaymentsProcessor.data);

      return coinpaymentsProcessor.save()
        .then(resolve)
        .catch(reject)
    })
  },

  defaultPaymentMethod: function () {
    return coinpaymentsProcessor.rawData;
  },

  validate: function () {
    return Promise.resolve(true);
  },

  billingDate: function () {
    return 1;
  },

  paymentMethods: function () {
    return coinpaymentsProcessor.rawData;
  }

}

module.exports = function(paymentProcessor) {
  coinpaymentsProcessor = paymentProcessor;
  return coinpaymentsAdapter;
}