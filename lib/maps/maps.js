/*!
 *  Stunnplate maps.js
 *  Version: 1.6
 *  @requires - markerWithLabels.js | Related css
 */
/*
 *  Last Updated: 13/01/15
 *  By: Mark
 *  
 *  Notes:
 *  For including Google Map(s) on site.
 *
 *  Changelog:
 *  13/01/15
 *  Added marker labels
 *  
 *  20/11/14
 *  Added geocoded addresses for markers
 *  
 *  August at some point
 *  Added overlays
 *  
 *  01/07/14
 *  Added styling
 *
 *  Todo:
 *  Fix master centering/zooming
 *  Infowindows - one at a time
 *  
 */




function initialize() {
	// Variables
		//Main Map options (if used)
		var centerLatLng, mapZoom,mapStyle,masterIcon, markerIcon, mapOptions, disableGUI, scrollwheel, draggable, disableDoubleClickZoom = {},
	  	bounds, 				// Viewpoint bounds
		i=0, 					// Marker iterator
		m=0, 					// Map iterator
		o=0, 					// Overlay iterator
		markerData = [], 		// Array to store marker data parsed from page
		marker = [], 			// Array of marker objects
		thisOverlay = [],		// Array for each overlay's coords
		overlayData = [], 		// Array of overlay data parsed from page
		overlayDataHover = [], 	// Array of overlay data parsed from page (For style on hover)
		thisOverlayHover = "",
		overlays = [], 			// Array of overlay (polygon) objects
		map = [], 				// Array of maps
		latlngs = [], 			// Var for separating out overlay latlng's
		latlng = []; 			// Var for splitting latlng's
		address = "",			// Var for addresses
		markerLabel = "";		// Var for marker labels

	
	$('.map').each(function(){
		//Optional values for setting up map 
		centerLatLng = ($(this).data('latlng') || null) ;
		mapZoom = ($(this).data('zoom') || null);
		mapStyle = $(this).data('style');
		masterIcon = $(this).data('icon');
		disableGUI = $(this).data('disableui');
		scrollwheel = $(this).data('scrollwheel');
		draggable = $(this).data('draggable');
		disableDoubleClickZoom = $(this).data('disabledoubleclickzoom');
		mapOptions = {
			center: new google.maps.LatLng(centerLatLng),
	    	zoom: mapZoom,
			styles: mapStyle,
			scrollwheel: scrollwheel,
			draggable: draggable,
			disableDefaultUI: disableGUI,
			disableDoubleClickZoom: disableDoubleClickZoom
	  	};
	  	//Clear any old Marker data
	  	markerData = [];
	  	//  Create a new viewpoint bound
		bounds = new google.maps.LatLngBounds ();
		
		$(this).children('.map-marker').each(function() {
			address = ($(this).data('address') || null);
			latlng = ($(this).data('latlng') || null);
			markerLabel = ($(this).data('label') || "");
			if(latlng != null){
				latlng = latlng.split(",");
			}
		
			if($(this).data("icon") == ""){
				markerIcon = masterIcon;
			} else{
				markerIcon = $(this).data("icon");
			}
			markerData.push({
				latlng: latlng,
				//position: markerPos,
				address: address,
				markerLabel:markerLabel,
				//icon: $(this).data('icon'),
				markerTitle: $(this).data('title'),
				infoContent: $(this).html(),
				icon: markerIcon
			});
		});

		$(this).children('.map-overlay').each(function() {
			latlngs = $(this).data('latlngs').split(";");

			var overlayDataLatLngs = [];

			for(var x=0;x<latlngs.length;x++){
				latlng = latlngs[x].split(",");
				overlayDataLatLngs.push(new google.maps.LatLng(latlng[0],latlng[1]));
			}

			var overlayParams = $(this).data('options'),
			overlayParamsHover = $(this).data('options-hover');
			overlayParams.paths = overlayDataLatLngs;
			overlayParams.clicked = false;	//Add a parameter to toggle whether overlay has been clicked
			overlayParams.areaTitle = $(this).data("title");	//Add a parameter to name overlay

			

			overlayData.push(overlayParams);
			overlayDataHover.push(overlayParamsHover);
			
		});

		var mapID = $(this).get(0);
		
		map[m] = new google.maps.Map(mapID,mapOptions);

		i=markerData.length;
		while(i--){

			if(markerData[i].latlng != null){
				var markerX = new google.maps.Marker({
				    position: new google.maps.LatLng(markerData[i].latlng[0],markerData[i].latlng[1]),
				    //position: markerData[i].position,
				    map: map[m],
				    label: markerData[i].markerLabel,
				    title:markerData[i].markerTitle,
				    infoContent: new google.maps.InfoWindow({content: markerData[i].infoContent}),
				    icon: markerData[i].icon
				});

				google.maps.event.addListener(markerX, 'click', function() {
					this.infoContent.open(this.map,this);
				});

				bounds.extend (markerX.position);

				marker.push(markerX);

			} else if(markerData[i].address != null) {
				var geocoder = new google.maps.Geocoder();
				var thisMarker = markerData[i];
				
				geoc(map[m], thisMarker, function(mp, mkr, location){
					var markerX = new google.maps.Marker({
					    position: location,
					    map: mp,
					    title:mkr.markerTitle,
					    infoContent: new google.maps.InfoWindow({content: mkr.infoContent}),
					    icon: mkr.icon
					});		
				    marker.push(markerX);
				})
			
			}
		}

		var markersDone = 0;
		function geoc(dmap, dMarker, dcallback){
			geocoder.geocode( { 'address': address}, function(results, status, thisMarker) {
				  if (status == google.maps.GeocoderStatus.OK) {    
				   	

				    dcallback(dmap, dMarker, results[0].geometry.location);

				  	markersDone++;
				  	if(markersDone == markerData.length){
				  		setCenter(results[0].geometry.location, dmap);
				  	}

				  } else {
				    alert("Geocode was not successful for the following reason: " + status);
				  }
				});
		}
		function setCenter(gloc, dmap){
			dmap.setCenter(gloc);
		}

		o=overlayData.length;


		while(o--){
			// Construct the polygon.
			overlays[o] = new google.maps.Polygon(overlayData[o]);
			overlays[o].setMap(map[m]);	
			
			delete overlayData[o].clicked;

			thisOverlayHover = overlayDataHover[o] || "";

			// Closure for Hover behaviour - put hover behaviour here
			function getOverlayHover(o){
				return function(){
					if(!this.clicked){
						this.setOptions(overlayDataHover[o]);
					}
				}
			}
			
			var thisOverlayHover = getOverlayHover(o);

			google.maps.event.addListener(overlays[o],"mouseover",thisOverlayHover);
			
			function getOverlayDefault(o){
				return function(){
					if(!this.clicked){
						this.setOptions(overlayData[o]);	
					}
				}
			}

			var thisOverlayDefault = getOverlayDefault(o);

			google.maps.event.addListener(overlays[o],"mouseout",thisOverlayDefault);

			function clickOverlay(o){
				return function(){
					var checkbox = $("[data-textName^=" + this.areaTitle +"]");
					if(this.clicked){
						this.clicked=false;
						$(checkbox).prop('checked', false);
						$(checkbox).parents('label').removeClass("checked");
						this.setOptions(overlayData[o]);
					} else{
						$(checkbox).prop('checked', true);
						$(checkbox).parents('label').addClass("checked");
						this.clicked=true;
					}

					formResults = $(checkbox).parents('form').serialize(),
					target = "/explore/?" + formResults + " #ajax-results";
		
					$('.filter-results').load(target, function(responseText, statusText, xhr){})
				}
			}

			var thisClickOverlay = clickOverlay(o);

			google.maps.event.addListener(overlays[o],"click",thisClickOverlay); 
		}

		//  Fit these bounds to the map
		map[m].fitBounds (bounds);	

		

		// Fitbounds (above) is asynchronous, so have to listen for bounds_changed events before settings zoom/center.
		zoomChangeBoundsListener = 
		    google.maps.event.addListenerOnce(map[m], 'bounds_changed', function(event) {

				//Center on point (if passed)
				if (marker.length ==1){
				}
				latlng = centerLatLng.split(",");
		    	
		    	//Set Center (if passed)
				this.setCenter(new google.maps.LatLng(latlng[0],latlng[1]));

				//Set zoom (if passed)
				this.setZoom (mapZoom);

		});
		setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);
		
		m++
	});
}

if($('.map').length > 0){

    var markerSize = { x: 22, y: 40 };

    google.maps.Marker.prototype.setLabel = function(label){
        this.label = new MarkerLabel({
          map: this.map,
          marker: this,
          text: label
        });
        this.label.bindTo('position', this, 'position');
    };

    var MarkerLabel = function(options) {
        this.setValues(options);
        this.span = document.createElement('span');
        this.span.className = 'map-marker-label';
    };

    MarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
        onAdd: function() {
            this.getPanes().overlayImage.appendChild(this.span);
            var self = this;
            this.listeners = [
            google.maps.event.addListener(this, 'position_changed', function() { self.draw();    })];
        },
        draw: function() {
            var text = String(this.get('text'));
            var position = this.getProjection().fromLatLngToDivPixel(this.get('position'));
            this.span.innerHTML = text;
            this.span.style.left = (position.x - (markerSize.x / 2)) - (text.length * 3) + 10 + 'px';
            this.span.style.top = (position.y - markerSize.y + 40) + 'px';
        }
    });

	initialize();
	// google.maps.event.addDomListener(window, 'load', initialize);	
}
