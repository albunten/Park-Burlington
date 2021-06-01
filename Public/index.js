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

// Create Base Map *************************************************
async function initMap() {
  //Define lat lng location of the center of downtown Burlington
  const burlingtonCenter = { lat: 44.478081, lng: -73.217 };
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
  let activeWindow = null
  const iconSize = 20
  const walkCircleZoom = 17
  const walkCircleRadius = 125


  // Global functions **********************************************
  // query database
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

  google.maps.event.addListener(map, 'zoom_changed', function () {
    var zoom = map.getZoom();
    console.log(zoom);
  });

  //Error Handling Function-----
  function errData(data) {
    console.log('Error!')
    console.log(err)
  };


  // iterate over db data to set up map ***********************************


  myInfo.forEach((item) => {



    let path = item.coordinates.split(',0,');
    let newPath = path.map((item) => {
      let coordPair = item.split(',')
      return { lat: Number(coordPair[1]), lng: Number(coordPair[0]) }
    });
    let stroke = item.stroke;
    let strokeOpacity = item.strokeopacity
    let fill = item.fill;
    let fillOpacity = item.fillOpacity;

    let category = item.category;
    let center = { lat: Number(item.center__lat), lng: Number(item.center__lng) };
    let contact = item.contact;
    let description = item.description;
    let id = item.id;
    let enforced = item.enforcedhours;
    let maxtime = item.maxtime;
    let maxtime2 = item.maxtime2;
    let name = item.name;
    let navigationurl = item.navigationurl;
    let rate = item.rate;
    let rate2 = item.rate2;
    let paymenttype = item.paymenttype
    let ownership = item.ownership;
    let zone1 = item.zone1;
    let zone2 = item.zone2;

    //  Icons and icon lookup tables *********************
    let evIcon = {
      url: './images/evCircle.png',
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let handicapIcon = {
      url: './images/handicapCircle.png',
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let motorcycleIcon = {
      url: './images/motoCircle.png',
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let luzIcon = {
      url: './images/luzIcon.png',
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let busIcon = {
      url: './images/busIcon.png',
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };

    let blueSingle = {
      url: './images/blueSingle.png',
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let brownSingle = {
      url: "./images/brownSingle.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let smartSingle = {
      url: "./images/smartSingle.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let yellowSingle = {
      url: "./images/yellowSingle.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };

    let blueLeft = {
      url: './images/blueLeft.png',
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let brownLeft = {
      url: "./images/brownLeft.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let smartLeft = {
      url: "./images/smartLeft.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let yellowLeft = {
      url: "./images/yellowLeft.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };

    let blueRight = {
      url: './images/blueRight.png',
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let brownRight = {
      url: "./images/brownRight.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let smartRight = {
      url: "./images/smartRight.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let yellowRight = {
      url: "./images/yellowRight.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };

    let kioskSmart = {
      url: "./images/kioskSmart.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let kioskBlue = {
      url: "./images/kioskBlue.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
    let kioskBrown = {
      url: "./images/kioskBrown.png",
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };

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

    const kioskIcon = {
      "5801": kioskBlue,
      "5811": kioskSmart,
      "5815": kioskBlue,
      "5816": kioskBrown
    }

    // create layers ***************************************************

    // adds garages and lots 
    let polygonLayer = new google.maps.Polygon({
      paths: [],
      strokeColor: stroke,
      strokeWeight: 2,
      fillColor: fill,
      fillOpacity: fillOpacity,
    });
    if (category === 'GAR' || category === 'LOT') {
      polygonLayer.setPath(newPath)
    }

    // Create Marker Layer for icons
    let markerLayer = new google.maps.Marker({
    });

    //Adds single meter icons
    if (category === 'SGL') {
      markerLayer.setOptions({
        icon: singleIcon[zone1],
        position: center
      })
    };



    //Adds double meter icons
    //LEFT
    // set clickable half of icon to left side
    const shapeLeft = {
      type: "rect",
      coords: [0, 0, (iconSize / 2), iconSize]
    }
    // create layer for left side markers
    let doubleLayerLeft = new google.maps.Marker({
    });
    //select icon from table by zone and add attributes
    if (category === 'DBL') {
      doubleLayerLeft.setOptions({
        icon: doubleIconLeft[zone1],
        position: center,
        shape: shapeLeft
      })
    }
    // RIGHT
    // set clickable half of icon to right side
    const shapeRight = {
      type: "rect",
      coords: [(iconSize / 2), 0, iconSize, iconSize]
    }
    // create layer for left side markers
    let doubleLayerRight = new google.maps.Marker({
    });
    //select icon from table by zone and add attributes
    if (category === 'DBL') {
      doubleLayerRight.setOptions({
        icon: doubleIconRight[zone2],
        position: center,
        shape: shapeRight
      })
    }

    //Adds Kiosk icons
    if (category === 'KIO') {
      markerLayer.setOptions({ icon: kioskIcon[zone1] })
      markerLayer.setPosition(center)
    };

    //Adds handicap icons
    if (category === 'HAN') {
      markerLayer.setOptions({ icon: handicapIcon })
      markerLayer.setPosition(center)
    };

    //Adds charging station icons
    if (category === 'EVC') {
      markerLayer.setOptions({ icon: evIcon })
      markerLayer.setPosition(center)
    };

    //Adds motorcycle icons
    if (category === 'MOT') {
      markerLayer.setOptions({ icon: motorcycleIcon })
      markerLayer.setPosition(center)
    };

    //Adds Loading/Unloading icons
    if (category === 'LUZ') {
      markerLayer.setOptions({ icon: luzIcon })
      markerLayer.setPosition(center)
    };

    //Adds Bus/Large Vehicle icons
    if (category === 'LRG') {
      markerLayer.setOptions({ icon: busIcon })
      markerLayer.setPosition(center)
    };

    // Set layers on Map
    polygonLayer.setMap(map);
    markerLayer.setMap(map)
    doubleLayerLeft.setMap(map);
    doubleLayerRight.setMap(map);

    // Info Window pop ups **********************************************

    // create info-window for use when clicking parking asset
    let infowindow = new google.maps.InfoWindow({
      content: ""
    });
    // define infoWindow content
    function setInfoWindow(name, url, zone, desc, cat, id, cntr, rate, pay, contact, owner, maxtime) {
      if (activeWindow != null) {
        activeWindow.close()
      }

      let html = ""

      if (desc) {
        html =
          '<strong>' + name + '</strong>' +
          '<br />' +
          '<a target="_blank" href=' + url + '>Get Directions</a>' +
          '<br />' +
          '<br />' +
          desc +
          '<br /><br />' +
        '<strong>' + 'Owner: ' + '</strong>' + owner +
          '<br />' +
          '<strong>' + 'Contact: ' + '</strong>' + contact +
          '<br />' +
          '<br />(' + cat + id + ')';
      } else {
        html =
          '<strong>' + name + '</strong>' +
          '<br />' +
          '<a target="_blank" href=' + url + '>Get Directions</a>' +
          '<br />' +
          '<br />' +
          '<strong>' + 'Rate: ' + '</strong>' + rate +
          '<br />' +
          '<strong>' + 'Payment: ' + '</strong>' + pay +
          '<br />' +
          '<strong>' + 'ParkMobil Zone: ' + '</strong>' + zone +
          '<br />' +
          '<br />' +
          '<strong>' + 'Enforced: ' + '</strong>' + enforced +
          '<br />' +
          '<strong>' + 'Max time: ' + '</strong>' + maxtime +
          '<br /><br />' +
          '<strong>' + 'Owner: ' + '</strong>' + owner +
          '<br />' +
          '<strong>' + 'Contact: ' + '</strong>' + contact +
          '<br />' +
          '<br />(' + cat + id + ')';
      }

      infowindow.setPosition(cntr);
      // define position and call open
      infowindow.setContent(html)
      infowindow.setOptions({
        pixelOffset: new google.maps.Size(0, 0)
      }); // move the infowindow up slightly to the top of the marker icon
      infowindow.open(map);
      { passive: true }
      activeWindow = infowindow;
    }
    // create name lookup table
    const truNameLookup = {
      "5801": "BLUE TOP METER",
      "5802": "BROWN TOP METER",
      "5803": "SMART METER",
      "5804": "YELLOW TOP METER",
      "5806": "BROWN TOP METER",
      "5807": "BLUE TOP METER",
      "5808": "BLUE TOP METER",
      "5809": "BROWN TOP METER",
      "5810": "BLUE TOP METER",
      "5811": "SMART METER",
      "5812": "BROWN TOP METER",
      "5813": "YELLOW TOP METER",
      "5815": "BLUE TOP METER",
      "5816": "BROWN TOP METER"
    };

    // add popUp listeners for each layer
    polygonLayer.addListener('click', function (event) {
      setInfoWindow(name, navigationurl, zone1, description, category, id, center, rate, paymenttype, contact, ownership)
    });

    markerLayer.addListener('click', function (event) {
      let truName = name
      if (category === 'SGL') { truName = truNameLookup[zone1] }
      setInfoWindow(truName, navigationurl, zone1, description, category, id, center, rate, paymenttype, contact, ownership)
    });

    doubleLayerLeft.addListener('click', function (event) {
      let truName = name
      if (category === 'DBL') { truName = truNameLookup[zone1] }
      setInfoWindow(truName, navigationurl, zone1, description, category, id, center, rate, paymenttype, contact, ownership, maxtime)
    });

    doubleLayerRight.addListener('click', function (event) {
      let truName = name
      if (category === 'DBL') { truName = truNameLookup[zone2] }
      setInfoWindow(truName, navigationurl, zone2, description, category, id, center, rate2, paymenttype, contact, ownership, maxtime2)
    });


    // get Filter controls *************************************

    let toggleMunicipalGaragesLayer = document.getElementById('toggleMunicipalGarages')
    let togglePrivateGaragesLayer = document.getElementById('togglePrivateGarages')
    let toggleSmartMetersLayer = document.getElementById('toggleSmartMeters')
    let toggleBlueTopMetersLayer = document.getElementById('toggleBlueTopMeters')
    let toggleBrownTopMetersLayer = document.getElementById('toggleBrownTopMeters')
    let toggleYellowTopMetersLayer = document.getElementById('toggleYellowTopMeters')
    let toggleHandicapLayer = document.getElementById('toggleHandicap')
    let toggleEVChargeLayer = document.getElementById('toggleEVCharge')
    let toggleLoadingUnloadingLayer = document.getElementById('toggleLoadingUnloading')
    let toggleMotorcycleLayer = document.getElementById('toggleMotorcycle')
    let toggleBusLargeVehicleLayer = document.getElementById('toggleBusLargeVehicle')


    // add listener to filter elements - define click action ********
    toggleMunicipalGaragesLayer.addEventListener('click', function () {
      toggleMunicipalGarages()
    });
    togglePrivateGaragesLayer.addEventListener('click', function () {
      togglePrivateGarages()
    });
    toggleSmartMetersLayer.addEventListener('click', function () {
      toggleSmartLayer()
    });
    toggleBlueTopMetersLayer.addEventListener('click', function () {
      toggleBlueLayer()
    });
    toggleBrownTopMetersLayer.addEventListener('click', function () {
      toggleBrownLayer()
    });
    toggleYellowTopMetersLayer.addEventListener('click', function () {
      toggleYellowLayer()
    });
    toggleHandicapLayer.addEventListener('click', function () {
      toggleHandicap()
    });
    toggleEVChargeLayer.addEventListener('click', function () {
      toggleEVCharge()
    });
    toggleLoadingUnloadingLayer.addEventListener('click', function () {
      toggleLoadingUnloading()
    });
    toggleMotorcycleLayer.addEventListener('click', function () {
      toggleMotorcycle()
    });
    toggleBusLargeVehicleLayer.addEventListener('click', function () {
      toggleBusLargeVehicle()
    });

    // function to toggle  parking asset on or off
    function toggleLayer(theLayer, layerType) {
      if (theLayer.checked === false) {
        layerType.setVisible(false)
      } else if (theLayer.checked === true) {
        layerType.setVisible(true)
      }
    };

    //Toggle specific types of parking asset from filter inputs *****
    function toggleMunicipalGarages() {
      if (ownership === 'Municipal' && (category === 'GAR' || category === 'LOT')) {
        let theLayer = toggleMunicipalGaragesLayer
        let layerType = polygonLayer
        toggleLayer(theLayer, layerType)
      }
    }

    function togglePrivateGarages() {
      if (ownership === 'Private' && (category === 'GAR' || category === 'LOT')) {
        let theLayer = togglePrivateGaragesLayer
        let layerType = polygonLayer
        toggleLayer(theLayer, layerType)
      }
    }

    function toggleSmartLayer() {
      if (zone1 === 5803 || zone1 === 5811) {
        toggleLayer(toggleSmartMetersLayer, markerLayer)
        toggleLayer(toggleSmartMetersLayer, doubleLayerLeft)
      }
      if (zone2 === 5803 || zone2 === 5811) {
        toggleLayer(toggleSmartMetersLayer, markerLayer)
        toggleLayer(toggleSmartMetersLayer, doubleLayerRight)
      }
    }

    function toggleBlueLayer() {
      if (zone1 === 5801 || zone1 === 5807 || zone1 === 5808 || zone1 === 5810 || zone1 === 5815) {
        toggleLayer(toggleBlueTopMetersLayer, markerLayer)
        toggleLayer(toggleBlueTopMetersLayer, doubleLayerLeft)
      }
      if (zone2 === 5801 || zone2 === 5807 || zone2 === 5808 || zone2 === 5810 || zone2 === 5815) {
        toggleLayer(toggleBlueTopMetersLayer, markerLayer)
        toggleLayer(toggleBlueTopMetersLayer, doubleLayerRight)
      }
    }

    function toggleBrownLayer() {
      if (zone1 === 5802 || zone1 === 5806 || zone1 === 5809 || zone1 === 5812 || zone1 === 5816) {
        toggleLayer(toggleBrownTopMetersLayer, markerLayer)
        toggleLayer(toggleBrownTopMetersLayer, doubleLayerLeft)
      }
      if (zone2 === 5802 || zone2 === 5806 || zone2 === 5809 || zone2 === 5812 || zone2 === 5816) {
        toggleLayer(toggleBrownTopMetersLayer, markerLayer)
        toggleLayer(toggleBrownTopMetersLayer, doubleLayerRight)
      }
    }

    function toggleYellowLayer() {
      if (zone1 === 5804 || zone1 === 5813) {
        toggleLayer(toggleYellowTopMetersLayer, markerLayer)
        toggleLayer(toggleYellowTopMetersLayer, doubleLayerLeft)
      }
      if (zone2 === 5804 || zone2 === 5813) {
        toggleLayer(toggleYellowTopMetersLayer, markerLayer)
        toggleLayer(toggleYellowTopMetersLayer, doubleLayerRight)
      }
    }

    function toggleHandicap() {
      if (category === 'HAN') {
        let theLayer = toggleHandicapLayer
        let layerType = markerLayer
        toggleLayer(theLayer, layerType)
      }
    };

    function toggleEVCharge() {
      if (category === 'EVC') {
        let theLayer = toggleEVChargeLayer
        let layerType = markerLayer
        toggleLayer(theLayer, layerType)
      }
    };

    function toggleLoadingUnloading() {
      if (category === 'LUZ') {
        let theLayer = toggleLoadingUnloadingLayer
        let layerType = markerLayer
        toggleLayer(theLayer, layerType)
      }
    }

    function toggleMotorcycle() {
      if (category === 'MOT') {
        let theLayer = toggleMotorcycleLayer
        let layerType = markerLayer
        toggleLayer(theLayer, layerType)
      }
    }
    function toggleBusLargeVehicle() {
      if (category === 'LRG') {
        let theLayer = toggleBusLargeVehicleLayer
        let layerType = markerLayer
        toggleLayer(theLayer, layerType)
      }
    }


  }); // END of For Each loop*************************************
  //******************************************************************* */


  // fire start condition for initial map display 
  // only lots and garages are 'on'
  startCondition()

  // Layer management by condition ********************************

  // turn on only off street parking (reset map to startup condition)
  let onOff = 'off'
  toggleShowAll.addEventListener('click', function () {
    if (onOff === 'off') {
      showAll()
      onOff = 'On'
    } else {
      startCondition()
      onOff = 'off'
    }
  });

  function toggleZoomFeaturesOn() {
    if (map.zoom >= 17) {
      showAll()
    }
  }


  // define start condition of layers on map - only lots and garages showing
  function startCondition() {
    if ((document.getElementById('toggleMunicipalGarages').checked) === false) {
      document.getElementById('toggleMunicipalGarages').click();
      console.log('it is true')
    }
    if ((document.getElementById('togglePrivateGarages').checked) === false) {
      document.getElementById('togglePrivateGarages').click();
    }
    if ((document.getElementById('toggleSmartMeters').checked) === true) {
      document.getElementById('toggleSmartMeters').click();
    }
    if ((document.getElementById('toggleBlueTopMeters').checked) === true) {
      document.getElementById('toggleBlueTopMeters').click();
    }
    if ((document.getElementById('toggleBrownTopMeters').checked) === true) {
      document.getElementById('toggleBrownTopMeters').click();
    }
    if ((document.getElementById('toggleYellowTopMeters').checked) === true) {
      document.getElementById('toggleYellowTopMeters').click();
    }
    if ((document.getElementById('toggleHandicap').checked) === true) {
      document.getElementById('toggleHandicap').click();
    }
    if ((document.getElementById('toggleEVCharge').checked) === true) {
      document.getElementById('toggleEVCharge').click();
    }
    if ((document.getElementById('toggleLoadingUnloading').checked) === true) {
      document.getElementById('toggleLoadingUnloading').click();
    }
    if ((document.getElementById('toggleMotorcycle').checked) === true) {
      document.getElementById('toggleMotorcycle').click();
    }
    if ((document.getElementById('toggleBusLargeVehicle').checked) === true) {
      document.getElementById('toggleBusLargeVehicle').click();
    }
  }

  // turn all parking assets on - visible regardless of prior visibility
  function showAll() {
    console.log('show All fired')
    if ((document.getElementById('toggleHandicap').checked) === false) {
      document.getElementById('toggleHandicap').click();
    }
    if ((document.getElementById('toggleMunicipalGarages').checked) === false) {
      document.getElementById('toggleMunicipalGarages').click();
      console.log('it is true')
    }
    if ((document.getElementById('togglePrivateGarages').checked) === false) {
      document.getElementById('togglePrivateGarages').click();
    }
    if ((document.getElementById('toggleSmartMeters').checked) === false) {
      document.getElementById('toggleSmartMeters').click();
    }
    if ((document.getElementById('toggleBlueTopMeters').checked) === false) {
      document.getElementById('toggleBlueTopMeters').click();
    }
    if ((document.getElementById('toggleBrownTopMeters').checked) === false) {
      document.getElementById('toggleBrownTopMeters').click();
    }
    if ((document.getElementById('toggleYellowTopMeters').checked) === false) {
      document.getElementById('toggleYellowTopMeters').click();
    }
    if ((document.getElementById('toggleEVCharge').checked) === false) {
      document.getElementById('toggleEVCharge').click();
    }
    if ((document.getElementById('toggleMotorcycle').checked) === false) {
      document.getElementById('toggleMotorcycle').click();
    }
    if ((document.getElementById('toggleBusLargeVehicle').checked) === false) {
      document.getElementById('toggleBusLargeVehicle').click();
    }
    if ((document.getElementById('toggleLoadingUnloading').checked) === false) {
      document.getElementById('toggleLoadingUnloading').click();
    }
  };

  // turn all park assets off despite current state
  function hideAll() {
    console.log('show All fired')
    if ((document.getElementById('toggleMunicipalGarages').checked) === true) {
      document.getElementById('toggleMunicipalGarages').click();
      console.log('it is true')
    }
    if ((document.getElementById('togglePrivateGarages').checked) === true) {
      document.getElementById('togglePrivateGarages').click();
    }
    if ((document.getElementById('toggleSmartMeters').checked) === true) {
      document.getElementById('toggleSmartMeters').click();
    }
    if ((document.getElementById('toggleBlueTopMeters').checked) === true) {
      document.getElementById('toggleBlueTopMeters').click();
    }
    if ((document.getElementById('toggleBrownTopMeters').checked) === true) {
      document.getElementById('toggleBrownTopMeters').click();
    }
    if ((document.getElementById('toggleYellowTopMeters').checked) === true) {
      document.getElementById('toggleYellowTopMeters').click();
    }
    if ((document.getElementById('toggleHandicap').checked) === true) {
      document.getElementById('toggleHandicap').click();
    }
    if ((document.getElementById('toggleEVCharge').checked) === true) {
      document.getElementById('toggleEVCharge').click();
    }
    if ((document.getElementById('toggleLoadingUnloading').checked) === true) {
      document.getElementById('toggleLoadingUnloading').click();
    }
    if ((document.getElementById('toggleMotorcycle').checked) === true) {
      document.getElementById('toggleMotorcycle').click();
    }
    if ((document.getElementById('toggleBusLargeVehicle').checked) === true) {
      document.getElementById('toggleBusLargeVehicle').click();
    }
  };


  //********************** toggle markers in street view*********************** */

  // create variables to store existing .clicked status of icons

  let varMun = ''
  let varPri = ''
  let varSma = ''
  let varBlu = ''
  let varBro = ''
  let varYel = ''
  let varHan = ''
  let varEvc = ''
  let varLoa = ''
  let varMot = ''
  let varBus = ''


  // create variable for listener 
  let groundLevel = map.getStreetView()

  // listener toggles when street view is toggled visible/hidden
  google.maps.event.addListener(groundLevel, 'visible_changed', function () {
    // store existing state of .clicked for element icons and priceicons
    function storeState() {
      varMun = document.getElementById('toggleMunicipalGarages').checked
      varPri = document.getElementById('togglePrivateGarages').checked
      varSma = document.getElementById('toggleSmartMeters').checked
      varBlu = document.getElementById('toggleBlueTopMeters').checked
      varBro = document.getElementById('toggleBrownTopMeters').checked
      varYel = document.getElementById('toggleYellowTopMeters').checked
      varHan = document.getElementById('toggleHandicap').checked
      varEvc = document.getElementById('toggleEVCharge').checked
      varLoa = document.getElementById('toggleLoadingUnloading').checked
      varMot = document.getElementById('toggleMotorcycle').checked
      varBus = document.getElementById('toggleBusLargeVehicle').checked
    }

    // check stored state and if 'true' then click it back on
    function setPriorState() {
      if (varMun === true) {
        document.getElementById('toggleMunicipalGarages').click();
      }
      if (varPri === true) {
        document.getElementById('togglePrivateGarages').click();
      }
      if (varSma === true) {
        document.getElementById('toggleSmartMeters').click();
      }
      if (varBlu === true) {
        document.getElementById('toggleBlueTopMeters').click();
      }
      if (varBro === true) {
        document.getElementById('toggleBrownTopMeters').click();
      }
      if (varYel === true) {
        document.getElementById('toggleYellowTopMeters').click();
      }
      if (varHan === true) {
        document.getElementById('toggleHandicap').click();
      }

      if (varEvc === true) {
        document.getElementById('toggleEVCharge').click();
      }
      if (varLoa === true) {
        document.getElementById('toggleLoadingUnloading').click();
      }
      if (varMot === true) {
        document.getElementById('toggleMotorcycle').click();
      }
      if (varBus === true) {
        document.getElementById('toggleBusLargeVehicle').click();
      }
    }

    // if street view is toggled on - store the existing element visibility and turn them all off
    if (groundLevel.getVisible()) {
      storeState()
      hideAll()
      // when street view is toggled off - set all icons to prior visibility
    } else {
      setPriorState()
    }
  })




  //
  //******* Modal window for Filters ************************************************************* */
  // Get the modal
  let modal = document.getElementById("filterListModal");

  // Get the button that opens the modal
  let btn = document.getElementById("toggleFilters");

  // Get the <span> element that closes the modal
  let cxl = document.getElementById("filtersClose");

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
    // setTimeout(closeModal, 1000)
  };
  // function closeModal() {
  //   modal.style.display = "none"
  // }

  // When the user clicks on <span> (x), close the modal
  cxl.onclick = function () {
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
    radius: walkCircleRadius,  //the average person can walk in a minute: 40-50 metres at a slow pace
    zIndex: -100
  });

  autocomplete.addListener('place_changed', function () {
    // If the place has a geometry, then present it on a map plus add 3 minute walk circle.
    let place = autocomplete.getPlace();

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      map.setZoom(walkCircleZoom);  //about 1 block
      toggleZoomFeaturesOn()
      addWalkCircle()
      // console.log(circleCount)
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(walkCircleZoom);  // Why 17? Because it looks good.
    }
    //set marker on map from search bar
    map.setZoom(walkCircleZoom);  //about 1 block
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

  // Disclaimer modal *******************************************

  // Get the modal
  const disclaimerModal = document.getElementById("disclaimerModal");

  const toggleDisclaimer = document.getElementById('about-link')
  toggleDisclaimer.onclick = function () {
    disclaimerModal.style.display = "block";
  }

  // Get the <span> element that closes the modal
  var disclaimerSpan = document.getElementsByClassName("disclaimer-accept")[0];
  // When the user clicks on <span> (x), close the modal
  disclaimerSpan.onclick = function () {
    disclaimerModal.style.display = "none";
  }
}

