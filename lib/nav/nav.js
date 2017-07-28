/*!
 *  Stunnplate nav.js
 *  Version: 1.1
 */
/*
 *  Last Updated: 27/06/14
 *  By: Mark
 *  
 *  Notes:
 *  Default nav to include a bar at desktop, switching to a select box on mobile
 *
 *  Dependencies:
 *  jQuery
 *
 *  Changelog:
 *  27/06/14
 *  Created 
 */

$(document).ready(function (){
	$('#menu-button').on('click',function(e){
		e.preventDefault();
		$('nav ul').toggleClass("open");
	});

});