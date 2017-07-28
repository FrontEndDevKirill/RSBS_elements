/*!  
 *  Stunnplate modal.js
 *  Version: 1.2
 */
/*
 *  Last Updated: 12/11/15
 *  By: Mark
 *  
 *  Notes:
 *  Could do with creating open() close() functions to tidy code.
 * 
 */

$(document).ready(function() {
	$('body').on('click','.modal-link',function(e){
		$('body').addClass('modal-open');
		// alert('add class');
		e.preventDefault();
		
		var target = $(this).attr('href'),
		modalTemplate = '<div id="modal-ajax" class="modal-wrap">'
		    			+	'<div class="modal-overlay">'
		    			+		'<div class="loader"></div>'
						+		'<div class="modal-close">&#10060;</div>'
			    		+		'<div class="modal-contentWrap">'
			    		+			'<div class="modal-content"></div>'
			    		+		'</div>'
			    		+	'</div>'
			    		+'</div>';
		//console.log("Target:"+target)
		if(target.indexOf("#") == 0){
			$(target).addClass("active");
		} 
		else{
			if($("#modal-ajax").length == 0){
				$("body").append(modalTemplate);
				// console.log(modalTemplate)
			}
			$("#modal-ajax").addClass("active");
			$("body").css("overflow","hidden");

			var ext = target.split('.').pop().toLowerCase();
			console.log($.inArray(ext, ['gif','png','jpg','jpeg']) == 1)
			if($.inArray(ext, ['gif','png','jpg','jpeg']) == 1) {
    			$("#modal-ajax .modal-content").append("<img src='" +target+"' />");
    			$("#modal-ajax").addClass("loaded");
			} else{

				if(target.indexOf("#") > 0){
					
					var idIndex = target.indexOf("#"),
					paramIndex = target.indexOf('?'),
					targetID = target.substring(idIndex, paramIndex != -1 ? paramIndex : target.length);

					if(paramIndex > idIndex){
						target = target.replace(targetID,"") + " " + targetID;
					} else{
						target = target.replace(/#/," #");
					}

				} else{
					target = target + " section"
				}

				$("#modal-ajax .modal-content").load(target, function(responseText, statusText, xhr) {
	                if(statusText == "error"){
						$("#modal-ajax .modal-content").html("<h1>Sorry, an error has occured: " + xhr.status + " - " + xhr.statusText);
					}
					if(statusText == "success"){
						$("#modal-ajax").addClass("loaded");
					}
	        	});	

			}

		}
		$('.modal-close').on('click',function () {
			$(".modal-wrap.active").removeClass("active loaded");
			$(document).unbind('keydown');
			$("body").css("overflow","visible");
			$('body').removeClass('modal-open');
		});
		$('.modal-overlay').on('click',function (e) {
			var target = e.target;
			console.log(target)
			if($(target).hasClass("modal-overlay")){
				$(".modal-wrap.active").removeClass("active loaded");
				$(document).unbind('keydown');
				$("body").css("overflow","visible");
				$('body').removeClass('modal-open');
			}
		});
		/* bind keydowns */
		$(document).bind('keydown', function(e){
			e.preventDefault();
			var key = e.which || e.keyCode || e.charCode;
			switch (key){
				case 27: // [esc]
					$(".modal-wrap.active").removeClass("active loaded");
					$(document).unbind('keydown');
					break;
				/*case 37: // [left arrow]
					FS.Prev();
					//FS.InnerPrev();
					break;
				case 39: // [right arrow]
					FS.Next();
					//FS.InnerNext();
					break;
				case 38: // [up arrow]
					FS.Prev();
					break;
				case 40: // [down arrow]
					FS.Next();
					break;*/
			}
		})
	});
});