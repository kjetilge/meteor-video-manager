Package.describe({
  name: 'telstar:video-manager',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(["templating","ecmascript"]);
  api.use(["reactive-dict", "reactive-var",'ecmascript', 'accounts-base', 'check', 'mongo']);
  //api.use('ecmascript');
  api.use(["templating"], "client")

  api.use([
    'edgee:slingshot@0.7.1'
  ], ['client','server']);

  api.use([
    "peerlibrary:aws-sdk@2.2.37_1",
  ], ['client','server']);

  api.use([
    "themeteorchef:bert@2.1.0"
  ], ['client']);

  //Add server/client files
  api.addFiles([
    "both/modules/_modules.js",
    "both/modules/check-url-validity.js",
    "both/methods/files.js",
  ],["client","server"]);

  //Add server files
  api.addFiles([
    "server/modules/_modules.js",
    "server/publications/files.js",
    "server/slingshot.js",
    "server/startup.js"
  ],["server"]);



  api.addFiles([
    "client/modules/_modules.js",
    "client/modules/upload-to-amazon-s3.js",
    "client/templates/authenticated/file.html",
    "client/templates/authenticated/file.js",
    "client/templates/authenticated/upload.html",
    "client/templates/authenticated/uploader.html",
    "client/templates/authenticated/uploader.js",
    "client/templates/authenticated/videoForm.html"
  ],["client"]);

  //api.export("VMConfig", ['client', 'server']);
  //api.export("TestF", ['client', 'server']);
  api.export("VM", ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('telstar:video-manager');
  api.addFiles('video-manager-tests.js');
});
