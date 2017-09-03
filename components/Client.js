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
  StatusBar,
  ActivityIndicator,
} from 'react-native';


import Icon from 'react-native-vector-icons/Entypo';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import CachedImage from 'react-native-cached-image';
import Firebase from '../lib/Firebase';

const {width, height} = Dimensions.get('window');

class Client extends Component {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "rgba(43,43,43,1)",
    },
    gesturesEnabled: false,
    headerTitle: (
      <Image style={{width: 28, height: 30}} source={require('../resources/img/logoIconWhite.png')}/>
    ),
    headerLeft: (<TouchableOpacity
      onPress={()=>{
                  console.log('show menu.')
                  }
              }>
              <View style={{paddingLeft: 20}}>
                <Icon
                  name= "menu"
                  color= "#FFFFFF"
                  size={28}
                />
              </View>
    </TouchableOpacity>),
    headerRight: (
      <View style={{flexDirection: 'row', marginRight: 20, alignItems: 'flex-end'}}>

      <TouchableOpacity
        style={{marginRight: 30}}
          onPress={()=>{
            console.log('emailing');
          }
        }
        >
          <View>
            <Icon
              name="mail"
              size={25}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
              console.log('caling');
            }
          }
        >
        <View>
          <Icon
            name="phone"
            size={25}
            color="#FFFFFF"
          />
        </View>
        </TouchableOpacity>

    </View>)
  };

  constructor(props){
      super(props);
      this.state = {
        settlementOrContractSelected: 'D',
        clienteKey: 'barcel',
        role: 'cliente',
        showActivityIndicator: true,
        client: null,
        schedule: null,
        depositos: null,
      }
  }

  componentDidMount(){
    try {
      if (this.state.clienteKey && this.state.role){
        // get client data
        Firebase.obtainClient(this.state.clienteKey, (snapshot)=>{
          Firebase.obtainSchedule(this.state.clienteKey, (snapshotSchedule)=>{
            var currentSchedule = null;
            var index = 0;
            snapshotSchedule.forEach((item)=>{
              index ++;
              var date = new Date(item.child('fechaPago').val());
              var currentDate = new Date();
              var status = item.child('estado').val();
              if (status === 'no_enviado' && (currentDate.getMonth()+1 === date.getMonth()+1)){
                currentSchedule = item.val();
                currentSchedule['fechaPago'] = (date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear());
              }
              if (index === snapshotSchedule.numChildren()){
                Firebase.obtainDepositos(this.state.clienteKey, (snapshotDepositos)=>{
                  var indexDepositos = 0;
                  var depositos = [];
                  snapshotDepositos.forEach((itemDeposito)=>{
                    indexDepositos ++;
                    var item = itemDeposito.val();
                    item['key'] = indexDepositos-1;
                    depositos.push(item);
                    if (indexDepositos === snapshotDepositos.numChildren()){
                      console.log(depositos);
                      this.setState({cliente: snapshot.val(), schedule: currentSchedule, depositos, showActivityIndicator: false});
                    }
                  });
                }, (errorDepositos)=>{
                  console.log(errorDepositos);
                });
              }
            });
          }, (errorSchedule)=>{
            console.log(errorSchedule);
          });
        }, (error)=>{
          console.log(error);
        })
      } else  {
        console.log('no client like that');
      }
    }catch(error){
      console.log(error);
    }
  }

  convertToDollars(n, currency) {
    return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }

  render(){
    if (this.state.showActivityIndicator ){
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
      const depositosList = this.state.depositos
      .map((item)=>{
        if (this.state.role === 'cliente'){
          return(
            <View style={styles.itemContainerSettlementsAndContractList} key={item.key}>
              <View style={styles.itemContainerSettlements}>
                <View style={styles.depositDataContainer}>
                  <IconMaterialCommunityIcons
                    name="arrow-top-right"
                    size={40}
                    color="#6AB817"
                  />
                  <View style={styles.depositDataTextContainer}>
                    <Text style={styles.depositDataTextStyle}>Transf. # {item.transferencia}</Text>
                    <Text style={styles.depositDataTextDateStyle}>{item.fechaTransferencia} {item.horaTransferencia}</Text>
                  </View>

                </View>
                <Text style={styles.depositDataTextStyle}>+ {this.convertToDollars(parseFloat(item.monto ? item.monto : 0.0), '$')}</Text>
              </View>
            </View>
          );
        } else {
          return(
            <View style={styles.itemContainerSettlementsAndContractList} key={item.key}>
              <TouchableOpacity>
                  <View style={styles.itemContainerSettlements}>
                    <View style={styles.depositDataContainer}>
                      <IconMaterialCommunityIcons
                        name="arrow-top-right"
                        size={40}
                        color="#6AB817"
                      />
                      <View style={styles.depositDataTextContainer}>
                        <Text style={styles.depositDataTextStyle}>Transf. # {item.transferencia}</Text>
                        <Text style={styles.depositDataTextDateStyle}>{item.fechaTransferencia} {item.horaTransferencia}</Text>
                      </View>

                    </View>
                    <Text style={styles.depositDataTextStyle}>+ {this.convertToDollars(parseFloat(item.monto ? item.monto : 0.0), '$')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
          );
        }
      });
      return(
        <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
        />
        <ScrollView>
          <View style={styles.containerHeader}>
            <View style={styles.avaterContainer}>
              <CachedImage
                resizeMode={'contain'}
                source={{uri: this.state.cliente.imagenUrl}}
                style={styles.imageAvatar}
              />
            </View>
            <View>
              <Text style={styles.balanceStyle}>BALANCE PENDIENTE</Text>
            </View>
            <View>
              <Text style={styles.balanceAmountStyle}>{this.convertToDollars(parseFloat(this.state.schedule.monto ? this.state.schedule.monto : 0.0), '$')}</Text>
            </View>
            <View>
              <Text style={styles.dueDateStyle}>vence {this.state.schedule.fechaPago}</Text>
            </View>
          </View>
          <View style={styles.containerAddress}>
            <View style={styles.addressContentStyle}>
              <Text style={[styles.textAddressStyle, {marginLeft: 20}]}>{this.state.cliente.calle}</Text>
              <Text style={[styles.textAddressStyle, {marginRight: 20}]}>{this.state.cliente.m2} M2</Text>
            </View>
          </View>
          <View style={styles.containerContract}>
            <View style={styles.subcontainerContract}>
              <View style={styles.contactBoxStyle}>
                <Text style={styles.contactBoxTitleStyle}>INCREMENTO</Text>
                <Text style={[styles.contactBoxTitleStyle, {fontWeight: 'bold'}]}>{this.state.cliente.incremento}</Text>
              </View>
              <View style={styles.contactBoxStyle}>
                <Text style={styles.contactBoxTitleStyle}>FECHA PARA INCREMENTO</Text>
                <Text style={[styles.contactBoxTitleStyle, {fontWeight: 'bold'}]}>{this.state.cliente.fechaIncremento}</Text>
              </View>
              <View style={styles.contactBoxStyle}>
                <Text style={styles.contactBoxTitleStyle}>VIGENCIA</Text>
                <Text style={[styles.contactBoxTitleStyle, {fontWeight: 'bold'}]}>{this.state.cliente.vigenciaContrato}</Text>
              </View>
            </View>
          </View>
          <View style={styles.containerSettlements}>
            <View style={styles.containerSettlementsAndContract}>
              <TouchableOpacity
              onPress={()=>{
                if (this.state.settlementOrContractSelected !== 'D')
                  this.setState({settlementOrContractSelected: 'D'});
              }}
              >
                <View style={this.state.settlementOrContractSelected === 'D' ? styles.verticalAligningSelected :styles.verticalAligning}>
                  <Icon
                    name="credit-card"
                    size={18}
                    color="#21243D"
                  />
                  <Text style={styles.textButtonSettlementsAndContract}>Depositos</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={()=>{
                if (this.state.settlementOrContractSelected !== 'C')
                  this.setState({settlementOrContractSelected: 'C'});
              }}
              style={{marginLeft: 30}}>
                <View style={this.state.settlementOrContractSelected === 'C' ? styles.verticalAligningSelected :styles.verticalAligning}>
                  <Icon
                    name="text-document"
                    size={18}
                    color="#21243D"
                  />
                  <Text style={styles.textButtonSettlementsAndContract}>Contrato</Text>
                </View>
              </TouchableOpacity>
            </View>
            {this.state.settlementOrContractSelected === 'D' ? (
              <View style={styles.containerSettlementsAndContractList}>
                {depositosList}
              </View>
            ) : (
              <View style={styles.containerSettlementsAndContractList}>
                <TouchableOpacity>
                <View style={styles.itemContainerSettlementsAndContractList}>
                  <View style={styles.itemContainerSettlements}>
                    <View style={styles.depositDataContainer}>
                      <IconFontAwesome
                        name="file-pdf-o"
                        size={40}
                        color="black"
                      />
                      <View style={styles.depositDataTextContainer}>
                        <Text style={styles.depositDataTextStyle}>{this.state.cliente.contratoNombre}</Text>
                        <Text style={styles.depositDataTextDateStyle}>Última actualización: {this.state.cliente.ultimaActualizacionContrato}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                </TouchableOpacity>
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
  },
  containerActivityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  containerHeader: {
    width,
    height: 160,
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerAddress: {
    width,
    height: 40,
    backgroundColor: '#21243D',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerContract: {
    width,
    height: 120,
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSettlements: {
    width,
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avaterContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: 'rgba(43,43,43,1)',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAvatar: {
    width: 60,
    height: 60,
  },
  balanceStyle: {
    color: '#21243D',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 5,
  },
  balanceAmountStyle: {
    color: '#959595',
    textAlign: 'center',
    fontSize: 30,

  },
  dueDateStyle: {
    color: '#21243D',
    textAlign: 'center',
    fontSize: 12,
  },
  addressContentStyle:{
    flexDirection: 'row',
    alignItems: 'flex-end',
    width,
    justifyContent: 'space-between'
  },
  textAddressStyle: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  subcontainerContract: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  contactBoxStyle: {
    width: 100,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#C2272F',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  contactBoxTitleStyle: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  containerSettlementsAndContract: {
    flexDirection: 'row',
  },
  textButtonSettlementsAndContract: {
    color: '#21243D',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    marginLeft: 5,
  },
  verticalAligning: {
    flexDirection: 'row',
  },
  verticalAligningSelected: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#C2272F'
  },
  containerSettlementsAndContractList: {
    marginTop: 20,
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainerSettlementsAndContractList: {
    width: width - 40,
    height: 60,
    backgroundColor: '#E4E4E4',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainerSettlements: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 40,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  depositDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositDataTextContainer:{
    marginHorizontal: 10,
  },
  depositDataTextStyle:{
    color: '#21243D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  depositDataTextDateStyle:{
    fontSize: 12,
  },
  depositAmountTextStyle:{
    marginLeft: 10,
  },

});

export default Client;
