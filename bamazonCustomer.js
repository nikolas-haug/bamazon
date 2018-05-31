var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon",
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected!");
    showProducts();
    // promptBuyer();
  });

// show all items in products table
function showProducts() {
    connection.query("SELECT * FROM products", function(err, results) {
        if(err) throw err;
        console.log("\n");
        //loop through all available products - TO DO: check availability is not 0 for each product
        for(var i = 0; i < results.length; i++) {
            //check for product availability
            if(results[i].stock_quantity > 0) {
                console.log(`Product ID: ${results[i].item_id} - ${results[i].product_name} || Price: $${results[i].price.toFixed(2)}\n`);
            }
        }
        promptBuyer();
    });
}

//prompt user for product id and quantity input
function promptBuyer() {
    connection.query("SELECT * FROM products", function(err, results) {
        if(err) throw err;
    
        inquirer.prompt([
            {
                name: "product_id",
                message: "Please tell me the product id",
                type: "input"
            },
        ]).then(function(answers) {
            var chosenID;
            for(var i = 0; i < results.length; i++) {
                if(results[i].item_id === parseInt(answers.product_id)) {
                    chosenID = results[i].item_id;
                }
            }
            // console.log(answers.product_id);
            //validate if user input is a number and an existing product id
            if(isNaN(answers.product_id)) {
                console.log("please enter a valid ID");
                promptBuyer();
            } else {
                
                
                console.log("success!");
                console.log(chosenID);
            }
        });
    });
}

// function promptBuyer() {
//     connection.query("SELECT * FROM products", function(err, results) {
//         if(err) throw err;
//         inquirer.prompt([
//             {
//                 name: "product_id",
//                 type: "list",
//                 pageSize: 100,
//                 choices: function() {
//                     var productArray = [];
//                     for(var i = 0; i < results.length; i++) {
//                         productArray.push("Product: " + results[i].product_name + "    Product ID: " + results[i].item_id);
//                     }
//                     return productArray;
//                 },
//                 message: "Please input the product ID you wish to select."
//             },
//             {
//                 name: "number_of_units",
//                 type: "input",
//                 message: "How many would you like to buy?"
//             },
//         ]).then(function(answers) {
//             //check that the item is in stock
//             console.log(answers.product_id);
//         });
//     });
// }

// function validateNumber(num)
// {
//    var isValid = !_.isNaN(parseFloat(num));
//    return isValid || "this should be a number!";
// }


