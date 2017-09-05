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
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconSimpleLine from 'react-native-vector-icons/SimpleLineIcons';
import Firebase from '../lib/Firebase';
import { NavigationActions } from 'react-navigation';
const {width, height} = Dimensions.get('window');

class Admin extends Component {

  static navigationOptions = ({navigation}) => ({
    headerStyle: {
      backgroundColor: "rgba(43,43,43,1)",
    },
    headerTitle:(<Text style={{color: 'white', fontSize: 16}}>Administrador</Text>),
    gesturesEnabled: false,
    headerLeft: (<TouchableOpacity
      onPress={()=>{
                      Firebase.logOut(()=>{
                        const backAction = NavigationActions.back();
                        navigation.dispatch(backAction)
                      });
                  }
              }>
              <View style={{paddingLeft: 20}}>
                <IconSimpleLine
                  name= "logout"
                  color= "#FFFFFF"
                  size={20}
                />
              </View>
    </TouchableOpacity>),
  });

  constructor(props){
    super(props);
    this.state={
      accountsOrClientsSelected: 'C',
      showActivityIndicator: true,
      clientes: [{key: 1}],
      cuentasPendientes: [{key: 1}],
    }
  }

  componentDidMount(){
    try {
      Firebase.obtainClients((snapshot)=>{
        if(snapshot){
          var clientes = [];
          var index = 0;
          snapshot.forEach((item)=>{
            index ++;
            var itemL = item.val();
            itemL['key'] = item.key;
            clientes.push(itemL);
            console.log(itemL);

            if (index === snapshot.numChildren()){
              // request accounts
              this.setState({clientes, showActivityIndicator: false})
            }
          })
        }else {
          console.log('No hay clientes');
        }
      }, (error)=>{
        console.log(error);
      });

    } catch(error){
      console.log(error);
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
      const clientesList = this.state.clientes
      .map((item)=>{
          return(
            <View style={styles.itemContainerAccountsAndClientsList} key={item.key}>
              <View style={styles.itemContainerClients}>
                <View style={styles.clientDataContainer}>
                  <View style={styles.clientDataTextContainer}>
                    <Text style={styles.clientDataTextStyle}>{item.nombre}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={()=>{
                    this.props.navigation.navigate('ClientScreen', {role: 'admin', cliente: item.key})
                  }}
                >
                  <Text style={[styles.clientDataTextStyle, {color: 'green'}]}> Abrir </Text>
                </TouchableOpacity>

              </View>
            </View>
          );
      });

      const cuentasList = this.state.cuentasPendientes
      .map((item)=>{
          return(
            <View style={styles.itemContainerAccountsAndClientsList} key={item.key}>
              <View style={styles.itemContainerClients}>
                <View style={styles.clientDataContainer}>
                  <View style={styles.clientDataTextContainer}>
                    <Text style={styles.clientDataTextStyle}>Barcel</Text>
                  </View>
                  <View style={styles.clientDataTextContainer}>
                    <Text style={styles.clientDataTextStyle}>ariasfigueroa@gmail.com</Text>
                  </View>
                </View>
                </View>
                <View style={[styles.itemContainerClients, {marginTop: 10}]}>
                  <View style={styles.clientDataContainer}>
                    <View style={styles.clientDataTextContainer}>
                      <TouchableOpacity
                        onPress={()=>{
                          console.log('aceptar');
                        }}
                      >
                      <Text style={[styles.clientDataTextStyle, {color: 'green'}]}>Aceptar</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.clientDataTextContainer}>
                      <TouchableOpacity
                        onPress={()=>{
                          console.log('rechazar');
                        }}
                      >
                      <Text style={[styles.clientDataTextStyle]}>Rechazar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
            </View>
          );
      });
      return(
        <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
        />
        <ScrollView>
        <View style={styles.containerAdmin}>
          <View style={styles.verticalAligning}>
            <TouchableOpacity
            onPress={()=>{
              if (this.state.accountsOrClientsSelected !== 'C')
                this.setState({accountsOrClientsSelected: 'C'});
            }}
            >
              <View style={this.state.accountsOrClientsSelected === 'C' ? styles.verticalAligningSelected :styles.verticalAligning}>
                <IconFontAwesome
                  name="building-o"
                  size={18}
                  color="#21243D"
                />
                <Text style={styles.textButtonAccountAndClients}>Clientes</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{
              if (this.state.accountsOrClientsSelected !== 'A')
                this.setState({accountsOrClientsSelected: 'A'});
            }}
            style={{marginLeft: 30}}>
              <View style={this.state.accountsOrClientsSelected === 'A' ? styles.verticalAligningSelected :styles.verticalAligning}>
                <Icon
                  name="users"
                  size={18}
                  color="#21243D"
                />
                <Text style={styles.textButtonAccountAndClients}>Cuentas</Text>
              </View>
            </TouchableOpacity>
          </View>
          {this.state.accountsOrClientsSelected === 'C' ? (
            <View style={styles.containerAccountsAndClientsList}>
              {clientesList}
            </View>
          ) : (
            <View style={styles.containerAccountsAndClientsList}>
              {cuentasList}
            </View>
          )}
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
});

export default Admin;
