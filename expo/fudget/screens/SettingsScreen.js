import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
	StyleSheet, 
	Text, 
	View, 
	FlatList, 
	TextInput, 
	Button, 
	TouchableHighlight,
	TouchableWithoutFeedback,
	Image, 
	Keyboard,
	Platform,
	ScrollView
} from 'react-native';

export default class SettingsScreen extends React.Component {
	state = {
		foodBudget: 100,
		coffeeBudget: 100,
		groceryBudget: 100,
		bookstoreBudget: 100,
		clothingBudget: 100,
		otherBudget: 100,
	}

  static navigationOptions = {
    title: 'Settings',
  };
  async componentWillMount() {
    // initiate values
    const request = await fetch('https://fudget-finance.herokuapp.com/items', {
    	method: 'GET',
    	headers: {
    		'Accept': 'application/json',
    		'Content-Type': 'application/json',
    	}
    });
    const data = await request.json();
  }
  render() {
  	// everytime a value is changed, send to db
    return (
    	<View style={styles.container}>
    		<ScrollView style={styles.scrollingView}>
    			<View style={styles.columnStyle}>
		    		<View style={styles.rowStyle}><Text style={styles.text}>Food: $</Text><TextInput style={styles.numInput} keyboardType='number-pad' returnKeyType="done" placeholder="100" onChangeText={(text) => this.setState({foodBudget: text})}/></View>
		    		<View style={styles.rowStyle}><Text style={styles.text}>Coffee: $</Text><TextInput style={styles.numInput} keyboardType='number-pad' returnKeyType="done" placeholder="100" onChangeText={(text) => this.setState({coffeeBudget: text})}/></View>
		    		<View style={styles.rowStyle}><Text style={styles.text}>Groceries: $</Text><TextInput style={styles.numInput} keyboardType='number-pad' returnKeyType="done" placeholder="100" onChangeText={(text) => this.setState({groceryBudget: text})}/></View>
		    		<View style={styles.rowStyle}><Text style={styles.text}>Bookstore: $</Text><TextInput style={styles.numInput} keyboardType='number-pad' returnKeyType="done" placeholder="100" onChangeText={(text) => this.setState({bookstoreBudget: text})}/></View>
		    		<View style={styles.rowStyle}><Text style={styles.text}>Clothing: $</Text><TextInput style={styles.numInput} keyboardType='number-pad' returnKeyType="done" placeholder="100" onChangeText={(text) => this.setState({clothingBudget: text})}/></View>
		    		<View style={styles.rowStyle}><Text style={styles.text}>Other: $</Text><TextInput style={styles.numInput} keyboardType='number-pad' returnKeyType="done" placeholder="100" onChangeText={(text) => this.setState({otherBudget: text})}/></View>
    			</View>
    		</ScrollView>
    	</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    textAlign: 'center',
  },
  text: {
  	fontSize: 24,
  },
  numInput: {
  	width: '60%',
  	fontSize: 24,
  	textAlign: "left",
  },
  scrollingView: {
  	width: "100%",
  	textAlign: 'center',
  },
  rowStyle: {
  	flexDirection: "row",
  	paddingLeft: 25,
  	paddingTop: 20,
  	paddingBottom: 20,
  	paddingRight: 25,
  	borderBottomWidth: 1,
  	borderBottomColor: "#777",
  },
  columnStyle: {
  	flex: 1,
  	flexDirection: 'column',
  	justifyContent: 'space-between',
  }
});