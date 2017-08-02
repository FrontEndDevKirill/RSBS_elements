$(document).ready(function () {
	$(".search-ico").click(function () {
		$(".search").toggleClass("show");
	});
	$(".filter-tag").click(function () {
		$(this).toggleClass("activate");
	});
	$(".select-menu").click(function () {
		var dropdown = $(".dropdown-list");
		dropdown.toggleClass("active");
		console.log("asdasd");
	});
	$(".item-dropdown").click(function () {
		var text = $(this).text();
		$(".text-input").val(text);
		$(".dropdown-list").removeClass("active");
	});
	$(document).mouseup(function(e)
	{
	    var container = $(".dropdown-list");

	    // if the target of the click isn't the container nor a descendant of the container
	    if (!container.is(e.target) && container.has(e.target).length === 0)
	    {
	        container.removeClass("active");
	    }
	});
		$(document).mouseup(function(e)
	{
	    var container = $(".search");

	    // if the target of the click isn't the container nor a descendant of the container
	    if (!container.is(e.target) && container.has(e.target).length === 0)
	    {
	        container.removeClass("show");
	    }
	});
	jQuery(function($) {
		$(window).scroll(function(){
			if($(this).scrollTop()>140){
				$('.header').addClass('fixed-header');
			}
			else if ($(this).scrollTop()<140){
				$('.header').removeClass('fixed-header');
			}
		});
	});
});

