const createLinks = require('./createLinks');
const cheerio = require('cheerio');
const async = require('async');
const request = require('request');

function getScrapedPackages(count, callback) {
  const links = createLinks(count);
  let scrapedPackages = [];
  const asyncCb = (err) => {
    if (err) return callback(err);
    const trimmedPackages = scrapedPackages.slice(0, count);
    return callback(null, trimmedPackages);
  };

  async.each(links, (link, cb) => {
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
    }).get();
  return packages;
}

module.exports = getScrapedPackages;
