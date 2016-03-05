var uploader = new ReactiveVar();
let template;

let _getFileFromInput = ( event ) => event.target.files[0];

let _setPlaceholderText = ( string = "Velg en fil å laste opp" ) => {
  //template.find( "#upload-helptext" ).innerText = string;
};

let _setFileUrl = (string = "..") => {
  template.find(".file-caption-ellipsis").innerText = string;
}

let _addUrlToDatabase = ( url, id ) => {
  Meteor.call( "storeUrlInDatabase", url, id, ( error ) => {
    if ( error ) {
      Bert.alert( error.reason, "warning" );
      _setPlaceholderText();
    } else {
      Bert.alert( "Videoen ble lastet opp til klippmagasin!", "success" );
      _setPlaceholderText();
    }
  });
};

let _removeUrlFromDatabase = () => {
  let id = Session.get("currentVideoFileId");
  console.log("removeUrlFromDatabase: id", id)
  Meteor.call( "removeUrlFromDatabase", id, ( error, res ) => {
    if ( error ) {
      Bert.alert( error.reason, "warning" );
      _setPlaceholderText();
    } else {
      console.log("id to be deleted", id)
      _removeFileFromFilestore(id)
      Bert.alert( "Videoen ble slettet", "success" );
      _setPlaceholderText();
    }
  });
};

let _removeVideoFile = (id) => {
  if(id) {
    console.log("removing videofile: ", id)
    Meteor.call( "removeVideoFile", id, (err, res) => {
      if(err) {
        console.log(err)
      } else {
        console.log("removed file: and session false ", res)
      }
    })
  }
}

let _uploadFileToAmazon = ( file, template ) => {
  let oldId = Session.get("currentVideoFileId");
  let oldFile = VideoFiles.findOne(oldId);
  if(!!oldFile) {
    _removeVideoFile(oldFile._id);
  }

  //Insert a new  video and update key and bucket
  id = VideoFiles.insert(file);
  Session.set("currentVideoFileId", id)
  let key = id+"-"+file.name;
  VideoFiles.update(id, {$set: {key: key, bucket: "klippmagasin"}});

  let metaContext = {id: id}; // use in sligshot directive to generate url

  const uploader = new Slingshot.Upload( "uploadToAmazonS3", metaContext);

  //attach the id to the uploader for later use
  uploader.videoFileId = id;
  //set uploader instance tom template it so it is available for progressBar
  template.uploader.set(uploader);

  uploader.send( file, ( error, url ) => {
    if ( error ) {
      Bert.alert( error.message, "warning" );
      _setPlaceholderText();
    } else {
      console.log("videoFileId: ", uploader.videoFileId)
      _addUrlToDatabase( url,  uploader.videoFileId);
      template.isUploading.set( false );
    }
  });
};

//*** public methods ***/
let upload = ( options ) => {
  template = options.template;
  let file = _getFileFromInput( options.event );
  _setPlaceholderText( `Laster opp ${file.name}...` );
  _setFileUrl(file.value);
  _uploadFileToAmazon( file, template);
};

let abortUpload = ( options ) => {
  template = options.template;
  let xhr = template.uploader.get().xhr;

  if(xhr) { //if upload active
    xhr.abort();
    template.isUploading.set( false );
    _setPlaceholderText( `aborted upload` );
    _removeVideoFile(Session.get("currentVideoFileId"));
  } else {
    _removeVideoFile(Session.get("currentVideoFileId"));
  }
};

Modules.client.uploadToAmazonS3 = upload;
Modules.client.abortUpload = abortUpload;
