// Function to filter the target by [prefix]elem_ID
function getTargetByID(targetID) {

	return originalContainer.find("*").filter(function(){ return $(this).data(prefix+"elem_ID") == targetID; });

}

// Function to filter the clone of the object
function getClone(target) {

	targetID = target.data(prefix+"elem_ID");
	return cloneContainer.find("*").filter(function(){ return $(this).data(prefix+"elem_ID") == targetID; });

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

(function($){

 	$.fn.extend({ 
 		
 		// getBoth() - Function to filter both original and clone elements
 		getBoth: function() {
 		 			
			var oID = originalContainer.attr("id");
			var cID = cloneContainer.attr("id");
			var outputClass;

    		this.each(function() {
				
				var targetClass = $(this).attr("class");
				var classes = targetClass.split(" ");
				var patt = new RegExp(prefix+"elem_ID_", "g");
				
				$.each(classes, function(key, val) {
					if ( patt.test(val) ) {
						outputClass = val;
					}
				});

    		});
    		
    		return $("."+outputClass);
    		
    	},
    	
    	// shift(level) - Function to shift elements in the zPlane
    	shift: function(level) {
    	
    		if ( level != undefined ) {
    		
		    	this.each(function() {
					
					var targetClass = $(this).attr("class");
					var classes = targetClass.split(" ");
					var oID = originalContainer.attr("id");
					var selector = "#"+oID+" ";
					
					$.each(classes, function(key, val) {
						selector = selector+"."+val;
					});
					
					var target = $(""+selector);
					var initML = $(this).css("margin-left");
					var initMR = $(this).css("margin-right");
					
					zPlaneShifter(target, level, initML, initMR)
	
	    		});
	    	
	    	}
	    	
	    	return this;
    	
    	}
    	
	});
	
})(jQuery);