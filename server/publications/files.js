Meteor.publish( 'videoFile', function(id){
  console.log("publishing", id)
  var data = VideoFiles.find(id);
  if ( data ) {
    return data;
  }
  return this.ready();
});
