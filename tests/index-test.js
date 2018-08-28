'use strict';

var chai  = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var assert = chai.assert;

describe('minio plugin', function() {
  var subject;
  var mockUi;
  var context;

  before(function() {
    subject = require('../index');
  });

  beforeEach(function() {
    mockUi = {
      verbose: true,
      messages: [],
      write: function() {},
      writeLine: function(message) {
        this.messages.push(message);
      }
    };

    context = {
      distDir: process.cwd() + '/tests/fixtures/dist',
      distFiles: ['app.css', 'app.js'],
      ui: mockUi,
      config: {
        minio: {
          accessKey: 'Q3AM3UQ867SPQQA43P2F',
          secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
          bucket: 'ember-cli-deploy-minio',
          endpoint: 'play.minio.io',
          secure: true,
          port: 9000,
          distDir: function(context) {
            return context.distDir;
          }
        }
      }
    };
  });

  it('has a name', function() {
    var plugin = subject.createDeployPlugin({
      name: 'minio'
    });

    assert.equal(plugin.name, 'minio');
  });

  it('implements the correct hooks', function() {
    var plugin = subject.createDeployPlugin({
      name: 'minio'
    });

    assert.typeOf(plugin.configure, 'function');
    assert.typeOf(plugin.upload, 'function');
  });

  describe('configure hook', function() {
    it('does not throw if config is ok', function() {
      var plugin = subject.createDeployPlugin({
        name: 'minio'
      });

      plugin.beforeHook(context);
      plugin.configure(context);

      assert.ok(true);
    });

    it('throws if config is not valid', function() {
      var plugin = subject.createDeployPlugin({
        name: 'minio'
      });
      context.config.minio = {};

      plugin.beforeHook(context);

      assert.throws(function() {
        plugin.configure(context);
      });
    });

    describe('required config', function() {
      it('warns about missing bucket', function() {
        delete context.config.minio.bucket;

        var plugin = subject.createDeployPlugin({
          name: 'minio'
        });
        plugin.beforeHook(context);
        assert.throws(function(/* error */){
          plugin.configure(context);
        });
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing required config: `bucket`/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);

        assert.equal(messages.length, 1);
      });

      it('warns about missing endpoint', function() {
        delete context.config.minio.endpoint;

        var plugin = subject.createDeployPlugin({
          name: 'minio'
        });
        plugin.beforeHook(context);
        assert.throws(function(/* error */){
          plugin.configure(context);
        });
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing required config: `endpoint`/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);

        assert.equal(messages.length, 1);
      });

      it('warns about missing accessKey', function() {
        delete context.config.minio.accessKey;

        var plugin = subject.createDeployPlugin({
          name: 'minio'
        });
        plugin.beforeHook(context);
        assert.throws(function(/* error */){
          plugin.configure(context);
        });
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing required config: `accessKey`/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);

        assert.equal(messages.length, 1);
      });

      it('warns about missing secretKey', function() {
        delete context.config.minio.secretKey;

        var plugin = subject.createDeployPlugin({
          name: 'minio'
        });
        plugin.beforeHook(context);
        assert.throws(function(/* error */){
          plugin.configure(context);
        });
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing required config: `secretKey`/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);

        assert.equal(messages.length, 1);
      });
    });

    it('adds default config to the config object', function() {
      delete context.config.minio.secure;
      delete context.config.minio.distDir;

      assert.isUndefined(context.config.minio.secure);
      assert.isUndefined(context.config.minio.distDir);

      var plugin = subject.createDeployPlugin({
        name: 'minio'
      });
      plugin.beforeHook(context);
      plugin.configure(context);

      assert.equal(context.config.minio.secure, true);
      assert.typeOf(context.config.minio.distDir, 'function');
    });
  });

  describe('#upload hook', function() {
    it('prints the begin message', function() {
      this.timeout(4000);

      var plugin = subject.createDeployPlugin({
        name: 'minio'
      });

      plugin.beforeHook(context);
      return assert.isFulfilled(plugin.upload(context))
        .then(function() {
          var regexMessage = /preparing to upload to: "ember-cli-deploy-minio"/;

          assert.equal(mockUi.messages.length, 5);
          assert.match(mockUi.messages[0], regexMessage);
        });
    });

    it('prints success message when files successully uploaded', function() {
      this.timeout(4000);

      var plugin = subject.createDeployPlugin({
        name: 'minio'
      });

      plugin.beforeHook(context);
      return assert.isFulfilled(plugin.upload(context))
        .then(function() {
          assert.equal(mockUi.messages.length, 5);

          var messages = mockUi.messages.reduce(function(previous, current) {
            if (/- uploaded 2 files ok/.test(current)) {
              previous.push(current);
            }

            return previous;
          }, []);

          assert.equal(messages.length, 1);
        });
    });
  });
});
