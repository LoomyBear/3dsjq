// Cloning procedures

function cloneContent() {

	console.log("cloning is started");
	
	// Vars
	
	bodyBack = $("body").css("background");
	initContent = $("body").html();

	// Splitting content into original and clone parts and applying styles
	
	$("html")
		.css({ height: "100%" })
		.find("body")
		.css({ height: "100%" })
		.wrapInner("<div id='"+prefix+"original' class='"+prefix+"split_part' /></div>");
	
	$("body").getOriginalContainer()
		.wrapInner("<div class='"+prefix+"container'>")
	
	// Marking all the content inside the Original and attaching specific #ids
	
	var elemCount = 0;
	$("body").getOriginalContainer().find("."+prefix+"container *").each(function(){
		$(this)
			.addClass(prefix+"elem_ID_"+elemCount);
		elemCount++;
	});
	
	// Cloning
	
	$("body").getOriginalContainer()
		.clone()
		.attr("id",prefix+"clone")
		.appendTo("body");
	
	var elemCount = 0;
	
	$("body").getCloneContainer().find("."+prefix+"container *").each(function(){
		$(this).addClass(prefix+"elem_ID_"+elemCount);
		elemCount++;
	});
	
	// Replacing id attributes inside the clone
	
	$("body").getCloneContainer().find("div [id]").each(function() {
		var ID = $(this).attr("id");
		var newID = ID+prefix;
		$(this).attr("id",newID);
	});
	
	var method = inputParams["method"];
	adjustSideBySide(method);
	
	console.log("cloning is complete");
	
	// Launching styles adaptation
	stylesAdaptation();
	
}

function adjustSideBySide(method) {

	var winW = $(window).width();
	var winH = $(window).height();
	var scrollW;
	
	if ( method && method == "top-to-bottom" ) {
		
		var margin = (winH/4)*(-1);
		
		$("."+prefix+"split_part").css({
			width: "100%",
			height: winH/2,
			position: "relative",
		});
		
		$("."+prefix+"container").css({
			width: "100%",
			height: winH,
			position: "absolute",
			top: margin,
			"-webkit-transform": "scaleY(0.5)",
			"-webkit-transform": "scaleY(0.5)",
			"-moz-transform": "scaleY(0.5)",
			"transform": "scaleY(0.5)",
		});
		
	} else {
		
		$("."+prefix+"split_part").css({
			width: "50%",
			height: "100%",
			float: "left",
			"background-size": "100% 100%",
			"background-position": "center center",
			"background-repeat": "no-repeat",
			overflow: "hidden",
			position: "relative",
		});
		
		$("."+prefix+"container").css({
			width: "50%",
			minHeight: winH,
			"-webkit-transform": "scaleX(0.5)",
			"-moz-transform": "scaleX(0.5)",
			"transform": "scaleX(0.5)",
		});
		
		if ( $("body").getOriginalContainer().width() > $("body").getOriginalContainer().get(0).scrollWidth ) {
			scrollW = $("body").getOriginalContainer().width() - $("body").getOriginalContainer().get(0).scrollWidth;
		} else {
			scrollW = 0;
		}
		var margin = (winW/4)*(-1);
		
		$("."+prefix+"container")
			.width(winW) // Fixing the window width in case of scroll
			.css({ marginLeft: margin-scrollW }); // Fixing the scroll gap
		
		if ( $("body").getOriginalContainer().get(0).scrollHeight > $("body").getOriginalContainer().height() ) {
		
			$("body").getOriginalContainer().height( $("body").getOriginalContainer().get(0).scrollHeight );
			$("body").getCloneContainer().height( $("body").getCloneContainer().get(0).scrollHeight );
		
		}
		
	}
	
	// Applying body background on the stereo containers
	
	$("body").getOriginalContainer().css({ background: bodyBack });
	$("body").getCloneContainer().css({ background: bodyBack });
	
	// Reinitiating the procedure on window resize
	 
	$(window).on({
		resize: function(){
			adjustSideBySide(method);
		}
	});
	
}