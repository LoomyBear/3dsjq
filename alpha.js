// 3DS Content Converter 
// by Alexey Chistyakov
// Started on 01.02.2013

// Known issues:
// 1. Some js scripts might not work and need to be triggered once again
// 2. Chrome has the anti-aliasing bug issue when elements are transformed

// ==============================================================================


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

// Preventing AJAX caching
$.ajaxSetup({ cache: false }); // Prevents caching


function loadCloneContent() {
	
	var cloneContentURL = "j/3dsjq/cloneContent.js";   
	
	$.getScript(cloneContentURL, function(){
		console.log("cloneContent() is loaded ...");
		loadStylesAdaptation();
	});
	
}

function loadFunctions() {
	
	var functionsURL = "j/3dsjq/functions.js";   
	
	$.getScript(functionsURL, function(){
		console.log("framework functions are loaded ...");
		loadCloneContent();
	});
	
}

function loadStylesAdaptation() {
	
	var stylesAdaptationURL = "j/3dsjq/stylesAdaptation.js";   
	
	$.getScript(stylesAdaptationURL, function(){
		console.log("stylesAdaptation() is loaded ...");
		stylesAdaptation();
		loadZPlaneBuilder();
		loadMirroring();
		loadScripts(jsURLs);
		loadMediaViewer();
	});
	
}

function loadMirroring() {

	var buildMirroringURL = "j/3dsjq/buildMirroring.js";   
	
	$.getScript(buildMirroringURL, function(){
		console.log("buildMirroring() is loaded ...");
		buildMirroring();
	});
	
}

function loadZPlaneBuilder() {

	var buildZPlaneURL = "j/3dsjq/buildZPlane.js";
	$.getScript(buildZPlaneURL, function(){
		console.log("buildZPlane() is loaded ...");
		buildZPlane();
	});
	
}

function loadMediaViewer() {

	var buildMediaViewerURL = "j/3dsjq/mediaViewer.js";
	$.getScript(buildMediaViewerURL, function(){
		console.log("buildMediaViewer() is loaded ...");
	});
	
}

function loadScripts(jsURLs) {
	
	$.each(jsURLs, function(key, URL){
		$.getScript(URL, function(){
			console.log(URL + " is loaded ...");
		});
	});
	
}

function go3DS( objArr, params ) {
	
	if ( objArr ) {
		zPlaneShiftedObjs = objArr;
	}
	
	if ( params ) {
		inputParams = params;
	}
	
	loadFunctions();
	//loadCloneContent();
	
}
