//********************** Turn off markers in street view*********************** */


let groundLevel = map.getStreetView()

google.maps.event.addListener(groundLevel, 'visible_changed', function () {

   let varHan = document.getElementById('toggleHandicap').checked
   let varMun = document.getElementById('toggleMunicipalGarages').checked
   let varPri = document.getElementById('togglePrivateGarages').checked
   let varSma = document.getElementById('toggleSmartMeters').checked
   let varBlu = document.getElementById('toggleBlueTopMeters').checked
   let varBro = document.getElementById('toggleBrownTopMeters').checked
   let varYel = document.getElementById('toggleYellowTopMeters').checked
   let varEvc = document.getElementById('toggleEVCharge').checked
   let varMot = document.getElementById('toggleMotorcycle').checked
   let varBus = document.getElementById('toggleBusLargeVehicle').checked
   let varRes = document.getElementById('toggleResidential').checked
   let varLoa = document.getElementById('toggleLoadingUnloading').checked

   let priorState = [
      varMun,
      varPri,
      varSma,
      varBlu,
      varBro,
      varYel,
      varEvc,
      varMot,
      varBus,
      varRes,
      varLoa
   ]

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


   if (groundLevel.getVisible()) {
      hideAll()
      console.log(priorState)
   } else {
      // set elements to prior
       setPriorState()
      console.log('view reset')
   }

}


)






// var thePanorama = map.getStreetView();

// google.maps.event.addListener(thePanorama, 'visible_changed', function () {

//    if (thePanorama.getVisible()) {

//       //Street view loads

//       //enlarge markers to make them show betetr in street view
//       for (var i = 0; i < gmarkers.length; i++) {
//          var oldIcon = gmarkers[i].getIcon();
//          var newIcon = { url: oldIcon.url, scaledSize: new google.maps.Size(60, 102) };
//          gmarkers[i].setIcon(newIcon);
//       }


//       //Get nearest visible marker
//       var nearestMarker = gmarkers.reduce(function (prev, curr) {

//          if (curr.getVisible()) {

//             var cpos = google.maps.geometry.spherical.computeDistanceBetween(thePanorama.position, curr.position);
//             var ppos = google.maps.geometry.spherical.computeDistanceBetween(thePanorama.position, prev.position);

//             return cpos < ppos ? curr : prev;

//          }
//          else {

//             return prev;

//          }

//       })


//       var path = [thePanorama.getPosition(), nearestMarker.getPosition()];
//       var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);

//       //point the street view heading
//       thePanorama.setPov({
//          heading: heading,
//          pitch: 0
//       });




//    }
//    else {

//       //Street view unloaded, return markers to original size

//       alert(thePanorama.getVisible())

//       for (var i = 0; i < gmarkers.length; i++) {
//          var oldIcon = gmarkers[i].getIcon();
//          var newIcon = { url: oldIcon.url, scaledSize: new google.maps.Size(20, 34) };
//          gmarkers[i].setIcon(newIcon);
//       }

//    }

// })