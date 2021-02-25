


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