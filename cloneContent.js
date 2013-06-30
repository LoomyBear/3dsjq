// Cloning procedures

processedIDs = [];

function cloneContent() {

	console.log("cloning is started");

	// 1.0. Splitting content into original and clone parts and applying styles
	
	$("html")
		.css({ height: "100%" })
		.find("body")
		.css({ height: "100%" })
		.wrapInner("<div id='"+prefix+"original' class='"+prefix+"split_part' /></div>");
	
	$("body").getOriginalContainer()
		.wrapInner("<div class='"+prefix+"container'>")
	
	// 1.1. Marking all the content inside the Original and attaching specific #ids
	
	var elemCount = 0;
	$("body").getOriginalContainer().find("."+prefix+"container *").each(function(){
		$(this)
			.data(prefix+"elem_ID",elemCount)
			.addClass(prefix+"elem_ID_"+elemCount);
		elemCount++;
	});
	
	// 1.2. Cloning
	
	$("body").getOriginalContainer()
		.clone()
		.attr("id",prefix+"clone")
		.appendTo("body");
	
	var elemCount = 0;
	
	$("body").getCloneContainer().find("."+prefix+"container *").each(function(){
		$(this)
			.data(prefix+"elem_ID",elemCount)
			.addClass(prefix+"elem_ID_"+elemCount);
		elemCount++;
	});

	var method = inputParams["method"];
	adjustSideBySide(method);
	
	console.log("cloning is complete");
	
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
			minHeight: "100%",
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
	
	// Reinitiating the procedure on window resize
	 
	$(window).on({
		resize: function(){
			adjustSideBySide(method);
		}
	});
	
}