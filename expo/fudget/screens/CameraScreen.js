import Expo from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

export default class App extends React.Component {
  state = {
    imageUri: null,
    text: null,
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
      <ScrollView style={styles.container}>
        {imageView}
        <Text>STATUS: {this.state.status}</Text>
        {textView}
        <TouchableOpacity
          style={styles.button}
          onPress={this._pickImage}>
          <Text style={{fontSize: 30}}>take a picture!</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  _pickImage = async () => {
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
    backgroundColor: '#5284f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#ffa500',
    height: 60,
    width: 200,
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 100,
  }
});

  // _getData = async () => {
  //   const req_data = await fetch('https://fudget-finance.herokuapp.com/items', {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //   });
  //   const res_data = await req_data.json();
  //   this.setState({
  //     items: res_data.items,
  //     budget: res_data.budget,
  //   });
  // }