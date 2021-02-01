// Set Window Height
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

//***********Firebase Configuration ****************************************************************
const config = {
   apiKey: 'process.env.FIREBASE_KEY',
   authDomain: "park-burlington-bba.firebaseapp.com",
   databaseURL: "https://park-burlington-bba.firebaseio.com",
   projectId: "park-burlington-bba",
   storageBucket: "park-burlington-bba.appspot.com",
   messagingSenderId: "456540755649",
   appId: "1:456540755649:web:0682866d64059a80faa640",
   measurementId: "G-NCTNJ3ZMS8"
};

firebase.initializeApp(config)
const database = firebase.database()
const ref = database.ref()


async function makeQuery() {

   let myVar = await ref.once('value')
      .then(function (dataSnapshot) {
         let info = dataSnapshot.val()
         let keys = Object.keys(info)

         for (let i = 0; i < keys.length; i++) {
            let k = keys[i]
         }
         return dataSnapshot.val()
      })
   return myVar
}


//Error Handling Function-----

function errData(data) {
   console.log('Error!')
   console.log(err)
}
let circleCount = 1;
//-----------------------create base map------------------------

async function initMap() {



   //Define lat lng location of the center of downtown Burlington
   const burlingtonCenter = { lat: 44.478081, lng: -73.215 }

   //Define a 1.5 mile (2414.02 meter) circle around downtown Burlington
   const circle = new google.maps.Circle(
      { center: burlingtonCenter, radius: 2414.02 });

   //Define max lat lng view limits of the map
   const viewLimit = {
      north: 47,
      south: 41,
      west: -77.269027,
      east: -69.151240,
   }

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
      // mapTypeControlOptions: {
      //   position: google.maps.ControlPosition.BOTTOM_CENTER,
      // },
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
   let reset = document.getElementById('btnReset')
   map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);


   // call database query and bring into initmap function ***************************************************************************
   let myInfo = await makeQuery()
   let activeWindow = null
   console.log(myInfo)
   myInfo.forEach((item) => {
      console.log(item.category)
   })





   myInfo.forEach((item) => {

      let path = item.coordinates.split(',0,')
      let stroke = item.stroke
      let strokeOpacity = item.strokeopacity
      let fill = item.fill
      let fillOpacity = item.fillOpacity
      let icon = item.icon
      let name = item.name
      let navigationurl = item.navigationurl
      let latitude = item.latitude
      let longitude = item.longitude
      let category = item.category
      let id = item.id
      let center = { lat: Number(item.center__lat), lng: Number(item.center__lng) }
      let rate = item.rate
      let description = item.description
      let ownership = item.ownership
      let geometry = item.geometry
      let parkMarker = './images/arrowtransparent.png'
      let image = './images/ev20.png'
      let newPath = path.map((item) => {
         let coordPair = item.split(',')
         return { lat: Number(coordPair[1]), lng: Number(coordPair[0]) }
      })
   
      //Adds charging station icons
      let markerLayer = new google.maps.Marker({
         position: null,
         icon: image,
      });
      if (category === 'EVC') {
         markerLayer.setPosition(center)
      }

      //add any polyline meter rows
      let polyLineLayer = new google.maps.Polyline({
         strokeColor: stroke,
         strokeWeight: 3.5,
         strokeOpacity: strokeOpacity
      })
      if (category !== 'GAR' || category !== 'LOT' || category !== 'EVC') {
         polyLineLayer.setPath(newPath)
      }

      // adds garages and lots 
      let polygonLayer = new google.maps.Polygon({
         paths: null,
         strokeColor: stroke,
         strokeWeight: 2,
         fillColor: fill,
         fillOpacity: fillOpacity,
      });
      if (category === 'GAR' || category === 'LOT') {
         polygonLayer.setPath(newPath)
      }

      //set all layers on the map
      polygonLayer.setMap(map);
      markerLayer.setMap(map);
      polyLineLayer.setMap(map);

      // create info-window for use when clicking parking asset
      let infowindow = new google.maps.InfoWindow({
         content: ""

      });

      // create small icons for show price on zoom in
      let priceIcon = new google.maps.Marker({
         position: null,
         icon: null,
         optimized: false,
      });

      priceIcon.addListener('click', function (event) {
         if (activeWindow != null) {
            activeWindow.close()
         }


         let html =
            '<strong>' + name + '</strong>' +
            '<br>' +
            '<a href=' + navigationurl + '>Get Directions</a>' +
            '<br><br>' +
            description +
            '<br /><br /> ('
            + category + id + ')';



         infowindow.setContent(html)

         infowindow.setPosition(event.latLng);
         infowindow.setOptions({
            pixelOffset: new google.maps.Size(0, 0)
         }); // move the infowindow up slightly to the top of the marker icon
         infowindow.open(map);
         { passive: true }
         activeWindow = infowindow;
      });

      if (rate != "") {
         let dynamicFontSize = (18 - (rate.length * 1.2)).toString() + 'px'
         priceIcon.setLabel({ text: rate, fontSize: dynamicFontSize, color: "white", fontWeight: "bold" })
      }

      if (icon != "") {
         priceIcon.setIcon({ url: icon, anchor: { x: 15, y: 15 } })
      } else {
         priceIcon.setIcon({ url: "images/text-background4020.png", anchor: { x: 30, y: 15 } })
      }

      if (center !== 'NEED') {
         priceIcon.setPosition(center)
      }
      // make parking assets 'clickable' and popup and populate infowindow
      polygonLayer.addListener('click', function (event) {
         if (activeWindow != null) {
            activeWindow.close()
         }
         let html = '<strong>' + name + '</strong>' +
            '<br>' +
            '<a href=' + navigationurl + '>Get Directions</a>' +
            '<br><br>' +
            description +
            '<br /><br /> ('
            + category + id + ')';
         infowindow.setContent(html)

         infowindow.setPosition(event.latLng);
         infowindow.setOptions({
            pixelOffset: new google.maps.Size(0, 0)
         }); // move the infowindow up slightly to the top of the marker icon
         infowindow.open(map);
         { passive: true }
         activeWindow = infowindow;
      });

      // make charge stations 'clickable' and popup and populate infowindow
      markerLayer.addListener('click', function (event) {
         if (activeWindow != null) {
            activeWindow.close()
         }
         let html = '<strong>' + name + '</strong>' +
            '<br>' +
            '<a href=' + navigationurl + '>Get Directions</a>' +
            '<br><br>' +
            description +
            '<br /><br /> ('
            + category + id + ')';
         infowindow.setContent(html)

         infowindow.setPosition(event.latLng);
         infowindow.setOptions({
            pixelOffset: new google.maps.Size(0, 0)
         }); // move the infowindow up slightly to the top of the marker icon
         infowindow.open(map);
         { passive: true }
         activeWindow = infowindow;
      });

      // make polylines 'clickable' and popup and populate infowindow
      polyLineLayer.addListener('click', function (event) {
         if (activeWindow != null) {
            activeWindow.close()
         }
         let html = '<strong>' + name + '</strong>' +
            '<br>' +
            '<a href=' + navigationurl + '>Get Directions</a>' +
            '<br><br>' +
            description +
            '<br /><br /> ('
            + category + id + ')';
         infowindow.setContent(html)

         infowindow.setPosition(event.latLng);
         infowindow.setOptions({
            pixelOffset: new google.maps.Size(0, 0)
         }); // move the infowindow up slightly to the top of the marker icon
         infowindow.open(map);
         { passive: true }
         activeWindow = infowindow;
      });


      // ******controls and filters*****************************************************************************************************

      // set variables for layer controls

      let z1 = 17
      let z2 = 18
      let z3 = 19
      let evcZoom = z1
      let hanZoom = z1
      let munZoom = z1
      let priZoom = z1
      let smtZoom = z2
      let bluZoom = z2
      let brnZoom = z2
      let yelZoom = z2
      let motZoom = z1
      let lrgZoom = z2
      let resZoom = z2
      let luzZoom = 25

      let toggleShowAll = document.getElementById('toggleShowAll')


      let toggleHandicapLayer = document.getElementById('toggleHandicap')
      let toggleMunicipalGaragesLayer = document.getElementById('toggleMunicipalGarages')
      let togglePrivateGaragesLayer = document.getElementById('togglePrivateGarages')
      let toggleSmartMetersLayer = document.getElementById('toggleSmartMeters')
      let toggleBlueTopMetersLayer = document.getElementById('toggleBlueTopMeters')
      let toggleBrownTopMetersLayer = document.getElementById('toggleBrownTopMeters')
      let toggleYellowTopMetersLayer = document.getElementById('toggleYellowTopMeters')
      let toggleEVChargeLayer = document.getElementById('toggleEVCharge')
      let toggleMotorcycleLayer = document.getElementById('toggleMotorcycle')
      let toggleBusLargeVehicleLayer = document.getElementById('toggleBusLargeVehicle')
      let toggleResidentialLayer = document.getElementById('toggleResidential')
      let toggleLoadingUnloadingLayer = document.getElementById('toggleLoadingUnloading')

      // ***** Toggle display of map overlay components **********************************************************
      // toggle small icons on or off
      function showSmallIcons(theLayer) {
         console.log('showSmallIcons ', theLayer)
         if (theLayer.checked === false) {
            priceIcon.setMap()
         } else if (theLayer.checked === true) {
            priceIcon.setMap(map)
         }
      }

      // function to toggle specific types of parking asset on or off
      function toggleLayer(theLayer) {
         // console.log('toggleLayer ', theLayer)
         if (theLayer.checked === false) {
            polygonLayer.setVisible(false)
         } else if (theLayer.checked === true) {
            polygonLayer.setVisible(true)
         }
      }

      function togglePolyLineLayer(theLayer) {
         // console.log('togglePolyLineLayer ', theLayer)
         if (theLayer.checked === false) {
            polyLineLayer.setVisible(false)
         } else if (theLayer.checked === true) {
            polyLineLayer.setVisible(true)
         }
      }

      //Toggle specific types of parking asset plus small icons 
      function toggleHandicap() {
         if (category === 'HAN') {
            let theLayer = toggleHandicapLayer
            togglePolyLineLayer(theLayer)
            if (map.zoom >= hanZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < hanZoom) { priceIcon.setMap() }
         }
      }
      function toggleMunicipalGarages() {
         if (ownership === 'Municipal' && (category === 'GAR' || category === 'LOT')) {
            let theLayer = toggleMunicipalGaragesLayer
            toggleLayer(theLayer)
            togglePolyLineLayer(theLayer)
            if (map.zoom >= munZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < munZoom) { priceIcon.setMap() }
         }
      }
      function togglePrivateGarages() {
         if (ownership === 'Private' && (category === 'GAR' || category === 'LOT')) {
            let theLayer = togglePrivateGaragesLayer
            toggleLayer(theLayer)
            togglePolyLineLayer(theLayer)
            if (map.zoom >= priZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < priZoom) { priceIcon.setMap() }
         }
      }
      function toggleSmartMeters() {
         if (category === 'SMT') {
            let theLayer = toggleSmartMetersLayer

            togglePolyLineLayer(theLayer)
            if (map.zoom >= smtZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < smtZoom) { priceIcon.setMap() }
         }
      }
      function toggleBlueTopMeters() {
         if (category === 'BLU') {
            let theLayer = toggleBlueTopMetersLayer

            togglePolyLineLayer(theLayer)
            if (map.zoom >= bluZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < bluZoom) { priceIcon.setMap() }
         }
      }
      function toggleBrownTopMeters() {
         if (category === 'BRN') {
            let theLayer = toggleBrownTopMetersLayer

            togglePolyLineLayer(theLayer)
            if (map.zoom >= brnZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < brnZoom) { priceIcon.setMap() }
         }
      }
      function toggleYellowTopMeters() {
         if (category === 'YEL') {
            let theLayer = toggleYellowTopMetersLayer

            togglePolyLineLayer(theLayer)
            if (map.zoom >= yelZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < yelZoom) { priceIcon.setMap() }
         }
      }
      function toggleEVCharge() {  // note complexity is due to charge stations having multiple names plus most are geometry: Point while 2 are linestrings
         if (category === 'EVC') {
            if (toggleEVChargeLayer.checked === false) {
               markerLayer.setMap()
            } else if (toggleEVChargeLayer.checked === true) {
               markerLayer.setMap(map)
            }
         }
         if (category === 'EVC') {
            let theLayer = toggleEVChargeLayer
            togglePolyLineLayer(theLayer)
            // small icons not shown on this type
         }
      }

      //  CHANGE TO DB STORAGE OF ICONS WITH THIS ACTIVE
      // NEEDS TESTING
      // function toggleEVCharge() {
      //    if (category === 'EVC') {
      //       let theLayer = toggleEVChargeLayer

      //       togglePolyLineLayer(theLayer)
      //       if (map.zoom >= evcZoom) {
      //          showSmallIcons(theLayer)
      //       }
      //       if (map.zoom < evcZoom) { priceIcon.setMap() }
      //    }
      // }


      function toggleMotorcycle() {
         if (category === 'MOT') {
            let theLayer = toggleMotorcycleLayer

            togglePolyLineLayer(theLayer)
            if (map.zoom >= motZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < motZoom) { priceIcon.setMap() }
         }
      }
      function toggleBusLargeVehicle() {
         if (category === 'LRG') {
            let theLayer = toggleBusLargeVehicleLayer

            togglePolyLineLayer(theLayer)
            if (map.zoom >= lrgZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < lrgZoom) { priceIcon.setMap() }
         }
      }
      function toggleResidential() {
         if (category === 'RES') {
            let theLayer = toggleResidentialLayer

            togglePolyLineLayer(theLayer)
            if (map.zoom >= resZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < resZoom) { priceIcon.setMap() }
         }
      }
      function toggleLoadingUnloading() {
         if (category === 'LUZ') {
            let theLayer = toggleLoadingUnloadingLayer

            togglePolyLineLayer(theLayer)
            if (map.zoom >= luzZoom) {
               showSmallIcons(theLayer)
            }
            if (map.zoom < luzZoom) { priceIcon.setMap() }
         }
      }

      // **************create toggle event on click of dom element
      toggleHandicapLayer.addEventListener('click', function () {
         toggleHandicap()
      });
      toggleMunicipalGaragesLayer.addEventListener('click', function () {
         toggleMunicipalGarages()
      });
      togglePrivateGaragesLayer.addEventListener('click', function () {
         togglePrivateGarages()
      });
      toggleSmartMetersLayer.addEventListener('click', function () {
         toggleSmartMeters()
      });
      toggleBlueTopMetersLayer.addEventListener('click', function () {
         toggleBlueTopMeters()
      });
      toggleBrownTopMetersLayer.addEventListener('click', function () {
         toggleBrownTopMeters()
      });
      toggleYellowTopMetersLayer.addEventListener('click', function () {
         toggleYellowTopMeters()
      });
      toggleEVChargeLayer.addEventListener('click', function () {
         toggleEVCharge()
      });
      toggleMotorcycleLayer.addEventListener('click', function () {
         toggleMotorcycle()
      });
      toggleBusLargeVehicleLayer.addEventListener('click', function () {
         toggleBusLargeVehicle()
      });
      toggleResidentialLayer.addEventListener('click', function () {
         toggleResidential()
      });
      toggleLoadingUnloadingLayer.addEventListener('click', function () {
         toggleLoadingUnloading()
      });

      // make small icons visible or not depending on zoom level
      map.addListener('zoom_changed', function () {
         let zoom = map.getZoom()
         console.log('toggle on zoom fired -', zoom)
         toggleHandicap()
         toggleMunicipalGarages()
         togglePrivateGarages()
         toggleSmartMeters()
         toggleBlueTopMeters()
         toggleBrownTopMeters()
         toggleYellowTopMeters()
         toggleEVCharge()
         toggleMotorcycle()
         toggleBusLargeVehicle()
         toggleResidential()
         toggleLoadingUnloading()
      })
   })
   //  **************end of forEach Loop ***********************************************end of forEach Loop*****************

   //turn off residential and loading/unloading to start
   function startCondition() {
      console.log('start condition fired')
      if ((document.getElementById('toggleHandicap').checked) === true) {
         document.getElementById('toggleHandicap').click();
      }
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
      if ((document.getElementById('toggleEVCharge').checked) === true) {
         document.getElementById('toggleEVCharge').click();
      }
      if ((document.getElementById('toggleMotorcycle').checked) === true) {
         document.getElementById('toggleMotorcycle').click();
      }
      if ((document.getElementById('toggleBusLargeVehicle').checked) === true) {
         document.getElementById('toggleBusLargeVehicle').click();
      }
      if ((document.getElementById('toggleResidential').checked) === true) {
         document.getElementById('toggleResidential').click();
      }
      if ((document.getElementById('toggleLoadingUnloading').checked) === true) {
         document.getElementById('toggleLoadingUnloading').click();
      }
   }
   startCondition()

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
      if ((document.getElementById('toggleResidential').checked) === false) {
         document.getElementById('toggleResidential').click();
      }
      if ((document.getElementById('toggleLoadingUnloading').checked) === false) {
         document.getElementById('toggleLoadingUnloading').click();
      }
   };

   // turn all park assets off despite current state
   function hideAll() {
      console.log('show All fired')
      if ((document.getElementById('toggleHandicap').checked) === true) {
         document.getElementById('toggleHandicap').click();
      }
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
      if ((document.getElementById('toggleEVCharge').checked) === true) {
         document.getElementById('toggleEVCharge').click();
      }
      if ((document.getElementById('toggleMotorcycle').checked) === true) {
         document.getElementById('toggleMotorcycle').click();
      }
      if ((document.getElementById('toggleBusLargeVehicle').checked) === true) {
         document.getElementById('toggleBusLargeVehicle').click();
      }
      if ((document.getElementById('toggleResidential').checked) === true) {
         document.getElementById('toggleResidential').click();
      }
      if ((document.getElementById('toggleLoadingUnloading').checked) === true) {
         document.getElementById('toggleLoadingUnloading').click();
      }
   };





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



   // show all parking when zoomed in from search bar
   function toggleOnZoom() {
      if ((document.getElementById('toggleHandicap').checked) === true) {
         document.getElementById('toggleHandicap').click();
      }
      if ((document.getElementById('toggleMunicipalGarages').checked) === false) {
         document.getElementById('toggleMunicipalGarages').click();
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
      if ((document.getElementById('toggleYellowTopMeters').checked) === true) {
         document.getElementById('toggleYellowTopMeters').click();
      }
      if ((document.getElementById('toggleEVCharge').checked) === true) {
         document.getElementById('toggleEVCharge').click();
      }
      if ((document.getElementById('toggleMotorcycle').checked) === true) {
         document.getElementById('toggleMotorcycle').click();
      }
      if ((document.getElementById('toggleBusLargeVehicle').checked) === false) {
         document.getElementById('toggleBusLargeVehicle').click();
      }
      if ((document.getElementById('toggleResidential').checked) === true) {
         document.getElementById('toggleResidential').click();
      }
      if ((document.getElementById('toggleLoadingUnloading').checked) === true) {
         document.getElementById('toggleLoadingUnloading').click();
      }

   };

   function toggleZoomFeaturesOn() {
      if (map.zoom >= 17) {
         toggleOnZoom()
      }
   }

   //********************** toggle markers in street view*********************** */

   // create variables to store existing .clicked status of icons
   let varHan = ''
   let varMun = ''
   let varPri = ''
   let varSma = ''
   let varBlu = ''
   let varBro = ''
   let varYel = ''
   let varEvc = ''
   let varMot = ''
   let varBus = ''
   let varRes = ''
   let varLoa = ''

   // create variable for listener 
   let groundLevel = map.getStreetView()

   // listener toggles when street view is toggled visible/hidden
   google.maps.event.addListener(groundLevel, 'visible_changed', function () {
      // store existing state of .clicked for element icons and priceicons
      function storeState() {
         varHan = document.getElementById('toggleHandicap').checked
         varMun = document.getElementById('toggleMunicipalGarages').checked
         varPri = document.getElementById('togglePrivateGarages').checked
         varSma = document.getElementById('toggleSmartMeters').checked
         varBlu = document.getElementById('toggleBlueTopMeters').checked
         varBro = document.getElementById('toggleBrownTopMeters').checked
         varYel = document.getElementById('toggleYellowTopMeters').checked
         varEvc = document.getElementById('toggleEVCharge').checked
         varMot = document.getElementById('toggleMotorcycle').checked
         varBus = document.getElementById('toggleBusLargeVehicle').checked
         varRes = document.getElementById('toggleResidential').checked
         varLoa = document.getElementById('toggleLoadingUnloading').checked
      }

      // check stored state and if 'true' then click it back on
      function setPriorState() {

         if (varHan === true) {
            document.getElementById('toggleHandicap').click();
         }
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
         if (varEvc === true) {
            document.getElementById('toggleEVCharge').click();
         }
         if (varMot === true) {
            document.getElementById('toggleMotorcycle').click();
         }
         if (varBus === true) {
            document.getElementById('toggleBusLargeVehicle').click();
         }
         if (varRes === true) {
            document.getElementById('toggleResidential').click();
         }
         if (varLoa === true) {
            document.getElementById('toggleLoadingUnloading').click();
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
   })

   autocomplete.addListener('place_changed', function () {

      // addressinfowindow.close();
      // marker.setVisible(false);
      let place = autocomplete.getPlace();
      // If the place has a geometry, then present it on a map plus add 3 minute walk circle.
      if (place.geometry.viewport) {

         map.fitBounds(place.geometry.viewport);
         map.setZoom(17.2);  //about 1 block
         toggleZoomFeaturesOn()
         addWalkCircle()
         console.log(circleCount)
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
      setTimeout(function () { addressinfowindow.close(); }, 7000)

      if (circleCount <= 1) {
         addressinfowindow.open(map, marker);
         setTimeout(function () { addressinfowindow.close(); }, 7000)
         circleCount += 1;
      }
      // add walk circle function
      function addWalkCircle() {
         walkCircle.center = place.geometry.location
         walkCircle.setMap(map)
      }

      // reset search bar - pin - info window - walk circle
      function resetSearch() {
         addressinfowindow.close();
         marker.setVisible(false);
         walkCircle.setMap(null);

         map.setCenter({ lat: 44.478081, lng: -73.215 });
         map.setZoom(15)
         startCondition()
      }
      document.getElementById("searchbar-container").addEventListener('click', function () {
         document.getElementById('searchbar-input').value = "";
         resetSearch()
      })

   });

}
// resizeWindow()
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
}
// function closeModal() {
//   modal.style.display = "none"
// }

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
   modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}
// *************************************************************************************
// Disclaimer modal

// Get the modal
var disclaimerModal = document.getElementById("disclaimerModal");


// Get the <span> element that closes the modal
var disclaimerSpan = document.getElementsByClassName("disclaimer-accept")[0];

// When the user clicks on <span> (x), close the modal
disclaimerSpan.onclick = function () {
   disclaimerModal.style.display = "none";
}

// Legend open/close
var legendToggle = document.getElementById("toggle-key");
let legend = document.getElementById("map-legend")
let legendClose = document.getElementById("legend-close")
// let modalContent = document.getElementById("myModal")

legendToggle.addEventListener("click", function () {

   if (legend.style.display === "block") {
      legend.style.left = "-250px"
      setTimeout(() => {
         legend.style.display = "none";
      }, 200);
   } else {
      legend.style.display = "block";
      legend.style.left = "1vh"
   }
});

// modalContent.addEventListener("click", function() {

//   if (modalContent.style.display === "block") {
//     modalContent.style.bottom = "-55vh"
//     setTimeout(() => {
//       modalContent.style.display = "none";
//     }, 200);
//   } else {
//     modalContent.style.display = "block";
//     modalContent.style.bottom = "12vh"
//   }
// });


legendClose.addEventListener("click", function () {
   legend.style.display = "none";
});