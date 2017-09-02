import * as firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAeQC3le2ofB5iBkUCHWyYQ42D-Oi2020c",
   authDomain: "flexspace-bae45.firebaseapp.com",
   databaseURL: "https://flexspace-bae45.firebaseio.com",
   projectId: "flexspace-bae45",
   storageBucket: "flexspace-bae45.appspot.com",
   messagingSenderId: "118807203865",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

class Firebase {

    static loginWithEmail(email, password, callbackSuccess, callbackError){
      try {
        firebaseApp.auth().signInWithEmailAndPassword(email, password)
        .then((onResolveUser) => {
          callbackSuccess(onResolveUser);
        })
        .catch((errorLogin)=>{
          callbackError(errorLogin);
        });
      } catch(error) {
        console.log(error);
      }
    }

    static obtainUserRole(uid, callbackSuccess, callbackError){
      try {
        if (uid){
          let ref = firebaseApp.database().ref('users/'+uid);
          ref.once('value')
          .then((snapshot) =>{
            if (snapshot){
              callbackSuccess(snapshot);
            }else {
              callbackError('snapshot does not exist for uid: ' +uid);
            }
          })
          .catch((error) =>{
            callbackError(error);
          });
        }else {
          callbackError('invalid uid');
        }
      } catch (error) {
        console.log(error);
      }
    }

    static resetPassword(email, callbackSuccess, callbackError){
      try {
        firebaseApp.auth().sendPasswordResetEmail(email)
        .then(() => {
          callbackSuccess();
        })
        .catch((errorLogin)=>{
          callbackError(errorLogin);
        });
      } catch(error) {
        console.log(error);
      }
    }

}

module.exports = Firebase;
