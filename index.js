'use strict';

var BasePlugin = require('ember-cli-deploy-plugin');
var Minio      = require('minio');
var RSVP       = require('rsvp');
var mime       = require('mime-types');
var path       = require('path');
var fs         = require('fs');

module.exports = {
  name: 'ember-cli-deploy-minio',

  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,
      requiredConfig: ['accessKey', 'secretKey', 'bucket', 'endpoint'],
      runAfter: 'gzip',
      defaultConfig: {
        source: 'tmp/deploy-dist/.',
        secure: true
      },

      upload: function(/*context*/) {
        var plugin = this,
            source = this.readConfig('source');

        var promises = this.walk(path.join(source)).map(file => {
          var relative = path.relative(source, file),
              bucket = plugin.readConfig('bucket'),
              meta = { 'Content-Type': mime.lookup(file) };

          return new RSVP.Promise(function(resolve, reject) {
            plugin.uploader().fPutObject(bucket, relative, file, meta, err => {
              if (err) {
                plugin.log('✘ ' + relative, { color: 'black' });
                plugin.log(err, { color: 'black' });

                reject(err);
              } else {
                plugin.log('✔ ' + relative);
                resolve(relative);
              }
            })
          });
        });

        return RSVP.all(promises);
      },

      walk: function(dir) {
        var plugin = this;

        return fs.readdirSync(dir).reduce((list, file) => {
          var name = path.resolve(dir, file);
          var isDir = fs.statSync(name).isDirectory();

          return list.concat(isDir ? plugin.walk(name) : [name]);
        }, []);
      },

      uploader: function() {
        return new Minio.Client({
          accessKey: this.readConfig('accessKey'),
          endPoint: this.readConfig('endpoint'),
          secretKey: this.readConfig('secretKey'),
          useSSL: this.readConfig('secure')
        })
      }
    });

    return new DeployPlugin();
  }
};
