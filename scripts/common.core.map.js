$( function() {
    
  $("#rotate-directions").click(function() {
      var start = $("#location-start");
      var finish = $("#location-finish");

      startContent = start.clone();
      finishContent = finish.clone();

      start.replaceWith(finishContent);
      finish.replaceWith(startContent);
  });
  
  var latitude = document.getElementById('latitude').value, longitude = document.getElementById('longitude').value;
  
  $( "#location-find" ).autocomplete({
    source: function( request, response ) {
      $.ajax( {
        url: "https://places.api.here.com/places/v1/autosuggest",
        type: 'GET',
        data: {
          at: latitude+","+longitude,
          q: request.term,
          app_id: 'r0DuadUyPmZEx0wMO5wA',
          app_code: 'A4x9FvmizpNAOYMYLurehA',
          results_types: 'address,place',
          size: 10,
          tf: 'plain'
        },
        beforeSend: function(xhr){
          xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function (data) {
          response($.map(data.results, function (el) {
              var vic = el.vicinity;
              if(vic !== undefined && vic.length > 0) {
                  var vicnew = vic.replace(new RegExp('<br/>', 'g'), ' ');
                  return { label: el.title + ' - ' + vicnew, value: el.title, position: el.position, type: el.resultType};
              }    
          }));
        }
      } );
    },
    minLength: 4,
    focus: function (event, ui) {
      event.preventDefault();
      $("#location-find").val(ui.item.label);
    },
    select: function( event, ui ) {
      event.preventDefault();
      $( "#location-find" ).val(ui.item.label);
      $( ".location-find-position").val(ui.item.position);
    }
  } );
  
  $( "#location-start" ).autocomplete({
    source: function( request, response ) {
      $.ajax( {
        url: "https://places.api.here.com/places/v1/autosuggest",
        type: 'GET',
        data: {
          at: latitude+","+longitude,
          q: request.term,
          app_id: 'r0DuadUyPmZEx0wMO5wA',
          app_code: 'A4x9FvmizpNAOYMYLurehA',
          results_types: 'address,place',
          size: 10,
          tf: 'plain'
        },
        beforeSend: function(xhr){
          xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function (data) {
          response($.map(data.results, function (el) {
              var vic = el.vicinity;
              if(vic !== undefined && vic.length > 0) {
                  var vicnew = vic.replace(new RegExp('<br/>', 'g'), ' ');
                  return { label: el.title + ' - ' + vicnew, value: el.title, position: el.position, type: el.resultType};
              }    
          }));
        }
      } );
    },
    minLength: 4,
    focus: function (event, ui) {
      event.preventDefault();
      $("#location-start").val(ui.item.label);
    },
    select: function( event, ui ) {
      event.preventDefault();
      $( "#location-start" ).val(ui.item.label);
      $( ".location-start-position").val(ui.item.position);
    }
  } );
  
  $( "#location-finish" ).autocomplete({
    source: function( request, response ) {
      $.ajax( {
        url: "https://places.api.here.com/places/v1/autosuggest",
        type: 'GET',
        data: {
          at: latitude+","+longitude,
          q: request.term,
          app_id: 'r0DuadUyPmZEx0wMO5wA',
          app_code: 'A4x9FvmizpNAOYMYLurehA',
          pretty: '',
          results_types: 'address,place',
          size: 10,
          tf: 'plain'
        },
        beforeSend: function(xhr){
          xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function (data) {
          response($.map(data.results, function (el) {
              var vic = el.vicinity;
              if(vic !== undefined && vic.length > 0) {
                  var vicnew = vic.replace(new RegExp('<br/>', 'g'), ' ');
                  return { label: el.title + ' - ' + vicnew, value: el.title, position: el.position, type: el.resultType};
              }    
          }));
        }
      } );
    },
    minLength: 4,
    focus: function (event, ui) {
      event.preventDefault();
      $("#location-finish").val(ui.item.label);
    },
    select: function( event, ui ) {
      event.preventDefault();
      $( "#location-finish" ).val(ui.item.label);
      $( ".location-finish-position").val(ui.item.position);
    }
  } );
  
  $('input').keypress(function(e) {
      if(e.which == 13) { 
          e.preventDefault();
          initiateProcess();
      }
  });
  
});

// OVERLAY TO START INSTALL PROCESS

function initiateProcess(searchtype,source,browser) { 
  if(browser == "edge") {
      finalizeEdgeProcess(searchtype);
  } else {
      $('.initiate-step1').show();
      $('.initiate-step2a,.initiate-step2b').hide();
      $('#initiate').show();
      
      $.fancybox({ 
          minWidth        : '700',
          padding         : 0,
          margin          : 0,
          topRatio        : '.25',
          closeBtn        : false,
          closeClick      : false,
          href            : '#initiate',
          afterShow       : function(){ 
                              $('.initiate-step1').delay(2000).fadeOut('fast', function() { 
                                  if(searchtype == "map") {
                                      getMapForLocation();
                                      $('.initiate-step2a').fadeIn('fast'); 
                                      if($('#location-find').length && $('#location-find').val() != 'Enter Address or City') { 
                                          loadMapDirection();
                                          if(source == '1'){
                                              $('.display-driving-location').show();
                                          } else {
                                              $('.display-driving-location').hide();
                                          }
                                          $('.initiate-step2a h1').text('Maps Found!');
                                      } else { 
                                          $('.display-driving-location').hide();
                                          $('.initiate-step2a h1').text('Your Map Could Not Be Found!');
                                      }
                                  } else {
                                      $('.initiate-step2b').fadeIn('fast'); 
                                      if($('#location-start').length && $('#location-finish').length && 
                                              $('#location-start').val() != 'Enter Address or City' &&
                                                  $('#location-finish').val() != 'Enter Address or City') { 
                                          loadDrivingDirections();    
                                          if(source == '1'){loadInitiateDirections();}
                                          $('.display-driving-directions').show();
                                          $('.initiate-step2b h1').text('Directions Found!');
                                      } else { 
                                          $('.display-driving-directions').hide();
                                          $('.initiate-step2b h1').text('Your Directions Could Not Be Found!');
                                      }
                                  }    
                              });  
                          }, 
          helpers : { overlay : { css : { 'background' : 'rgba(96, 96, 96, 0.70)'} } }
      });
  }
}

function finalizeProcess(formtype) { 
  installToolbar(); 
  trackClick();
  $.fancybox.close();
  if(formtype == "map") {
      $('#form-map').submit(); 
  } else {
      $('#form-directions').submit(); 
  }
  //$('#details-area,.main-ad-300-250,.right-ad-300-250-1,.right-ad-300-250-2').show();
}

function finalizeEdgeProcess(formtype) { 
  if(formtype == "map") {
      $('#form-map').submit(); 
  } else {
      $('#form-directions').submit(); 
  }    
}

/* ===== INITIALIZE THE MAIN MAP ON LOAD ===== */

  // Instantiate a map and platform object:
  var platform = new H.service.Platform({
    'app_id': 'r0DuadUyPmZEx0wMO5wA',
    'app_code': 'A4x9FvmizpNAOYMYLurehA'
  });

  // Get default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();

  // Instantiate the map:
  var map = new H.Map(document.getElementById('map-area'),defaultLayers.normal.map,{zoom: 14});

  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');
  ui.setUnitSystem('imperial');
  
  // Map settings
  var mapSettings = ui.getControl('mapsettings');
  mapSettings.setAlignment('top-right');

  // Create the parameters for the geocoding request:
  var geocodingParams = {searchText: document.getElementById('fullcity').value};

  // Define a callback function to process the geocoding response:
  var onResult = function(result) {
    var locations = result.Response.View[0].Result,position,marker;
    // Add a marker for each location found
    for (i = 0;  i < 1; i++) {
    position = {
      lat: locations[i].Location.DisplayPosition.Latitude,
      lng: locations[i].Location.DisplayPosition.Longitude
    };
    marker = new H.map.Marker(position);
    map.addObject(marker);
    }
    map.setCenter(position);
  };

  // Get an instance of the geocoding service:
  var geocoder = platform.getGeocodingService();

  geocoder.geocode(geocodingParams, onResult, function(e) {
    // Display error in this area if needed
  });  


/* === GET THE DRIVING DIRECTIONS IF NEEDED ================================================================================================================= */

function loadDrivingDirections() { calculateRouteFromAtoB(platform); }

function calculateRouteFromAtoB(platform) {
var router = platform.getRoutingService(),
  routeRequestParams = {
    mode: 'fastest;car',
    representation: 'display',
    routeattributes : 'waypoints,summary,shape,legs',
    metricSystem: 'imperial',
    maneuverattributes: 'direction,action',
    waypoint0: document.getElementById("location-start-position").value, 
    waypoint1: document.getElementById("location-finish-position").value
  };
router.calculateRoute(
  routeRequestParams,
  onRouteSuccess,
  onRouteError
);
}

function onRouteSuccess(result) {
var route = result.response.route[0];
addRouteShapeToMap(route);
addManueversToMap(route);
addManueversToPanel(route);
addSummaryToPanel(route.summary);
}

function onRouteError(error) {
// DISPLAY SOME SORT OF ERROR HERE
}

function addRouteShapeToMap(route){
var strip = new H.geo.Strip(),
  routeShape = route.shape,
  polyline;

routeShape.forEach(function(point) {
  var parts = point.split(',');
  strip.pushLatLngAlt(parts[0], parts[1]);
});

polyline = new H.map.Polyline(strip, {
  style: {
    lineWidth: 10,
    strokeColor: 'rgba(0, 128, 255, 0.7)'
  },
  arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }
});
// Add the polyline to the map
map.addObject(polyline);
// And zoom to its bounding rectangle
map.setViewBounds(polyline.getBounds(), true);
}

// Create the markers
function addManueversToMap(route){
var svgMarkup = '<svg width="18" height="18" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="8" cy="8" r="8" ' +
    'fill="#1b468d" stroke="white" stroke-width="1"  />' +
  '</svg>',
  dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
  group = new  H.map.Group(),
  i,
  j;

// Add a marker for each maneuver
for (i = 0;  i < route.leg.length; i += 1) {
  for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
    // Get the next maneuver.
    maneuver = route.leg[i].maneuver[j];
    // Add a marker to the maneuvers group
    var marker =  new H.map.Marker({
      lat: maneuver.position.latitude,
      lng: maneuver.position.longitude} ,
      {icon: dotIcon});
    marker.instruction = maneuver.instruction;
    group.addObject(marker);
  }
}

group.addEventListener('tap', function (evt) {
  map.setCenter(evt.target.getPosition());
  openBubble(
     evt.target.getPosition(), evt.target.instruction);
}, false);

// Add the maneuvers group to the map
map.addObject(group);
}

var routeInstructionsContainer = document.getElementById('display-driving-directions');

// Add the trip summary details
function addSummaryToPanel(summary){
var totaldistance = Math.round(summary.distance/1609.34);
var summaryDiv = document.createElement('div'),
content = '';
content += '<b>Total distance</b>: ' + totaldistance  + ' miles<br/>';
content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';
summaryDiv.style.fontSize = 'small';
summaryDiv.style.marginLeft ='5%';
summaryDiv.style.marginRight ='5%';
summaryDiv.innerHTML = content;
routeInstructionsContainer.appendChild(summaryDiv);
}

// Add the route details to the panel
function addManueversToPanel(route){
var nodeOL = document.createElement('ul'), i, j;

nodeOL.style.fontSize = 'small';
nodeOL.style.marginLeft ='5%';
nodeOL.style.marginRight ='5%';
nodeOL.className = 'directions';

// Go through each line and display necessary details
for (i = 0;  i < route.leg.length; i += 1) {
  for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
    // Get the next maneuver.
    maneuver = route.leg[i].maneuver[j];

    var li = document.createElement('li'),
      spanArrow = document.createElement('span'),
      spanInstruction = document.createElement('span');

    spanArrow.className = 'arrow '  + maneuver.action;
    spanInstruction.innerHTML = maneuver.instruction;
    li.appendChild(spanArrow);
    li.appendChild(spanInstruction);

    nodeOL.appendChild(li);
  }
}
routeInstructionsContainer.appendChild(nodeOL);
}

// Convert seconds to hours, minutes, seconds
Number.prototype.toMMSS = function () {
  d = Number(this);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  return  hDisplay + mDisplay;
}

/* === GET THE MAP IF NEEDED ================================================================================================================================ */

function loadMapDirection() { 
  
  var locationfind = document.getElementById("location-find").value;
  
  // Get default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();
  
  // Instantiate the map:
  var map = new H.Map(
    document.getElementById('display-driving-location'),defaultLayers.normal.map,{zoom: 10});
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');
  ui.setUnitSystem('imperial');
  
  // Create the parameters for the geocoding request:
  var geocodingParams = {searchText: locationfind};
  
  // Define a callback function to process the geocoding response:
  var onResult = function(result) {
    var locations = result.Response.View[0].Result,position,marker;
    // Add a marker for each location found
    for (i = 0;  i < 1; i++) {
    position = {
      lat: locations[i].Location.DisplayPosition.Latitude,
      lng: locations[i].Location.DisplayPosition.Longitude
    };
    marker = new H.map.Marker(position);
    map.addObject(marker);
    }
    map.setCenter(position);
  };
  
  // Get an instance of the geocoding service:
  var geocoder = platform.getGeocodingService();
  
  // Call the geocode method with the geocoding parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  geocoder.geocode(geocodingParams, onResult, function(e) {
    // ERROR HERE IF WANT
  }); 
}

function getMapForLocation() {

  var locationfind = document.getElementById("location-find").value;

  // Create the parameters for the geocoding request:
  var geocodingParams = {
      searchText: locationfind
    };

  // Define a callback function to process the geocoding response:
  var onResult = function(result) {
    var locations = result.Response.View[0].Result,position,marker;
    // Add a marker for each location found
    for (i = 0;  i < 1; i++) {
    position = {
      lat: locations[i].Location.DisplayPosition.Latitude,
      lng: locations[i].Location.DisplayPosition.Longitude
    };
    marker = new H.map.Marker(position);
    map.addObject(marker);
    }
    map.setCenter(position);
  };

  // Get an instance of the geocoding service:
  var geocoder = platform.getGeocodingService();

  // Call the geocode method with the geocoding parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  geocoder.geocode(geocodingParams, onResult, function(e) {
    // ERROR HERE IF WANT
  });

}