import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  StatusBar,
  AppRegistry,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

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

const {width, height} = Dimensions.get('window');
class FlexSpaceApp extends Component{

  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      userName: '',
      password: '',
      errorMessage: null,
      showActivityIndicator: false,
    }
    this._resetErrors = this._resetErrors.bind(this)
    this._getTextInputRefs = this._getTextInputRefs.bind(this)
  }

    componentDidMount() {
      FCM.requestPermissions(); // for iOS
      FCM.getFCMToken().then(token => {
          console.log('Token: ', token)
          // store fcm token in your server
      });

      this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
          // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
          if(notif.local_notification){
            //this is a local notification
            console.log("Notification recived local", "local notification");
            return;
          }
          if(notif.opened_from_tray){
            console.log("Notification recived tray ", "opened from tray");
            return;
          }
          await this.showAlert(notif);

          if(Platform.OS ==='ios'){
            //optional
            //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
            //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
            //notif._notificationType is available for iOS platfrom
            switch(notif._notificationType){
              case NotificationType.Remote:
                notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                break;
              case NotificationType.NotificationResponse:
                notif.finish();
                break;
              case NotificationType.WillPresent:
                notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                break;
            }
          }
      });
      this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
          console.log(token)
          // fcm token may not be available on first load, catch it here
      });
      }

      componentWillUnmount() {
          // stop listening for events
          this.notificationListener.remove();
          this.refreshTokenListener.remove();
      }

    _getTextInputRefs(){
      return [this.userNameInput, this.passwordInput]
    }

    _resetErrors(){
      if (this.state.errorMessage)
        this.setState({errorMessage: null})
    }

    async showAlert(notification){
        // Here goes to code to call
        console.log(notification);
    }

    login(){
      try {
        if (this.state.userName && this.state.password){
          this.setState({showActivityIndicator: true})
          firebaseApp.auth().signOut().then((onResolve)=> {
            firebaseApp.auth().signInWithEmailAndPassword(this.state.userName, this.state.password).then((onResolveUser) => {
              setTimeout(()=>{
                this.setState({showActivityIndicator: false})
                this._navigate('home')
              }, 1000);
            }, (onRejectUser)=>{
              this.setState({showActivityIndicator: false})
              console.log(onRejectUser)
            })
          }, (onReject) => {
            this.setState({showActivityIndicator: false})
            console.log(onReject)
          })
        } else {
          this.setState({errorMessage: 'Correo Eletrónico y Contraseña requeridos.'})
        }
      } catch (error) {
        console.log(error);
        this.setState({errorMessage: error.message})
      }
    }

  render(){
    return(
      <View style={styles.container}>
      <StatusBar
         barStyle="light-content"
      />
        <Image
          style={styles.backgroundImage}
          source={require('../resources/img/FlexSpaceBackGround.png')}
        />
        <KeyboardAvoidingView
          behavior='position'
          style={styles.containerAbsolute}
        >
          <View style={styles.textInputViewStyle}>
            <View style={styles.logoView}>
              <Image
                style={styles.logo}
                source={require('../resources/img/flexLogo.png')}
              />
            </View>
            <View style={styles.loginView}>
              <View style={[styles.loginField, styles.loginDivisor]}>
                <TextInput style={styles.textInputStyle}
                   autoCapitalize= {'none'}
                   autoCorrect={false}
                   placeholder= {'Correo Electrónico'}
                   onChangeText={(userName) => this.setState({userName})}
                   returnKeyType={'next'}
                   keyboardType={'email-address'}
                   ref={(userNameInput) => this.userNameInput = userNameInput}
                   onSubmitEditing={() => this.passwordInput.focus()}
                   value={this.state.userName}
                   onFocus={this._resetErrors}
                />
              </View>
              <View style={[styles.loginField]}>
                <TextInput style={styles.textInputStyle}
                  autoCapitalize= {'none'}
                  autoCorrect={false}
                  placeholder= {'Contraseña'}
                  onChangeText={(password) => this.setState({password})}
                  returnKeyType={'go'}
                  secureTextEntry={true}
                  keyboardType={'default'}
                  ref={(passwordInput) => this.passwordInput = passwordInput}
                  value={this.state.password}
                  onFocus={this._resetErrors}
                />
              </View>
            </View>
            <View style={styles.forgotPasswordButtonStyle}>
              <TouchableOpacity
                onPress={()=>{
                console.log('reset pass');
                }
              }>
                <Text style={styles.textButtons}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.loginButtonContainer}>
              <TouchableOpacity style={styles.loginButtonStyle}
                onPress={this.login.bind(this)}
              >
               <Text style={styles.textInsideButtons}>
                 Iniciar Sesión
               </Text>
              </TouchableOpacity>
            </View>

            {this.state.errorMessage ? <Text style={styles.errorMessageStyle}> {this.state.errorMessage} </Text> : null}
            </View>
          </KeyboardAvoidingView>
      </View>
    );
  }
}

export default FlexSpaceApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  backgroundImage:{
    width,
    height,
  },
  containerAbsolute:{
    position: 'absolute',

  },
  textInputViewStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    height: 40,
    paddingLeft: 10,
  },
  loginView: {
    width: width - 100,
    height:100,
    backgroundColor: "rgba(255,255,255,0.80)",
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoView: {
    width: 180,
    height:100,
    backgroundColor: "rgba(255,255,255,0.80)",
    borderRadius: 10,
    marginBottom: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 162,
    height: 90,
  },
  loginField:{
    backgroundColor: 'transparent',
    width: width - 100,
    height:40,
    borderRadius: 5,
},
loginDivisor:{
  borderBottomWidth: 0.3,
},
forgotPasswordButtonStyle: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
},
textButtons: {
  color: '#FFFFFF',
  fontSize: 16,
  fontStyle: 'italic',
  fontWeight: '400',
  backgroundColor: 'transparent',
},
loginButtonContainer:{
  width: width - 100,
  height:44,
  backgroundColor: '#C2272F',
  borderRadius: 5,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 80,
},
textInsideButtons:{
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
},
errorMessageStyle: {
  marginTop: 20,
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '500',
  textAlign: 'center',
  fontStyle: 'italic',
  backgroundColor: 'transparent',
},
});

export const Stack = StackNavigator({
  FlexSpaceApp: {
    screen: FlexSpaceApp,
  }
}
);

AppRegistry.registerComponent('FlexSpace', () => Stack);
