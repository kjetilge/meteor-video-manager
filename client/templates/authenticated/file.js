Template.videoFile.onCreated( () => Template.instance().subscribe( 'videoFile', Session.get("currentVideoFileId") ) );

Template.videoFile.onRendered( function () {
  var self = this;
  self.subscribe( 'videoFiles')
  self.autorun( function () {
    if(! self.subscriptionsReady())
      return;
    let id = Session.get("currentVideoFileId");
    //console.log("Auto id:", id)
    let videoFile = VideoFiles.findOne(id)
    //console.log("Auto find:", videoFile)
  })
})

Template.videoFile.helpers({
  videoFile() {
    currentVideoFileId = Session.get("currentVideoFileId")
    //console.log("##**** Searchin for", currentVideoFileId)
    var video_file = VideoFiles.findOne({_id: currentVideoFileId});
    //console.log("##**** Fant video_file:", video_file)
    if ( video_file && video_file.url ) {
      return video_file;
    } else {
      return null;
    }
  }
});
