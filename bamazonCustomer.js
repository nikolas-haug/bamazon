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
                type: "input",
                //validate that input is a number

                validate: function(value) {
                    // console.log(value, typeof value, parseInt(value));
                    // if (isNaN(value) === false) {
                    //   return true;
                    // }
                    // return false;
                    // console.log("please enter a valid number")
                    return /^[0-9]+$/.test(value);

                    // var matches = /^[0-9]+$/.test(value);

                    // if ( ! matches) console.log("\nplease enter again");
                    // return ! isNaN(parseInt(value));
                }
            },
            {
                name: "quantity",
                message: "how many do you want?",
                type: "input"
            },
        ]).then(function(answers) {
            var chosenID;
            for(var i = 0; i < results.length; i++) {
                if(results[i].item_id === parseInt(answers.product_id)) {
                    chosenID = results[i].item_id;
                }
            }
            connection.query("SELECT stock_quantity FROM products WHERE item_id= ?", 
            [chosenID],
            function(err, res) {
                if(err) throw err;

                if(answers.quantity > res[0].stock_quantity) {
                    console.log("not enough in stock!");
                    console.log("The current item stock is: " + res[0].stock_quantity);
                    promptBuyer();
                } else {
                    
                    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id= ?",
                    [
                        res[0].stock_quantity - answers.quantity,
                        chosenID
                    ],
                    function(err) {
                        if(err) throw err;

                        //show the user the $ of their order
                        
                        console.log("order placed!");
                        // connection.end();
                        connection.query("SELECT price FROM products WHERE item_id= ?", 
                    [chosenID]
                ),
                        function(err, res) {
                            if(err) throw err;
                            console.log(res.price);
                            console.log(chosenID);
                        }
                    }                   
                )   
                }
                
                // console.log(answers.quantity);
                // console.log(res[0].stock_quantity);
                // console.log(chosenID);
            });
        });
    });
}

// function showPrice(prod) {
//     connection.query("SELECT price FROM products WHERE item_id= ?",
//         [prod],
//      function(err) {
//         if(err) throw err;
//         console.log("order total: " + prod);
//     });
// }

// showPrice(4);