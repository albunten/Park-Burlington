// Set Window Height ***********************************************

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});


// Firebase config ************************************************
const config = {
  apiKey: "AIzaSyBD584NZj_YWneTOAgahXR0A_CgKpJtR2c",
  authDomain: "parkburlingtondev.firebaseapp.com",
  databaseURL: "https://parkburlingtondev-default-rtdb.firebaseio.com/",
  projectId: "parkburlingtondev",
  storageBucket: "parkburlingtondev.appspot.com",
  messagingSenderId: "876903591987",
  appId: "1:876903591987:web:e2f212a6db49f81263f346"
};

firebase.initializeApp(config);
const database = firebase.database();
const ref = database.ref();

async function makeQuery() {
  let myVar = await ref.once('value')
    .then(function (dataSnapshot) {
      let info = dataSnapshot.val();
      let keys = Object.keys(info);

      for (let i = 0; i < keys.length; i++) {
        let k = keys[i]
      };
      return dataSnapshot.val();
    });

  return myVar
};

//Error Handling Function-----
function errData(data) {
  console.log('Error!')
  console.log(err)
};

// Create Base Map *************************************************
async function initMap() {
  //Define lat lng location of the center of downtown Burlington
  const burlingtonCenter = { lat: 44.478081, lng: -73.215 };
  //Define a 1.5 mile (2414.02 meter) circle around downtown Burlington
  const circle = new google.maps.Circle(
    { center: burlingtonCenter, radius: 2414.02 });
  //Define max lat lng view limits of the map
  const viewLimit = {
    north: 47,
    south: 41,
    west: -77.269027,
    east: -69.151240,
  };
  // some controls disabled
  let map = new google.maps.Map(document.getElementById('map'), {
    center: burlingtonCenter,
    zoom: 15.3,
    gestureHandling: "greedy",
    fullscreenControl: false,
    streetViewControl: true,
    rotateControl: false,
    scaleControl: true,
    mapTypeControl: false,
    restriction: {
      latLngBounds: viewLimit,
      strictBounds: false,
    },
    styles: [
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "transit",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "transit.station.bus",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }
    ]

  });
  //Get searchbar element and fix it to top left of screen
  let card = document.getElementById('searchbar-container');
  let input = document.getElementById('searchbar-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  // Global variables **********************************************
  let circleCount = 1;
  let myInfo = await makeQuery();
  console.log({ myInfo });


  // Global functions **********************************************



  // get data from database ***********************************


  myInfo.forEach((item) => {
    let path = item.coordinates.split(',0,');
    let newPath = path.map((item) => {
      let coordPair = item.split(',')
      return { lat: Number(coordPair[1]), lng: Number(coordPair[0]) }
    });
    let stroke = item.stroke;
    let fill = item.fill;
    let fillOpacity = item.fillOpacity;

    let category = item.category;
    let center = { lat: Number(item.center__lat), lng: Number(item.center__lng) };
    let description = item.description;
    let id = item.id;
    let name = item.name;
    let navigationurl = item.navigationurl;
    let rate = item.rate;
    let ownership = item.ownership;
    let zone1 = item.zone1;
    let zone2 = item.zone2;

    //  Icons and icon lookup tables *********************
    let evIcon = './images/evCircle.png';
    let handicapIcon = './images/handicapCircle.png';
    let motorcycleIcon = './images/motoCircle.png';

    let blueSingle = './images/blueSingle.png';
    let brownSingle = "./images/brownSingle.png";
    let smartSingle = "./images/smartSingle.png";
    let yellowSingle = "./images/yellowSingle.png";

    let blueLeft = './images/blueLeft.png';
    let brownLeft = "./images/brownLeft.png";
    let smartLeft = "./images/smartLeft.png";
    let yellowLeft = "./images/yellowLeft.png";

    let blueRight = './images/blueRight.png';
    let brownRight = "./images/brownRight.png";
    let smartRight = "./images/smartRight.png";
    let yellowRight = "./images/yellowRight.png";

    let kioskIcon = './images/kioskCircle.png';

    const singleIcon = {
      "5801": blueSingle,
      "5802": brownSingle,
      "5803": smartSingle,
      "5804": yellowSingle,
      "5806": brownSingle,
      "5807": blueSingle,
      "5808": blueSingle,
      "5809": brownSingle,
      "5810": blueSingle,
      "5811": smartSingle,
      "5812": brownSingle,
      "5813": yellowSingle,
      "5815": blueSingle,
      "5816": brownSingle
    };

    const doubleIconLeft = {
      "5801": blueLeft,
      "5802": brownLeft,
      "5803": smartLeft,
      "5804": yellowLeft,
      "5806": brownLeft,
      "5807": blueLeft,
      "5808": blueLeft,
      "5809": brownLeft,
      "5810": blueLeft,
      "5811": smartLeft,
      "5812": brownLeft,
      "5813": yellowLeft,
      "5815": blueLeft,
      "5816": brownLeft
    };

    const doubleIconRight = {
      "5801": blueRight,
      "5802": brownRight,
      "5803": smartRight,
      "5804": yellowRight,
      "5806": brownRight,
      "5807": blueRight,
      "5808": blueRight,
      "5809": brownRight,
      "5810": blueRight,
      "5811": smartRight,
      "5812": brownRight,
      "5813": yellowRight,
      "5815": blueRight,
      "5816": brownRight
    };

    //Adds single meter icons
    let singleLayer = new google.maps.Marker({
      position: null,
      icon: singleIcon[zone1],
    });
    if (category === 'SGL') {
      singleLayer.setPosition(center)
    };

    //Adds double meter icons
    let doubleLayerLeft = new google.maps.Marker({
      position: null,
      icon: doubleIconLeft[zone1],
    });
    if (category === 'DBL') {
      doubleLayerLeft.setPosition(center)
    };

    let doubleLayerRight = new google.maps.Marker({
      position: null,
      icon: doubleIconRight[zone2],
    });
    if (category === 'DBL') {
      doubleLayerRight.setPosition(center)
    };

    //Adds Kiosk icons
    let kioskLayer = new google.maps.Marker({
      position: null,
      icon: kioskIcon,
    });
    if (category === 'KIO') {
      kioskLayer.setPosition(center)
    };

    // Set layers on Map
    singleLayer.setMap(map);
    doubleLayerLeft.setMap(map);
    doubleLayerRight.setMap(map);
    kioskLayer.setMap(map)


    // function to toggle specific types of parking asset on or off
    function toggleLayer(theLayer, layerType) {
      console.log('toggleLayer ', theLayer.checked)
      if (theLayer.checked === false) {
        layerType.setVisible(false)
      } else if (theLayer.checked === true) {
        layerType.setVisible(true)
      }
    };

    // get Filter controls *************************************
    let toggleEvcLayer = document.getElementById('toggleEVCharge');
    let toggleHandicapLayer = document.getElementById('toggleHandicap');
    let toggleSmartMetersLayer = document.getElementById('toggleSmartMeters');


    // add listener to filter element and define click action ********
    toggleEvcLayer.addEventListener('click', function () {
      toggleEVCharge()
    });
    toggleHandicapLayer.addEventListener('click', function () {
      toggleHandicap()
    });
    toggleSmartMetersLayer.addEventListener('click', function () {
      toggleSmartLayer()
    });



    //Toggle specific types of parking asset plus small icons *****
    function toggleHandicap() {
      if (category === 'HAN') {
        let theLayer = toggleHandicapLayer
        let layerType = markerLayer
        toggleLayer(theLayer, layerType)
      }
    };

    function toggleEVCharge() {
      if (category === 'EVC') {
        let theLayer = toggleEvcLayer
        let layerType = markerLayer
        toggleLayer(theLayer, layerType)
      }
    };

    function toggleSmartLayer() {
      if (zone1 === 5803) {
        let theLayer = toggleSmartMetersLayer
        let layerType = markerLayer
        toggleLayer(theLayer, layerType)
      }
    };

  }); // END of For Each loop







  //******* Modal window for Filters ************************************************************* */
  // Get the modal
  let modal = document.getElementById("filterListModal");

  // Get the button that opens the modal
  let btn = document.getElementById("toggleFilters");

  // Get the <span> element that closes the modal
  let span = document.getElementsByClassName("close")[1];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
    // setTimeout(closeModal, 1000)
  };
  // function closeModal() {
  //   modal.style.display = "none"
  // }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    };
  };
   
  // *********** search box ************************************************************
  //Initialize autocomplete function in the searchbar
  let autocomplete = new google.maps.places.Autocomplete(input);
  // Limit autocomplete results to within a 2 mile (3218.688 meter) circle of downtown Burlington.
  autocomplete.setBounds(circle.getBounds());
  autocomplete.setOptions({ strictBounds: true });
  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
  let addressinfowindow = new google.maps.InfoWindow();
  let infowindowContent = document.getElementById('infowindow-content');
  addressinfowindow.setContent(infowindowContent);
  let marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  // create walk circle
  let walkCircle = new google.maps.Circle({
    strokeColor: '#20346a',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillOpacity: 0.0,
    center: map.center,
    radius: 95,  //the average person can walk in a minute: 40-50 metres at a slow pace
    zIndex: -100
  });

  autocomplete.addListener('place_changed', function () {
    // If the place has a geometry, then present it on a map plus add 3 minute walk circle.
    let place = autocomplete.getPlace();

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      map.setZoom(17.2);  //about 1 block
      // toggleZoomFeaturesOn()
      addWalkCircle()
      // console.log(circleCount)
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17.2);  // Why 17? Because it looks good.
    }
    //set marker on map from search bar
    map.setZoom(17.2);  //about 1 block
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    // add place name to infowindow
    infowindowContent.children['place-name'].textContent = place.name;
    // set infowindow on map and close after 6 seconds
    // addressinfowindow.open(map, marker);
    setTimeout(function () { addressinfowindow.close(); }, 7000);

    if (circleCount <= 1) {
      addressinfowindow.open(map, marker);
      setTimeout(function () { addressinfowindow.close(); }, 7000)
      circleCount += 1;
    };
    // add walk circle function
    function addWalkCircle() {
      walkCircle.center = place.geometry.location
      walkCircle.setMap(map)
    };

    // reset search bar - pin - info window - walk circle
    function resetSearch() {
      addressinfowindow.close();
      marker.setVisible(false);
      walkCircle.setMap(null);
      map.setCenter({ lat: 44.478081, lng: -73.215 });
      map.setZoom(15);
      startCondition();
    };
    document.getElementById("searchbar-container").addEventListener('click', function () {
      document.getElementById('searchbar-input').value = "";
      resetSearch()
    });
  });
}

