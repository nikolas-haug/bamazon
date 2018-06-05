var mysql = require("mysql");
var inquirer = require("inquirer");
//prettify the console output
var Table = require('cli-table');


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

        // instantiate
        var table = new Table({
            head: ["Product", "ID", "Department", "Price $ ", "Quantity"],
            colWidths: [40, 10, 20, 10, 10]
        });

        console.log("\n");
        //loop through all available products - TO DO: check availability is not 0 for each product
        for(var i = 0; i < results.length; i++) {
            //check for product availability
            if(results[i].stock_quantity > 0) {
                
                table.push([
                    results[i].product_name,
                    results[i].item_id,
                    results[i].department_name,
                    results[i].price.toFixed(2),
                    results[i].stock_quantity
                ]);

                // console.log(`Product ID: ${results[i].item_id} - ${results[i].product_name} || Price: $${results[i].price.toFixed(2)}\n`);
            }
        }
        console.log("===== Welcom to Bamazon! =====");
        console.log(table.toString());
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
                    return /^[0-9]+$/.test(value);
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

                        console.log("order placed!");                        
                        showPrice(chosenID, answers.quantity);
                        checkSales();
                        }
                    )
                }
                
            });
        });
    });
}

function showPrice(prod, quant) {
    connection.query("SELECT price FROM products WHERE item_id= ?",
        [prod],
     function(err, res) {
        if(err) throw err;
        var table = new Table({
            head: ["Your order: ", "$ Total $"],
            colWidths: [40, 40]
        });
        table.push([
            "col-1",
            res[0].price.toFixed(2)
        ]);
        
        console.log("\n");
        console.log(table.toString());
        // console.log("order total: $" + (res[0].price * quant).toFixed(2));
    });
}

function checkSales() {
    inquirer.prompt([
        {
            name: "verify",
            message: "would you like to make another sale?",
            type: "confirm"
        }
    ]).then(function(answers) {
        if(answers.verify === true) {
            console.log("welcome back to the bamazon marketplace");
            showProducts();
        } else {
            console.log("thank you for shopping here");
            connection.end();
        }
    });
}