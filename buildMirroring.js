// Interaction mirroring procedures

var hoverElemXY = [];
var visibleElem = [];

function buildMirroring() {
	
	buildHoverBindings(hoverElemIDs);
	buildScrollBindings();
	buildCursor();
	
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