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
			var clone = getClone($(this));
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
		
	originalContainer.on({
		scroll: function(){
			var scrollTop = $(this).scrollTop();
			cloneContainer.scrollTop(scrollTop);
		}
	});
	
}

function buildCursor() {
	
	originalContainer.prepend("<div id='"+prefix+"cursor_original' class='"+prefix+"cursor'></div>");
	cloneContainer.prepend("<div id='"+prefix+"cursor_clone' class='"+prefix+"cursor'></div>");
	
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
	
	originalContainer.on({
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