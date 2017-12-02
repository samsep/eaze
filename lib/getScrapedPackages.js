'use strict';

const createLinks = require('./createLinks');
const cheerio = require('cheerio');
const async = require('async');
const request = require('request');
/**
 * Get array of package names and versions
 * @param {number} count - number of packages
 * @param {function} callback - called with array of package objects
 */
function getScrapedPackages(count, callback) {
  const links = createLinks(count);
  let scrapedPackages = [];
  const asyncCb = (err) => {
    if (err) return callback(err);
    // Limit number of packages according to requested count
    const trimmedPackages = scrapedPackages.slice(0, count);
    return callback(null, trimmedPackages);
  };
  /**
   * Make a GET call on each url and parse its response body
   * Scrape up to 10 pages at a time to avoid memory overload
   */
  async.eachLimit(links, 10, (link, cb) => {
    request(link, (err, response) => {
      if (err || response.statusCode !== 200) {
        return cb(`Error retrieving url response: ${err.message}`);
      }
      const packages = parsePackageNames(response.body);
      scrapedPackages = scrapedPackages.concat(packages);
      return cb(null);
    });
  }, asyncCb);
}
/**
 * Parses HTML of a given npm page
 * @param {string} body - HTML body
 * @returns {Array} - array of {name, version} objects
 */
function parsePackageNames(body) {
  const $ = cheerio.load(body);
  const packages = $('.package-widget .package-details')
    .map((ind, elem) => {
      const name = $(elem).find('.name').text();
      const version = $(elem).find('.type-neutral-1').text();
      return {
        name,
        version,
      };
    });
  // Return native JS array
  return packages.get();
}

module.exports = getScrapedPackages;
