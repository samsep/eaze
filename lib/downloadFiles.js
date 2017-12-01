const downloadNpmPackage = require('download-npm-package');
const async = require('async');

function downloadFiles(files, directory, callback) {
  const asyncCb = (err) => {
    if (err) return callback(err);
    return callback(null);
  };
  async.each(files, (file, cb) => {
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
