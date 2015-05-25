// Edits 08.04.2015 

// 1. Added stereoIsOn - global variable to indicate if the library is running
// 2. Variables definition levelled all over the library
// 3. Fixed issue with multiple ids within a single selector

// Edits 25.05.2015

// 1. Fixed the issue with background stretching for original and clone containers
// 2. Added the _3dsjq_ class to the body

// Global vars

var jsURLs = [],
	zPlaneShiftedObjs = [],
	inputParams = [],
	prefix = "_3dsjq_",
	stereoObjArr = [],
	hoverElemIDs = [],
	initContent,
	bodyBack,
	bodyInitHeight,
	elemCount, // Counting number of elements in a markaup
	zPlaneDefaultParams = {
		method: 'left-to-right',				// side-by-side method (left-to-right, top-to-bottom)	string
		depthBudget: 1.5,						// maximum allowed amount of shifting in %				int		
		levels: 5,								// the maximum number of zPlanes						int
		visualCues: true,						// enabling/disabling scaling for zPlanes				boolean
		scaleAmount: 10,						// amount of scaling in %s								int
		shiftAnim: true,						// enabling/disabling animation fot zPlane shifting		boolean
		shiftAnimDuration: 0.25					// animation duration in seconds						int
	},
	zParams,
	shiftLimit,
	shiftStep,
	shiftScale,
	shiftAnim,
	shiftMaxLvl,
	sAD,
	initsSA,
	winW,
	winH,
	initDocH;

$.ajaxSetup({ cache: false }); // Prevents caching


// Initialization

function go3DS( objArr, params ) {

	winW = $(window).width(),
	winH = $(window).height();

	if ( objArr ) {
		zPlaneShiftedObjs = objArr;
	}
	
	if ( params ) {
		inputParams = params;
	}
	
	cloneContent();

}



// functions.js

// Function to get original container. Returns original container object.
function getOriginalContainer(){

	return $("#"+prefix+"original");

}

// Function to get clone container. Returns clone container object.
function getCloneContainer(){

	return $("#"+prefix+"original");

}

// Function to get container width
function getStereoContainerWidth() {

	var stereoContainerW = $(window).width()/2;
	return stereoContainerW;

}

// Function to get the class containing the current depth level
function getLevelClass(target) {
	
	var levelClass = "",
		targetClass = target.attr("class"),
		classes = targetClass.split(" "),
		patt = new RegExp(prefix+"level_", "g");
				
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
	
		if ( !$(this).isCalculated() && $(this).isOriginal() ) {
			
			var tML = parseInt($(this).css("margin-left"), 10),
				tMR = parseInt($(this).css("margin-right"), 10),
				objZID = $(this).getElementID(),
				initZInd = parseInt($(this).css("z-index"),10) || 0;
			
			var obj = buildArray(objID, objZID, objPseudo, initLvl,  pseudoLvl, tML, tMR, initZInd);
			stereoObjArr.push(obj);
		
		}
		
	});

}

// Function to builld array of data for each element for S3D conversion
function buildArray(objID, objZID, objPseudo, initLvl, pseudoLvl, initML, initMR, initZInd) {
	return {
		objID: objID,
		objZID: objZID,
		objPseudo: objPseudo,
		initLvl: initLvl,
		pseudoLvl: pseudoLvl,
		initML: initML,
		initMR: initMR,
		initZInd: initZInd
	};
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
			return false;
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
			
			var targetClass = $(this).attr("class"),
				classes = targetClass.split(" "),
				patt = new RegExp(prefix+"elem_ID_", "g");
			
			$.each(classes, function(key, val) {
				if ( patt.test(val) ) {
					outputClass = val;
				}
			});
			
		});
		
		return outputClass;
		
	},		
	
	// isCalculated() - checks if the current element params have being calculated and pushed to stereoObjArr; 
	isCalculated: function() {
		
		var isCalculated = false;
		
		this.each(function() {
			
			var tID = $(this).getElementID();
			
			$.each(stereoObjArr, function(key, arr){
				if( arr.objZID == tID ) {
					isCalculated = true;
				}
			});
			
		});
		
		return isCalculated;
		
	},
	
	// isOriginal() - function to check if an element is inside the original container. Returns boolean value;
	isOriginal: function(){
		
		var output = false;
		
		this.each(function(){
			
			output = $(this).closest("#"+prefix+"original").length > 0;
			
		});
		
		return output;
		
	},
	
	// isClone() - function to check if an element is inside the clone container. Returns boolean value;
	isClone: function(){
		
		var output = false;
		
		this.each(function(){
			
			output = $(this).closest("#"+prefix+"original").length > 0;
			
		});
		
		return output;
		
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

		this.each(function() {
			
			outputClass = $(this).getCountClass();
			
		});
		
		return $("body").getCloneContainer().find("." + outputClass);
		
	},
	
	// appendBoth() - Function to append elements to both original and clone containers. Returns target object.
	appendBoth: function(html) {
		
		var processedHTML,
			originalHTML,
			cloneHTML,
			thisL = this.length,
			c = 0;
		
		this.each(function() {
					
			c++;
			var thisClass = $(this).getCountClass();
			
			if ( thisL == 1 ) { thisL = 2; } 
			
			if ( c <= thisL/2 ) {
				
				processedHTML = processInputHTMLstr(html);
				originalHTML = processedHTML[0];
				cloneHTML = processedHTML[1];
								
				$("body")
					.getOriginalContainer()
					.find("." + thisClass)
					.append(originalHTML)
					.getClone()
					.append(cloneHTML);
					
			}
							
		});
		
		return this;
		
	},
	
	// appendBoth() - Function to prepend elements to both original and clone containers. Returns target object.
	prependBoth: function(html) {
		
		var processedHTML,
			originalHTML,
			cloneHTML,
			thisL = this.length,
			c = 0;
		
		this.each(function() {
					
			c++;
			var thisClass = $(this).getCountClass();
			
			if ( thisL == 1 ) { thisL = 2; }
			
			if ( c <= thisL/2 ) {
				
				processedHTML = processInputHTMLstr(html);
				originalHTML = processedHTML[0];
				cloneHTML = processedHTML[1];
								
				$("body")
					.getOriginalContainer()
					.find("." + thisClass)
					.prepend(originalHTML)
					.getClone()
					.prepend(cloneHTML);
					
			}
							
		});
		
		return this;
		
	},
	
	// beforeBoth() - Function to inject elements before a target to both original and clone containers. Returns target object.
	beforeBoth: function(html) {
		
		var processedHTML,
			originalHTML,
			cloneHTML,
			thisL = this.length,
			c = 0;
			
		this.each(function() {
												
			c++;
			var thisClass = $(this).getCountClass();
			
			if ( thisL == 1 ) { thisL = 2; } 
			
			if ( c <= thisL/2 ) {
				
				processedHTML = processInputHTMLstr(html);
				originalHTML = processedHTML[0];
				cloneHTML = processedHTML[1];
							
				$("body")
					.getOriginalContainer()
					.find("." + thisClass)
					.before(originalHTML)
					.getClone()
					.before(cloneHTML);
					
			}
							
		});
		
		return this;
		
	},
	
	// afterBoth() - Function to inject elements after a target to both original and clone containers. Returns target object.
	afterBoth: function(html) {
		
		var processedHTML,
			originalHTML,
			cloneHTML,
			thisL = this.length,
			c = 0;
			
		this.each(function() {
												
			c++;
			var thisClass = $(this).getCountClass();
			
			if ( thisL == 1 ) { thisL = 2; } 
			
			if ( c <= thisL/2 ) {
				
				processedHTML = processInputHTMLstr(html);
				originalHTML = processedHTML[0];
				cloneHTML = processedHTML[1];
							
				$("body")
					.getOriginalContainer()
					.find("." + thisClass)
					.after(originalHTML)
					.getClone()
					.after(cloneHTML);
					
			}
							
		});
		
		return this;
		
	},
	
	// shift(level) - Function to shift elements in the zPlane. Returns the targeted item.
	shift: function(level) {
		
		var output;
		
		this.each(function() {
			
			if ( level !== undefined && $(this).isOriginal() ) {
				
				var targetClass = $(this).attr("class"),
					classes = targetClass.split(" "),
					oID = $("body").getOriginalContainer().attr("id"),
					selector = "#"+oID+" ";
					
					$.each(classes, function(key, val) {
						selector = selector+"."+val;
					});
					
					var target = $(""+selector);
				
				if ( !$(this).isCalculated() ) {
					
					var initZInd = parseInt($(this).css("z-index"),10) || 0;
					buildObjParamArr( target, selector, 0, 0, 0, initZInd );

				}
				
				$.each(stereoObjArr, function(key, obj){
	
					if ( obj.objZID == target.getElementID() ) {
					
						var initML = obj.initML,
							initMR = obj.initMR,
							initZInd = obj.initZInd;
							
						zPlaneShifter(target, level, initML, initMR, initZInd);
					
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
			
			var levelClass = getLevelClass($(this)),
				patt = new RegExp(prefix+"level_","g");
			
			if ( levelClass !== 0 ) {
				level = parseInt(levelClass.replace(patt, ""), 10);
			} else {
				level = 0;
			}
			
		});
		
		return level;
		
	}
	
});

})(jQuery);

// Function to process HTML string before insertion into HTML
function processInputHTMLstr( HTMLstr ) {

	var originalHTML = HTMLstr,
		cloneHTML = HTMLstr,
		tags = HTMLstr.match(/<\w.*?>/gm);
	
	$.each( tags, function( i, tag ){
						
		var idAttrs = tag.match(/id=("|').*?("|')/);
		
		if ( idAttrs ) {
			$.each( idAttrs, function( x, idAttr ){
				
				if ( /id=/.test(idAttr) ) {
					var idStr = idAttr.replace(/id=("|')/,"").replace(/("|')/,""),
						outputID = idStr+prefix,
						repPatt = new RegExp( "id=(\"|')" + idStr );
					cloneHTML = cloneHTML.replace( repPatt, "id='" + outputID );	
				}
			});
		}
		
		var classAttrs = tag.match(/class=("|').*?("|')/);
		
		if ( classAttrs ) {
			$.each( classAttrs, function( x, classAttr ){
				
				if ( /class=/.test(classAttr) ) {
					elemCount++;
					var classStr = classAttr.replace(/class=("|')/,"").replace(/("|')/,""),
						outputClass = classStr + " " + prefix + "elem_ID_" + elemCount,
						repPatt = new RegExp( "class=(\"|')" + classStr );
					cloneHTML = cloneHTML.replace( repPatt, "class='" + outputClass );
					originalHTML = originalHTML.replace( repPatt, "class='" + outputClass );
				}
			});
		} else {
		
			elemCount++;
			cloneHTML = cloneHTML.replace(/>/, " class='" + prefix + "elem_ID_" + elemCount + "'>" );
			originalHTML = originalHTML.replace(/>/, " class='" + prefix + "elem_ID_" + elemCount + "'>" );
		
		}
		
	});

	return [ originalHTML, cloneHTML ];

}


// cloneContent.js
// Cloning procedures

function cloneContent() {

	console.log("cloning is started");
	
	// Vars
	
	bodyBack = $("body").css("background"),
	initContent = $("body").html(),
	initDocH = $(document).height(),
	bodyInitHeight = $("body").outerHeight();
	
	// Splitting content into original and clone parts and applying styles
	
	$("html")
		.css({ height: "100%" })
		.find("body")
		.css({ height: "100%" })
		.wrapInner("<div id='"+prefix+"original' class='"+prefix+"split_part' /></div>");
	
	$("body")
		.getOriginalContainer()
		.wrapInner("<div class='"+prefix+"container'>");
	
	// Marking all the content inside the Original and attaching specific #ids
	
	elemCount = 0;
	
	$("body").getOriginalContainer().find("."+prefix+"container *").each(function(){
		var curClass = "";
		if ( $(this).attr("class") ) {
			curClass = $(this).attr("class") + " ";
		}
		$(this).attr("class", curClass + prefix+"elem_ID_"+elemCount);
		elemCount++;
	});
	
	// Cloning
	
	$("body").getOriginalContainer()
		.clone()
		.attr("id",prefix+"clone")
		.appendTo("body");
	
	elemCount = 0;
	
	$("body").getCloneContainer().find("."+prefix+"container *").each(function(){
		var curClass = $(this).attr("class") + " ";
		$(this).attr("class", curClass + prefix+"elem_ID_"+elemCount);
		elemCount++;
	});
	
	// Replacing id attributes inside the clone
	
	$("body").getCloneContainer().find("div [id]").each(function() {
		var ID = $(this).attr("id"),
			newID = ID+prefix;
		$(this).attr("id",newID);
	});
	
	var method = inputParams.method;
	adjustSideBySide(method);
	
	console.log("cloning is complete");
	
	// Launching styles adaptation
	stylesAdaptation();

}

function adjustSideBySide(method) {
	
	if ( method && method == "top-to-bottom" ) {
		
		margin = (winH/4)*(-1);
		
		$("."+prefix+"split_part").css({
			width: "100%",
			height: winH/2,
			position: "relative"
		});
		
		$("."+prefix+"container").css({
			width: "100%",
			height: winH,
			position: "absolute",
			top: margin,
			"-webkit-transform": "scaleY(0.5)",
			"-moz-transform": "scaleY(0.5)",
			"-ms-transform": "scaleY(0.5)",
			"transform": "scaleY(0.5)"
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
			position: "relative"
		});
		
		$("."+prefix+"container").css({
			width: "50%",
			height: bodyInitHeight,
			"-webkit-transform": "scaleX(0.5)",
			"-moz-transform": "scaleX(0.5)",
			"-ms-transform": "scaleX(0.5)",	
			"transform": "scaleX(0.5)"
		});
		
		if ( $("body").getOriginalContainer().get(0).scrollWidth ) {
		
			if ( $("body").getOriginalContainer().width() >= $("body").getOriginalContainer().get(0).scrollWidth ) {
				scrollW = $("body").getOriginalContainer().width() - $("body").getOriginalContainer().get(0).scrollWidth;
			} else {
				scrollW = 0;
			}
		
		}
		
		margin = (winW/4)*(-1);
		$("."+prefix+"container")
			.width(winW) // Fixing the window width in case of scroll
			.css({ marginLeft: margin-scrollW }); // Fixing the scroll gap
			
		if ( initDocH > $("body").getOriginalContainer().height() ) {
		
			$("body").getOriginalContainer().height( initDocH );
			$("body").getCloneContainer().height( initDocH );
		
		}
		
	}
	
	// Applying body background on the stereo containers
	
	$("body").addClass("_3dsjq_");
	$("body").getOriginalContainer().css({ background: bodyBack, backgroundSize: "100% 100%" });
	$("body").getCloneContainer().css({ background: bodyBack, backgroundSize: "100% 100%" });
	
	// Reinitiating the procedure on window resize
	 
	$(window).on({
		resize: function(){
			winW = $(window).width(),
			winH = $(window).height();
			adjustSideBySide(method);
		}
	});

}


// stylesAdaptation.js
// Parsing stylesheets

function stylesAdaptation() {

	var stylesheetURLs = [],
		stylesheetInlines = "",
		curURL = window.location.href;
	
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
	
		var done = false;
		
		$.each(stylesheetURLs, function(key, stylesheet){
			
			var extCSS = stylesheet.match(/^http\:\/\//);
			if ( !extCSS ) {
			
				$.ajaxSetup({ cache: false, async: false }); // Prevents caching
				
				
				$.when($.get(stylesheet, "text")).done( function(response) {
					
					var inputCSS = response.toString();
					buildCloneStylesheet(inputCSS);
					
					if ( key+1 == stylesheetURLs.length ) {
						done = true;
						
						// Building mirroring
						buildMirroring();
						
						console.log("adaptation is complete");
					
					}
				
				}).fail( function(){
				
					console.warn( "3DSjQ error occured: " + stylesheet + " cannot be opened" );
				
				});
			
			} else {
			
				console.warn( "3DSjQ warning: External stylesheet " + stylesheet + " was bypassed in order to avoid security restrictions." );
			
			}
		
		});
		
	}
	
	if ( stylesheetInlines !== "" ) { buildCloneStylesheet(stylesheetInlines); }
	
}

function buildCloneStylesheet(inputCSS) {

	inputCSS = inputCSS.toString();
	inputCSS = inputCSS.replace(/[\t]|[\r\n]/gm," "); // Removing line breaks and tabs
		
	var outputCSS = [];
	
	var fetchRules = new RegExp("}.[^}]*","gm"),
		rulesArr = inputCSS.match(fetchRules);		
	
	var outputRules;
	
	$.each(rulesArr, function(key, rule){
		
		var outputRule,
			newSel,
			selRepPatt,
			pushFlag = false;
		
		rule = rule.replace(/(\}\*\/)|(\}\s)|(\/\*.*?\*\/)|(\s\s)/, "") + "}";
		
		var selector = rule.replace(/\{.*\}/,""),
			selArr = selector.split(/,/),
			style = rule.replace(/^.[^{]*/,"");
		
		$.each(selArr, function(key, sel){
		
			var hoverCheck = /:hover/.test(sel),
				idCheck = /#/.test(sel),
				multIdCheck = false;
		
			if ( hoverCheck || idCheck ) { pushFlag = true; }
			if ( sel.split(/#/).length >= 3 ) { multIdCheck = true; }
			
			if ( hoverCheck ) {
				hoverElemIDs.push( sel.replace(/:hover/, "") );
				sel = sel.replace(/:hover/,".hover"+prefix);
			}
			
			if ( idCheck ) {
				
				sel = sel.replace(/^\s*/,"");
				var sArr = sel.split(/\s/);
				
				$.each(sArr,function(k, s){
					if ( /#/.test(s) ) {
						
						if ( /\./.test(s) ) {
							s = s.split(/\./);
							s = s[0];
						}
						var repPatt = new RegExp(s);
						sel = sel.replace(repPatt, s+prefix);
					}
					
				});
				
				// Relative URLs fix
				
				if ( /\.\.\//.test(style) ) {
					var urlPrefix = document.location.href.replace(/#/, "").replace(/\w+\.html/,"");
					style = style.replace(/\.\.\//g, urlPrefix+"/");
				}
			
			}
			
			if ( pushFlag === true ) {
			
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
					var curClass = clone.attr("class") + " ";
					clone.attr("class", curClass + "hover"+prefix);
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
			});
		},
		mouseleave: function(){
			$(this).css({
				zIndex: 10
			});
		}
	});

}


// build zPlane
// Building zSpace

function buildZPlane() {

	console.log("zPlane building is started");
	
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
	
	shiftLimit = Math.round(((winW/100)*zParams.depthBudget)/2);
	shiftStep = Math.round(shiftLimit/zParams.levels);
	
	shiftScale = zParams.visualCues;
	shiftAnim = zParams.shiftAnim;
	shiftMaxLvl = zParams.levels;
	sAD = zParams.shiftAnimDuration;
	initsSA = zParams.scaleAmount;
	
	if ( zPlaneShiftedObjs !== null ) {	
		
		$.each(zPlaneShiftedObjs, function(obj, level){
				
			var tID = obj,
				tSplit = tID.split(/:/),
				objID = tSplit[0],
				objPseudo = tSplit[1],
				target = $("html").find(objID);
			
			if ( objPseudo ) {
				$.each(zPlaneShiftedObjs, function(key, val){
					if ( key == objID && /:hover/.test(key) === false ) {
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
	
	console.log("zPlane building is complete");
	
	// Global var to indicate that the library is in operation
	stereoIsOn = true;

}

function zPlaneDisplace(target) {

	var tPseudo,
		initML,
		initMR,
		initLvl,
		pseudoLvl,
		initZInd;
	
	$.each(stereoObjArr, function(key, obj){
		
		if ( obj.objZID == target.getElementID() ) {			
			tPseudo = obj.objPseudo,
			initML = obj.initML,
			initMR = obj.initMR,
			initLvl = obj.initLvl,
			pseudoLvl = obj.pseudoLvl,
			initZInd = obj.initZInd;
		}
		
	});
	
	if ( tPseudo == "hover" ) {
		
		target.on({
			mouseenter: function(){
				zPlaneShifter($(this), pseudoLvl, initML, initMR, initZInd);
			},
			mouseleave: function(){
				zPlaneShifter($(this), initLvl, initML, initMR, initZInd);
			}
		});
		
	} else {
	
		target.each(function(){
			zPlaneShifter($(this), initLvl, initML, initMR, initZInd);	
		});
		
	}

}

function windowViolation(target,level) {

	var winW = $(window).width()/2,
		tOffset = target.offset(),
		tShiftedOffset = tOffset.left-(level*shiftStep);
	
	if ( zParams.visualCues === true ) {
		var sSA = 1+((initsSA)*(level/shiftMaxLvl))/100,
			tW = target.width(),
			sDelta = ((tW*sSA)-tW)/2;
		tShiftedOffset = tShiftedOffset-sDelta;
	}
	
	if ( tShiftedOffset < 0 ) {
		//console.log("WARNING: "+target.attr("class")+" violated the window by " + tShiftedOffset + "px");
		return true;
	} else {
		return false;
	}

}

function addLevelClass(target, level) {
	
	var curClass = target.attr("class") + " ",
		repPatt = new RegExp(prefix+"level_.*");
	curClass = curClass.replace(repPatt, "");
	target.getBoth().attr("class", curClass + prefix+"level_"+level);

}

function removeLevelClass(target) {

	var levelClass = getLevelClass(target);
	target
		.getBoth()
		.removeClass(levelClass);

}

function zPlaneShifter(target, level, initML, initMR, initZInd) {

	initML = parseInt(initML, 10),
	initMR = parseInt(initMR, 10);
	
	sSA = 1+((initsSA)*(level/shiftMaxLvl))/100;
	
	var targetClone = target.getClone(),
		wViolation = windowViolation(target, level);
		
	var tW = target.width(),
		tH = target.height(),
		deltaLeft,
		deltaRight,
		deltaCloneLeft,
		deltaCloneRight,
		deltaHS = (tW*sSA)-tW,
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
		marginRight: deltaRight
	});
	
	targetClone.css({
		marginLeft: deltaCloneLeft,
		marginRight: deltaCloneRight
	});
		
	if ( level === 0 ) {
	
		removeLevelClass(target, level);
	
	} else {
		addLevelClass(target, level);
	}
	
	// Introducing zIndexes for shifted elements
	target.each(function(){
		if ( $(this).isOriginal() ) {
			$(this)
				.getBoth()
				.css({
					zIndex : initZInd + $(this).getLevel()
				});
		}
	
	});
	
	if ( shiftScale === true && sSA !== 0 /*&& tPseudo*/ ) {			
		target
			.getBoth()
			.css({
				"-webkit-transform" : "scale("+sSA+")",
				"-moz-transform" : "scale("+sSA+")",
				"transform" : "scale("+sSA+")"
			});
	}

}