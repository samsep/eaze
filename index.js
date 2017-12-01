'use strict';

const getScrapedPackages = require('./lib/getScrapedPackages');
const downloadFiles = require('./lib/downloadFiles');
const winston = require('winston');

function downloadPackages(count, callback) {
  count = count || 10;
  const directory = './packages';
  getScrapedPackages(count, (err, packages) => {
    if (err) return winston.error(err);
    return downloadFiles(packages, directory, (error) => {
      if (error) return winston.error(error);
      return callback();
    });
  });
}

module.exports = downloadPackages();
