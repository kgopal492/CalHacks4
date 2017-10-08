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
    remaining: 1.0,
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
        <Progress.Pie progress={this.state.progPercent} size={100} style={styles.pieChart}/>
        <View style={styles.remainderStyle}>
        {(this.state.moneySpent <= this.state.maxBudget) ? (<Text>$ {this.state.remaining} left!</Text>) : (<Text>${this.state.remaining} over!</Text>)}
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
      remaining: data.remainder,
    });
  }

  _getBackupData = () => {
    var data = require("./test.json")
    this.setState({
      budgets: data.topics,
      maxBudget: data.totalBudget,
      moneySpent: data.totalSpent,
      progPercent: data.totalPercent,
      remaining: data.remainder,
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
    borderColor: '#000000',
    borderRadius: 10,
  }
});

