'use strict';

const downloadNpmPackage = require('download-npm-package');
const async = require('async');
/**
 * Download packages
 * @param {array} files - files to download
 * @param {string} directory - directory where packages are downloaded
 * @param {function} callback
 */
function downloadFiles(files, directory, callback) {
  const asyncCb = (err) => {
    if (err) return callback(err);
    return callback(null);
  };
  /**
   * Download up to 100 packages at a time to avoid memory overload
   */
  async.eachLimit(files, 100, (file, cb) => {
    downloadNpmPackage({
      arg: formatPackageName(file.name, file.version),
      dir: directory,
    }).then(() => {
      cb();
    }, (err) => {
      cb(err);
    });
  }, asyncCb);
}

function formatPackageName(name, version) {
  return `${name}@${version}`;
}

module.exports = downloadFiles;
