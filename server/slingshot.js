Slingshot.fileRestrictions( "uploadToAmazonS3", {
  allowedFileTypes: [ "video/mp4", "video/quicktime", "video/*"],
  maxSize: 10 * 1024 * 1024 * 1024 // 1GB
});

Slingshot.createDirective( "uploadToAmazonS3", Slingshot.S3Storage, {
  bucket: Meteor.settings.bucket,
  region: Meteor.settings.region,
  acl: "public-read",
  authorize: function (file, metaContext) {
    return true;
  },
  key: function ( file, metaContext ) {
    return metaContext.id + "-" + file.name;
  }
});
