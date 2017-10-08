'use strict';
var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types

var ItemSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  date_bought: {
    type: Date,
    default: Date.now
  },
  price: {
    type: SchemaTypes.Double,
    required: 'what is the price'
  },
  store_location: {
  	type: String,
  },
  category: {
  	type: [{
      type: String,
      enum: ['Restaurant/Food', 'Coffee', 'Groceries', 'Bookstore', 'Clothing', 'Other']
    }],
    default: ['Other']
  }
});
module.exports = mongoose.model('Items', ItemSchema);


var BudgetSchema = new Schema({
  category: {
    type: String,
    required: "Enter the category of this budget"
  },
  value: {
    type: SchemaTypes.Double,
    default: 0.0
  },
  maxValue: {
    type: SchemaTypes.Double,
    required: "Please enter a budget value"
  }
});
module.exports = mongoose.model('Budgets', BudgetSchema);

