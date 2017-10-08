import React, { Component } from 'react';
import Expo from 'expo';
import * as Progress from 'react-native-progress';
import {
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  Button, 
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image, 
  Keyboard,
  Platform,
} from 'react-native';

import BudgetPart from './BudgetPart'

export default class App extends Component {
  static navigationOptions = {
    title: 'Home',
  };
  state = {
    budgets: [],
    maxBudget: 1.0,
    moneySpent: 0.0,
    progPercent: 0.0,
    moneyLeft: 1.0,
  }
  loadPage = () => {
    this._getData();
    //this._getBackupData();
  }
  keyExtractor = (item, index) => item.id;
  

  renderBudget = ({item}) => {
    return <BudgetPart
        budget = {item.budget} 
        type = {item.type}
        moneySpent = {item.moneySpent}
        moneyLeft = {item.moneyLeft}
        percentage = {item.percentage}

    />
      
  }
  componentWillMount() {
    this.loadPage();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._getBackupData}><Text style={styles.refresh}>Refresh</Text></TouchableOpacity>
        <Progress.Pie progress={this.state.progPercent} size={100} style={styles.pieChart} color="#6075ff"/>
        <View style={styles.remainderStyle}>
          {(this.state.moneySpent)? <Text style={{fontSize: 24, color: "#555"}}>${this.state.moneySpent} spent!</Text> :  <Text  style={{fontSize: 24, color: "#555"}} >$0 spent!</Text>}
        </View>
        <FlatList
          data={this.state.budgets}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderBudget}
          style={styles.list}
        />
        
      </View>
    );
  }

  _getData = async () => {
    const req_data = await fetch('https://fudget-finance.herokuapp.com/items', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const data = await req_data.json();
    this.setState({
      budgets: data.topics,
      maxBudget: data.totalBudget,
      moneySpent: data.totalSpent,
      progPercent: data.totalPercent,
      moneyLeft: data.moneyLeft,
    });
  }

  _getBackupData = () => {
    var data = require("./test.json")
    this.setState({
      budgets: data.topics,
      maxBudget: data.totalBudget,
      moneySpent: data.totalSpent,
      progPercent: data.totalPercent,
      moneyLeft: data.moneyLeft,
    });
  }
}

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  list: {
    width: '100%'
  },
  list: {
    width: '100%'
  },
  pieChart: {
    padding: 25,
  },
  remainderStyle: {
    fontSize: 16,
  },
  refresh: {
    padding: 10,
    marginTop: 20,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#6075ff",
    borderRadius: 10,
    color: "#555"
  }
});

