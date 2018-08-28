/*eslint-env node*/
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
        distDir: function(context) {
          return context.distDir;
        },
        secure: true
      },

      upload: function(/*context*/) {
        var plugin = this,
            source = this.readConfig('distDir');

        var promises = this.walk(path.join(source)).map(file => {
          var relative = path.relative(source, file),
              bucket = plugin.readConfig('bucket'),
              meta = { 'Content-Type': mime.lookup(file) };

          plugin.log(`preparing to upload to: "${bucket}"`, { verbose: true });

          return new RSVP.Promise(function(resolve, reject) {
            plugin.uploader().fPutObject(bucket, relative, file, meta, err => {
              if (err) {
                plugin.log('✘ ' + relative, { color: 'black' });
                plugin.log(err, { color: 'black' });

                reject(err);
              } else {
                plugin.log('✔ ' + relative, { verbose: true });
                resolve(relative);
              }
            })
          });
        });

        plugin.log(`uploaded ${promises.length} files ok`, { verbose: true });

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
          secretKey: this.readConfig('secretKey'),
          endPoint: this.readConfig('endpoint'),
          useSSL: this.readConfig('secure'),
          port: this.readConfig('port')
        })
      }
    });

    return new DeployPlugin();
  }
};
