// Function to handle overlay contents

var contentOverlay;
var overlayVideo;
var stereoContainer;
var stereoContainerClone;

function buildMediaViewer(contentType, fileURL) {
	
	buildFullScreenOverlay(contentType, fileURL);
	
}

function buildFullScreenOverlay(contentType, fileURL) {
	
	if ( $("#"+prefix+"content_overlay").length == 0 ) {
		$("body").prepend("<div id='"+prefix+"content_overlay'></div>");
		
		contentOverlay = $("#"+prefix+"content_overlay");
		buildStereoContainer(contentOverlay);
		
		contentOverlay
			.css({
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				zIndex: 10000,
				cursor: "none",
				opacity: 0
			}).animate({
				opacity: 1
			},500, function(){
				getContent(contentType, fileURL);
			});
	
		$(window).on({
			keydown: function(e){
				if ( e.keyCode == 27 ) {
					destroyOverlay();
				}	
			}
		});
		
	}
	
}

function buildStereoContainer(parentContainer) {
	
	parentContainer
		.prepend("<div class='"+prefix+"stereo_container' id='"+prefix+"stereo_container'/></div>")
		.find("."+prefix+"stereo_container")
		.css({
			width: "50%",
			height: "100%",
			float: "left",
			position: "relative",
			zIndex: 10,
		})
		.clone()
		.appendTo(contentOverlay)
		.attr("id", prefix+"stereo_container_clone");
		
	stereoContainer = $("#"+prefix+"stereo_container");
	stereoContainerClone = $("#"+prefix+"stereo_container_clone");
	
}

function buildFullscreenPreloader() {
	
	stereoContainer
		.prepend("<div class='"+prefix+"fullscreen_preloader_overlay'/></div>")
		.find("."+prefix+"fullscreen_preloader_overlay")
		.css({
			height: "100%",
			width: "100%",
			backgroundImage: "url('i/preloader.gif'), -webkit-radial-gradient(rgba(0,0,0,.8) 0%, rgba(0,0,0,.95) 100%)",
			backgroundPosition: "center center",
			backgroundRepeat: "no-repeat",
		});
		
	stereoContainerClone
		.prepend("<div class='"+prefix+"fullscreen_preloader_overlay'/></div>")
		.find("."+prefix+"fullscreen_preloader_overlay")
		.css({
			height: "100%",
			width: "100%",
			backgroundImage: "url('i/preloader.gif'), -webkit-radial-gradient(rgba(0,0,0,.8) 0%, rgba(0,0,0,.95) 100%)",
			backgroundPosition: "center center",
			backgroundRepeat: "no-repeat",
		});
			
}

function destroyFullscreenPreloader() {
	
	$("."+prefix+"fullscreen_preloader_overlay")
		.animate({
			opacity: 0,
		}, 200, function(){
			$(this).remove();
		});
	
}

function destroyOverlay(e) {	
	contentOverlay
		.stop()
		.animate({
			opacity:0
		},500, function(){
			contentOverlay.remove();
			$(window).off();
		});
}

function getContent(contentType, fileURL) {

	buildFullscreenPreloader();
	
	if ( contentType == "video" ) {
		
		contentOverlay.prepend("<div id='"+prefix+"video_container'><video id='"+prefix+"video' autoplay></video></div>");
		videoContainer = $("#"+prefix+"video_container");
				
		videoContainer
			.css({
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "black"
			})
			.find("video")
			.css({
				width: "100%",
				height: "100%"
			});
		
		var vidID = prefix+"video";
		var video = document.getElementById(vidID);
		video.src = fileURL;
		video.load();
		video.addEventListener("loadeddata", function() { destroyFullscreenPreloader(); }, false);
		video.addEventListener("ended", function() { destroyOverlay(); }, false);
		
		//buildVideoControls();
		
	}
	
}

function buildVideoControls() {
	
	contentOverlay.prepend("<div class='"+prefix+"controls_container'></div>");
	var controlsContainer = $("."+prefix+"controls_container");
	controlsContainer.css({
		background: "green",
		width: "100px",
		height: "50px",
	});
	
	var controlsContLeft = $("#"+prefix+"controls_container_left");
	
}