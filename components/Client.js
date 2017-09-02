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
} from 'react-native';


import Icon from 'react-native-vector-icons/Entypo';
import CachedImage from 'react-native-cached-image';
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
  }

  render(){
    return(
      <View style={styles.container}>
      <ScrollView>
        <View style={styles.containerHeader}>
          <View style={styles.avaterContainer}>
            <CachedImage
              resizeMode={'contain'}
              source={{uri: "https://firebasestorage.googleapis.com/v0/b/flexspace-bae45.appspot.com/o/negocio%2FTakis.png?alt=media&token=211d47c6-ebb2-467a-997f-00627016e567"}}
              style={styles.imageAvatar}
            />
          </View>

        </View>
        <View style={styles.containerAddress}>
          <Text>Here goes the Address</Text>
        </View>
        <View style={styles.containerContract}>
          <Text>Here goes the contract data</Text>
        </View>
        <View style={styles.containerSeatlements}>
          <Text>Here goes the Seatlements</Text>
            <Text>Here goes the Seatlements</Text>
              <Text>Here goes the Seatlements</Text>
                <Text>Here goes the Seatlements</Text>
                  <Text>Here goes the Seatlements</Text>
                    <Text>Here goes the Seatlements</Text>
                      <Text>Here goes the Seatlements</Text>
                        <Text>Here goes the Seatlements</Text>
                          <Text>Here goes the Seatlements</Text>
                            <Text>Here goes the Seatlements</Text>
                              <Text>Here goes the Seatlements</Text>
                                <Text>Here goes the Seatlements</Text>
        </View>
      </ScrollView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    height: 160,
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSeatlements: {
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
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,1)',
  },
  imageAvatar: {
    width: 60,
    height: 60,
  }
});

export default Client;
