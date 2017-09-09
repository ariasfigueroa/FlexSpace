import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Switch,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';

import Firebase from '../lib/Firebase';
import { NavigationActions } from 'react-navigation';
const {width, height} = Dimensions.get('window');

class AddDeposit extends Component {

  static navigationOptions = ({navigation}) => ({
    headerStyle: {
      backgroundColor: "rgba(43,43,43,1)",
    },
    headerTitle:(<Text style={{color: 'white', fontSize: 16}}>Agregar Depósito</Text>),
    gesturesEnabled: false,
    headerLeft: (<TouchableOpacity
      onPress={()=>{
                    const backAction = NavigationActions.back();
                    navigation.dispatch(backAction)
                  }
              }>
              <View style={{paddingLeft: 20}}>
                <Text style={{color: 'white', fontWeight: '500'}}>Cancelar</Text>
              </View>
    </TouchableOpacity>),
  });

  constructor(props){
    super(props);
    this.state={
      showActivityIndicator: true,
      schedule: null,
      depositNumber: '',
      monto: '',
    }
  }
  convertToDollars(n, currency) {
    return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }

  componentWillMount(){
    console.log(this.props.navigation.state.params.schedule);
    console.log(this.props.navigation.state.params.clienteKey);
    this.setState({schedule: this.props.navigation.state.params.schedule, showActivityIndicator: false})
  }

  saveDeposit(){
    if (this.state.depositNumber && this.state.monto && this.state.schedule){
      var transferencia = {};
      transferencia['fechaPago'] = this.state.schedule.fechaPago;

      var currentDate = new Date();
      var fechaTransferencia = (currentDate.getDate() + '/' + (currentDate.getMonth()+1) + '/' + currentDate.getFullYear());
      var horaTransferencia = (currentDate.getHours() + ':' + currentDate.getMinutes());

      transferencia['fechaTransferencia'] = fechaTransferencia;
      transferencia['horaTransferencia'] = horaTransferencia;
      transferencia['monto'] = this.state.monto;
      transferencia['transferencia'] = this.state.depositNumber;

      Firebase.saveDeposit(transferencia, this.props.navigation.state.params.clienteKey, ()=>{
        // update schedule
        Firebase.updateSchedule(this.state.schedule, this.props.navigation.state.params.clienteKey, ()=>{
          Alert.alert('Depósito', 'Transferencia guardada satisfactoriamente.',  [ {text: 'Ok', onPress: () => {
            this.props.navigation.state.params.callback();
            const backAction = NavigationActions.back();
            this.props.navigation.dispatch(backAction);
          }},],  { cancelable: false });
        }, (errorUpdateSchedule)=>{
          console.log(errorUpdateSchedule);
        });
      }, (error)=>{
        console.log(error);
      })
    } else {
      Alert.alert('Error', 'Transferencia y Montos son requeridos.',  [ {text: 'Ok', onPress: () => {
        console.log('validacion.');
      }},],  { cancelable: false });
    }
  }

  render(){
    if (this.state.showActivityIndicator){
      return(
        <View style={styles.containerActivityIndicator}>
          <StatusBar
             barStyle="light-content"
          />
          <ActivityIndicator
            animating={this.state.showActivityIndicator}
            style={{height: 80}}
            size="large"
          />
        </View>
      )
    } else {
      return(
        <KeyboardAvoidingView
          behavior='padding'
          style={styles.container}
        >
          <StatusBar
             barStyle="light-content"
          />

        {this.state.schedule ? (
        <View style={styles.containerAdmin}>
          <View>
            <Text style={styles.balanceAmountStyle}>{this.convertToDollars(parseFloat(this.state.schedule && this.state.schedule.monto ? this.state.schedule.monto : 0.0), '$')}</Text>
          </View>
          <View>
            <Text>BALANCE PENDIENTE</Text>
          </View>
          <View style={[styles.verticalAligning, {alignItems: 'center', justifyContent: 'center', marginTop: 20}]}>
          <Text>
            Balance Pagado:
          </Text>
            <Switch
            value={this.state.schedule.pagado}
              onValueChange={()=>{
                var currentSchedule = this.state.schedule;
                currentSchedule.pagado = !currentSchedule.pagado;
                this.setState({schedule: currentSchedule});
              }}
            />
          </View>
          <View style={{borderRadius: 6, borderWidth: 0.3, borderColor: 'grey', padding: 3, marginTop: 20, width: width - 20, marginHorizontal: 20, height: 44}}>
            <TextInput style={styles.textInputStyle}
               autoCapitalize= {'none'}
               autoCorrect={false}
               placeholder= {'# Transferencia'}
               onChangeText={(depositNumber) => this.setState({depositNumber})}
               returnKeyType={'go'}
               keyboardType={'default'}
               value={this.state.depositNumber}
            />
          </View>
          <View style={{borderRadius: 6, borderWidth: 0.3, borderColor: 'grey', padding: 3, marginTop: 20, width: width - 20, marginHorizontal: 20, height: 44}}>
            <TextInput style={styles.textInputStyle}
               autoCapitalize= {'none'}
               autoCorrect={false}
               placeholder= {'$ 0.00'}
               onChangeText={(monto) => this.setState({monto})}
               returnKeyType={'go'}
               keyboardType={'default'}
               value={this.state.monto}
            />
          </View>

          <TouchableOpacity
            onPress={this.saveDeposit.bind(this)}
          >
            <View>
              <Text style={styles.textInsideButtons}>
                Guardar
              </Text>
            </View>
          </TouchableOpacity>

        </View>) : (
            <View>
              <Text>No hay datos del deposito.</Text>
            </View>)
          }
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
  containerActivityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  containerAdmin: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  verticalAligning: {
    flexDirection: 'row',
  },
  balanceAmountStyle: {
    color: '#959595',
    textAlign: 'center',
    fontSize: 30,

  },
  textInputStyle: {
    height: 40,
    paddingLeft: 10,
  },
  loginButtonContainer:{
    width: width - 100,
    height: 44,
    backgroundColor: '#6AB817',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  textInsideButtons:{
    marginTop: 40,
    color: '#C2272F',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
});

export default AddDeposit;
