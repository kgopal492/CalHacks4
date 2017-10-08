import Expo from 'expo';
import React from 'react';
import { EvilIcons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ScrollView,
} from 'react-native';

export default class App extends React.Component {
  static navigationOptions = {
    title: 'Camera',
  };
  state = {
    imageUri: null,
    text: null,
    status: ''
  }

  render() {
    let imageView = null;
    if (this.state.imageUri) {
      imageView = (
        <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: this.state.imageUri }}
        />
      );
    }

    let textView = null;
    if (this.state.text) {
      textView = (
        <Text style={{ margin: 5 }}>
          {this.state.text}
        </Text>
      );
    }

    return (
      <View style={styles.container}>
      <ScrollView>
        <View>
          
          <View style={styles.imageStyle}>
          {imageView}
          </View>
            <EvilIcons
              name={"plus"}
              size={100}
              style={styles.addPic}
              color={"#6075ff"}
              onPress={this._pickImage}
            />
            <Text style={{textAlign: "center"}}>{this.state.status}</Text>
        
        </View>
        
          {textView}
        </ScrollView>
        </View>
      
    );
  }

  _pickImage = async () => {
    this.setState({
      status: 'analyzing...'
    });
    const {
      cancelled,
      uri,
      base64,
    } = await Expo.ImagePicker.launchCameraAsync({
      base64: true,
    });
    if (!cancelled) {
      this.setState({
        imageUri: uri,
        text: '(loading...)',
      });
    }

    const body = {
      requests:[
        {
          image:{
            content: base64,
          },
          features:[
            {
              type: 'TEXT_DETECTION',
              maxResults: 100,
            }
          ]
        },
      ],
    };


    const key = 'AIzaSyCScDq8xvUnb1x4JDyt9zRHawD-imeyzuE';
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const parsed = await response.json();
    this.setState({
      text: parsed.responses[0].textAnnotations[0].description,
    });

    // send to custom api
    this.setState({
      status: 'sending information to fudget parser...'
    });
    const response1 = await fetch('https://fudget-finance.herokuapp.com/receipt', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parsed),
    });
    const parsed1 = await response1.json();
    
    /* 

    this is where validation of the 'parsed' content happens

    */

    this.setState({
      status: 'verified content. sending bits to be reconstructed...'
    });
    // confirm send to db (one at a time)
    for(var i = 0; i < parsed1.length; i++){
      fetch('https://fudget-finance.herokuapp.com/items', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsed1[i]),
      });
    }
    this.setState({
      status: 'Done! Check out the home page!'
    });
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  refresh: {
    padding: 10,
    marginTop: 20,
    textAlign: "center",
    fontSize: 25,
    color: "#444",    
    radius: 10, 
    alignItems: "center",
    fontWeight: "bold",
  },
  imageStyle: {
    width: 300,
    height: 300,
    backgroundColor: "#4444",
  },
  addPic: {
    textAlign: "center",
    marginTop: 15,
  }
});