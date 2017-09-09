import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,

} from 'react-native';

import Firebase from '../lib/Firebase';
import { NavigationActions } from 'react-navigation';
const {width, height} = Dimensions.get('window');
import Pdf from 'react-native-pdf';

class PDFContainer extends Component {

  static navigationOptions = ({navigation}) => ({
    headerStyle: {
      backgroundColor: "rgba(43,43,43,1)",
    },
    headerTitle:(<Text style={{color: 'white', fontSize: 16}}>{navigation.state.params.contratoNombre}</Text>),
    gesturesEnabled: false,
    headerLeft: (<TouchableOpacity
      onPress={()=>{
                    const backAction = NavigationActions.back();
                    navigation.dispatch(backAction)
                  }
              }>
              <View style={{paddingLeft: 20}}>
                <Text style={{color: 'white', fontWeight: '500'}}>Cerrar</Text>
              </View>
    </TouchableOpacity>),
  });

  constructor(props){
    super(props);
    this.state={
      showActivityIndicator: true,
      contrato: '',
      page: 1,
      pageCount: 1,
    }
    this.pdf = null;
  }

  prePage=()=>{
       if (this.pdf){
           let prePage = this.state.page>1?this.state.page-1:1;
           this.pdf.setNativeProps({page: prePage});
           this.setState({page:prePage});
           console.log(`prePage: ${prePage}`);
       }
   }

   nextPage=()=>{
     if (this.pdf){
         let nextPage = this.state.page+1>this.state.pageCount?this.state.pageCount:this.state.page+1;
         this.pdf.setNativeProps({page: nextPage});
         this.setState({page:nextPage});
         console.log(`nextPage: ${nextPage}`);
     }

 }


  componentWillMount(){
    console.log(this.props.navigation.state.params.contrato);
    this.setState({contrato: this.props.navigation.state.params.contrato, showActivityIndicator: false});
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
      let source = {uri:this.state.contrato,cache:true};
      return(
        <View style={styles.container}>
          <StatusBar
             barStyle="light-content"
          />
          <View style={{flexDirection:'row'}}>
            <TouchableHighlight  disabled={this.state.page==1} style={this.state.page==1?styles.btnDisable:styles.btn} onPress={()=>this.prePage()}>
                <Text style={styles.btnText}>{'Anterior'}</Text>
            </TouchableHighlight>
            <TouchableHighlight  disabled={this.state.page==this.state.pageCount} style={this.state.page==this.state.pageCount?styles.btnDisable:styles.btn}  onPress={()=>this.nextPage()}>
                <Text style={styles.btnText}>{'Siguiente'}</Text>
            </TouchableHighlight>
          </View>
          <Pdf ref={(pdf)=>{this.pdf = pdf;}}
              source={source}
              page={1}
              horizontal={false}
              onLoadComplete={(pageCount)=>{
                  this.setState({pageCount: pageCount});
                  console.log(`total page count: ${pageCount}`);
              }}
              onPageChanged={(page,pageCount)=>{
                  this.setState({page:page});
                  console.log(`current page: ${page}`);
              }}
              onError={(error)=>{
                  console.log(error);
              }}
              style={styles.pdf}/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    btn: {
        margin: 5,
        padding:5,
        borderRadius: 4,
        backgroundColor: "#C2272F",
    },
    btnDisable: {
        margin: 5,
        padding:5,
        borderRadius: 4,
        backgroundColor: "gray",
    },
    btnText: {
        color: "#FFF",
    },
    pdf: {
        flex:1,
        width,
    },
  containerActivityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

});

export default PDFContainer;
