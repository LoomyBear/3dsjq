// Building zSpace

var zPlaneDefaultParams = {
	method: 'left-to-right',				// side-by-side method (left-to-right, top-to-bottom)	string
	depthBudget: 1.5,						// maximum allowed amount of shifting in %				int		
	levels: 5,								// the maximum number of zPlanes						int
	visualCues: true,						// enabling/disabling scaling for zPlanes				boolean
	scaleAmount: 10,						// amount of scaling in %s								int
	shiftAnim: true,						// enabling/disabling animation fot zPlane shifting		boolean
	shiftAnimDuration: 0.25,					// animation duration in seconds						int
}

var zParams;
var shiftLimit;
var shiftStep;
var shiftScale;
var shiftAnim;
var shiftMaxLvl;
var sAD;
var initsSA;

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
