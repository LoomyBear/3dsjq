// Global Vars

prefix = "_3dsjq_";


// Function to filter the target by [prefix]elem_ID
function getTargetByID(targetID) {

	return $("body").getOriginalContainer().find("*").filter(function(){ return $(this).data(prefix+"elem_ID") == targetID; });

}

// Function to get element's elem_ID
function getElementID(target) {

	return $(this).data(prefix+"elem_ID");

}

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
				
				targetID = $(this).data(prefix+"elem_ID");
				
    		});
    		
    		return $("body").getCloneContainer().find("*").filter(function(){ return $(this).data(prefix+"elem_ID") == targetID; });
    		
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
					var initML = $(this).css("margin-left");
					var initMR = $(this).css("margin-right");
					
					zPlaneShifter(target, level, initML, initMR);

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