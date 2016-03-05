if (Meteor.settings.AWSAccessKeyId) {
  AWS.config.update({
    accessKeyId: Meteor.settings.AWSAccessKeyId,
    secretAccessKey: Meteor.settings.AWSSecretAccessKey,
    region: Meteor.settings.region
  })
} else {
  console.warn("AWS settings missing")
}

Meteor.methods({
  storeUrlInDatabase: function( url, id ) {
    console.log("store url", url)
    check( url, String );
    Modules.both.checkUrlValidity( url );

    try {
      VideoFiles.update({_id: id}, {$set: {
        url: url,
        added: new Date()
      }});
    } catch( exception ) {
      return exception;
    }
  },
  storeVideoFile: function () {
    //noe
  },
  removeVideoFile: function (id) {
    console.log("removing file with id", id)
    if (Meteor.settings.AWSAccessKeyId) {
      AWS.config.update({
        accessKeyId: Meteor.settings.AWSAccessKeyId,
        secretAccessKey: Meteor.settings.AWSSecretAccessKey,
        region: Meteor.settings.region
      })
    } else {
      console.warn("AWS settings missing")
    }

    s3 = new AWS.S3();
    let file = VideoFiles.findOne(id);
    console.log("fil id"+id+" ", file)
    let params = {
      Bucket: file.bucket, /* required */
      Key: file.key /* required */
    };
    s3.deleteObject(params, Meteor.bindEnvironment(
        function(err, data){
            if(err) {

            } else {
              console.log(data)
              VideoFiles.remove(id);
            }
        },
        function(e){
            //bind failure
            console.log(e);
        }
    ));
  }
});
