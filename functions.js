// Global Vars

prefix = "_3dsjq_";
stereoObjArr = [];


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