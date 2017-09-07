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

    static obtainClients(callbackSuccess, callbackError){
      try {
          let ref = firebaseApp.database().ref('cliente/');
          ref.once('value')
          .then((snapshot) =>{
            if (snapshot){
              callbackSuccess(snapshot);
            }else {
              callbackError('snapshot does not exist for clientes');
            }
          })
          .catch((error) =>{
            callbackError(error);
          });
      } catch (error) {
        console.log(error);
      }
    }

    static obtainClient(clienteKey, callbackSuccess, callbackError){
      try {
          if (clienteKey){
            let ref = firebaseApp.database().ref('cliente/'+clienteKey);
            ref.once('value')
            .then((snapshot) =>{
              if (snapshot){
                callbackSuccess(snapshot);
              }else {
                callbackError('snapshot does not exist for cliente: ' + clienteKey);
              }
            })
            .catch((error) =>{
              callbackError(error);
            });
          } else {
            callbackError('no clienteKey provided');
          }
      } catch (error) {
        console.log(error);
      }
    }

    static obtainSchedule(clienteKey, callbackSuccess, callbackError){
      try {
          if (clienteKey){
            let ref = firebaseApp.database().ref('calendarioPagos/'+clienteKey+'/enviarNotificacion/schedulle');
            ref.once('value')
            .then((snapshot) =>{
              if (snapshot){
                callbackSuccess(snapshot);
              }else {
                callbackError('snapshot does not exist for calendarioPagos/'+clienteKey+'/enviarNotificacion/schedulle');
              }
            })
            .catch((error) =>{
              callbackError(error);
            });
          } else {
            callbackError('no clienteKey provided');
          }
      } catch (error) {
        console.log(error);
      }
    }

    static obtainDepositos(clienteKey, callbackSuccess, callbackError){
      try {
          if (clienteKey){
            let ref = firebaseApp.database().ref('depositos/'+clienteKey+'/transferencias');
            ref.once('value')
            .then((snapshot) =>{
              if (snapshot){
                callbackSuccess(snapshot);
              }else {
                callbackError('snapshot does not exist for calendarioPagos/'+clienteKey+'/enviarNotificacion/schedulle');
              }
            })
            .catch((error) =>{
              callbackError(error);
            });
          } else {
            callbackError('no clienteKey provided');
          }
      } catch (error) {
        console.log(error);
      }
    }


  static requestNewAccount(object, callbackSuccess, callbackError){
    try {
      if (object){
        let uid = Firebase.uuidv4();
        object['estatus'] = 'solicitud_enviada';
        let ref = firebaseApp.database().ref('solicitud_cuenta/'+uid);
        ref.set(object)
        .then(() => {
          callbackSuccess();
        })
        .catch((error) => {
          callbackError(error);
        });
      }else {
        callbackError('invalid/null object');
      }
    } catch (error) {
      console.log(error);
    }
  }

  static uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

static logOut(callbackSuccess){
  try {
    firebaseApp.auth().signOut().then((onResolve) => {
      callbackSuccess();
    }, (onReject) => {
      console.log(onReject)
    } )
  } catch (error) {
    console.log(error)
  }
}

static obtainRequestedAccounts (callbackSuccess, callbackError){
  try {
    var ref = firebaseApp.database().ref('solicitud_cuenta');
    ref.once('value')
    .then((snapshot)=>{
      if (snapshot){
        callbackSuccess(snapshot);
      } else {
        callbackError('No requested accounts');
      }
    })
    .catch((error)=>{
      callbackError(error);
    });
  }catch (error){
    callbackError(error);
  }
}

static rejectAccount(item, callbackSuccess, callbackError){
  try {
    var ref = firebaseApp.database().ref('solicitud_cuenta/'+item.key);
    ref.update(item)
    .then(()=>{
      callbackSuccess();
    })
    .catch((error)=>{
      callbackError(error);
    });
  } catch(error){
    callbackError(error);
  }
}

}

module.exports = Firebase;
