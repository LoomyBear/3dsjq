// Building zSpace

var zPlaneDefaultParams = {
	maxShift: 1.5,							// maximum allowed amount of shifting in %				int		
	levels: 5,								// the maximum number of zPlanes						int
	visualCues: true,						// enabling/disabling scaling for zPlanes				boolean
	scaleAmount: 10,						// amount of scaling in %s								int
	scaleAnim: true,						// enabling/disabling animation fot zPlane shifting		boolean
	scaleAnimDuration: 0.2,					// animation duration in seconds						int
}

var zParams;
var shiftLimit;
var shiftStep;
var shiftScale;
var shiftAnim;
var shiftMaxLvl;
var sAD;
var initsSA;
var objArr = [];

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

	shiftLimit = Math.round(((winW/100)*zParams["maxShift"])/2);
	shiftStep = Math.round(shiftLimit/zParams["levels"]);

	shiftScale = zParams["visualCues"];
	shiftAnim = zParams["scaleAnim"];
	shiftMaxLvl = zParams["levels"]
	sAD = zParams["scaleAnimDuration"];
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
					}
				});
				pseudoLvl = level;
			} else {
				initLvl = level;
				pseudoLvl = 0;	
			}
			
			buildObjParamArr( target, tID, objID, objPseudo, initLvl, pseudoLvl );
			zPlaneDisplace(obj);
		
		});
		
	}
	
}

function buildObjParamArr( target, tID, objID, objPseudo, initLvl, pseudoLvl ) {
	
	target.each(function(){
	
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
		var objZID = $(this).data(prefix+"elem_ID");
		
		var obj = buildArray(objID, objZID, objPseudo, initLvl,  pseudoLvl, tML, tMR)
		
		objArr.push(obj);
		
	});
	
}

function zPlaneDisplace(objID) {

	var target;
	var tPseudo;
	var initML;
	var initMR;
	var initLvl;
	var pseudoLvl;
	
	var objIDSplit = objID.split(/:/);
	objID = objIDSplit[0];
	
	$.each(objArr, function(key, obj){
		
		var tID = obj["objID"];
		
		if ( tID == objID ) {
			tPseudo = obj["objPseudo"];
			initML = obj["initML"];
			initMR = obj["initMR"];
			initLvl = obj["initLvl"];
			pseudoLvl = obj["pseudoLvl"];
		}
		
	});
	
	target = $(""+objID);
	
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
				zPlaneShifter($(this), pseudoLvl, initML, initMR, tPseudo);
			},
			mouseleave: function(){
				$(this)
					.css({ zIndex: tInitZ })
					.parent()
					.css({ zIndex: tParentInitZ });
				zPlaneShifter($(this), initLvl, initML, initMR, tPseudo);
			}
		});
		
	} else {
	
		// Change here! Another change blah blah blah
		target.each(function(){
			zPlaneShifter($(this), initLvl, initML, initMR, tPseudo);	
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

function zPlaneShifter(target, level, initML, initMR, tPseudo) {
	
	sSA = 1+((initsSA)*(level/shiftMaxLvl))/100;
	var targetClone = getClone(target);
	
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
		deltaCloneLeft = deltaRight;
		deltaCloneRight = deltaLeft;
	
	} else if ( level < 0 ) {
		
		deltaLeft = initML+(level*shiftStep);
		deltaRight = initMR-(level*shiftStep);
		deltaCloneLeft = deltaLeft/4;
		deltaCloneRight = deltaRight/4;	
		
	}
	
	target.css({
		marginLeft: deltaLeft,
		marginRight: deltaRight,
	});

	targetClone.css({
		marginLeft: deltaCloneLeft,
		marginRight: deltaCloneRight,
	});

	// Rescaling if enabled
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
