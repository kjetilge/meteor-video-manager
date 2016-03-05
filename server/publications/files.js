Meteor.publish( 'videoFiles', function(){
  var data = VideoFiles.find();
  console.log("publishing files", data.count())
  if ( data ) {
    return data;
  }
  return this.ready();
});

Meteor.publish( 'videoFile', function(id){
  console.log("publishing", id)
  var data = VideoFiles.find(id);
  if ( data ) {
    return data;
  }
  return this.ready();
});
Meteor.publish( 'videos', function(id){
  console.log("publishing", id)
  var data = Videos.find();
  if ( data ) {
    return data;
  }
  return this.ready();
});
