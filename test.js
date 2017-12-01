const test = require('tape');
const series = require('run-series');
const fs = require('fs');
const folderSize = require('get-folder-size');
const download = require('./');
const async = require('async');

test('download', (t) => {
  t.plan(3);

  const COUNT = parseInt(process.env.COUNT, 10) || 10;

  series([
    callback => download(COUNT, callback),
    verifyCount,
    verifySize,
    verifyLodash,
  ], t.end);

  function verifyCount(callback) {
    fs.readdir('./packages', (err, files) => {
      if (err) return callback(err);
      // Filter .gitignore and other hidden files
      // Account for packages in same namespace such as @angular
      let packageFiles = files.filter(file => !/^\./.test(file) && !/^@/.test(file));
      const nameSpaceDirectories = files.filter(file => /^@/.test(file));
      const asyncCb = (error) => {
        if (error) return callback(error);
        t.equal(packageFiles.length, COUNT, `has ${COUNT} files`);
        return callback();
      };
      return async.each(nameSpaceDirectories, (directory, cb) => {
        fs.readdir(`./packages/${directory}`, (error, subFiles) => {
          if (error) return cb(error);
          packageFiles = packageFiles.concat(subFiles);
          return cb();
        });
      }, asyncCb);
    });
  }

  function verifySize(callback) {
    folderSize('./packages', (err, size) => {
      if (err) return callback(err);
      t.ok(size / 1024 > 5 * COUNT, 'min 5k per package');
      return callback();
    });
  }

  function verifyLodash(callback) {
    const _ = require('./packages/lodash');
    t.equal(typeof _.map, 'function', '_.map exists');
    callback();
  }
});
