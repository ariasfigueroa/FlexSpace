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
    headerRight: (<TouchableOpacity
      onPress={()=>{
                    console.log('Guardar');
                  }
              }>
              <View style={{paddingRight: 20}}>
                <Text style={{color: 'white', fontWeight: '500'}}>Guardar</Text>
              </View>
    </TouchableOpacity>),
  });

  constructor(props){
    super(props);
    this.state={
      showActivityIndicator: true,
      schedule: null,
    }
  }
  convertToDollars(n, currency) {
    return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }

  componentWillMount(){
    this.setState({schedule: this.props.navigation.state.params.schedule, showActivityIndicator: false})
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
        <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
        />
        <ScrollView>
        <View style={styles.containerAdmin}>
        {this.state.schedule ? (
        <View style={styles.dialogContentView}>
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
          <View>
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
        </View>) : (
            <View style={styles.dialogContentView}>
              <Text>No hay datos del deposito.</Text>
            </View>)
          }
        </View>
        </ScrollView>
        </View>
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
  containerContract: {
    width,
    height: 120,
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerAdmin: {
    width,
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalAligning: {
    flexDirection: 'row',
  },
  verticalAligningSelected: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#C2272F'
  },
  textButtonAccountAndClients: {
    color: '#21243D',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    marginLeft: 5,
  },
  containerAccountsAndClientsList: {
    marginTop: 20,
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainerAccountsAndClientsList: {
    width: width - 20,
    height: 60,
    backgroundColor: '#E4E4E4',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainerClients: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 20,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  clientDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientDataTextContainer:{
    marginHorizontal: 10,
  },
  clientDataTextStyle:{
    color: '#21243D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  balanceAmountStyle: {
    color: '#959595',
    textAlign: 'center',
    fontSize: 30,

  },
});

export default AddDeposit;
