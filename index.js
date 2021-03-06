'use strict';

const getScrapedPackages = require('./lib/getScrapedPackages');
const downloadFiles = require('./lib/downloadFiles');
const winston = require('winston');
/**
 * Download top <count> npm packages
 * @param {number} count - number of packages
 * @param {function} callback
 */
function downloadPackages(count, callback) {
  const defaultCb = () => {};
  const directory = './packages';
  count = count || 10;
  callback = callback || defaultCb;
  getScrapedPackages(count, (err, packages) => {
    if (err) return winston.error(err);
    return downloadFiles(packages, directory, (error) => {
      if (error) return winston.error(error);
      winston.info('Packages successfully downloaded');
      return callback();
    });
  });
}

module.exports = downloadPackages;
