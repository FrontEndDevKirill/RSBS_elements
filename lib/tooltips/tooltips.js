/*!
 *  Stunnplate tooltops.js
 *  Version: 1.0
 */
/*
 *  Last Updated: 15/09/14
 *  By: Mark
 *  
 *  Notes:
 *  Based on Moob Tooltips V4 - Creates CSS styled tooltips in place of real ones...
 *
 *  Changelog:
 *  15/09/14
 *  Integrated into stunnplate
 *
 * 	Requires:
 * 	jQuery
 * 	
 */

jQuery.fn.extend({
  tooltip: function() {
  var zis = this;
	return $(this).find("*[title]").hover(function(){	
								try {
									titleVal = this.title || this.titleVal;
									this.title = "";
									this.titleVal = titleVal;
									cssTip = document.createElement('span');
									cssTip.className="tooltip";
									if($(cssTip).css("position")!="absolute"){//if the tooltip isnt styled externally...
										$(cssTip).css({//...style it:
														'margin' : '0',
														'max-width' : '400px',
														'height' : 'auto',
														'background-color' : '#d8ecf5',
														'padding' : '6px',
														'color' : '#000',
														'font-size' : '1em',
														'font-weight' : 'normal',
														'font-family' : '"Lato", Trebuchet MS, Tahoma, Verdana',
														'text-align' : 'left',
														'-moz-border-radius' : '6px',
														'-webkit-border-radius' : '6px'/*,
														'border' : '10px solid rgba(0,0,0,.2)'*/
													  });
									}
									$(cssTip).css({//forced defaults regardless of whether the css has been defined elsewhere:
													'display' : 'none',
													'position' : 'absolute',
													'z-index' : '9999999999',
													'top' : '0',
													'left' : '0',
													'opacity' : '0.0'
												});
									cssTip.innerHTML = titleVal.replace(/\n/g,"<br />");
									offset = $(zis).offset();
									ie = (navigator.appName=="Microsoft Internet Explorer");
									initialPause = ($(this).attr("href"))?100:500;		// < for anything other than links pause for longer before showing the tooltip
									$(cssTip).stop();
									$(cssTip).animate({opacity: 0.0}, initialPause);		// < do nothing but pause for a fraction
									$(zis).append(cssTip);										// < insert the element
									$(cssTip).animate({opacity: 0.8}, 400, 				// < fade in
													  							function(){$(cssTip).animate({opacity: 0.8}, (800 + titleVal.length*50), 							// < show and pause
																								function(){$(cssTip).animate({opacity: 0.8}, 400, 										// < fade out
																												function(){this.title=titleVal;$(cssTip).stop();$(cssTip).remove();} 	// < destroy
																								);}
																				);}
									);// < end fade in then out		
									$(this).mousemove(function(e){							// < set tip position at cursor
																/*cssTip.style.display = "block";
																cssTip.style.position = "absolute";
																cssTip.style.left = e.pageX - offset.left +'px';																				
																cssTip.style.top = e.pageY+((ie)?18:0) +'px';
																cssTip.style.marginRight = 20-offset.left +'px';*/
																$(cssTip).css({	'display' : 'block',
																				'position' : 'absolute',
																				'left' : e.pageX - offset.left +'px',
																				'top' :e.pageY+((ie)?0:-182) +'px',
																				'margin-right' : 20-offset.left +'px' });
																});									
									$(this).click(function(){this.title=titleVal;$(cssTip).stop();$(cssTip).remove();});
									} catch(err) {
										//alert(err.description);
									return;
									}
								},function(){if(this.title==""){this.title=titleVal;};/*alert("out");*/$(cssTip).stop();$(cssTip).remove();}// < callback destroys tip 
				);
  		}
	});

//useage: $(elem).tooltip()
$(document).ready(function(){$("section").tooltip();}); // < call here applies tooltip to all pages on load
/* ]]> */