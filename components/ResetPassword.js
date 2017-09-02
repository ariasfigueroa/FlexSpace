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

import { NavigationActions } from 'react-navigation';
import Firebase from '../lib/Firebase';
const {width, height} = Dimensions.get('window');

class ResetPassword extends Component {

  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor(props){
    super(props);
    this.state = {
      userName: '',
      errorMessage: null,
      showActivityIndicator: false,
    }
    this._resetErrors = this._resetErrors.bind(this)
    this.goBack = this.goBack.bind(this);
  }

  _resetErrors(){
    if (this.state.errorMessage)
      this.setState({errorMessage: null})
  }

  resetPassword(){
    try{
      if (this.state.userName){
        this.setState({
          showActivityIndicator: !this.state.showActivityIndicator
        });
        Firebase.resetPassword(this.state.userName, () => {
          Alert.alert('Contraseña', 'Te enviamos un correo a: ' + this.state.userName, [ {text: 'OK', onPress: () => {
            this.setState({
              showActivityIndicator: !this.state.showActivityIndicator
            });
            this.goBack();
          }, style: 'cancel'}],  { cancelable: false });

        }, (error) => {
          this.setState({errorMessage: error});
        });
      } else {
        this.setState({errorMessage: 'Correo Electrónico es requerido.'});
      }
    } catch(error){
      this.setState({errorMessage: error.message});
    }
  }

  goBack(){
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction)
  }

  render(){
    if (this.state.showActivityIndicator){
      return(
        <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
        />
          <Image
            style={styles.backgroundImage}
            source={require('../resources/img/FlexSpaceBackGround.png')}
          />
          <View style={styles.containerAbsolute}>
            <ActivityIndicator
              animating={this.state.showActivityIndicator}
              style={{height: 80}}
              size="large"
            />
          </View>
        </View>
      );
    } else {
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
            behavior='padding'
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
                <View style={[styles.loginField]}>
                  <TextInput style={styles.textInputStyle}
                     autoCapitalize= {'none'}
                     autoCorrect={false}
                     placeholder= {'Correo Electrónico'}
                     onChangeText={(userName) => this.setState({userName})}
                     returnKeyType={'next'}
                     keyboardType={'email-address'}
                     ref={(userNameInput) => this.userNameInput = userNameInput}
                     value={this.state.userName}
                     onFocus={this._resetErrors}
                  />
                </View>
              </View>

              <View style={styles.loginButtonContainer}>
                <TouchableOpacity style={styles.loginButtonStyle}
                  onPress={this.resetPassword.bind(this)}
                >
                 <Text style={styles.textInsideButtons}>
                   Enviar nueva contraseña
                 </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.forgotPasswordButtonStyle}>
                <TouchableOpacity
                  onPress={()=>{
                    this.goBack();
                  }
                }>
                  <Text style={styles.textInsideButtons}>
                    Cancelar
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

}

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
    height:50,
    backgroundColor: "rgba(255,255,255,0.80)",
    borderRadius: 5,
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
    marginTop: 40,
  },
  textInsideButtons:{
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
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

export default ResetPassword;
