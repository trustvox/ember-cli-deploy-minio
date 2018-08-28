# ember-cli-deploy-minio

![npm](https://img.shields.io/npm/v/ember-cli-deploy-minio.svg)

> An ember-cli-deploy plugin to upload files to minio (https://minio.io)

This plugin uploads one or more files to an Minio (S3) bucket. It could be used to upload the assets (js, css, images etc) or indeed the application's index.html.

## What is an ember-cli-deploy plugin?

A plugin is an addon that can be executed as a part of the ember-cli-deploy pipeline. A plugin will implement one or more of the ember-cli-deploy's pipeline hooks.

For more information on what plugins are and how they work, please refer to the [Plugin Documentation][1].

## Quick Start

To get up and running quickly, do the following:

- Ensure [ember-cli-deploy-build][2] is installed and configured.

- Install this plugin

```bash
$ ember install ember-cli-deploy-minio
```

- Place the following configuration into `config/deploy.js`

```javascript
ENV.minio = {
  accessKey: '<your-minio-access-key>',
  secretKey: '<your-minio-secret>',
  bucket: '<your-minio-bucket>',
  endpoint: '<your-minio-server-endpoint>'
}
```

- Run the pipeline

```bash
$ ember deploy
```

## Installation
Run the following command in your terminal:

```bash
ember install ember-cli-deploy-minio
```

## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][1].

- `configure`
- `upload`

## Configuration Options

For detailed information on how configuration of plugins works, please refer to the [Plugin Documentation][1].

<hr/>

### accessKey (`required`)

The access key for the user that has the ability to upload to the `bucket`.

*Default:* `undefined`

### secretKey (`required`)

The secret for the user that has the ability to upload to the `bucket`. 

*Default:* `undefined`

### bucket (`required`)

The minio bucket that the files will be uploaded to.

*Default:* `undefined`

### distDir

The root directory where the files matching `filePattern` will be searched for. By default, this option will use the `distDir` property of the deployment context, provided by [ember-cli-deploy-build][2].

*Default:* `context.distDir`

### secure

Determines if the endpoint is served from a secured connection.

*Default:* `true`

## Tests

* `yarn test`

## Why `ember build` and `ember test` don't work

Since this is a node-only ember-cli addon, this package does not include many files and dependencies which are part of ember-cli's typical `ember build` and `ember test` processes.

[1]: http://ember-cli-deploy.com/plugins/ "Plugin Documentation"
[2]: https://github.com/ember-cli-deploy/ember-cli-deploy-build "ember-cli-deploy-build"
[3]: https://github.com/ember-cli-deploy/ember-cli-deploy-gzip "ember-cli-deploy-gzip"
