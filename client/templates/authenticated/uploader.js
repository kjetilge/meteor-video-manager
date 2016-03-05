var pageSession = new ReactiveDict();
Template.uploader.onCreated(function(){
  this.uploader = new ReactiveVar( {progress: 0} );
  this.isUploading = new ReactiveVar( false );
  this.videoFileId = new ReactiveVar( false );
});

Template.uploader.rendered = function() {
	pageSession.set("uploaderInfoMessage", "");
	pageSession.set("uploaderFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.uploader.helpers({
  isUploading: function() {
    let l = Template.instance().isUploading.get();
    console.log("uploadting: "+l)
    return l;
  },
  progress: function () {
    let prog = Template.instance().uploader.get().progress() * 100;
    let four_decims = prog.toLocaleString('en', {maximumFractionDigits:4, useGrouping:false});
    return four_decims;
  },
  hideCancel: function (template) {
    console.log(Template.parentData())
    //console.log("isUploading.get()", Template.instance().isUploading.get())
    return Template.instance().isUploading.get() ? "" : "hide";
  },
  hideFilnBtn: function () {

  },
  "infoMessage": function() {
		return pageSession.get("uploaderInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("uploaderFormErrorMessage");
	}

});

Template.uploader.events({
  "submit": function(e, t) {
		e.preventDefault();
		pageSession.set("uploaderInfoMessage", "");
		pageSession.set("uploaderFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var videosInsertVideoNewFormMode = "insert"; //denne må endres på update siden !
			if(!t.find("#form-cancel-button")) {
				switch(videosInsertVideoNewFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("uploaderInfoMessage", message);
					}; break;
				}
			}
      if(typeof(Router) !== 'undefined') //Make videomanager work without a router
			   Router.go(Meteor.settings.public.vmSaveRoute, {videoId: newId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("uploaderInfoMessage", message);
		}
		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
        if(!!self && self.params)
				    values.editionId = self.params.editionId;
        values.videoFile = Session.get("currentVideoFileId")
				newId = Videos.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
        VideoFiles.update(values.videoFile, {$set: {videoId: newId} })
			}
		);
		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();
    Modules.client.abortUpload({ event: e, template: t })
		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();
    Modules.client.abortUpload({ event: e, template: t })
		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();
		/*BACK_REDIRECT*/
	},
  "click .fileinput-remove": function(e, t) {
		e.preventDefault();
    Modules.client.abortUpload({ event: e, template: t })
		/*CANCEL_REDIRECT*/
	},

	"change #field-video-file": function(e, t) {
  	e.preventDefault();
    //Show progress-bar
    Template.instance().isUploading.set( true );

  	//var fileInput = $(e.currentTarget);
  	//var dataField = fileInput.attr("data-field");
  	//var hiddenInput = fileInput.closest("form").find("input[name='" + dataField + "']");
    t.isUploading.set( true );
    Modules.client.uploadToAmazonS3( { event: e, template: t } );
  }
});
