"use strict";

var map;
var marker;
var bounceTimer;
var markers = [];
var largeInfowindow;

//Model
var restaurantList = [
  {
    title: "Chulha Chauki Da Dhaba",
		location: {lat: 12.912609, lng: 77.586017},
    markerNo: 0,
    nonveg: true
	},
  {
    title: "Barbeque Nation",
		location: {lat: 12.9064, lng: 77.5968},
    markerNo: 1,
    nonveg: true
	},
  {
    title: "Grill Square",
    location: {lat: 12.9262, lng: 77.5840},
    markerNo: 2,
    nonveg: true
  },
  {
    title: "Royal Andhra Spice",
    location: {lat: 12.906060, lng: 77.521022},
    markerNo: 3,
    nonveg: true
  },
  {
    title: "Hotel Nalapaka",
    location: {lat: 12.998871, lng: 77.552279},
    markerNo: 4,
    nonveg: false
  },
  {
    title: "Green Theory",
    location: {lat: 12.968213, lng: 77.602723},
    markerNo: 5,
    nonveg: false
  },
  {
    title: "1947 Restaurant",
    location: {lat: 12.927623, lng: 77.586237},
    markerNo: 6,
    nonveg: false
  },
  {
    title: "Vivanta by Taj",
    location: {lat: 13.029286, lng: 77.540743},
    markerNo: 7,
    nonveg: true
  },
  {
    title: "Hari Super Sandwich",
    location: {lat: 12.932846, lng: 77.582585},
    markerNo: 8,
    nonveg: false
  },
  {
    title: "The Hole in the Wall Cafe",
    location: {lat: 12.980508, lng: 77.625533},
    markerNo: 9,
    nonveg: true
  },
  {
    title: "Samarkand",
    location: {lat: 12.980508, lng: 77.604696},
    markerNo: 10,
    nonveg: true
  },
  {
    title: "Kapoor's Cafe",
    location: {lat: 12.956216, lng: 77.719927},
    markerNo: 11,
    nonveg: false
  }

];

//Restaurant Constructor
var Restaurant = function(data) {
  this.restaurantTitle = ko.observable(data.title);
  this.location = ko.observable(data.location);
  this.restaurantNumber = ko.observable(data.markerNo);
  this.Nonveg = ko.observable(data.nonveg);
  //Intially Display All the Restaurants with 'visible' binding in View
  this.listVisible = ko.observable(true);
};

//ViewModel
var viewModel = function(){
  var self = this;
  //Empty location list array for all Restaurant locations
  this.locationList = ko.observableArray([]);
  //Adding all Restaurant locations to location list array
  restaurantList.forEach(function(location) {
    self.locationList.push(new Restaurant(location));
  });
  //Initializing Google Map
  var myLatLng = {lat: 12.9716, lng: 77.5946};
  map = new google.maps.Map(document.getElementById('map-start'), {
    zoom: 11,
    center: myLatLng,
  	mapTypeControl: false
    });

  //Initializing InfoWindow
  largeInfowindow = new google.maps.InfoWindow();
  //Customization of marker icons
  var defaultIcon = makeMarkerIcon('1245f0');
  var highlightedIcon = makeMarkerIcon('a1c6fa');
  //Setting up markers in this for-loop
  for (var i = 0; i < restaurantList.length; i++) {
    var position = restaurantList[i].location;
    var title = restaurantList[i].title;
    marker = new google.maps.Marker({
      title: title,
      position: position,
      animation: google.maps.Animation.DROP,
      id: i,
      icon: defaultIcon,
      });
    //Adding all marker to empty 'markers' array
    markers.push(marker);
    //Display all markers initially
    markers[i].setMap(map);
    //Click event listener for each marker
    marker.addListener('click', function() {
      //calling fillInfoWindow function
      fillInfoWindow(this, largeInfowindow);
      //Bounce animation for each marker
      if (this.getAnimation() == null) {
        clearTimeout(bounceTimer);
        var self = this;
        bounceTimer = setTimeout(function(){
        self.setAnimation(google.maps.Animation.BOUNCE);
        }, 300);
        }
      });
      //MouseOut event listener for each marker
      marker.addListener('mouseout', function() {
        //Setting each marker color to default color
        this.setIcon(defaultIcon);
        //Canceling bounce animation
        clearTimeout(bounceTimer);
        if (this.getAnimation() != null) {
          this.setAnimation(null);
        }


        });
      //MouseOver event listener for each marker
      marker.addListener('mouseover', function() {
        //Setting marker color to highlighted color on mouse hover
        this.setIcon(highlightedIcon);
        });
  }

  //Dispaly respective Restaurant's InfoWindow and with highlighted icon
  //when clicked from the resturant list
  this.viewInfoWindowOnListClick = function() {
    var markerNumber = this.restaurantNumber();
    fillInfoWindow(markers[markerNumber], largeInfowindow);
    markers[markerNumber].setIcon(highlightedIcon);
    setTimeout(function() {
      markers[markerNumber].setIcon(defaultIcon);
    }, 500);
    // markers[markerNumber].setAnimation(google.maps.Animation.BOUNCE);
  };

  //Display nonveg resturant list and respective markers
  //Reffered from https://discussions.udacity.com/t/issues-with-filtering-markers-and-list/197045/4
  this.getNonVeg = function() {
    var len = self.locationList().length;
    for (var i = 0; i < len; i++) {
      if(self.locationList()[i].Nonveg() === true) {
        //Dispaly nonveg resturant list
        self.locationList()[i].listVisible(true);
        //Dispaly nonveg resturant markers
        (function nonvegMarker() {
          for (var i = 0; i < markers.length; i++) {
            if(restaurantList[i].nonveg === true) {
              markers[i].setMap(map);
            }
            else {
              markers[i].setMap(null);
            }
          }
        })();
      }
      else {
       self.locationList()[i].listVisible(false);
      }
    }
  };

  //Display veg resturant list and respective markers
  this.getVeg = function() {
    var len = self.locationList().length;
    for (var i = 0; i < len; i++) {
      if(self.locationList()[i].Nonveg() === false) {
        //Dispaly veg resturant list
        self.locationList()[i].listVisible(true);
        //Dispaly veg resturant markers
        (function vegMarker() {
          for (var i = 0; i < markers.length; i++) {
            if(restaurantList[i].nonveg === false) {
              markers[i].setMap(map);
            }
            else {
              markers[i].setMap(null);
            }
          }
        })();
      }
      else {
        self.locationList()[i].listVisible(false);
      }
    }
  };

  //Display all resturant list and respective markers
  this.displayAll = function() {
    var len = self.locationList().length;
    for (var i = 0; i < len; i++) {
      //Dispaly all resturant list
      self.locationList()[i].listVisible(true);
      //Dispaly all resturant markers
      (function allMarker() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      })();
    }
  };

}

//InfoWindow Function
function fillInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened
  if (infowindow.marker != marker) {
    // Fill the content of information window
    var infoContent = '<b>'+ marker.title + '</b><br><div>Foursquare Link:</div><div id="foursquare-link"></div><div id="foursquare-time">Timings: </div>';
    infowindow.setContent(infoContent) ;
    infowindow.marker = marker;
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
  //Foursquare Data
  var clientID = '2VJ4O34VQACZIZMS041DVFZXL2FPSH0TMD40VBJNJE1OU0PL',
      clientSecret = 'MQIF1NOUZGDUVTVYBXU2YKKSRWSHMMDP42C42BS0ASVPA1GY',
      version = '20161117',
      query = marker.title,
      base_url = "https://api.foursquare.com/v2/venues/";

  //AJAX call to Foursquare API
  $.ajax({
    url: base_url + '/search',
    dataType: 'json',
    data: {
      client_id: clientID,
      client_secret: clientSecret,
      near: 'Bangalore',
      v: version,
      query: query,
      async: true,
      limit: 10
    },
    //To be executed on successfull call
    success: function(result) {
      console.log("venue: ", result);
      console.log("venue id: ", result.response.venues[0].location.formattedAddress);
      //Get data from returned Venue JSON object
      var hotelId = result.response.venues[0].id;
      var hotelAddress = result.response.venues[0].location.formattedAddress;
      //Populate the returned JSON links to respective marker's infowindow
      var list = $("#foursquare-link");
      var url = 'https://foursquare.com/v/' + hotelId;
      list.append('<a href="' + url + '">' + hotelAddress + '</a>');

      //Make another AJAX call to get Hours Information
      //Reffered from https://discussions.udacity.com/t/trying-to-implement-the-foursquare-api-tips/186524
      $.ajax({
        url: base_url + hotelId + '/hours',
        dataType: 'json',
        data: {
          client_id: clientID,
          client_secret: clientSecret,
          near: 'Bangalore',
          v: '20161117',
          query: marker.title,
          async: true
        },
        success: function(request1) {
        console.log("hours: ", request1);
        //Get data from returned Hours JSON object
        var hotelTime1 = request1.response.popular.timeframes[1].open[0].start ;
        var hotelTime2 = request1.response.popular.timeframes[1].open[0].end;
        var hotelTime3 = request1.response.popular.timeframes[1].open[1].start;
        var hotelTime4 = request1.response.popular.timeframes[1].open[1].end;
        // console.log(hotelTime1, hotelTime2, hotelTime3, hotelTime4);
        //Populate the returned JSON hours to respective marker's infowindow
        var list = $("#foursquare-time")
        list.append(hotelTime1 + "-" + hotelTime2 + ", " + hotelTime3 + "-" + hotelTime4);
        },
        //To be executed on unsuccessfull call for Hours object
        error: function(jqXHR, textStatus, errorThrown) {
          alert('Can not retrieve Restaurant Timings for now.');
          // if( typeof hotelTime1 === null )
          // {
          //   list.html('<p>Can not retrieve Restaurant Timings for now</p>');
          // }
          }
        })
      },
      //To be executed on unsuccessfull call for Venue object
      error: function() {
        alert('Can not retrieve Foursquare Links & Restaurant Timings for now.');
      }
    })
}

//Customization of markers
//Reffered from https://developers.google.com/maps/documentation/javascript/markers#complex_icons
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
};

//On successfull/unsuccessfull callback for google map API
function successMAP() {
    //https://stackoverflow.com/questions/5113374/javascript-check-if-variable-exists-is-defined-initialized
    if (typeof google !== 'undefined' || google === null) {
        ko.applyBindings(new viewModel());
    }
    else {
        alert('Google Map is not available');
        errorMAP();
    }

};

//On unsuccessfull callback for google map API
function errorMAP() {
    alert('Google Map is not available right now');
};
