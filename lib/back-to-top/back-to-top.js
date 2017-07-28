/*!
 *  Stunnplate script.css
 *  Version: 1.0
 *
 */
 /* 
 *  Last Updated: 10/07/14
 *  By: Mark
 *  
 *  Notes:
 *  Goes back to the top yo!
 *
 *  Changelog:
 * 
 */

/*--------------------------------------------------
	 BACK TO TOP
---------------------------------------------------*/
jQuery(document).ready(function($){
	$("#back-top").hide();
	
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		$('#back-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});
}); 