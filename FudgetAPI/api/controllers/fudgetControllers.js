'use strict';
var bodyParser = require('body-parser')

var mongoose = require('mongoose'),
  Item = mongoose.model('Items');

exports.list_all_items = function(req, res) {
  Item.find({}, function(err, items) {
    if (err)
      res.send(err);
    res.json(items);
  });
};

exports.list_sorted_items = function(req, res) {
  console.log(req.body);
  Item.find(req.body, function(err, items) {
    if (err)
      res.send(err);
    res.json(items);
  });
};

exports.create_an_item = function(req, res) {
  var new_item = new Item(req.body);
  new_item.save(function(err, items) {
    if (err)
      res.send(err);
    res.json(items);
  });
};


exports.read_an_item = function(req, res) {
  Item.findById(req.params.itemId, function(err, items) {
    if (err)
      res.send(err);
    res.json(items);
  });
};


exports.update_an_item = function(req, res) {
  Item.findOneAndUpdate({_id: req.params.itemId}, req.body, {new: true}, function(err, items) {
    if (err)
      res.send(err);
    res.json(items);
  });
};


exports.delete_an_item = function(req, res) {
  Item.remove({
    _id: req.params.itemId
  }, function(err, items) {
    if (err)
      res.send(err);
    res.json({ message: 'Item successfully deleted' });
  });
};

exports.read_receipt = function(req, res) {
  var jsonOfItems = [];
  var TA = req.body.responses[0].textAnnotations;
  console.log(TA);
  console.log('-----------');

  // var text = TA[0].description;
  // var regex = "{DATA:name}\%s{{DATETIME:date}\%s}"

  var storeLocation = TA[1].description; //the first element is always the store
  console.log(storeLocation);
  //set category. Use NLP later for better classification
  if(storeLocation === 'Target') {
    category = 'Groceries';
  }
  else if(storeLocation === 'Starbucks'){
    category = 'Coffee';
  }

  var dateOfPurchase = new Date(); //date of purchase
  var value;
  var itemName;
  var itemDetails;
  for(var i=2 ; i<TA.length ; i++) {
    //add value after dollar sign
    if(TA[i].description.includes("$")) {
      value = Number(TA[i].description.substr(1));
      console.log(value);
      itemName = TA[i-1].description;
      console.log(itemName);

      itemDetails = {
        name : itemName,
        date_bought: dateOfPurchase,
        price: value,
        store_location: storeLocation
      };
      if(itemDetails.name != "total") {
        jsonOfItems.push(itemDetails);
      }
    }      
  }
  var out = jsonOfItems;
  console.log(out);
  res.setHeader("Content-Type", "application/json");
  res.json(out);
}