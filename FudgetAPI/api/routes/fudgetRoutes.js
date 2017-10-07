'use strict';
module.exports = function(app) {
  var fudget = require('../controllers/fudgetControllers');

  // todoList Routes
  app.route('/items')
    .get(fudget.list_all_items)
    .post(fudget.create_an_item);

  app.route('/items/sort/:key=:value')
    .get(fudget.list_sorted_items);



  app.route('/items/:itemId')
    .get(fudget.read_an_item)
    .put(fudget.update_an_item)
    .delete(fudget.delete_an_item);

  app.route('/receipt')
  	.post(fudget.read_receipt);
};