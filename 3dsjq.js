// Global vars

var jsURLs = [];
var zPlaneShiftedObjs = [];
var inputParams = [];
var prefix = "_3dsjq_";
var stereoObjArr = [];
var hoverElemIDs = [];
var initContent;
var bodyBack;

var zPlaneDefaultParams = {
	method: 'left-to-right',				// side-by-side method (left-to-right, top-to-bottom)	string
	depthBudget: 1.5,						// maximum allowed amount of shifting in %				int		
	levels: 5,								// the maximum number of zPlanes						int
	visualCues: true,						// enabling/disabling scaling for zPlanes				boolean
	scaleAmount: 10,						// amount of scaling in %s								int
	shiftAnim: true,						// enabling/disabling animation fot zPlane shifting		boolean
	shiftAnimDuration: 0.25,				// animation duration in seconds						int
}

var zParams;
var shiftLimit;
var shiftStep;
var shiftScale;
var shiftAnim;
var shiftMaxLvl;
var sAD;
var initsSA;

$.ajaxSetup({ cache: false }); // Prevents caching


// Initialization

function go3DS( objArr, params ) {
	
	if ( objArr ) {
		zPlaneShiftedObjs = objArr;
	}
	
	if ( params ) {
		inputParams = params;
	}
	
	cloneContent();
	
}



// functions.js

// Function to get container width
function getStereoContainerWidth() {
	
	var stereoContainerW = $(window).width()/2;
	return stereoContainerW;
	
}

// Function to get the class containing the current depth level
function getLevelClass(target) {
	
	var levelClass = "";
	var targetClass = target.attr("class");
	var classes = targetClass.split(" ");
	var patt = new RegExp(prefix+"level_", "g");
				
	$.each(classes, function(key, val) {
		if ( patt.test(val) ) {
			levelClass = val;
		}
	});
	
	if ( levelClass ) {
		return levelClass;
	} else {
		return 0;
	}
	
}

// buildObjParamArr( ... ) - function to store initial data for elements to be shifted
function buildObjParamArr( target, objID, objPseudo, initLvl, pseudoLvl ) {
	
	target.each(function(){
	
		if ( $(this).isCalculated() == false ) {
			
			function buildArray(objID, objZID, objPseudo, initLvl, pseudoLvl, initML, initMR) {
				return {
					objID: objID,
					objZID: objZID,
					objPseudo: objPseudo,
					initLvl: initLvl,
					pseudoLvl: pseudoLvl,
					initML: initML,
					initMR: initMR,
				}
			}
			
			var tML = parseInt($(this).css("margin-left"));
			var tMR = parseInt($(this).css("margin-right"));
			var objZID = $(this).getElementID();
			
			var obj = buildArray(objID, objZID, objPseudo, initLvl,  pseudoLvl, tML, tMR);
			stereoObjArr.push(obj);
		
		}
		
	});
	
}

// jQuery extensions
(function($){

 	$.fn.extend({ 
 		
 		// getOriginalContainer() - Function to get the parent for the original part. Returns original container object.
 		getOriginalContainer: function() {
 		 			
			var originalContainer = this.find("#"+prefix+"original");
			
			if ( originalContainer ) {
	    		return originalContainer;
	    	} else {
		    	console.log('getOriginalContainer() failed to find original container within the specified parent.');
	    	}
    		
    	},
    	
    	// getCloneContainer() - Function to get the parent for the clone part. Returns clone container object.
    	getCloneContainer: function() {
 		 			
			var cloneContainer = this.find("#"+prefix+"clone");
    		if ( cloneContainer ) {
	    		return cloneContainer;
	    	} else {
		    	console.log('getCloneContainer() failed to find clone container within the specified parent.');
	    	}
    		
    	},
    	
    	// getCountClass() - function to extract the class containing elem_ID
    	getCountClass: function(){
	    	
			var outputClass = "";
	    	
	    	this.each(function(){
		    	
		    	var targetClass = $(this).attr("class");
				var classes = targetClass.split(" ");
				var patt = new RegExp(prefix+"elem_ID_", "g");
				
				$.each(classes, function(key, val) {
					if ( patt.test(val) ) {
						outputClass = val;
					}
				});
				
	    	});
	    	
	    	return outputClass;
	    	
    	},
		
		// getElementID() - function to get elem_ID of the current element    	
    	getElementID: function(){
	    	
			var output;
	    	
	    	this.each(function(){
		    	
		    	output = $(this).getCountClass().replace(prefix+"elem_ID_", "");
				
	    	});
	    	
	    	return output;
	    	
    	},
 		
 		// getBoth() - Function to filter both original and clone elements. Returns object with a framework specific class.
 		getBoth: function() {
 		 			
			var outputClass;

    		this.each(function() {
				
				outputClass = $(this).getCountClass();
				
    		});
    		
    		return $("." + outputClass);
    		
    	},
    	
    	// getClone() - Function to filter the clone element. Returns clone object.
 		getClone: function() {
 		 			
			var targetID;

    		this.each(function() {
				
				outputClass = $(this).getCountClass();
				
    		});
    		
    		return $("body").getCloneContainer().find("." + outputClass);
    		
    	},
    	
    	
    	// isCalculated() - checks if the current element params have being calculated and pushed to stereoObjArr; 
 		isCalculated: function() {
	 		
	 		var isCalculated = false;
	 		
    		this.each(function() {
				
				var tID = $(this).getElementID();
				
				$.each(stereoObjArr, function(key, arr){
					if( arr["objZID"] == tID ) {
						isCalculated = true;
					}
				});
				
    		});
    		
    		return isCalculated;
    		
    	},
    	
    	// shift(level) - Function to shift elements in the zPlane. Returns the target item.
    	shift: function(level) {
    		
	    	this.each(function() {
				
				if ( level != undefined && $(this).parents("#"+prefix+"original").length > 0 ) {
					
					var targetClass = $(this).attr("class");
					var classes = targetClass.split(" ");
					var oID = $("body").getOriginalContainer().attr("id");
					var selector = "#"+oID+" ";
					
					$.each(classes, function(key, val) {
						selector = selector+"."+val;
					});
					
					var target = $(""+selector);
					buildObjParamArr( target, selector, 0, 0, 0 );
					
					$.each(stereoObjArr, function(key, obj){
		
						if ( obj["objZID"] == target.getElementID() ) {
						
							var initML = obj["initML"];
							var initMR = obj["initMR"];
						
							zPlaneShifter(target, level, initML, initMR);
						
						}
					
					});

				}
    	
    		});
	    		    	
	    	return this;
    	
    	},
    	
    	// getDepthLevel() - Function to get the level of the object. Returns int.
    	getLevel: function() {
	    	
	    	var level;
	    	
	    	this.each(function() {
	    		
	    		var levelClass = getLevelClass($(this));
	    		var patt = new RegExp(prefix+"level_","g");
	    		
	    		if ( levelClass != 0 ) {
		    		level = parseInt(levelClass.replace(patt, ""));
		    	} else {
			    	level = 0;
		    	}
	    		
	    	});
	    	
	    	return level;
	    	
    	}
    	
	});
	
})(jQuery);


// cloneContent.js

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

// stylesAdaptation.js

// Parsing stylesheets

function stylesAdaptation() {
	
	var stylesheetURLs = [];
	var stylesheetInlines = "";
	var curURL = window.location.href;

	console.log("adaptation is started");

	$("html")
		.find("link[rel='stylesheet']")
		.each(function(){
			var styleURL = $(this).attr("href");
			stylesheetURLs.push(styleURL);
		});
	
	$("html")
		.find("style")
		.each(function(){
			var stylesheetStr = $(this).html();
			stylesheetInlines = stylesheetInlines + stylesheetStr;
		});		
		
	if ( stylesheetURLs !== "" ) {
	
		$.each(stylesheetURLs, function(key, stylesheet){
		
			$.ajaxSetup({ cache: false }); // Prevents caching
			
			$.when($.get(stylesheet, "text")).done( function(response) {
				
				var inputCSS = response.toString();
				buildCloneStylesheet(inputCSS);				
			
			}).fail( function(){
			
				console.warn( "3DSjQ error occured: " + stylesheet + " cannot be opened" );
			
			});
		
		});
		
		console.log("adaptation is complete");
		
	}
	
	if ( stylesheetInlines !== "" ) { buildCloneStylesheet(stylesheetInlines); }

}

function buildCloneStylesheet(inputCSS) {
	
	inputCSS = inputCSS.toString();
	inputCSS = inputCSS.replace(/[\t]|[\r\n]/gm," "); // Removing line breaks and tabs
		
	var outputCSS = [];
	
	var fetchRules = new RegExp("\}.[^}]*","gm");
	var rulesArr = inputCSS.match(fetchRules);		
	
	var outputRules;
	
	$.each(rulesArr, function(key, rule){
		
		var outputRule;
		var newSel;
		var selRepPatt;
		var pushFlag = false;
		
		rule = rule.replace(/\}\s/, "").replace(/\/\*.*?\*\//, "").replace(/\s\s/, "") + "}";
		
		var selector = rule.replace(/\{.*\}/,"");
		var selArr = selector.split(/,/);
		var style = rule.replace(/^.[^{]*/,"");
		
		$.each(selArr, function(key, sel){
		
			var hoverCheck = /:hover/.test(sel);
			var idCheck = /#/.test(sel);
		
			if ( hoverCheck == true || idCheck == true ) {
				pushFlag = true;
			}
			
			if ( hoverCheck == true ) {
				hoverElemIDs.push( sel.replace(/:hover/, "") );
				sel = sel.replace(/:hover/,".hover"+prefix);
			}
			
			if ( idCheck == true ) {
				
				sel = sel.replace(/^\s*/,"");
				var sArr = sel.split(/\s/);
				
				$.each(sArr,function(k, s){
					
					if ( /#/.test(s) ) {
						var repPatt = new RegExp(s, "g");
						sel = sel.replace(repPatt, s+prefix); 
					}
					
				});
				
				// Relative URLs fix
				
				if ( /\.\.\//.test(style) ) {
					var urlPrefix = document.location.href.replace(/#/, "").replace(/\w+\.html/,"");
					style = style.replace(/\.\.\//g, urlPrefix+"/");
				}
			
			}
			
			if ( pushFlag == true ) {
			
				outputRule = sel+style;
				outputCSS.push(outputRule);
				
			}
			
		});
	
	});
	
	if ( outputCSS !== null ) {

		$("<style type='text/css' />")
			.html(outputCSS)
			.prependTo($("body"));
	
	}
	
	// Building mirroring
	buildMirroring();

}

// buildMirroring.js

// Interaction mirroring procedures

function buildMirroring() {
	
	buildHoverBindings(hoverElemIDs);
	buildScrollBindings();
	buildCursor();
	
	// Building zPlane
	buildZPlane();
	
}

function buildHoverBindings(objs) {

	$.each(objs, function(key,obj){
		obj = obj.replace(/:hover/, "");
		var target = $(""+obj);
		target.each(function(){
			var clone = $(this).getClone();
			$(this).on({
				mouseenter: function(){
					clone.addClass("hover"+prefix);
				},
					mouseleave: function(){
					clone.removeClass("hover"+prefix);
				}
			});
		});
	});
	
}

function buildScrollBindings() {
		
	$("body").getOriginalContainer().on({
		scroll: function(){
			var scrollTop = $(this).scrollTop();
			$("body").getCloneContainer().scrollTop(scrollTop);
		}
	});
	
}

function buildCursor() {
	
	$("body").getOriginalContainer().prepend("<div id='"+prefix+"cursor_original' class='"+prefix+"cursor'></div>");
	$("body").getCloneContainer().prepend("<div id='"+prefix+"cursor_clone' class='"+prefix+"cursor'></div>");
	
	$("."+prefix+"cursor").css({
		position: "absolute",
		width: "5px",
		height: "5px",
		"border-radius":"256px",
		background: "red",
		top:0,
		left: 0,
		zIndex: 1000,
		marginLeft: "5px",
		marginTop: "5px"
	});
	
	// Hiding the default cursor
	$("body").find("*").css({ cursor: "none" });
		
	var scrollDelta = 0;
	
	$("body").getOriginalContainer().on({
		mousemove: function(e){
		
			var winW = $(window).width();
					
			$("#"+prefix+"cursor_original").css({
				top: e.pageY + scrollDelta,
				left: e.pageX
			});
			$("#"+prefix+"cursor_clone").css({
				top: e.pageY + scrollDelta,
				left: e.pageX
			});
		},
		scroll: function(e) {
		
			scrollDelta = $(this).scrollTop();			
		
		}
	});
	
	$("."+prefix+"cursor").on({
		mouseenter: function() {
			$(this).css({
				zIndex: 0
			})
		},
		mouseleave: function(){
			$(this).css({
				zIndex: 10
			})
		}
	});
	
}

// build zPlane

// Building zSpace

function buildZPlane() {
	
	console.log("zPlane building is started ...");
	
	var winW = $(window).width();
	
	zParams = zPlaneDefaultParams;
	
	// Checking out input params
	if ( inputParams ) {
		$.each(inputParams, function(param, val){
			if ( zParams[param] != val ) {
				zParams[param] = val;	
			}
		});
	}

	// Specifying the maximum limit for shifting according to incoming parameter

	shiftLimit = Math.round(((winW/100)*zParams["depthBudget"])/2);
	shiftStep = Math.round(shiftLimit/zParams["levels"]);

	shiftScale = zParams["visualCues"];
	shiftAnim = zParams["shiftAnim"];
	shiftMaxLvl = zParams["levels"]
	sAD = zParams["shiftAnimDuration"];
	initsSA = zParams["scaleAmount"];
	
	if ( zPlaneShiftedObjs !== null ) {	
		
		$.each(zPlaneShiftedObjs, function(obj, level){
				
			var tID = obj;
			var tSplit = tID.split(/:/);
			var objID = tSplit[0];
			var objPseudo = tSplit[1];
			var target = $("html").find(objID);
			
			if ( objPseudo ) {
				$.each(zPlaneShiftedObjs, function(key, val){
					if ( key == objID && /:hover/.test(key) == false ) {
							initLvl = val;
					} else {
						initLvl = 0;
					}
				});
				pseudoLvl = level;
			} else {
				initLvl = level;
				pseudoLvl = 0;	
			}
			
			buildObjParamArr( target, objID, objPseudo, initLvl, pseudoLvl );
			zPlaneDisplace(target);
		
		});
		
	}
	
}

function zPlaneDisplace(target) {
	
	var tPseudo;
	var initML;
	var initMR;
	var initLvl;
	var pseudoLvl;
	
	$.each(stereoObjArr, function(key, obj){
		
		if ( obj["objZID"] == target.getElementID() ) {			
			tPseudo = obj["objPseudo"];
			initML = obj["initML"];
			initMR = obj["initMR"];
			initLvl = obj["initLvl"];
			pseudoLvl = obj["pseudoLvl"];
		}
		
	});
	
	if ( tPseudo == "hover" ) {
		
		var tInitZ;
		var tParentInitZ;
		
		target.on({
			mouseenter: function(){
				tInitZ = $(this).css("z-index");
				tParentInitZ = $(this).parent().css("z-index");
				$(this)
					.css({ zIndex: 1000 })
					.parent()
					.css({ zIndex: 1000 });
				zPlaneShifter($(this), pseudoLvl, initML, initMR);
			},
			mouseleave: function(){
				$(this)
					.css({ zIndex: tInitZ })
					.parent()
					.css({ zIndex: tParentInitZ });
				zPlaneShifter($(this), initLvl, initML, initMR);
			}
		});
		
	} else {
	
		target.each(function(){
			zPlaneShifter($(this), initLvl, initML, initMR);	
		});
		
	}

}

function windowViolation(target,level) {

	var winW = $(window).width()/2;
	var tOffset = target.offset();
	var tShiftedOffset = tOffset.left-(level*shiftStep);

	if ( zParams["visualCues"] == true ) {
		var sSA = 1+((initsSA)*(level/shiftMaxLvl))/100;
		var tW = target.width();
		var sDelta = ((tW*sSA)-tW)/2;
		tShiftedOffset = tShiftedOffset-sDelta;
	}

	if ( tShiftedOffset < 0 ) {
		console.log("WARNING: "+target.attr("class")+" violated the window by " + tShiftedOffset + "px");
		return true;
	} else {
		return false;
	}
	
}

function addLevelClass(target, level) {

	target.getBoth().addClass(prefix+"level_"+level);
	
}

function removeLevelClass(target) {
	
	var levelClass = getLevelClass(target);
	target.getBoth().removeClass(levelClass);
	
}

function zPlaneShifter(target, level, initML, initMR) {

	initML = parseInt(initML);
	initMR = parseInt(initMR);
	
	sSA = 1+((initsSA)*(level/shiftMaxLvl))/100;
	var targetClone = target.getClone();
	
	var wViolation = windowViolation(target, level);
	
	if ( shiftAnim == true ) {
	
		var initAnim = target.css("-webkit-transition-property");
		var initAnimDur = target.css("-webkit-transition-duration");
	
		target.css({
			"-webkit-transition-property" : initAnim+", margin, -webkit-transform",
			"-webkit-transition-duration" : initAnimDur+", " +sAD+"s, " +sAD+"s",
			"-moz-transition-property" : initAnim+", margin, -webkit-transform",
			"-moz-transition-duration" : initAnimDur+", " +sAD+"s, " +sAD+"s",
			"transition-property" : initAnim+", margin, -webkit-transform",
			"transition-duration" : initAnimDur+", " +sAD+"s, " +sAD+"s",
		});
		targetClone.css({
			"-webkit-transition-property" : initAnim+", margin, -webkit-transform",
			"-webkit-transition-duration" : initAnimDur+", " +sAD+"s, " +sAD+"s",
			"-moz-transition-property" : initAnim+", margin, -webkit-transform",
			"-moz-transition-duration" : initAnimDur+", " +sAD+"s, " +sAD+"s",
			"transition-property" : initAnim+", margin, -webkit-transform",
			"transition-duration" : initAnimDur+", " +sAD+"s, " +sAD+"s",
		});
	
	}
		
	var deltaLeft;
	var deltaRight;
	var deltaCloneLeft;
	var deltaCloneRight;
	var deltaHS;
	var deltaVS;
	
	var tW = target.width();
	var tH = target.height();
	deltaHS = (tW*sSA)-tW;
	deltaVS = (tH*sSA)-tH;	
	
	if ( level >= 0 ) {
	
		deltaLeft = initML+(level*shiftStep);
		deltaRight = initMR-(level*shiftStep);
		deltaCloneLeft = initML-(level*shiftStep);
		deltaCloneRight = initMR+(level*shiftStep);		
	
	} else if ( level < 0 ) {
		
		deltaLeft = initML-(level*shiftStep);
		deltaRight = initMR+(level*shiftStep);
		deltaCloneLeft = initML+(level*shiftStep);
		deltaCloneRight = initMR-(level*shiftStep);	
		
	}
	
	target.css({
		marginLeft: deltaLeft,
		marginRight: deltaRight,
	});

	targetClone.css({
		marginLeft: deltaCloneLeft,
		marginRight: deltaCloneRight,
	});
			
	if ( level == 0 ) {
		removeLevelClass(target, level);
	} else {
		addLevelClass(target, level);
	}

	if ( shiftScale == true && sSA != 0 /*&& tPseudo*/ ) {			
		target.css({
			"-webkit-transform" : "scale("+sSA+")",
			"-moz-transform" : "scale("+sSA+")",
			"transform" : "scale("+sSA+")"
		});
		targetClone.css({
			"-webkit-transform" : "scale("+sSA+")",
			"-moz-transform" : "scale("+sSA+")",
			"transform" : "scale("+sSA+")"
		});
	}
	
}


