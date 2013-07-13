// Parsing stylesheets

function stylesAdaptation() {
	
	var stylesheets = [];
	var curURL = window.location.href;

	console.log("adaptation is started");

	$("html")
		.find("link[rel='stylesheet']")
		.each(function(){
			var styleURL = $(this).attr("href");
			stylesheets.push(styleURL);
		});

	if ( stylesheets !== "" ) {
	
		$.each(stylesheets, function(key, stylesheet){
		
			$.ajaxSetup({ cache: false }); // Prevents caching
			
			$.when($.get(stylesheet, "text")).done( function(response) {
				
				var inputCSS = response.toString();
				buildCloneStylesheet(inputCSS);				
			
			}).fail( function(){
			
				console.log( "   error occured: " + stylesheet + " cannot be opened" );
			
			});
		
		});
		
		console.log("adaptation is complete");
		
	}

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

}