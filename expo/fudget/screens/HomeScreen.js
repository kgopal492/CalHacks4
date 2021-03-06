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
    categories: ['Groceries', 'Restaurant/Food', 'Clothing', 'Other'],
    pseudoMaxBudgetIndividual: 100,
    pseudoMaxBudget: 200,
    budgets: [],
    maxBudget: 1.0,
    moneySpent: 0.0,
    progPercent: 0.0,
    moneyLeft: 1.0,
  }
  loadPage = () => {
    this._getSortedData();
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
        <Text>{this.state.text}</Text>
        <TouchableOpacity onPress={this._getSortedData}><Text style={styles.refresh}>Refresh</Text></TouchableOpacity>
        {(this.state.progPercent >= 1) ? (<Progress.Pie progress={1} size={100} style={styles.pieChart} color="red"/>) : (<Progress.Pie progress={this.state.progPercent} size={100} style={styles.pieChart} color="#6075ff"/>)}
        <View style={styles.remainderStyle}>
          {(this.state.progPercent < 1) ? (<Text style={{fontSize: 24, color: "#555"}}>${this.state.moneySpent} spent!</Text>) :  (<Text style={{fontSize: 24, color: "#555"}}>${this.state.moneySpent} spent!!!</Text>)}
          <Text style={{fontSize: 20, color: "#555"}}>Your Budget: ${this.state.maxBudget}</Text>
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
    var data_sorted = {};
    const data = await req_data.json();
  }

  _getSortedData = async () => {
    var categories = this.state.categories;
    var formatted_json = [];
    var totalMoneySpent = 0;
    for (var i = 0; i < categories.length; i++) {
      var unformatted_data = await this._getSortedDataHelper(categories[i]);
      var budgetObj = new Object();
      var moneySpentSum = 0;
      for (var j = 0; j < unformatted_data.length; j++) {
        moneySpentSum += unformatted_data[j].price;
      }
      totalMoneySpent += moneySpentSum;
      var maxBudgetind = this.state.pseudoMaxBudgetIndividual;
      budgetObj.type = categories[i];
      budgetObj.budget = maxBudgetind;
      budgetObj.moneySpent = moneySpentSum.toFixed(2);
      budgetObj.moneyLeft = (maxBudgetind - moneySpentSum).toFixed(2);
      budgetObj.percentage = (moneySpentSum/maxBudgetind);
      budgetObj.id = categories[i];
      formatted_json.push(budgetObj);
    }
    var pseudoMaxBudget = this.state.pseudoMaxBudget;
    this.setState({
      budgets: formatted_json,
      maxBudget: pseudoMaxBudget,
      moneySpent: totalMoneySpent.toFixed(2),
      progPercent: totalMoneySpent/pseudoMaxBudget,
      remaining: pseudoMaxBudget - totalMoneySpent,
    });
  }

  _getSortedDataHelper = async (category) => {
    const req_data = await fetch('https://fudget-finance.herokuapp.com/sort', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'category': category,
      }),
    });
    const data = await req_data.json();
    return data;
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

