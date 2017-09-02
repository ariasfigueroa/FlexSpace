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

class Admin extends Component {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "rgba(43,43,43,1)",
    },
    gesturesEnabled: false,
  };

  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={styles.container}>
        <Text>Content goes here: {this.props.navigation.state.params.cliente}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Admin;
